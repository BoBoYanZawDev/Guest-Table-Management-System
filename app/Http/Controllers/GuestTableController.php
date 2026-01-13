<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GuestTableService;

class GuestTableController extends Controller
{
    protected $guestTableService;
    public function __construct(GuestTableService $guestTableService)
    {
        $this->guestTableService = $guestTableService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tables =  $this->guestTableService->list($request);
        return inertia('Admin/GuestTable/GuestTableIndex', [
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
            'name' => 'required|string|max:255',
            'capacity' => 'nullable|integer|min:1',
        ]);

        [$status, $message] =    $this->guestTableService->storeData($request);

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
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'nullable|integer|min:1',
        ]);

        [$status, $message] =    $this->guestTableService->updateData($request, $id);

        return redirect()->back()->with($status, $message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        [$status, $message] =    $this->guestTableService->deleteData($id);

        return redirect()->back()->with($status, $message);
    }
}
