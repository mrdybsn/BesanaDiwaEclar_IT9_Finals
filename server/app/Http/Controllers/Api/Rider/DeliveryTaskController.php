<?php

namespace App\Http\Controllers\Api\Rider;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\Notification;
use App\Models\Remittance;
use App\Services\OrderStockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DeliveryTaskController extends Controller
{
    public function myDeliveries(Request $request)
    {
        $date   = $request->input('date');
        $status = $request->input('status');
        // active = all non-completed assignments (default for rider tasks)
        // today  = only scheduled for a given date (defaults to today)
        $scope  = $request->input('scope', $date ? 'today' : 'active');

        $deliveries = Delivery::with([
                'order.orderItems.product',
                'order.customer',
            ])
            ->where('rider_id', auth()->id())
            ->where('is_deleted', false)
            ->orderBy('scheduled_date', 'asc')
            ->orderBy('delivery_id', 'asc');

        if ($scope === 'today') {
            $filterDate = $date ?? now()->toDateString();
            $deliveries->whereDate('scheduled_date', $filterDate);
        } else {
            $deliveries->whereNotIn('status', ['delivered', 'failed']);
        }

        if ($status) {
            $deliveries->where('status', $status);
        }

        $deliveries = $deliveries->get();

        return response()->json([
            'deliveries' => $deliveries
        ], 200);
    }

    public function updateGPS(Request $request, Delivery $delivery)
    {
        // make sure rider only updates their own delivery
        if ($delivery->rider_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'rider_gps_lat' => ['required', 'numeric'],
            'rider_gps_lng' => ['required', 'numeric'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $delivery->update([
            'rider_gps_lat' => $request->rider_gps_lat,
            'rider_gps_lng' => $request->rider_gps_lng,
            'status'        => 'in_transit',
        ]);

        return response()->json([
            'message' => 'GPS Updated.',
            'lat'     => $delivery->rider_gps_lat,
            'lng'     => $delivery->rider_gps_lng,
        ], 200);
    }

    public function markDelivered(Request $request, Delivery $delivery)
    {
        // make sure rider only updates their own delivery
        if ($delivery->rider_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        $delivery->load('order');

        $isRecurring  = !empty($delivery->recurring_order_id);
        $orderPaid    = $delivery->order?->payment_status === 'paid';
        $completeOnly = $request->boolean('complete_only');

        $validator = Validator::make($request->all(), [
            'collected_amount' => ['required', 'numeric', 'min:0'],
            'notes'            => ['nullable', 'string'],
            'complete_only'    => ['sometimes', 'boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $collectedAmount = (float) $request->collected_amount;
        $needsCollection   = $isRecurring || !$orderPaid;

        if ($needsCollection && !$completeOnly && $collectedAmount <= 0) {
            return response()->json([
                'message' => 'Collection amount is required for this delivery.',
            ], 422);
        }

        if ($completeOnly || (!$needsCollection && $orderPaid)) {
            $collectedAmount = 0;
        }

        $delivery->update([
            'status'           => 'delivered',
            'collected_amount' => $collectedAmount,
            'notes'            => $request->notes ?? $delivery->notes,
        ]);

        if ($delivery->order) {
            $orderUpdate = ['status' => 'delivered'];
            if ($needsCollection || $collectedAmount > 0) {
                $orderUpdate['payment_status'] = 'paid';
            }
            $delivery->order->update($orderUpdate);
            OrderStockService::deductForOrder($delivery->order->fresh());
        }

        if ($collectedAmount > 0) {
            Remittance::updateOrCreate(
                ['delivery_id' => $delivery->delivery_id, 'is_deleted' => false],
                [
                    'rider_id'         => auth()->id(),
                    'date'             => now()->toDateString(),
                    'collected_amount' => $collectedAmount,
                    'remitted_amount'  => 0,
                    'status'           => 'pending',
                    'notes'            => 'Auto-logged from rider collection.',
                ]
            );
        }

        if ($needsCollection && $collectedAmount > 0) {
            Notification::create([
                'user_id' => $delivery->order->processed_by ?? null,
                'type'    => 'payment',
                'title'   => 'Payment Collected',
                'message' => 'Rider ' . auth()->user()->first_name . ' ' . auth()->user()->last_name .
                    ' collected PHP ' . number_format($collectedAmount, 2) .
                    ' for Delivery #' . $delivery->delivery_id . '.',
                'is_read' => 0,
            ]);
        } else {
            Notification::create([
                'user_id' => $delivery->order->processed_by ?? null,
                'type'    => 'delivery',
                'title'   => 'Delivery Completed',
                'message' => 'Rider ' . auth()->user()->first_name . ' ' . auth()->user()->last_name .
                    ' completed prepaid Delivery #' . $delivery->delivery_id . '.',
                'is_read' => 0,
            ]);
        }

        $delivery->load(['order.orderItems.product']);

        return response()->json([
            'message'  => 'Delivery Marked as Delivered.',
            'delivery' => $delivery
        ], 200);
    }

    public function markFailed(Request $request, Delivery $delivery)
    {
        // make sure rider only updates their own delivery
        if ($delivery->rider_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'notes' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $delivery->update([
            'status' => 'failed',
            'notes'  => $request->notes,
        ]);

        // notify admin that delivery failed
        Notification::create([
            'user_id' => $delivery->order->processed_by ?? null,
            'type'    => 'delivery',
            'title'   => 'Delivery Failed',
            'message' => 'Rider ' . auth()->user()->first_name . ' ' . auth()->user()->last_name .
                         ' reported Delivery #' . $delivery->delivery_id . ' as failed. Reason: ' . $request->notes,
            'is_read' => 0,
        ]);

        return response()->json([
            'message' => 'Delivery Marked as Failed.',
        ], 200);
    }

    public function weeklySchedule()
    {
        $startOfWeek = now()->startOfWeek()->toDateString();
        $endOfWeek   = now()->endOfWeek()->toDateString();

        $deliveries = Delivery::with([
                'order.orderItems.product',
                'order.customer',
            ])
            ->where('rider_id', auth()->id())
            ->where('is_deleted', false)
            ->whereBetween('scheduled_date', [$startOfWeek, $endOfWeek])
            ->orderBy('scheduled_date', 'asc')
            ->get();

        return response()->json([
            'deliveries' => $deliveries
        ], 200);
    }
}
