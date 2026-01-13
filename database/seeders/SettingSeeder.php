<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::create([
            'company_name' => 'Linn IT Solution Co.,Ltd.',
            'compnay_desc' => 'This is a sample company description.',
            'logo' => "-",
            'address' => 'No.14/585, 4th Street,Paung Laung Quarter, Pyinmanar',
            'phone' => '09788788788',
        ]);
    }
}
