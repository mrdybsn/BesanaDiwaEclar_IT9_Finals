<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $table      = 'tbl_products';
    protected $primaryKey = 'product_id';

    protected $fillable = [
        'image',
        'name',
        'size',
        'unit',
        'price',
        'price_per_liter',
        'custom_volume_ml',
        'container_deposit',
        'stock',
        'low_stock_threshold',
        'is_available',
        'is_deleted',
    ];

    protected function casts(): array
    {
        return [
            'price'             => 'decimal:2',
            'price_per_liter'   => 'decimal:2',
            'container_deposit' => 'decimal:2',
            'is_available'      => 'boolean',
            'is_deleted'        => 'boolean',
        ];
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'product_id', 'product_id');
    }

    public function recurringOrders(): HasMany
    {
        return $this->hasMany(RecurringOrder::class, 'product_id', 'product_id');
    }
}
