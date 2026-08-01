<?php

namespace App\Models;

use App\Support\LandingDefaults;
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
        'landing_sections_json',
        'landing_copy_json',
        'landing_highlights_json',
        'landing_process_json',
        'landing_testimonials_json',
        'landing_hours_json',
        'landing_warranty_title',
        'landing_warranty_body',
        'landing_cta_title',
        'landing_cta_body',
        'landing_cta_label',
        'landing_cta_url',
        'landing_contact_title',
        'landing_contact_lead',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'warranty_default_months' => 'integer',
        'landing_services_json' => 'array',
        'landing_show_latest_posts' => 'boolean',
        'landing_posts_limit' => 'integer',
        'landing_sections_json' => 'array',
        'landing_copy_json' => 'array',
        'landing_highlights_json' => 'array',
        'landing_process_json' => 'array',
        'landing_testimonials_json' => 'array',
        'landing_hours_json' => 'array',
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
            'landing_hero_subtitle' => 'Perawatan, perbaikan, dan isi freon AC mobil dengan teknisi berpengalaman.',
            'landing_hero_cta_label' => 'Lacak Servis Kendaraan',
            'landing_hero_cta_url' => '/portal/login',
            'landing_about_title' => 'Tentang Bengkel Kami',
            'landing_about_body' => "Bengkel AC mobil kami hadir dengan standar kerja rapi, transparan, dan bergaransi.\n\nPelanggan dapat memantau progres servis kendaraan secara online melalui portal pelanggan.",
            'landing_services_json' => LandingDefaults::services(),
            'landing_show_latest_posts' => true,
            'landing_posts_limit' => 6,
            'landing_sections_json' => LandingDefaults::sections(),
            'landing_copy_json' => LandingDefaults::copy(),
            'landing_highlights_json' => LandingDefaults::highlights(),
            'landing_process_json' => LandingDefaults::process(),
            'landing_testimonials_json' => LandingDefaults::testimonials(),
            'landing_hours_json' => LandingDefaults::hours(),
            'landing_warranty_title' => 'Garansi pekerjaan yang jelas',
            'landing_warranty_body' => 'Garansi servis berlaku sesuai ketentuan bengkel. Klaim garansi wajib disertai bukti servis/SPK.',
            'landing_cta_title' => 'Pantau progres servis secara langsung',
            'landing_cta_body' => 'Masuk ke portal untuk melihat status perbaikan, riwayat kendaraan, dan pembaruan dari bengkel.',
            'landing_cta_label' => 'Lacak Servis Kendaraan',
            'landing_cta_url' => '/portal/login',
            'landing_contact_title' => 'Hubungi kami',
            'landing_contact_lead' => 'Siap membantu konsultasi, booking, dan pertanyaan seputar servis AC mobil.',
        ]);
    }

    protected static function booted(): void
    {
        static::saved(fn () => static::clearCache());
        static::deleted(fn () => static::clearCache());
    }
}
