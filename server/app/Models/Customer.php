<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends Model
{
    use HasFactory;

    protected $table      = 'tbl_customers';
    protected $primaryKey = 'customer_id';

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'suffix_name',
        'gender',
        'birth_date',
        'age',
        'contact_number',
        'address',
        'username',
        'password',
        'is_active',
        'is_deleted',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    // ── computed full name helper ─────────────────────────────────────────────
    public function getFullNameAttribute(): string
    {
        $name = $this->last_name . ', ' . $this->first_name;
        if ($this->middle_name) $name .= ' ' . $this->middle_name[0] . '.';
        if ($this->suffix_name) $name .= ' ' . $this->suffix_name;
        return $name;
    }

    // ── relationships ─────────────────────────────────────────────────────────
    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id', 'customer_id');
    }
}
