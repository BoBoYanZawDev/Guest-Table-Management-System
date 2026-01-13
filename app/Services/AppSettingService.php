<?php

namespace App\Services;

use App\Models\AppSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AppSettingService
{
    public static function list()
    {
        return AppSetting::query()
            ->pluck('value', 'key')
            ->toArray();
    }

    public static function updateData($id, Request $request)
    {
        $keys = [
            'company_name',
            'compnay_desc',
            'address',
            'phone',
            'bot_token',
            'chat_id',
            'category_header',
            'subcategory_header',
            'rating_header',
            'is_show_sub_cat',
            'is_show_cat',
            'logo',
        ];

        $data = [];
        foreach ($keys as $key) {
            if ($key === 'logo') {
                if ($request->hasFile('logo')) {
                    $path = $request->file('logo')->store('uploads', 'public');
                    // uploads/filename.jpg
                    $data['logo'] = rtrim(config('app.url'), '/') . '/storage/' . $path;
                }
                continue;
            }

            $data[$key] = $request->input($key);
        }

        foreach ($data as $key => $value) {
            AppSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
        Cache::forget('app_setting');
        return self::list();
    }
}
