<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\RecurringOrder;
use App\Services\RecurringOrderService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RecurringOrderController extends Controller
{
    // ─── GET /admin/recurring ─────────────────────────────────────────────────
    // Returns all recurring orders, optionally filtered by customer or is_active.
    public function loadRecurring(Request $request): JsonResponse
    {
        $query = RecurringOrder::with(['customer', 'product'])
            ->where('is_deleted', false)
            ->latest();

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('day')) {
            $query->where('day_of_week', $request->day);
        }

        $recurring = $query->get();

        return response()->json([
            'success' => true,
            'data'    => $recurring,
        ]);
    }

    // ─── GET /admin/recurring/{recurringOrder} ────────────────────────────────
    // Returns a single recurring order with its full details.
    public function getRecurring(RecurringOrder $recurringOrder): JsonResponse
    {
        $recurringOrder->load(['customer', 'product']);

        return response()->json([
            'success' => true,
            'data'    => $recurringOrder,
        ]);
    }

    // ─── POST /admin/recurring ────────────────────────────────────────────────
    // Creates a new recurring order for a customer.
    public function storeRecurring(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id'       => 'required|exists:tbl_products,product_id',
            'quantity'         => 'required|integer|min:1',
            'day_of_week'      => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'customer_id'      => 'nullable|exists:tbl_customers,customer_id',
            'delivery_address' => 'required|string|max:255',
            'notes'            => 'nullable|string|max:500',
            'is_active'        => 'nullable|boolean',
        ]);

        $validated['is_active']  = $validated['is_active'] ?? true;
        $validated['is_deleted'] = false;

        if (!empty($validated['day_of_week'])) {
            $validated['day_of_week'] = strtolower($validated['day_of_week']);
        }

        $orderedProduct = Product::findOrFail($validated['product_id']);
        if (RecurringOrderService::isNewContainerProduct($orderedProduct)) {
            $refill = RecurringOrderService::resolveRefillProduct($orderedProduct);
            $validated['initial_product_id']  = $orderedProduct->product_id;
            $validated['product_id']          = $refill->product_id;
            $validated['includes_container']  = true;
        } else {
            $validated['includes_container'] = false;
        }
        $validated['first_delivery_completed'] = false;

        $recurring = RecurringOrder::create($validated);
        $recurring->load(['customer', 'product']);

        return response()->json([
            'success' => true,
            'message' => 'Recurring order created successfully.',
            'data'    => $recurring,
        ], 201);
    }

    // ─── PUT /admin/recurring/{recurringOrder} ────────────────────────────────
    // Updates an existing recurring order's details.
    public function updateRecurring(Request $request, RecurringOrder $recurringOrder): JsonResponse
    {
        $validated = $request->validate([
            'customer_id'      => 'sometimes|exists:tbl_customers,customer_id',
            'product_id'       => 'sometimes|exists:tbl_products,product_id',
            'quantity'         => 'sometimes|integer|min:1',
            'day_of_week'      => 'sometimes|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'delivery_address' => 'sometimes|string|max:255',
            'notes'            => 'nullable|string|max:500',
        ]);

        $recurringOrder->update($validated);
        $recurringOrder->load(['customer', 'product']);

        return response()->json([
            'success' => true,
            'message' => 'Recurring order updated successfully.',
            'data'    => $recurringOrder,
        ]);
    }

    // ─── PATCH /admin/recurring/{recurringOrder}/status ───────────────────────
    // Toggles is_active between true and false.
    public function updateStatus(Request $request, RecurringOrder $recurringOrder): JsonResponse
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $recurringOrder->update(['is_active' => $validated['is_active']]);

        $status = $validated['is_active'] ? 'activated' : 'paused';

        return response()->json([
            'success' => true,
            'message' => "Recurring order {$status} successfully.",
            'data'    => $recurringOrder,
        ]);
    }

    // ─── DELETE /admin/recurring/{recurringOrder} ─────────────────────────────
    // Soft deletes by setting is_deleted = true (preserves records).
    public function destroyRecurring(RecurringOrder $recurringOrder): JsonResponse
    {
        $recurringOrder->update(['is_deleted' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Recurring order deleted successfully.',
        ]);
    }
}
