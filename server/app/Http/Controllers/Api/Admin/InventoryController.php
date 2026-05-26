<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class InventoryController extends Controller
{
    public function loadInventory(Request $request)
    {
        $search   = $request->input('search');
        $category = $request->input('category');

        $items = InventoryItem::where('is_deleted', false)
            ->orderBy('item_name', 'asc');

        if ($search) {
            $items->where(function ($query) use ($search) {
                $query->where('item_name', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('unit', 'like', "%{$search}%");
            });
        }

        if ($category) {
            $items->where('category', $category);
        }

        $items = $items->paginate(15);

        return response()->json([
            'items' => $items
        ], 200);
    }

    public function loadAlerts()
    {
        $alerts = InventoryItem::where('is_deleted', false)
            ->whereColumn('quantity', '<=', 'low_stock_threshold')
            ->orderBy('quantity', 'asc')
            ->get();

        return response()->json([
            'alerts' => $alerts,
            'count'  => $alerts->count()
        ], 200);
    }

    public function storeInventory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'item_name'           => ['required', 'string', 'max:100'],
            'category'            => ['required', Rule::in([
                                        'containers',
                                        'caps',
                                        'filters',
                                        'chemicals',
                                        'equipment',
                                        'other'
                                    ])],
            'quantity'            => ['required', 'integer', 'min:0'],
            'unit'                => ['required', 'string', 'max:30'],
            'low_stock_threshold' => ['required', 'integer', 'min:1'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $item = InventoryItem::create([
            'item_name'           => $validated['item_name'],
            'category'            => $validated['category'],
            'quantity'            => $validated['quantity'],
            'unit'                => $validated['unit'],
            'low_stock_threshold' => $validated['low_stock_threshold'],
        ]);

        return response()->json([
            'message' => 'Inventory Item Successfully Added.',
            'item'    => $item
        ], 200);
    }

    public function updateInventory(Request $request, InventoryItem $inventoryItem)
    {
        $validator = Validator::make($request->all(), [
            'item_name'           => ['required', 'string', 'max:100'],
            'category'            => ['required', Rule::in([
                                        'containers',
                                        'caps',
                                        'filters',
                                        'chemicals',
                                        'equipment',
                                        'other'
                                    ])],
            'quantity'            => ['required', 'integer', 'min:0'],
            'unit'                => ['required', 'string', 'max:30'],
            'low_stock_threshold' => ['required', 'integer', 'min:1'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $inventoryItem->update([
            'item_name'           => $validated['item_name'],
            'category'            => $validated['category'],
            'quantity'            => $validated['quantity'],
            'unit'                => $validated['unit'],
            'low_stock_threshold' => $validated['low_stock_threshold'],
        ]);

        return response()->json([
            'message' => 'Inventory Item Successfully Updated.',
            'item'    => $inventoryItem
        ], 200);
    }

    public function destroyInventory(InventoryItem $inventoryItem)
    {
        $inventoryItem->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Inventory Item Successfully Deleted.'
        ], 200);
    }
}
