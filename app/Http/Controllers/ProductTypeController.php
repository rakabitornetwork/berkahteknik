<?php

namespace App\Http\Controllers;

use App\Models\ProductType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductTypeController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ProductTypes/Index', [
            'items' => ProductType::withCount('spareParts')->orderBy('name')->paginate(15),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/ProductTypes/Form');
    }

    public function store(Request $request)
    {
        ProductType::create($this->validated($request));

        return redirect()->route('admin.product-types.index')
            ->with('success', 'Jenis produk berhasil ditambahkan.');
    }

    public function edit(ProductType $productType)
    {
        return Inertia::render('Admin/ProductTypes/Form', [
            'item' => $productType,
        ]);
    }

    public function update(Request $request, ProductType $productType)
    {
        $productType->update($this->validated($request));

        return redirect()->route('admin.product-types.index')
            ->with('success', 'Jenis produk berhasil diperbarui.');
    }

    public function destroy(ProductType $productType)
    {
        $productType->delete();

        return redirect()->route('admin.product-types.index')
            ->with('success', 'Jenis produk berhasil dihapus.');
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
