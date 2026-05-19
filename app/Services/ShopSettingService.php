<?php

namespace App\Services;

use App\Models\ShopSetting;
use Illuminate\Support\Facades\Storage;

class ShopSettingService
{
    public function forFrontend(): array
    {
        $s = ShopSetting::current();

        return [
            'app_name' => $s->app_name,
            'legal_name' => $s->legal_name,
            'short_name' => $s->short_name,
            'tagline' => $s->tagline,
            'owner_name' => $s->owner_name,
            'phone' => $s->phone,
            'whatsapp' => $s->whatsapp,
            'email' => $s->email,
            'website' => $s->website,
            'address' => $s->address,
            'latitude' => $s->latitude,
            'longitude' => $s->longitude,
            'logo_url' => $s->logo_path ? Storage::disk('public')->url($s->logo_path) : null,
            'favicon_url' => $s->favicon_path ? Storage::disk('public')->url($s->favicon_path) : null,
            'footer_text' => $s->footer_text,
            'receipt_footer' => $s->receipt_footer,
            'warranty_policy' => $s->warranty_policy,
            'warranty_default_months' => (int) $s->warranty_default_months,
            'maps_url' => $this->mapsUrl($s),
            'whatsapp_url' => $this->whatsappUrl($s->whatsapp),
        ];
    }

    public function landingForFrontend(): array
    {
        $s = ShopSetting::current();

        return [
            'hero_title' => $s->landing_hero_title,
            'hero_subtitle' => $s->landing_hero_subtitle,
            'hero_image_url' => $s->landing_hero_image_path
                ? Storage::disk('public')->url($s->landing_hero_image_path)
                : null,
            'hero_cta_label' => $s->landing_hero_cta_label ?: 'Lacak Servis Kendaraan',
            'hero_cta_url' => $s->landing_hero_cta_url ?: '/portal/login',
            'about_title' => $s->landing_about_title,
            'about_body' => $s->landing_about_body,
            'about_image_url' => $s->landing_about_image_path
                ? Storage::disk('public')->url($s->landing_about_image_path)
                : null,
            'services' => $s->landing_services_json ?? [],
            'show_latest_posts' => (bool) $s->landing_show_latest_posts,
            'posts_limit' => (int) ($s->landing_posts_limit ?: 6),
        ];
    }

    public function mapsUrl(ShopSetting $s): ?string
    {
        if ($s->latitude && $s->longitude) {
            return 'https://www.google.com/maps?q='.urlencode("{$s->latitude},{$s->longitude}");
        }

        if ($s->address) {
            return 'https://www.google.com/maps/search/?api=1&query='.urlencode($s->address);
        }

        return null;
    }

    public function whatsappUrl(?string $whatsapp): ?string
    {
        if (! $whatsapp) {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $whatsapp);
        if (str_starts_with($digits, '0')) {
            $digits = '62'.substr($digits, 1);
        }

        return $digits ? 'https://wa.me/'.$digits : null;
    }
}
