<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecurringOrder extends Model
{
    protected $table      = 'tbl_recurring_orders';
    protected $primaryKey = 'recurring_order_id';

    protected $fillable = [
        'customer_id',
        'product_id',
        'initial_product_id',
        'includes_container',
        'first_delivery_completed',
        'quantity',
        'day_of_week',
        'is_active',
        'delivery_address',
        'notes',
        'is_deleted',
    ];

    protected function casts(): array
    {
        return [
            'includes_container'         => 'boolean',
            'first_delivery_completed'   => 'boolean',
            'is_active'                  => 'boolean',
            'is_deleted'                 => 'boolean',
        ];
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    public function initialProduct()
    {
        return $this->belongsTo(Product::class, 'initial_product_id', 'product_id');
    }
}
