<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\RecurringOrder;
use App\Services\GeocodingService;
use App\Services\RecurringOrderService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DeliveryController extends Controller
{
    public function loadDeliveries(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $date   = $request->input('date');

        $deliveries = Delivery::with([
                'rider',
                'order.orderItems.product',
                'order.customer',
            ])
            ->where('is_deleted', false)
            ->orderBy('scheduled_date', 'desc');

        if ($search) {
            $deliveries->where(function ($query) use ($search) {
                $query->where('notes', 'like', "%{$search}%")
                    ->orWhereHas('rider', function ($q) use ($search) {
                        $q->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($status) {
            $deliveries->where('status', $status);
        }

        if ($date) {
            $deliveries->whereDate('scheduled_date', $date);
        }

        if ($request->boolean('unassigned')) {
            $deliveries->whereNull('rider_id')->where('status', 'pending');
        }

        if ($request->filled('rider_id')) {
            $deliveries->where('rider_id', $request->input('rider_id'));
        }

        $deliveries = $deliveries->paginate($request->input('per_page', 15));

        return response()->json([
            'deliveries' => $deliveries
        ], 200);
    }

    public function loadCalendar(Request $request)
    {
        $month = $request->input('month', now()->month);
        $year  = $request->input('year', now()->year);

        $deliveries = Delivery::with(['rider', 'order'])
            ->where('is_deleted', false)
            ->whereMonth('scheduled_date', $month)
            ->whereYear('scheduled_date', $year)
            ->get();

        return response()->json([
            'deliveries' => $deliveries
        ], 200);
    }

    public function storeDelivery(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rider_id'           => ['nullable', 'exists:tbl_users,user_id'],
            'order_id'           => ['required_without:recurring_order_id', 'nullable', 'exists:tbl_orders,order_id'],
            'recurring_order_id' => ['required_without:order_id', 'nullable', 'exists:tbl_recurring_orders,recurring_order_id'],
            'scheduled_date'     => ['required', 'date'],
            'expected_amount'    => ['nullable', 'numeric', 'min:0'],
            'notes'              => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        $hasRider  = !empty($validated['rider_id']);

        try {
            $delivery = DB::transaction(function () use ($validated, $hasRider) {
                $orderId           = $validated['order_id'] ?? null;
                $recurringOrderId  = $validated['recurring_order_id'] ?? null;
                $expectedAmount    = $validated['expected_amount'] ?? null;

                if ($recurringOrderId) {
                    $recurring = RecurringOrder::with(['product', 'initialProduct', 'customer'])
                        ->where('recurring_order_id', $recurringOrderId)
                        ->where('is_deleted', false)
                        ->where('is_active', true)
                        ->firstOrFail();

                    $chargeProduct = $recurring->product;
                    $unitPrice     = RecurringOrderService::deliveryUnitPrice(
                        $recurring->product,
                        $recurring->initialProduct,
                        (bool) $recurring->includes_container,
                        (bool) $recurring->first_delivery_completed
                    );

                    if (
                        $recurring->includes_container
                        && !$recurring->first_delivery_completed
                        && $recurring->initialProduct
                    ) {
                        $chargeProduct = $recurring->initialProduct;
                    }

                    $subtotal       = $unitPrice * $recurring->quantity;
                    $expectedAmount = $expectedAmount ?? $subtotal;

                    $gpsLat = null;
                    $gpsLng = null;
                    if ($recurring->delivery_address) {
                        $geo = GeocodingService::geocode($recurring->delivery_address);
                        if ($geo) {
                            $gpsLat = $geo['lat'];
                            $gpsLng = $geo['lng'];
                        }
                    }

                    $gallonOwned = 0;
                    if ($recurring->includes_container && !$recurring->first_delivery_completed) {
                        $gallonOwned = $recurring->quantity;
                    }

                    $order = Order::create([
                        'customer_id'      => $recurring->customer_id,
                        'processed_by'     => auth()->id(),
                        'order_type'       => 'delivery',
                        'total_amount'     => $subtotal,
                        'gallon_owned'     => $gallonOwned,
                        'gallon_exchange'  => 0,
                        'status'           => 'pending',
                        'payment_method'   => 'cash',
                        'payment_status'   => 'unpaid',
                        'delivery_address' => $recurring->delivery_address,
                        'gps_lat'          => $gpsLat,
                        'gps_lng'          => $gpsLng,
                        'notes'            => $recurring->notes,
                    ]);

                    OrderItem::create([
                        'order_id'   => $order->order_id,
                        'product_id' => $chargeProduct->product_id,
                        'quantity'   => $recurring->quantity,
                        'unit_price' => $unitPrice,
                        'subtotal'   => $subtotal,
                    ]);

                    if ($recurring->includes_container && !$recurring->first_delivery_completed) {
                        $recurring->update(['first_delivery_completed' => true]);
                    }

                    $orderId = $order->order_id;
                } else {
                    $order = Order::where('order_id', $orderId)->firstOrFail();
                    $expectedAmount = $expectedAmount ?? $order->total_amount ?? 0;
                }

                return Delivery::create([
                    'rider_id'           => $validated['rider_id'] ?? null,
                    'order_id'           => $orderId,
                    'recurring_order_id' => $recurringOrderId,
                    'scheduled_date'     => $validated['scheduled_date'],
                    'status'             => $hasRider ? 'assigned' : 'pending',
                    'expected_amount'    => $expectedAmount,
                    'collected_amount'   => 0.00,
                    'notes'              => $validated['notes'] ?? null,
                ]);
            });
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to schedule delivery.',
                'error'   => $e->getMessage(),
            ], 422);
        }

        $delivery->load(['rider', 'order.orderItems.product', 'order.customer']);

        if ($hasRider) {
            $this->notifyRiderAssigned($delivery);
        }

        return response()->json([
            'message'  => 'Delivery Successfully Scheduled.',
            'delivery' => $delivery
        ], 200);
    }

    public function updateDelivery(Request $request, Delivery $delivery)
    {
        $validator = Validator::make($request->all(), [
            'rider_id'       => ['nullable', 'exists:tbl_users,user_id'],
            'scheduled_date' => ['required', 'date'],
            'expected_amount'=> ['nullable', 'numeric', 'min:0'],
            'notes'          => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $riderId     = $validated['rider_id'] ?? null;
        $wasAssigned = (int) $delivery->rider_id;
        $newRider    = $riderId ? (int) $riderId : null;

        $updates = [
            'rider_id'        => $newRider,
            'scheduled_date'  => $validated['scheduled_date'],
            'expected_amount' => $validated['expected_amount'] ?? $delivery->expected_amount,
            'notes'           => $validated['notes'] ?? $delivery->notes,
        ];

        if ($newRider) {
            $updates['status'] = 'assigned';
        } elseif ($wasAssigned && !$newRider) {
            $updates['status'] = 'pending';
        }

        $delivery->update($updates);

        $delivery->load(['rider', 'order.orderItems.product', 'order.customer']);

        if ($newRider && $newRider !== $wasAssigned) {
            $this->notifyRiderAssigned($delivery);
        }

        return response()->json([
            'message'  => 'Delivery Successfully Updated.',
            'delivery' => $delivery
        ], 200);
    }

    private function notifyRiderAssigned(Delivery $delivery): void
    {
        if (!$delivery->rider_id) {
            return;
        }

        $delivery->loadMissing(['order.customer']);
        $customer = $delivery->order?->customer;
        $name     = $customer
            ? trim("{$customer->first_name} {$customer->last_name}")
            : 'a customer';
        $address  = $delivery->order?->delivery_address
            ?? $customer?->address
            ?? 'See app for address';

        Notification::create([
            'user_id' => $delivery->rider_id,
            'type'    => 'delivery',
            'title'   => 'New Delivery Assigned',
            'message' => "Delivery #{$delivery->delivery_id} for {$name} on {$delivery->scheduled_date}. Address: {$address}",
            'is_read' => 0,
        ]);
    }

    public function updateStatus(Request $request, Delivery $delivery)
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', Rule::in(['pending', 'assigned', 'in_transit', 'delivered', 'failed'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $delivery->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Delivery Status Updated.',
            'status'  => $delivery->status
        ], 200);
    }

    public function destroyDelivery(Delivery $delivery)
    {
        $delivery->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Delivery Successfully Deleted.'
        ], 200);
    }
}
