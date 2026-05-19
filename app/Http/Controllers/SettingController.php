<?php

namespace App\Http\Controllers;

use App\Models\ShopSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function edit()
    {
        $settings = ShopSetting::current();

        return Inertia::render('Admin/Settings/Edit', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $settings = ShopSetting::current();

        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'legal_name' => 'required|string|max:255',
            'short_name' => 'required|string|max:100',
            'tagline' => 'nullable|string|max:255',
            'owner_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'footer_text' => 'nullable|string',
            'receipt_footer' => 'nullable|string',
            'warranty_policy' => 'nullable|string',
            'warranty_default_months' => 'required|integer|min:0|max:120',
            'logo' => 'nullable|image|max:2048',
            'favicon' => 'nullable|image|max:1024',
        ]);

        if ($request->hasFile('logo')) {
            if ($settings->logo_path) {
                Storage::disk('public')->delete($settings->logo_path);
            }
            $validated['logo_path'] = $request->file('logo')->store('shop', 'public');
        }

        if ($request->hasFile('favicon')) {
            if ($settings->favicon_path) {
                Storage::disk('public')->delete($settings->favicon_path);
            }
            $validated['favicon_path'] = $request->file('favicon')->store('shop', 'public');
        }

        unset($validated['logo'], $validated['favicon']);

        $settings->update($validated);

        return redirect()->back()->with('success', 'Pengaturan aplikasi berhasil disimpan.');
    }
}
