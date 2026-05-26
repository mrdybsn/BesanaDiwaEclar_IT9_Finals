<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LostItemReport extends Model
{
    protected $table      = 'tbl_lost_item_reports';
    protected $primaryKey = 'report_id';

    protected $fillable = [
        'rider_id',
        'delivery_id',
        'customer_name',
        'delivery_address',
        'item_description',
        'item_type',
        'quantity',
        'notes',
        'status',
        'is_deleted',
    ];

    public function rider()
    {
        return $this->belongsTo(User::class, 'rider_id', 'user_id');
    }

    public function delivery()
    {
        return $this->belongsTo(Delivery::class, 'delivery_id', 'delivery_id');
    }
}
