<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DefaultDestinationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = \App\Models\User::where('role', 'admin')->first();
        if (!$admin) return;

        $destinations = [
            [
                'name' => 'Air Terjun Sekumpul',
                'slug' => 'air-terjun-sekumpul',
                'category' => 'Wisata Alam',
                'location' => 'Sekumpul, Buleleng',
                'description' => 'Kumpulan tujuh air terjun tersembunyi di rimbunnya hutan Buleleng yang memukau.',
                'price' => 20000,
                'latitude' => -8.1738,
                'longitude' => 115.1824,
                'status' => 'approved',
                'user_id' => $admin->id,
            ],
            [
                'name' => 'Air Terjun Candi Kuning',
                'slug' => 'air-terjun-candi-kuning',
                'category' => 'Wisata Alam',
                'location' => 'Silangjana, Buleleng',
                'description' => 'Air terjun yang tersembunyi di balik hutan tropis Bali Utara yang masih asri.',
                'price' => 15000,
                'latitude' => -8.1834,
                'longitude' => 115.1587,
                'status' => 'approved',
                'user_id' => $admin->id,
            ],
            [
                'name' => 'Blayag Penglatan',
                'slug' => 'blayag-penglatan',
                'category' => 'Kuliner Lokal',
                'location' => 'Penglatan, Buleleng',
                'description' => 'Kuliner tradisional khas Buleleng yang otentik dan kaya rempah.',
                'price' => 15000,
                'latitude' => -8.1329,
                'longitude' => 115.1121,
                'status' => 'approved',
                'user_id' => $admin->id,
            ],
            [
                'name' => 'Siobak Singaraja',
                'slug' => 'siobak-singaraja',
                'category' => 'Kuliner Lokal',
                'location' => 'Singaraja, Buleleng',
                'description' => 'Kuliner babi khas Buleleng dengan bumbu tauco kental yang legendaris sejak 1970.',
                'price' => 25000,
                'latitude' => -8.1120,
                'longitude' => 115.0880,
                'status' => 'approved',
                'user_id' => $admin->id,
            ]
        ];

        foreach ($destinations as $dest) {
            \App\Models\Destination::create($dest);
        }
    }
}
