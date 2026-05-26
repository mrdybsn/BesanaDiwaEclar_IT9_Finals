<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GallonDebt extends Model
{
    protected $table      = 'tbl_gallon_debts';
    protected $primaryKey = 'gallon_debt_id';

    protected $fillable = [
        'customer_id',
        'gallons_borrowed',
        'gallons_returned',
        'notes',
        'is_deleted',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }
}
