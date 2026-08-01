<?php

namespace App\Http\Controllers;

use App\Models\ServiceCategory;
use App\Support\Units;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ServiceCategories/Index', [
            'items' => ServiceCategory::orderBy('name')->paginate(15),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/ServiceCategories/Form');
    }

    public function store(Request $request)
    {
        $validated = $this->validated($request);
        ServiceCategory::create($validated);

        return redirect()->route('admin.service-categories.index')
            ->with('success', 'Kategori jasa berhasil ditambahkan.');
    }

    public function edit(ServiceCategory $serviceCategory)
    {
        return Inertia::render('Admin/ServiceCategories/Form', [
            'item' => $serviceCategory,
        ]);
    }

    public function update(Request $request, ServiceCategory $serviceCategory)
    {
        $serviceCategory->update($this->validated($request));

        return redirect()->route('admin.service-categories.index')
            ->with('success', 'Kategori jasa berhasil diperbarui.');
    }

    public function destroy(ServiceCategory $serviceCategory)
    {
        $serviceCategory->delete();

        return redirect()->route('admin.service-categories.index')
            ->with('success', 'Kategori jasa berhasil dihapus.');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => Units::validationRule(false),
            'default_fee' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $data['unit'] = Units::normalize($data['unit'] ?? null, 'job');
        $data['default_fee'] = $data['default_fee'] ?? 0;
        $data['is_active'] = $request->boolean('is_active', true);

        return $data;
    }
}
