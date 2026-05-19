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
