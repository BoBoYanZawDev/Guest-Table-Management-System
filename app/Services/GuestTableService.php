<?php

namespace App\Services;

use Exception;
use App\Models\GuestTable;

class GuestTableService
{
    /**
     * Display a listing of the resource.
     */
    public function list($request)
    {
        $tables = GuestTable::query()->where('is_active', 1);

        if ($request->has('search') && !empty($request->search)) {
            $tables = $tables->where('name', 'like', '%' . $request->search . '%');
        }

        return $tables->orderBy('created_at',"DESC")->paginate(10)->withQueryString();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storeData($request)
    {
        try {
            GuestTable::create([
                'name' => $request->name,
                'capacity' => $request->capacity ?? 10,
                'is_active' => 1,
            ]);
            return ['success', 'Guest table created successfully.'];
        } catch (Exception $e) {
            return ['error', 'Something went wrong.'];
        }
    }

    /**
     * Display the specified resource.
     */
    public function showData($id)
    {
        return GuestTable::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateData($request, $id)
    {
        try {
            $table = GuestTable::findOrFail($id);
            $table->update([
                'name' => $request->name,
                'capacity' => $request->capacity ?? $table->capacity,
            ]);
            return ['success', 'Guest table updated successfully.'];
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
            $table = GuestTable::findOrFail($id);
            $table->update([
                'is_active' => 0
            ]);
            return ['success', 'Guest Table deleted successfully.'];
        } catch (Exception $e) {
            return ['error', 'Something went wrong.'];
        }
    }
}
