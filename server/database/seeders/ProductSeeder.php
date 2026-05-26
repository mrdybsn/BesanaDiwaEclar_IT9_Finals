<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['Purified Water', '500ml', 'bottle', null, 8.00, 16.00, 0.00, 100, 20],
            ['Purified Water', '1L', 'bottle', null, 15.00, 15.00, 0.00, 100, 20],
            ['Purified Water', '5gal', 'gallon', null, 35.00, 7.00, 0.00, 50, 10],
            ['Purified Water (New Container)', '5gal', 'gallon', null, 185.00, 7.00, 150.00, 30, 5],
            ['Alkaline Water', '500ml', 'bottle', null, 12.00, 24.00, 0.00, 80, 15],
            ['Alkaline Water', '1L', 'bottle', null, 20.00, 20.00, 0.00, 80, 15],
            ['Alkaline Water', '5gal', 'gallon', null, 55.00, 11.00, 0.00, 40, 8],
            ['Alkaline Water (New Container)', '5gal', 'gallon', null, 205.00, 11.00, 150.00, 20, 5],
            ['Mineral Water', '500ml', 'bottle', null, 10.00, 20.00, 0.00, 80, 15],
            ['Mineral Water', '1L', 'bottle', null, 18.00, 18.00, 0.00, 80, 15],
            ['Mineral Water', '5gal', 'gallon', null, 45.00, 9.00, 0.00, 40, 8],
            ['Mineral Water (New Container)', '5gal', 'gallon', null, 195.00, 9.00, 150.00, 20, 5],
            ['Purified Water', 'custom', 'bottle', 250, 5.00, 20.00, 0.00, 50, 10],
            ['Purified Water', 'custom', 'jug', 2000, 25.00, 12.50, 0.00, 50, 10],
            ['Purified Water', 'custom', 'container', 10000, 60.00, 6.00, 200.00, 20, 5],
            ['Alkaline Water', 'custom', 'jug', 2000, 35.00, 17.50, 0.00, 30, 8],
            ['Alkaline Water', 'custom', 'container', 10000, 90.00, 9.00, 200.00, 15, 5],
            ['Mineral Water', 'custom', 'jug', 2000, 30.00, 15.00, 0.00, 30, 8],
            ['Mineral Water', 'custom', 'container', 10000, 75.00, 7.50, 200.00, 15, 5],
        ];

        foreach ($products as [$name, $size, $unit, $customMl, $price, $pricePerLiter, $deposit, $stock, $threshold]) {
            Product::updateOrCreate(
                [
                    'name'              => $name,
                    'size'              => $size,
                    'unit'              => $unit,
                    'custom_volume_ml'  => $customMl,
                    'is_deleted'        => false,
                ],
                [
                    'price'               => $price,
                    'price_per_liter'     => $pricePerLiter,
                    'container_deposit'   => $deposit,
                    'stock'               => $stock,
                    'low_stock_threshold' => $threshold,
                    'is_available'        => true,
                ]
            );
        }
    }
}
