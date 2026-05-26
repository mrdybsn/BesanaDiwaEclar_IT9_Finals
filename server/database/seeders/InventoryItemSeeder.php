<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use Illuminate\Database\Seeder;

class InventoryItemSeeder extends Seeder
{
    private function mapCategory(string $label): string
    {
        return match (strtolower($label)) {
            'containers' => 'containers',
            'caps'       => 'caps',
            'equipment'  => 'equipment',
            default      => 'other',
        };
    }

    public function run(): void
    {
        $items = [
            ['Round Gallon (5-gal)', 'Containers', 50, 'pcs', 10],
            ['Slim Gallon (5-gal)', 'Containers', 50, 'pcs', 10],
            ['1-Gallon Jug', 'Containers', 30, 'pcs', 8],
            ['500ml Bottle', 'Containers', 100, 'pcs', 20],
            ['1-Liter Bottle', 'Containers', 100, 'pcs', 20],
            ['Round Gallon Cap', 'Caps', 200, 'pcs', 50],
            ['Slim Gallon Cap', 'Caps', 200, 'pcs', 50],
            ['Bottle Cap 500ml', 'Caps', 300, 'pcs', 60],
            ['Bottle Cap 1L', 'Caps', 300, 'pcs', 60],
            ['Heat Shrink Seal (Round)', 'Caps', 200, 'pcs', 50],
            ['Heat Shrink Seal (Slim)', 'Caps', 200, 'pcs', 50],
            ['Tissue Roll', 'Other', 20, 'rolls', 5],
            ['Sanitizing Alcohol', 'Other', 10, 'bottles', 3],
            ['Dishwashing Soap', 'Other', 5, 'bottles', 2],
            ['Cleaning Brush', 'Other', 5, 'pcs', 2],
            ['Sticker Label (Round Gallon)', 'Other', 500, 'pcs', 100],
            ['Sticker Label (Slim Gallon)', 'Other', 500, 'pcs', 100],
            ['Sticker Label (Bottle)', 'Other', 500, 'pcs', 100],
            ['Packaging Tape', 'Other', 10, 'rolls', 3],
            ['Plastic Bag Small', 'Other', 100, 'pcs', 20],
            ['Plastic Bag Large', 'Other', 100, 'pcs', 20],
            ['Receipt Paper Roll', 'Other', 10, 'rolls', 3],
            ['Faucet/Spout', 'Equipment', 5, 'pcs', 2],
            ['O-Ring / Gasket', 'Equipment', 20, 'pcs', 5],
            ['Water Pump', 'Equipment', 2, 'pcs', 1],
            ['UV Lamp Bulb', 'Equipment', 5, 'pcs', 2],
            ['Pressure Gauge', 'Equipment', 3, 'pcs', 1],
            ['Hose Connector', 'Equipment', 10, 'pcs', 3],
            ['Extension Cord', 'Equipment', 3, 'pcs', 1],
            ['Ballpen', 'Other', 20, 'pcs', 5],
            ['Record Logbook', 'Other', 5, 'pcs', 2],
            ['Rubber Band', 'Other', 5, 'packs', 2],
            ['Cable Tie', 'Other', 10, 'packs', 3],
        ];

        foreach ($items as [$name, $category, $qty, $unit, $threshold]) {
            InventoryItem::updateOrCreate(
                [
                    'item_name'  => $name,
                    'is_deleted' => false,
                ],
                [
                    'category'            => $this->mapCategory($category),
                    'quantity'            => $qty,
                    'unit'                => $unit,
                    'low_stock_threshold' => $threshold,
                ]
            );
        }
    }
}
