<?php

namespace App\Http\Controllers\Api\Rider;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\LostItemReport;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class LostItemController extends Controller
{
    public function index()
    {
        $reports = LostItemReport::where('rider_id', auth()->id())
            ->where('is_deleted', false)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['reports' => $reports], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'delivery_id'      => ['nullable', 'integer', 'exists:tbl_deliveries,delivery_id'],
            'item_description' => ['required', 'string', 'max:255'],
            'item_type'        => ['required', Rule::in(['gallon', 'cap', 'seal', 'other'])],
            'quantity'         => ['required', 'integer', 'min:1'],
            'notes'            => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();
        $customerName = 'Customer';
        $address      = null;

        if (!empty($validated['delivery_id'])) {
            $delivery = Delivery::with('order.customer')
                ->where('delivery_id', $validated['delivery_id'])
                ->where('rider_id', auth()->id())
                ->where('is_deleted', false)
                ->first();

            if (!$delivery) {
                return response()->json(['message' => 'Delivery not found.'], 404);
            }

            $customer = $delivery->order?->customer;
            if ($customer) {
                $customerName = trim("{$customer->first_name} {$customer->last_name}");
            }
            $address = $delivery->order?->delivery_address;
        }

        $report = LostItemReport::create([
            'rider_id'          => auth()->id(),
            'delivery_id'       => $validated['delivery_id'] ?? null,
            'customer_name'     => $customerName,
            'delivery_address'  => $address,
            'item_description'  => $validated['item_description'],
            'item_type'         => $validated['item_type'],
            'quantity'          => $validated['quantity'],
            'notes'             => $validated['notes'] ?? null,
            'status'            => 'pending',
        ]);

        Notification::create([
            'user_id' => null,
            'type'    => 'lost_item',
            'title'   => 'Lost / Damaged Item Report',
            'message' => 'Rider ' . auth()->user()->first_name . ' ' . auth()->user()->last_name .
                ' reported: ' . $validated['item_description'] . ' (' . $validated['quantity'] . 'x).',
            'is_read' => 0,
        ]);

        return response()->json([
            'message' => 'Report submitted successfully.',
            'report'  => $report,
        ], 200);
    }
}
