<?php

namespace App\Services;

use Exception;
use App\Models\Guest;
use App\Models\GuestTable;
use App\Imports\GuestImport;
use Maatwebsite\Excel\Facades\Excel;

class GuestService
{
    /**
     * Display a listing of the resource.
     */
    public function list($request)
    {
        $guests = Guest::with('table:id,name')->orderBy('id');

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $guests = $guests->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('seat_no', 'like', '%' . $search . '%')
                    ->orWhereHas('table', function ($tableQuery) use ($search) {
                        $tableQuery->where('name', 'like', '%' . $search . '%');
                    });
            });
        }

        if ($request->has('table_id') && !empty($request->table_id)) {
            $guests = $guests->where('table_id', $request->table_id);
        }

        if ($request->boolean('paginate', true)) {
            return $guests->paginate(10)->withQueryString();
        }

        return $guests->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storeData($request)
    {
        try {
            if ($this->seatTaken($request->table_id, $request->seat_no)) {
                return ['error', 'Seat already taken.'];
            }

            Guest::create([
                'name' => $request->name,
                'table_id' => $request->table_id,
                'seat_no' => $request->seat_no,
                'checked_in' => (bool) $request->checked_in,
                'source' => 'manual',
            ]);

            return ['success', 'Guest created successfully.'];
        } catch (Exception $e) {
            return ['error', 'Something went wrong.'];
        }
    }

    /**
     * Display the specified resource.
     */
    public function showData($id)
    {
        return Guest::with('table:id,name')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateData($guest, $request)
    {
        try {
            if ($this->seatTaken($request->table_id, $request->seat_no, $guest->id)) {
                return ['error', 'Seat already taken.'];
            }

            $guest->update([
                'name' => $request->name,
                'table_id' => $request->table_id,
                'seat_no' => $request->seat_no,
                'checked_in' => (bool) $request->checked_in,
            ]);

            return ['success', 'Guest updated successfully.'];
        } catch (Exception $e) {
            return ['error', 'Something went wrong.'];
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function deleteData($id)
    {
        try {
            $guest = Guest::findOrFail($id);
            $guest->delete();
            return ['success', 'Guest deleted successfully.'];
        } catch (Exception $e) {
            return ['error', 'Something went wrong.'];
        }
    }

    public function importData($file)
    {
        $import = new GuestImport();
        Excel::import($import, $file);

        if ($import->created === 0) {
            return ['error', $import->errors[0] ?? 'No guests imported.'];
        }

        $message = "Imported {$import->created} guest(s).";
        if ($import->skipped > 0) {
            $message .= " Skipped {$import->skipped} row(s).";
        }

        return ['success', $message];
    }
}
