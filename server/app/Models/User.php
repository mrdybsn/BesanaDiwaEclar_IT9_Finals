<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table      = 'tbl_users';
    protected $primaryKey = 'user_id';

    protected $fillable = [
        'profile_picture',
        'first_name',
        'middle_name',
        'last_name',
        'suffix_name',
        'role',
        'birth_date',
        'age',
        'contact_number',
        'address',
        'gps_lat',
        'gps_lng',
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
}
