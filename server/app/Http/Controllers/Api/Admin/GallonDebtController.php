<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\GallonDebt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GallonDebtController extends Controller
{
    public function loadDebts(Request $request)
    {
        $search = $request->input('search');

        $debts = GallonDebt::with('customer')
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc');

        if ($search) {
            $debts->whereHas('customer', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('contact_number', 'like', "%{$search}%");
            });
        }

        $debts = $debts->paginate(15);

        return response()->json([
            'debts' => $debts
        ], 200);
    }

    public function storeDebt(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id'      => ['required', 'exists:tbl_customers,customer_id'],
            'gallons_borrowed' => ['required', 'integer', 'min:1'],
            'notes'            => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        // check if customer already has an existing debt record
        $existing = GallonDebt::where('customer_id', $validated['customer_id'])
            ->where('is_deleted', false)
            ->first();

        if ($existing) {
            // add to existing debt instead of creating duplicate
            $existing->update([
                'gallons_borrowed' => $existing->gallons_borrowed + $validated['gallons_borrowed'],
                'notes'            => $validated['notes'] ?? $existing->notes,
            ]);

            $existing->load('customer');

            return response()->json([
                'message' => 'Gallon Debt Updated for Existing Customer.',
                'debt'    => $existing
            ], 200);
        }

        $debt = GallonDebt::create([
            'customer_id'      => $validated['customer_id'],
            'gallons_borrowed' => $validated['gallons_borrowed'],
            'gallons_returned' => 0,
            'notes'            => $validated['notes'] ?? null,
        ]);

        $debt->load('customer');

        return response()->json([
            'message' => 'Gallon Debt Successfully Logged.',
            'debt'    => $debt
        ], 200);
    }

    public function updateDebt(Request $request, GallonDebt $gallonDebt)
    {
        $validator = Validator::make($request->all(), [
            'gallons_borrowed' => ['required', 'integer', 'min:0'],
            'gallons_returned' => ['required', 'integer', 'min:0'],
            'notes'            => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        // make sure returned never exceeds borrowed
        if ($validated['gallons_returned'] > $validated['gallons_borrowed']) {
            return response()->json([
                'errors' => [
                    'gallons_returned' => ['Gallons returned cannot exceed gallons borrowed.']
                ]
            ], 422);
        }

        $gallonDebt->update([
            'gallons_borrowed' => $validated['gallons_borrowed'],
            'gallons_returned' => $validated['gallons_returned'],
            'notes'            => $validated['notes'] ?? $gallonDebt->notes,
        ]);

        $gallonDebt->load('customer');

        return response()->json([
            'message' => 'Gallon Debt Successfully Updated.',
            'debt'    => $gallonDebt
        ], 200);
    }

    public function resolveDebt(GallonDebt $gallonDebt)
    {
        // mark as fully returned
        $gallonDebt->update([
            'gallons_returned' => $gallonDebt->gallons_borrowed,
            'notes'            => 'Fully resolved on ' . now()->toDateString(),
        ]);

        $gallonDebt->load('customer');

        return response()->json([
            'message' => 'Gallon Debt Successfully Resolved.',
            'debt'    => $gallonDebt
        ], 200);
    }

    public function destroyDebt(GallonDebt $gallonDebt)
    {
        $gallonDebt->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Gallon Debt Successfully Deleted.'
        ], 200);
    }
}
