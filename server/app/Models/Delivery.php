<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    protected $table      = 'tbl_deliveries';
    protected $primaryKey = 'delivery_id';

    protected $fillable = [
        'rider_id',
        'order_id',
        'recurring_order_id',
        'scheduled_date',
        'status',
        'expected_amount',
        'collected_amount',
        'rider_gps_lat',
        'rider_gps_lng',
        'notes',
        'is_deleted',
    ];

    public function rider()
    {
        return $this->belongsTo(User::class, 'rider_id', 'user_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }

    public function recurringOrder()
    {
        return $this->belongsTo(RecurringOrder::class, 'recurring_order_id', 'recurring_order_id');
    }
}
