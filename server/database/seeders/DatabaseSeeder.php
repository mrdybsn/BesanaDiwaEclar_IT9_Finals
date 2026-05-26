<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'first_name'     => 'System',
                'last_name'      => 'Administrator',
                'role'           => 'admin',
                'birth_date'     => '1990-01-01',
                'age'            => 36,
                'password'       => 'admin123',
                'is_active'      => true,
                'is_deleted'     => false,
            ]
        );

        User::updateOrCreate(
            ['username' => 'rider1'],
            [
                'first_name'     => 'Demo',
                'last_name'      => 'Rider',
                'role'           => 'rider',
                'birth_date'     => '1995-06-15',
                'age'            => 30,
                'password'       => 'rider123',
                'is_active'      => true,
                'is_deleted'     => false,
            ]
        );

        $this->call([
            ProductSeeder::class,
            InventoryItemSeeder::class,
        ]);
    }
}
