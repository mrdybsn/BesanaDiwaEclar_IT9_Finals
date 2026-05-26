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
        'quantity',
        'day_of_week',
        'is_active',
        'delivery_address',
        'notes',
        'is_deleted',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
}
