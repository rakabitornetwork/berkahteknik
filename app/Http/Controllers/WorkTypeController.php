<?php

namespace App\Http\Controllers;

use App\Models\ServiceCategory;
use App\Models\WorkType;
use App\Support\Units;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkTypeController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/WorkTypes/Index', [
            'items' => WorkType::with('category')->orderBy('name')->paginate(15),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/WorkTypes/Form', [
            'categories' => ServiceCategory::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        WorkType::create($this->validated($request));

        return redirect()->route('admin.work-types.index')
            ->with('success', 'Data jasa berhasil ditambahkan.');
    }

    public function edit(WorkType $workType)
    {
        return Inertia::render('Admin/WorkTypes/Form', [
            'item' => $workType,
            'categories' => ServiceCategory::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, WorkType $workType)
    {
        $workType->update($this->validated($request));

        return redirect()->route('admin.work-types.index')
            ->with('success', 'Data jasa berhasil diperbarui.');
    }

    public function destroy(WorkType $workType)
    {
        $workType->delete();

        return redirect()->route('admin.work-types.index')
            ->with('success', 'Data jasa berhasil dihapus.');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'service_category_id' => 'nullable|exists:service_categories,id',
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
