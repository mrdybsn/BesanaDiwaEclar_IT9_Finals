<?php

namespace App\Services;

use App\Models\Product;

class RecurringOrderService
{
    public static function isNewContainerProduct(Product $product): bool
    {
        if ((float) $product->container_deposit > 0) {
            return true;
        }

        return stripos($product->name, '(New Container)') !== false;
    }

    /**
     * Match refill (water-only) product for a new-container SKU.
     */
    public static function resolveRefillProduct(Product $product): Product
    {
        if (!self::isNewContainerProduct($product)) {
            return $product;
        }

        $baseName = trim(preg_replace('/\s*\(New Container\)\s*/i', '', $product->name));

        $refill = Product::where('name', $baseName)
            ->where('size', $product->size)
            ->where('is_deleted', false)
            ->where('is_available', true)
            ->where('container_deposit', '<=', 0)
            ->first();

        return $refill ?? $product;
    }

    /**
     * Price for a recurring delivery: full (container + water) on first run, refill after.
     */
    public static function deliveryUnitPrice(Product $storedProduct, ?Product $initialProduct, bool $includesContainer, bool $firstDeliveryCompleted): float
    {
        if ($includesContainer && !$firstDeliveryCompleted && $initialProduct) {
            return (float) $initialProduct->price;
        }

        return (float) $storedProduct->price;
    }
}
