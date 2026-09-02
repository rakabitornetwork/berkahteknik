<?php

namespace App\Http\Controllers;

use App\Models\ProductType;
use App\Models\SparePart;
use App\Services\OperationalJournal;
use App\Support\Units;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SparePartController extends Controller
{
    public function index(Request $request)
    {
        $spareParts = SparePart::with('productType')
            ->when($request->search, fn($q) =>
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('code', 'like', "%{$request->search}%"))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/SpareParts/Index', [
            'spareParts' => $spareParts,
            'filters'    => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/SpareParts/Form', [
            'productTypes' => ProductType::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code'        => 'required|string|unique:spare_parts,code',
            'barcode'     => 'nullable|string|unique:spare_parts,barcode',
            'name'        => 'required|string|max:150',
            'product_type_id' => 'nullable|exists:product_types,id',
            'unit'        => Units::validationRule(),
            'stock'       => 'required|integer|min:0',
            'min_stock'   => 'required|integer|min:0',
            'buy_price'   => 'required|numeric|min:0',
            'sell_price'  => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        SparePart::create($validated);

        return redirect()->route('admin.spare-parts.index')
            ->with('success', 'Spare part berhasil ditambahkan.');
    }

    public function quickStore(Request $request)
    {
        $request->merge([
            'code' => strtoupper(trim((string) $request->input('code', ''))),
            'barcode' => $request->filled('barcode') ? trim((string) $request->input('barcode')) : null,
            'product_type_id' => $request->filled('product_type_id') ? $request->input('product_type_id') : null,
        ]);

        if ($request->input('code') === '') {
            $request->merge(['code' => SparePart::nextQuickCode()]);
        }

        $validated = $request->validate([
            'code'            => 'required|string|unique:spare_parts,code',
            'barcode'         => 'nullable|string|unique:spare_parts,barcode',
            'name'            => 'required|string|max:150',
            'product_type_id' => 'nullable|exists:product_types,id',
            'unit'            => Units::validationRule(),
            'stock'           => 'required|integer|min:1',
            'min_stock'       => 'nullable|integer|min:0',
            'buy_price'       => 'required|numeric|min:0',
            'sell_price'      => 'required|numeric|min:0',
            'description'     => 'nullable|string',
        ]);

        $validated['min_stock'] = $validated['min_stock'] ?? 0;
        $part = SparePart::create($validated);

        return response()->json([
            'spare_part' => $part,
            'message' => 'Produk berhasil ditambahkan dan siap masuk keranjang.',
        ], 201);
    }

    public function edit(SparePart $sparePart)
    {
        return Inertia::render('Admin/SpareParts/Form', [
            'sparePart' => $sparePart,
            'productTypes' => ProductType::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, SparePart $sparePart)
    {
        $validated = $request->validate([
            'code'        => "required|string|unique:spare_parts,code,{$sparePart->id}",
            'barcode'     => "nullable|string|unique:spare_parts,barcode,{$sparePart->id}",
            'name'        => 'required|string|max:150',
            'product_type_id' => 'nullable|exists:product_types,id',
            'unit'        => Units::validationRule(),
            'stock'       => 'required|integer|min:0',
            'min_stock'   => 'required|integer|min:0',
            'buy_price'   => 'required|numeric|min:0',
            'sell_price'  => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $sparePart->update($validated);

        return redirect()->route('admin.spare-parts.index')
            ->with('success', 'Spare part berhasil diperbarui.');
    }

    public function destroy(SparePart $sparePart)
    {
        $sparePart->delete();

        return redirect()->route('admin.spare-parts.index')
            ->with('success', 'Spare part berhasil dihapus.');
    }

    public function adjustStock(Request $request, SparePart $sparePart, OperationalJournal $journal)
    {
        $request->validate([
            'adjustment' => 'required|integer',
            'reason'     => 'nullable|string',
        ]);

        $before = $sparePart->stock;
        $sparePart->increment('stock', $request->adjustment);
        $sparePart->refresh();
        $journal->stock($sparePart, 'adjustment', abs((int) $request->adjustment), $before, $sparePart->stock, $sparePart, $request->reason ?: 'Penyesuaian stok manual');
        $journal->audit('adjust', 'stock', $sparePart, 'Stok disesuaikan.', ['adjustment' => $request->adjustment, 'reason' => $request->reason]);

        return back()->with('success', 'Stok berhasil disesuaikan.');
    }
}
