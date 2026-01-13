<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\GuestTable;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FrontendController extends Controller
{
    private function firstAvailableSeat(int $tableId, int $capacity): ?int
    {
        $taken = Guest::where('table_id', $tableId)
            ->whereNotNull('seat_no')
            ->pluck('seat_no')
            ->all();
        $taken = array_flip($taken);

        for ($seatNo = 1; $seatNo <= $capacity; $seatNo++) {
            if (!isset($taken[$seatNo])) {
                return $seatNo;
            }
        }

        return null;
    }

    public function guest_table()
    {
        $tables = GuestTable::with(['guests' => function ($query) {
            $query->select('id', 'name', 'table_id', 'seat_no', 'checked_in');
        }])
            ->orderBy('id')
            ->get()
            ->map(function ($table) {
                $capacity = (int) $table->capacity;
                $guestsBySeat = $table->guests->keyBy('seat_no');
                $seats = [];

                for ($seatNo = 1; $seatNo <= $capacity; $seatNo++) {
                    $guest = $guestsBySeat->get($seatNo);
                    $seats[] = [
                        'id' => $table->id . '-' . $seatNo,
                        'seat_no' => $seatNo,
                        'assignment' => $guest ? ['guest' => $guest] : null,
                    ];
                }

                return [
                    'id' => $table->id,
                    'name' => $table->name,
                    'capacity' => $capacity,
                    'seats' => $seats,
                ];
            });
        return Inertia::render('Frontend/GuestTable', [
            'tables' => $tables, // tables -> seats -> assignment -> guest (checked_in)
        ]);
    }

    public function storeGuest(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'table_id' => ['required', 'integer', 'exists:guest_tables,id'],
            'seat_no' => ['required', 'integer', 'min:1'],
        ]);

        $table = GuestTable::findOrFail($validated['table_id']);
        if ($validated['seat_no'] > (int) $table->capacity) {
            return back()->withErrors(['seat_no' => 'Seat number exceeds table capacity.']);
        }

        $taken = Guest::where('table_id', $table->id)
            ->where('seat_no', $validated['seat_no'])
            ->exists();
        if ($taken) {
            return back()->withErrors(['seat_no' => 'Seat already taken.']);
        }

        Guest::create([
            'name' => $validated['name'],
            'table_id' => $table->id,
            'seat_no' => $validated['seat_no'],
            'source' => 'manual',
            'checked_in' => true,
        ]);

        return back();
    }

    public function toggleGuestStatus(Guest $guest)
    {
        $guest->checked_in = ! $guest->checked_in;
        $guest->save();

        return back();
    }

    public function moveGuest(Request $request)
    {
        $validated = $request->validate([
            'guest_id' => ['required', 'integer', 'exists:guests,id'],
            'to_table_id' => ['nullable', 'integer', 'exists:guest_tables,id'],
            'reason' => ['nullable', 'string', 'max:50'],
        ]);

        $guest = Guest::findOrFail($validated['guest_id']);

        if ($validated['to_table_id']) {
            $table = GuestTable::findOrFail($validated['to_table_id']);
            $seatNo = $this->firstAvailableSeat($table->id, (int) $table->capacity);

            if (! $seatNo) {
                return back()->withErrors(['to_table_id' => 'No free seats in that table.']);
            }
        } else {
            $tables = GuestTable::orderBy('id')->get();
            $table = null;
            $seatNo = null;

            foreach ($tables as $candidate) {
                $candidateSeat = $this->firstAvailableSeat($candidate->id, (int) $candidate->capacity);
                if ($candidateSeat) {
                    $table = $candidate;
                    $seatNo = $candidateSeat;
                    break;
                }
            }

            if (! $table || ! $seatNo) {
                return back()->withErrors(['to_table_id' => 'No free seats available.']);
            }
        }   

        $guest->update([
            'table_id' => $table->id,
            'seat_no' => $seatNo,
        ]);

        return back()->with('success', 'Guest moved successfully.');
    }

    public function swapGuests(Request $request)
    {
        $validated = $request->validate([
            'guest_id' => ['required', 'integer', 'exists:guests,id', 'different:with_guest_id'],
            'with_guest_id' => ['required', 'integer', 'exists:guests,id'],
        ]);

        $guest = Guest::findOrFail($validated['guest_id']);
        $otherGuest = Guest::findOrFail($validated['with_guest_id']);

        DB::transaction(function () use ($guest, $otherGuest) {
            $tempTableId = $guest->table_id;
            $tempSeatNo = $guest->seat_no;

            $guest->update([
                'table_id' => $otherGuest->table_id,
                'seat_no' => $otherGuest->seat_no,
            ]);

            $otherGuest->update([
                'table_id' => $tempTableId,
                'seat_no' => $tempSeatNo,
            ]);
        });

        return back()->with('success', 'Seats swapped successfully.');
    }
}
