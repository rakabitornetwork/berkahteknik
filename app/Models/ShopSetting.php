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
        'landing_hero_title',
        'landing_hero_subtitle',
        'landing_hero_image_path',
        'landing_hero_cta_label',
        'landing_hero_cta_url',
        'landing_about_title',
        'landing_about_body',
        'landing_about_image_path',
        'landing_services_json',
        'landing_show_latest_posts',
        'landing_posts_limit',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'warranty_default_months' => 'integer',
        'landing_services_json' => 'array',
        'landing_show_latest_posts' => 'boolean',
        'landing_posts_limit' => 'integer',
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
            'landing_hero_title' => 'Servis AC Profesional & Terpercaya',
            'landing_hero_subtitle' => 'Perawatan, perbaikan, dan isi freon AC mobil & rumah dengan teknisi berpengalaman.',
            'landing_hero_cta_label' => 'Lacak Servis Kendaraan',
            'landing_hero_cta_url' => '/portal/login',
            'landing_about_title' => 'Tentang Bengkel Kami',
            'landing_about_body' => "Berkah Teknik AC hadir melayani perawatan dan perbaikan AC dengan standar kerja rapi, transparan, dan bergaransi.\n\nPelanggan dapat memantau progres servis kendaraan secara online melalui portal pelanggan.",
            'landing_services_json' => [
                ['title' => 'Servis AC Mobil', 'description' => 'Cuci evaporator, isi freon, cek kebocoran, dan perbaikan kompresor.', 'icon' => 'car'],
                ['title' => 'Servis AC Rumah', 'description' => 'Perawatan unit split/standing, pembersihan, dan optimasi pendinginan.', 'icon' => 'home'],
                ['title' => 'Penjualan Spare Part', 'description' => 'Suku cadang AC original & kompatibel dengan stok terkini.', 'icon' => 'package'],
            ],
            'landing_show_latest_posts' => true,
            'landing_posts_limit' => 6,
        ]);
    }

    protected static function booted(): void
    {
        static::saved(fn () => static::clearCache());
        static::deleted(fn () => static::clearCache());
    }
}
