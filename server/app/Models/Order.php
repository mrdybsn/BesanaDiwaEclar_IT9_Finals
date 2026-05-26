<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table      = 'tbl_orders';
    protected $primaryKey = 'order_id';

    protected $fillable = [
        'customer_id',
        'processed_by',
        'order_type',
        'total_amount',
        'gallon_owned',
        'gallon_exchange',
        'status',
        'payment_method',
        'payment_status',
        'delivery_address',
        'gps_lat',
        'gps_lng',
        'notes',
        'stock_deducted',
        'is_deleted',
    ];

    protected function casts(): array
    {
        return [
            'stock_deducted' => 'boolean',
        ];
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'order_id');
    }

    public function processedBy()
    {
        return $this->belongsTo(User::class, 'processed_by', 'user_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    public function delivery()
    {
        return $this->hasOne(Delivery::class, 'order_id', 'order_id');
    }
}
