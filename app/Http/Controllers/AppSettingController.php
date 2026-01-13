<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use Illuminate\Http\Request;
use App\Services\AppSettingService;

class AppSettingController extends Controller
{
      protected $AppSettingService;
    public function __construct(AppSettingService $AppSettingService)
    {
        $this->AppSettingService = $AppSettingService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $AppSettings = $this->AppSettingService->list();
        return inertia('Admin/AppSetting/AppSettingIndex', [
            'setting' => $AppSettings,
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(AppSetting $AppSetting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AppSetting $AppSetting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'compnay_desc' => 'required|string',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'category_header' => 'nullable|string|max:255',
            'subcategory_header' => 'nullable|string|max:255',
            'rating_header' => 'nullable|string|max:255',
        ]);
        $this->AppSettingService->updateData($id, $request);
        return redirect()->route('app_settings.index')->with('success', 'AppSetting updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AppSetting $AppSetting)
    {
        //
    }
}
