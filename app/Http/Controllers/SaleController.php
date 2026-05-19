<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SparePart;
use App\Services\ShopSettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $sales = Sale::with('items')
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->where('receipt_number', 'like', "%{$request->search}%")
                          ->orWhere('customer_name', 'like', "%{$request->search}%");
                });
            })
            ->when($request->status, function ($q) use ($request) {
                $q->where('payment_status', $request->status);
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Sales/Index', [
            'sales' => $sales,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Sales/Form', [
            'spareParts' => SparePart::where('stock', '>', 0)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'nullable|string|max:255',
            'payment_method' => 'nullable|string|max:255',
            'amount_paid' => 'nullable|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.spare_part_id' => 'required|exists:spare_parts,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $receiptNumber = 'TRX-' . strtoupper(Str::random(8));
        $totalAmount = 0;

        $sale = Sale::create([
            'receipt_number' => $receiptNumber,
            'customer_name' => $validated['customer_name'] ?? 'Pelanggan Umum',
            'payment_status' => 'belum_lunas', // Temp
            'payment_method' => $validated['payment_method'],
            'total_amount' => 0, // Will update shortly
        ]);

        foreach ($validated['items'] as $item) {
            $sparePart = SparePart::findOrFail($item['spare_part_id']);
            
            if ($sparePart->stock < $item['quantity']) {
                $sale->delete();
                return back()->withErrors(['message' => "Stok {$sparePart->name} tidak mencukupi."]);
            }

            $subtotal = $sparePart->sell_price * $item['quantity'];
            $totalAmount += $subtotal;

            SaleItem::create([
                'sale_id' => $sale->id,
                'spare_part_id' => $sparePart->id,
                'quantity' => $item['quantity'],
                'unit_price' => $sparePart->sell_price,
            ]);

            $sparePart->decrement('stock', $item['quantity']);
        }

        $amountPaid = $validated['amount_paid'] ?? 0;
        $changeAmount = max(0, $amountPaid - $totalAmount);
        $paymentStatus = $amountPaid >= $totalAmount ? 'lunas' : 'belum_lunas';

        $sale->update([
            'total_amount' => $totalAmount,
            'amount_paid' => $amountPaid,
            'change_amount' => $changeAmount,
            'payment_status' => $paymentStatus,
        ]);

        return redirect()->route('admin.sales.show', $sale)
            ->with('success', 'Transaksi berhasil disimpan.');
    }

    public function show(Sale $sale)
    {
        $sale->load('items.sparePart');
        
        return Inertia::render('Admin/Sales/Show', [
            'sale' => $sale,
        ]);
    }

    public function receipt(Sale $sale)
    {
        $sale->load('items.sparePart');

        return Inertia::render('Admin/Sales/ReceiptPrint', [
            'sale' => $sale,
            'shop' => app(ShopSettingService::class)->forFrontend(),
        ]);
    }

    public function destroy(Sale $sale)
    {
        // Revert stock
        foreach ($sale->items as $item) {
            $item->sparePart->increment('stock', $item->quantity);
        }
        
        $sale->delete();

        return redirect()->route('admin.sales.index')
            ->with('success', 'Transaksi dibatalkan dan stok dikembalikan.');
    }

    public function pay(Request $request, Sale $sale)
    {
        $request->validate([
            'amount_paid' => 'required|numeric|min:0'
        ]);

        if ($sale->payment_status === 'lunas') {
            return back()->with('error', 'Transaksi ini sudah lunas.');
        }

        $newAmountPaid = $sale->amount_paid + $request->amount_paid;
        $changeAmount = max(0, $newAmountPaid - $sale->total_amount);
        $status = $newAmountPaid >= $sale->total_amount ? 'lunas' : 'belum_lunas';

        $sale->update([
            'amount_paid' => $newAmountPaid,
            'change_amount' => $changeAmount,
            'payment_status' => $status
        ]);

        return back()->with('success', 'Pembayaran berhasil ditambahkan.');
    }
}
