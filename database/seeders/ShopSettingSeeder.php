<?php

namespace Database\Seeders;

use App\Models\ShopSetting;
use Illuminate\Database\Seeder;

class ShopSettingSeeder extends Seeder
{
    public function run(): void
    {
        if (ShopSetting::query()->exists()) {
            return;
        }

        ShopSetting::create([
            'app_name' => config('app.name', 'Berkah Teknik AC'),
            'legal_name' => 'Berkah Teknik AC',
            'short_name' => 'AC Berkah',
            'tagline' => 'Melayani dengan Sepenuh Hati',
            'owner_name' => null,
            'phone' => null,
            'whatsapp' => null,
            'email' => null,
            'website' => null,
            'address' => null,
            'footer_text' => '© '.date('Y').' Berkah Teknik AC — Melayani dengan Sepenuh Hati',
            'receipt_footer' => 'Terima kasih atas pembelian Anda! Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan.',
            'warranty_policy' => "Garansi servis berlaku sesuai ketentuan bengkel.\nKlaim garansi wajib disertai bukti servis/SPK asli.\nGaransi tidak berlaku untuk kerusakan akibat kelalaian pengguna atau force majeure.",
            'warranty_default_months' => 3,
        ]);
    }
}
