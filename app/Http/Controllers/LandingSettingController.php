<?php

namespace App\Http\Controllers;

use App\Models\ShopSetting;
use App\Support\LandingDefaults;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LandingSettingController extends Controller
{
    public function edit()
    {
        $settings = ShopSetting::current();
        $landing = app(\App\Services\ShopSettingService::class)->landingForFrontend();

        return Inertia::render('Admin/Cms/Landing/Edit', [
            'settings' => $settings,
            'landing' => $landing,
            'defaults' => [
                'sections' => LandingDefaults::sections(),
                'copy' => LandingDefaults::copy(),
                'icons' => [
                    'car' => 'Mobil / AC mobil',
                    'snowflake' => 'Pendinginan / freon',
                    'wrench' => 'Perbaikan',
                    'shield' => 'Garansi',
                    'clock' => 'Waktu / portal',
                    'package' => 'Spare part',
                    'check' => 'Checklist',
                    'thermometer' => 'Suhu',
                    'fan' => 'Kipas / blower',
                ],
            ],
        ]);
    }

    public function update(Request $request)
    {
        $settings = ShopSetting::current();

        $validated = $request->validate([
            'landing_hero_title' => 'nullable|string|max:255',
            'landing_hero_subtitle' => 'nullable|string|max:500',
            'landing_hero_cta_label' => 'nullable|string|max:100',
            'landing_hero_cta_url' => 'nullable|string|max:255',
            'landing_about_title' => 'nullable|string|max:255',
            'landing_about_body' => 'nullable|string',
            'landing_services_json' => 'nullable|array|max:8',
            'landing_services_json.*.title' => 'required_with:landing_services_json|string|max:120',
            'landing_services_json.*.description' => 'nullable|string|max:500',
            'landing_services_json.*.icon' => 'nullable|string|max:30',
            'landing_highlights_json' => 'nullable|array|max:8',
            'landing_highlights_json.*.title' => 'required_with:landing_highlights_json|string|max:120',
            'landing_highlights_json.*.description' => 'nullable|string|max:500',
            'landing_highlights_json.*.icon' => 'nullable|string|max:30',
            'landing_process_json' => 'nullable|array|max:6',
            'landing_process_json.*.title' => 'required_with:landing_process_json|string|max:120',
            'landing_process_json.*.description' => 'nullable|string|max:500',
            'landing_testimonials_json' => 'nullable|array|max:8',
            'landing_testimonials_json.*.name' => 'required_with:landing_testimonials_json|string|max:120',
            'landing_testimonials_json.*.vehicle' => 'nullable|string|max:120',
            'landing_testimonials_json.*.quote' => 'required_with:landing_testimonials_json|string|max:600',
            'landing_hours_json' => 'nullable|array|max:8',
            'landing_hours_json.*.day' => 'required_with:landing_hours_json|string|max:80',
            'landing_hours_json.*.time' => 'required_with:landing_hours_json|string|max:80',
            'landing_copy_json' => 'nullable|array',
            'landing_copy_json.*.kicker' => 'nullable|string|max:80',
            'landing_copy_json.*.title' => 'nullable|string|max:255',
            'landing_copy_json.*.lead' => 'nullable|string|max:500',
            'landing_sections_json' => 'nullable|array',
            'landing_warranty_title' => 'nullable|string|max:255',
            'landing_warranty_body' => 'nullable|string',
            'landing_cta_title' => 'nullable|string|max:255',
            'landing_cta_body' => 'nullable|string|max:500',
            'landing_cta_label' => 'nullable|string|max:100',
            'landing_cta_url' => 'nullable|string|max:255',
            'landing_contact_title' => 'nullable|string|max:255',
            'landing_contact_lead' => 'nullable|string|max:500',
            'landing_show_latest_posts' => 'boolean',
            'landing_posts_limit' => 'nullable|integer|min:1|max:12',
            'hero_image' => 'nullable|image|max:12288',
            'about_image' => 'nullable|image|max:12288',
            'remove_hero_image' => 'boolean',
            'remove_about_image' => 'boolean',
        ]);

        if ($request->boolean('remove_hero_image') && $settings->landing_hero_image_path) {
            Storage::disk('public')->delete($settings->landing_hero_image_path);
            $validated['landing_hero_image_path'] = null;
        }

        if ($request->boolean('remove_about_image') && $settings->landing_about_image_path) {
            Storage::disk('public')->delete($settings->landing_about_image_path);
            $validated['landing_about_image_path'] = null;
        }

        if ($request->hasFile('hero_image')) {
            if ($settings->landing_hero_image_path) {
                Storage::disk('public')->delete($settings->landing_hero_image_path);
            }
            $validated['landing_hero_image_path'] = $request->file('hero_image')->store('landing', 'public');
        }

        if ($request->hasFile('about_image')) {
            if ($settings->landing_about_image_path) {
                Storage::disk('public')->delete($settings->landing_about_image_path);
            }
            $validated['landing_about_image_path'] = $request->file('about_image')->store('landing', 'public');
        }

        unset($validated['hero_image'], $validated['about_image'], $validated['remove_hero_image'], $validated['remove_about_image']);

        $validated['landing_show_latest_posts'] = $request->boolean('landing_show_latest_posts');

        if (isset($validated['landing_sections_json']) && is_array($validated['landing_sections_json'])) {
            $normalized = LandingDefaults::sections();
            foreach ($normalized as $key => $default) {
                $normalized[$key] = filter_var(
                    $validated['landing_sections_json'][$key] ?? $default,
                    FILTER_VALIDATE_BOOLEAN,
                    FILTER_NULL_ON_FAILURE
                ) ?? (bool) $default;
            }
            $validated['landing_sections_json'] = $normalized;
            $validated['landing_show_latest_posts'] = $normalized['posts'];
        }

        $settings->update($validated);
        ShopSetting::clearCache();

        return redirect()->back()->with('success', 'Pengaturan landing page berhasil disimpan.');
    }
}
