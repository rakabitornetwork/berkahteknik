<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SparePart;
use App\Models\User;
use App\Services\OperationalJournal;
use App\Services\SaleTotals;
use App\Services\ShopSettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

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
        $warehouses = Schema::hasTable('warehouses')
            ? DB::table('warehouses')->orderByDesc('is_default')->orderBy('name')->get(['id', 'code', 'name', 'is_default'])
            : collect();

        return Inertia::render('Admin/Sales/Form', [
            'spareParts' => SparePart::where('stock', '>', 0)->orderBy('name')->get(),
            'customers' => Customer::query()->orderBy('name')->get(['id', 'name', 'phone']),
            'warehouses' => $warehouses,
            'cashiers' => User::query()
                ->whereIn('role', ['cashier', 'admin', 'owner', 'superadmin'])
                ->orderBy('name')
                ->get(['id', 'name', 'role']),
        ]);
    }

    public function store(Request $request, OperationalJournal $journal)
    {
        $validated = $request->validate([
            'customer_name' => 'nullable|string|max:255',
            'payment_method' => 'nullable|string|max:255',
            'amount_paid' => 'nullable|numeric|min:0',
            'discount_percent' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'tax_enabled' => 'nullable|boolean',
            'tax_percent' => 'nullable|numeric|min:0|max:100',
            'items' => 'required|array|min:1',
            'items.*.spare_part_id' => 'required|exists:spare_parts,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.discount_percent' => 'nullable|numeric|min:0|max:100',
        ]);

        $sale = DB::transaction(function () use ($validated, $journal) {
            $receiptNumber = 'TRX-' . strtoupper(Str::random(8));
            $lines = [];

            $sale = Sale::create([
                'receipt_number' => $receiptNumber,
                'customer_name' => $validated['customer_name'] ?? 'Pelanggan Umum',
                'payment_status' => 'belum_lunas',
                'payment_method' => $validated['payment_method'],
                'discount_percent' => $validated['discount_percent'] ?? 0,
                'discount_amount' => $validated['discount_amount'] ?? 0,
                'tax_enabled' => filter_var($validated['tax_enabled'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'tax_percent' => $validated['tax_percent'] ?? 11,
                'total_amount' => 0,
            ]);

            foreach ($validated['items'] as $item) {
                $sparePart = SparePart::lockForUpdate()->findOrFail($item['spare_part_id']);

                if ($sparePart->stock < $item['quantity']) {
                    throw \Illuminate\Validation\ValidationException::withMessages(['message' => "Stok {$sparePart->name} tidak mencukupi."]);
                }

                $before = $sparePart->stock;
                $discountPercent = (float) ($item['discount_percent'] ?? 0);

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'spare_part_id' => $sparePart->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $sparePart->sell_price,
                    'discount_percent' => $discountPercent,
                ]);

                $lines[] = [
                    'unit_price' => $sparePart->sell_price,
                    'quantity' => $item['quantity'],
                    'discount_percent' => $discountPercent,
                ];

                $sparePart->decrement('stock', $item['quantity']);
                $sparePart->refresh();
                $journal->stock($sparePart, 'out', $item['quantity'], $before, $sparePart->stock, $sale, 'Penjualan POS', $sparePart->buy_price);
            }

            $totals = SaleTotals::invoice(
                $lines,
                (float) ($validated['discount_percent'] ?? 0),
                (float) ($validated['discount_amount'] ?? 0),
                filter_var($validated['tax_enabled'] ?? false, FILTER_VALIDATE_BOOLEAN),
                (float) ($validated['tax_percent'] ?? 11)
            );

            $amountPaid = $validated['amount_paid'] ?? 0;
            $changeAmount = max(0, $amountPaid - $totals['total_amount']);
            $paymentStatus = $amountPaid >= $totals['total_amount'] ? 'lunas' : 'belum_lunas';

            $sale->update([
                'subtotal' => $totals['subtotal'],
                'discount_total' => $totals['discount_total'],
                'tax_amount' => $totals['tax_amount'],
                'total_amount' => $totals['total_amount'],
                'amount_paid' => $amountPaid,
                'change_amount' => $changeAmount,
                'payment_status' => $paymentStatus,
            ]);
            if ($amountPaid > 0) {
                $journal->cash('income', 'pos_sale', min((float) $amountPaid, (float) $totals['total_amount']), $sale, 'Pembayaran POS '.$sale->receipt_number);
            }
            $journal->audit('create', 'sale', $sale, 'Transaksi POS dibuat.');

            return $sale;
        });

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

    public function destroy(Sale $sale, OperationalJournal $journal)
    {
        DB::transaction(function () use ($sale, $journal) {
            foreach ($sale->items as $item) {
                $part = $item->sparePart;
                $before = $part->stock;
                $part->increment('stock', $item->quantity);
                $part->refresh();
                $journal->stock($part, 'return', $item->quantity, $before, $part->stock, $sale, 'Stok dikembalikan karena POS dibatalkan');
            }
            $journal->cash('refund', 'pos_cancel', (float) $sale->amount_paid, $sale, 'Pembatalan POS '.$sale->receipt_number);
            $journal->audit('delete', 'sale', $sale, 'Transaksi POS dibatalkan.');
            $sale->delete();
        });

        return redirect()->route('admin.sales.index')
            ->with('success', 'Transaksi dibatalkan dan stok dikembalikan.');
    }

    public function pay(Request $request, Sale $sale, OperationalJournal $journal)
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
        $journal->cash('income', 'pos_payment', (float) $request->amount_paid, $sale, 'Pembayaran tambahan POS '.$sale->receipt_number);
        $journal->audit('pay', 'sale', $sale, 'Pembayaran POS ditambahkan.', ['amount' => $request->amount_paid]);

        return back()->with('success', 'Pembayaran berhasil ditambahkan.');
    }
}
