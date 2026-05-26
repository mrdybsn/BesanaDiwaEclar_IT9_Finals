<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;

class OrderStockService
{
    public static function deductForOrder(Order $order): void
    {
        if ($order->stock_deducted) {
            return;
        }

        $order->loadMissing('orderItems');

        foreach ($order->orderItems as $item) {
            $product = Product::where('product_id', $item->product_id)
                ->where('is_deleted', false)
                ->first();

            if ($product) {
                $newStock = max(0, (int) $product->stock - (int) $item->quantity);
                $product->update(['stock' => $newStock]);
            }
        }

        $order->update(['stock_deducted' => true]);
    }
}
