<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\GallonDebt;

class GallonDebtService
{
    /**
     * Record or update gallon container debt for a customer.
     */
    public static function recordDebt(?int $customerId, int $gallonsBorrowed, ?string $notes = null): void
    {
        if (!$customerId || $gallonsBorrowed <= 0) {
            return;
        }

        if (!Customer::where('customer_id', $customerId)->exists()) {
            return;
        }

        $existing = GallonDebt::where('customer_id', $customerId)
            ->where('is_deleted', false)
            ->first();

        if ($existing) {
            $existing->update([
                'gallons_borrowed' => $existing->gallons_borrowed + $gallonsBorrowed,
                'notes'            => $notes ?? $existing->notes,
            ]);
            return;
        }

        GallonDebt::create([
            'customer_id'      => $customerId,
            'gallons_borrowed' => $gallonsBorrowed,
            'gallons_returned' => 0,
            'notes'            => $notes,
        ]);
    }

    /**
     * Compute net new gallon containers from order gallon fields.
     */
    public static function netBorrowedFromOrder(int $gallonOwned, int $gallonExchange): int
    {
        $net = $gallonOwned - $gallonExchange;
        return max(0, $net);
    }
}
