<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\GeocodingService;
use App\Models\Customer;
use App\Models\Delivery;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\OrderStockService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function loadOrders(Request $request)
    {
        $search    = $request->input('search');
        $orderType = $request->input('order_type');
        $category  = $request->input('category');
        $status    = $request->input('status');
        $dateFrom  = $request->input('date_from');
        $dateTo    = $request->input('date_to');

        $orders = Order::with([
                'orderItems.product',
                'processedBy',
                'customer',        // ← include customer in list
            ])
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc');

        if ($search) {
            $orders->where(function ($query) use ($search) {
                $query->where('delivery_address', 'like', "%{$search}%")
                    ->orWhere('notes',     'like', "%{$search}%")
                    ->orWhere('order_id',  'like', "%{$search}%")
                    ->orWhereHas('customer', function ($q) use ($search) {
                        $q->where('first_name',  'like', "%{$search}%")
                          ->orWhere('last_name',  'like', "%{$search}%")
                          ->orWhere('contact_number', 'like', "%{$search}%");
                    });
            });
        }

        if ($orderType) {
            $orders->where('order_type', $orderType);
        }

        if ($category === 'walkin') {
            $orders->where('order_type', 'walkin');
        } elseif ($category === 'delivery') {
            $orders->where('order_type', 'delivery')
                ->where(function ($q) {
                    $q->whereDoesntHave('delivery')
                        ->orWhereHas('delivery', fn ($d) => $d->whereNull('recurring_order_id'));
                });
        } elseif ($category === 'recurring') {
            $orders->where('order_type', 'delivery')
                ->whereHas('delivery', fn ($d) => $d->whereNotNull('recurring_order_id'));
        }

        if ($status) {
            $statuses = explode(',', $status);
            $orders->whereIn('status', $statuses);
        }

        if ($dateFrom) {
            $orders->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo) {
            $orders->whereDate('created_at', '<=', $dateTo);
        }

        $orders = $orders->paginate(15);

        return response()->json([
            'orders' => $orders
        ], 200);
    }

    public function getOrder(Order $order)
    {
        $order->load([
            'orderItems.product',
            'processedBy',
            'customer',            // ← include customer in single fetch
        ]);

        return response()->json([
            'order' => $order
        ], 200);
    }

    public function storeOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_type'         => ['required', Rule::in(['walkin', 'delivery'])],
            'payment_method'     => ['required', Rule::in(['cash', 'gcash', 'maya', 'other'])],
            'payment_status'     => ['required', Rule::in(['unpaid', 'paid', 'partial'])],
            'gallon_owned'       => ['nullable', 'integer', 'min:0'],
            'gallon_exchange'    => ['nullable', 'integer', 'min:0'],
            'delivery_address'   => ['nullable', 'required_if:order_type,delivery', 'string'],
            'gps_lat'            => ['nullable', 'numeric'],
            'gps_lng'            => ['nullable', 'numeric'],
            'notes'              => ['nullable', 'string'],
            'scheduled_date'     => ['nullable', 'date'],
            'items'              => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:tbl_products,product_id'],
            'items.*.quantity'   => ['required', 'integer', 'min:1'],

            // ── customer fields ────────────────────────────────────────────
            // delivery = required | walkin = optional
            'customer_name'    => [
                Rule::requiredIf($request->order_type === 'delivery'),
                'nullable', 'string', 'max:255',
            ],
            'customer_contact' => ['nullable', 'string', 'max:20'],
            'customer_address' => [
                Rule::requiredIf($request->order_type === 'delivery'),
                'nullable', 'string',
            ],
            // ──────────────────────────────────────────────────────────────
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        DB::beginTransaction();

        try {
            // ── Resolve / create customer ──────────────────────────────────
            $customerId = null;
            $hasCustomer = !empty($validated['customer_name']);

            if ($hasCustomer) {
                // Split "First Last" → first_name / last_name
                $nameParts = explode(' ', trim($validated['customer_name']), 2);
                $firstName = $nameParts[0];
                $lastName  = $nameParts[1] ?? '';

                $customer = Customer::firstOrCreate(
                    [
                        'first_name'     => $firstName,
                        'last_name'      => $lastName,
                        'contact_number' => $validated['customer_contact'] ?? null,
                    ],
                    [
                        'address' => $validated['customer_address'] ?? null,
                    ]
                );

                // Always update address in case it changed
                $customer->update([
                    'address' => $validated['customer_address'] ?? $customer->address,
                ]);

                $customerId = $customer->customer_id;
            }
            // ──────────────────────────────────────────────────────────────

            $totalAmount   = 0;
            $itemsToInsert = [];

            foreach ($validated['items'] as $item) {
                $product = Product::where('product_id', $item['product_id'])
                    ->where('is_available', true)
                    ->where('is_deleted', false)
                    ->firstOrFail();

                $unitPrice    = $product->price;
                $subtotal     = $unitPrice * $item['quantity'];
                $totalAmount += $subtotal;

                $itemsToInsert[] = [
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'subtotal'   => $subtotal,
                ];
            }

            $initialStatus = $validated['order_type'] === 'walkin' ? 'delivered' : 'pending';

            $gpsLat = $validated['gps_lat'] ?? null;
            $gpsLng = $validated['gps_lng'] ?? null;

            if (
                $validated['order_type'] === 'delivery'
                && !empty($validated['delivery_address'])
                && ($gpsLat === null || $gpsLng === null)
            ) {
                $geo = GeocodingService::geocode($validated['delivery_address']);
                if ($geo) {
                    $gpsLat = $geo['lat'];
                    $gpsLng = $geo['lng'];
                }
            }

            $order = Order::create([
                'customer_id'      => $customerId,          // ← linked here
                'processed_by'     => auth()->id(),
                'order_type'       => $validated['order_type'],
                'total_amount'     => $totalAmount,
                'gallon_owned'     => $validated['gallon_owned']    ?? 0,
                'gallon_exchange'  => $validated['gallon_exchange']  ?? 0,
                'status'           => $initialStatus,
                'payment_method'   => $validated['payment_method'],
                'payment_status'   => $validated['payment_status'],
                'delivery_address' => $validated['delivery_address'] ?? null,
                'gps_lat'          => $gpsLat,
                'gps_lng'          => $gpsLng,
                'notes'            => $validated['notes']            ?? null,
            ]);

            foreach ($itemsToInsert as $item) {
                OrderItem::create([
                    'order_id'   => $order->order_id,
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal'   => $item['subtotal'],
                ]);
            }

            // Auto-create unassigned delivery for delivery orders
            if ($validated['order_type'] === 'delivery') {
                Delivery::create([
                    'order_id'        => $order->order_id,
                    'rider_id'        => null,
                    'scheduled_date'  => $request->input('scheduled_date', now()->toDateString()),
                    'status'          => 'pending',
                    'expected_amount' => $totalAmount,
                    'collected_amount'=> 0,
                    'notes'           => $validated['notes'] ?? null,
                ]);
            }

            // Gallon debt is recorded when the rider marks the delivery as delivered.

            if (
                $validated['order_type'] === 'walkin'
                || ($validated['order_type'] === 'delivery' && $validated['payment_status'] === 'paid')
            ) {
                OrderStockService::deductForOrder($order);
            }

            DB::commit();

            $order->load(['orderItems.product', 'processedBy', 'customer']);

            return response()->json([
                'message' => 'Order Successfully Created.',
                'order'   => $order
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to create order.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function updateOrder(Request $request, Order $order)
    {
        $validator = Validator::make($request->all(), [
            'payment_method'   => ['required', Rule::in(['cash', 'gcash', 'maya', 'other'])],
            'payment_status'   => ['required', Rule::in(['unpaid', 'paid', 'partial'])],
            'delivery_address' => ['nullable', 'string'],
            'gps_lat'          => ['nullable', 'numeric'],
            'gps_lng'          => ['nullable', 'numeric'],
            'gallon_owned'     => ['nullable', 'integer', 'min:0'],
            'gallon_exchange'  => ['nullable', 'integer', 'min:0'],
            'notes'            => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $order->update([
            'payment_method'   => $validated['payment_method'],
            'payment_status'   => $validated['payment_status'],
            'delivery_address' => $validated['delivery_address'] ?? $order->delivery_address,
            'gps_lat'          => $validated['gps_lat']          ?? $order->gps_lat,
            'gps_lng'          => $validated['gps_lng']          ?? $order->gps_lng,
            'gallon_owned'     => $validated['gallon_owned']     ?? $order->gallon_owned,
            'gallon_exchange'  => $validated['gallon_exchange']  ?? $order->gallon_exchange,
            'notes'            => $validated['notes']            ?? $order->notes,
        ]);

        $order->load(['orderItems.product', 'processedBy', 'customer']);

        return response()->json([
            'message' => 'Order Successfully Updated.',
            'order'   => $order
        ], 200);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', Rule::in(['pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $order->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Order Status Updated.',
            'status'  => $order->status
        ], 200);
    }

    public function destroyOrder(Order $order)
    {
        $order->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Order Successfully Deleted.'
        ], 200);
    }
}
