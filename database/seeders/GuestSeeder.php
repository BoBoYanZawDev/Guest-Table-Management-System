<?php

namespace Database\Seeders;

use App\Models\Guest;
use App\Models\GuestTable;
use Illuminate\Database\Seeder;

class GuestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tables = GuestTable::select('id', 'name', 'capacity')->orderBy('id')->get();
        $existingSeats = Guest::select('table_id', 'seat_no')->get()->map(function ($guest) {
            return $guest->table_id . ':' . $guest->seat_no;
        })->flip();

        $now = now();
        $payload = [];

        foreach ($tables as $table) {
            $capacity = (int) $table->capacity;
            for ($seatNo = 1; $seatNo <= $capacity; $seatNo++) {
                $key = $table->id . ':' . $seatNo;
                if ($existingSeats->has($key)) {
                    continue;
                }

                $payload[] = [
                    'name' => 'Guest ' . $table->id . '-' . str_pad((string) $seatNo, 2, '0', STR_PAD_LEFT),
                    'table_id' => $table->id,
                    'seat_no' => $seatNo,
                    'source' => 'manual',
                    'checked_in' => false,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        if ($payload) {
            foreach (array_chunk($payload, 500) as $chunk) {
                Guest::insert($chunk);
            }
        }
    }
}
