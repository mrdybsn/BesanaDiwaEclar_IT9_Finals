<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Remittance;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class RemittanceController extends Controller
{
    public function loadRemittances(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $date      = $request->input('date');
        $dateFrom  = $request->input('date_from');
        $dateTo    = $request->input('date_to');
        $riderId   = $request->input('rider_id');

        $remittances = Remittance::with([
                'rider',
                'delivery.order'
            ])
            ->where('is_deleted', false)
            ->orderBy('date', 'desc');

        if ($search) {
            $remittances->whereHas('rider', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $remittances->where('status', $status);
        }

        if ($date) {
            $remittances->whereDate('date', $date);
        }

        if ($dateFrom) {
            $remittances->whereDate('date', '>=', $dateFrom);
        }

        if ($dateTo) {
            $remittances->whereDate('date', '<=', $dateTo);
        }

        if ($riderId) {
            $remittances->where('rider_id', $riderId);
        }

        $remittances = $remittances->paginate($request->input('per_page', 15));

        return response()->json([
            'remittances' => $remittances
        ], 200);
    }

    public function storeRemittance(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rider_id'         => ['required', 'exists:tbl_users,user_id'],
            'delivery_id'      => ['required', 'exists:tbl_deliveries,delivery_id'],
            'date'             => ['required', 'date'],
            'collected_amount' => ['required', 'numeric', 'min:0'],
            'remitted_amount'  => ['required', 'numeric', 'min:0'],
            'notes'            => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        // auto determine status based on amount difference
        $difference = abs($validated['collected_amount'] - $validated['remitted_amount']);
        $status     = $difference < 1 ? 'verified' : 'discrepancy';

        $remittance = Remittance::create([
            'rider_id'         => $validated['rider_id'],
            'delivery_id'      => $validated['delivery_id'],
            'date'             => $validated['date'],
            'collected_amount' => $validated['collected_amount'],
            'remitted_amount'  => $validated['remitted_amount'],
            'status'           => $status,
            'notes'            => $validated['notes'] ?? null,
        ]);

        $remittance->load(['rider', 'delivery.order']);

        return response()->json([
            'message'    => 'Remittance Successfully Logged.',
            'remittance' => $remittance
        ], 200);
    }

    public function verifyRemittance(Request $request, Remittance $remittance)
    {
        $validator = Validator::make($request->all(), [
            'remitted_amount' => ['required', 'numeric', 'min:0'],
            'notes'           => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated  = $validator->validated();

        // recompute status on verify
        $difference = abs($remittance->collected_amount - $validated['remitted_amount']);
        $status     = $difference < 1 ? 'verified' : 'discrepancy';

        $remittance->update([
            'remitted_amount' => $validated['remitted_amount'],
            'status'          => $status,
            'notes'           => $validated['notes'] ?? $remittance->notes,
        ]);

        $remittance->load(['rider', 'delivery.order']);

        return response()->json([
            'message'    => 'Remittance Successfully Verified.',
            'remittance' => $remittance
        ], 200);
    }

    public function destroyRemittance(Remittance $remittance)
    {
        $remittance->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Remittance Successfully Deleted.'
        ], 200);
    }
}
