<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class ShopSetting extends Model
{
    protected $fillable = [
        'app_name',
        'legal_name',
        'short_name',
        'tagline',
        'owner_name',
        'phone',
        'whatsapp',
        'email',
        'website',
        'address',
        'latitude',
        'longitude',
        'logo_path',
        'favicon_path',
        'footer_text',
        'receipt_footer',
        'warranty_policy',
        'warranty_default_months',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'warranty_default_months' => 'integer',
    ];

    public static function current(): self
    {
        return Cache::remember('shop_settings', 3600, function () {
            return static::query()->first() ?? static::createDefaults();
        });
    }

    public static function clearCache(): void
    {
        Cache::forget('shop_settings');
    }

    public static function createDefaults(): self
    {
        return static::create([
            'app_name' => config('app.name', 'Berkah Teknik AC'),
            'legal_name' => config('app.name', 'Berkah Teknik AC'),
            'short_name' => 'AC Berkah',
            'tagline' => 'Melayani dengan Sepenuh Hati',
            'footer_text' => '© '.date('Y').' Berkah Teknik AC — Melayani dengan Sepenuh Hati',
            'receipt_footer' => 'Terima kasih atas pembelian Anda! Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan.',
            'warranty_policy' => 'Garansi servis berlaku sesuai ketentuan bengkel. Klaim garansi wajib disertai bukti servis/SPK.',
            'warranty_default_months' => 3,
        ]);
    }

    protected static function booted(): void
    {
        static::saved(fn () => static::clearCache());
        static::deleted(fn () => static::clearCache());
    }
}
