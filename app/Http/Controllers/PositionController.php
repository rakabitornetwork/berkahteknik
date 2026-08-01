<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PositionController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Employees/Positions', [
            'positions' => Position::withCount('employees')->orderBy('name')->paginate(15),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validated($request);
        Position::create($validated);

        return redirect()->route('admin.karyawan.jabatan.index')
            ->with('success', 'Jabatan berhasil ditambahkan.');
    }

    public function update(Request $request, Position $jabatan)
    {
        $jabatan->update($this->validated($request));

        return redirect()->route('admin.karyawan.jabatan.index')
            ->with('success', 'Jabatan berhasil diperbarui.');
    }

    public function destroy(Position $jabatan)
    {
        $jabatan->delete();

        return redirect()->route('admin.karyawan.jabatan.index')
            ->with('success', 'Jabatan berhasil dihapus.');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $data['is_active'] = $request->boolean('is_active', true);

        return $data;
    }
}
