<?php

namespace Database\Seeders;

use App\Models\GuestTable;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GuestTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();
        $tables = [];

        foreach (range(1, 20) as $i) {
            $tables[] = [
                'name' => 'Table ' . str_pad((string) $i, 2, '0', STR_PAD_LEFT),
                'capacity' => 10,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        GuestTable::upsert($tables, ['name'], ['capacity', 'updated_at']);
    }
}
