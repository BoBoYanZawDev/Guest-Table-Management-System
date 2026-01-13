<?php

namespace App\Services;

use Exception;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SettingService
{
    public static function list()
    {
        $settings = Setting::first();
        return $settings;
    }

    public static function updateData($id, Request $request)
    {
        // $setting = Setting::findOrFail($id);
        // $data = $request->all();

        // if ($request->hasFile('logo')) {
        //     $file = $request->file('logo');
        //     $filename = time() . '_' . $file->getClientOriginalName();
        //     $uploadPath = public_path('uploads');

        //     if (!is_dir($uploadPath)) {
        //         mkdir($uploadPath, 0755, true);
        //     }

        //     $file->move($uploadPath, $filename);
        //     $data['logo'] = rtrim(config('app.url'), '/') . '/uploads/' . $filename;
        // } else {
        //     unset($data['logo']);
        // }

        // $setting->update($data);
        // return $setting;
        $setting = Setting::findOrFail($id);
        $data = $request->except('logo');

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('uploads', 'public');
            // uploads/filename.jpg

            $data['logo'] = rtrim(config('app.url'), '/') . '/storage/' . $path;
        }

        $setting->update($data);
        Cache::forget('company_profile');
        return $setting;
    }
}
