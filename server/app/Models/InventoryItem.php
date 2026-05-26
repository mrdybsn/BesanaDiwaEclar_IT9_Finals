<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    protected $table      = 'tbl_inventory_items';
    protected $primaryKey = 'inventory_item_id';

    protected $fillable = [
        'item_name',
        'category',
        'quantity',
        'unit',
        'low_stock_threshold',
        'is_deleted',
    ];
}
