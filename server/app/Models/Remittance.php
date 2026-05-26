<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Remittance extends Model
{
    protected $table      = 'tbl_remittances';
    protected $primaryKey = 'remittance_id';

    protected $fillable = [
        'rider_id',
        'delivery_id',
        'date',
        'collected_amount',
        'remitted_amount',
        'status',
        'notes',
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
