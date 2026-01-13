<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\GuestTable;
use Illuminate\Http\Request;
use App\Services\GuestService;

class GuestController extends Controller
{
    protected $guestService;
    public function __construct(GuestService $guestService)
    {
        $this->guestService = $guestService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $guests =  $this->guestService->list($request);
        $tables = GuestTable::where('is_active', 1)
            ->orderBy('id')
            ->get(['id', 'name', 'capacity']);
        return inertia('Admin/Guest/GuestIndex', [
            'guests' => $guests,
            'tables' => $tables,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'table_id' => ['required', 'integer', 'exists:guest_tables,id'],
            'seat_no' => ['nullable', 'integer', 'min:1'],
            'checked_in' => ['nullable', 'boolean'],
        ]);

        [$status, $message] = $this->guestService->storeData($request);
        return redirect()->back()->with($status, $message);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Guest $guest)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'table_id' => ['required', 'integer', 'exists:guest_tables,id'],
            'seat_no' => ['nullable', 'integer', 'min:1'],
            'checked_in' => ['nullable', 'boolean'],
        ]);

        [$status, $message] = $this->guestService->updateData($guest, $request);
        return redirect()->back()->with($status, $message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Guest $guest)
    {
        [$status, $message] = $this->guestService->deleteData($guest->id);
        return redirect()->back()->with($status, $message);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv'],
        ]);

        [$status, $message] = $this->guestService->importData($request->file('file'));
        return redirect()->back()->with($status, $message);
    }
}
