<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class SuperadminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'amon@teslatech.my.id'],
            [
                'name' => 'Superadmin',
                'username' => 'amon@teslatech.my.id',
                'password' => 'gantengmaxpro',
                'role' => 'superadmin',
                'email_verified_at' => now(),
            ]
        );
    }
}
