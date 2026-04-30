<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@balipramana.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
        
        // Create a Contributor
        User::factory()->create([
            'name' => 'Wayan UMKM',
            'email' => 'wayan@balipramana.com',
            'password' => Hash::make('password'),
            'role' => 'contributor',
        ]);
        
        // Create an Explorer
        User::factory()->create([
            'name' => 'Budi Explorer',
            'email' => 'budi@balipramana.com',
            'password' => Hash::make('password'),
            'role' => 'explorer',
        ]);
    }
}
