<?php

namespace App\Http\Controllers;

use App\Models\ShopSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LandingSettingController extends Controller
{
    public function edit()
    {
        $settings = ShopSetting::current();

        return Inertia::render('Admin/Cms/Landing/Edit', [
            'settings' => $settings,
            'landing' => app(\App\Services\ShopSettingService::class)->landingForFrontend(),
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
            'landing_show_latest_posts' => 'boolean',
            'landing_posts_limit' => 'nullable|integer|min:1|max:12',
            'hero_image' => 'nullable|image|max:4096',
            'about_image' => 'nullable|image|max:4096',
        ]);

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

        unset($validated['hero_image'], $validated['about_image']);

        $validated['landing_show_latest_posts'] = $request->boolean('landing_show_latest_posts');

        $settings->update($validated);

        return redirect()->back()->with('success', 'Pengaturan landing page berhasil disimpan.');
    }
}
