<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SalePayment;
use App\Services\OperationalJournal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PosV2Controller extends Controller
{
    private const SPLIT_METHODS = ['cash', 'bank', 'emoney', 'qris', 'transfer'];

    public function piutang()
    {
        $sales = Sale::query()
            ->with(['items.sparePart'])
            ->where('payment_status', 'belum_lunas')
            ->orderByDesc('sold_at')
            ->orderByDesc('id')
            ->get();

        $groups = $sales
            ->groupBy(fn (Sale $sale) => $sale->customer_id ? 'id:'.$sale->customer_id : 'name:'.mb_strtolower($sale->customer_name ?: 'pelanggan umum'))
            ->map(function ($rows) {
                $first = $rows->first();
                $due = $rows->sum(fn (Sale $sale) => max(0, (float) $sale->total_amount - (float) $sale->amount_paid));

                return [
                    'customer_id' => $first->customer_id,
                    'customer_name' => $first->customer_name ?: 'Pelanggan Umum',
                    'invoice_count' => $rows->count(),
                    'total_due' => round($due, 2),
                    'invoices' => $rows->map(fn (Sale $sale) => [
                        'id' => $sale->id,
                        'receipt_number' => $sale->receipt_number,
                        'sold_at' => optional($sale->sold_at ?: $sale->created_at)->toDateTimeString(),
                        'total_amount' => (float) $sale->total_amount,
                        'amount_paid' => (float) $sale->amount_paid,
                        'due' => round(max(0, (float) $sale->total_amount - (float) $sale->amount_paid), 2),
                        'payment_method' => $sale->payment_method,
                    ])->values(),
                ];
            })
            ->sortByDesc('total_due')
            ->values();

        return Inertia::render('Admin/Sales/V2/Piutang', [
            'groups' => $groups,
        ]);
    }

    public function riwayat(Request $request)
    {
        $sales = Sale::query()
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->where('receipt_number', 'like', '%'.$request->search.'%')
                        ->orWhere('customer_name', 'like', '%'.$request->search.'%');
                });
            })
            ->when($request->date, function ($q) use ($request) {
                $q->where(function ($inner) use ($request) {
                    $inner->whereDate('sold_at', $request->date)
                        ->orWhere(function ($fallback) use ($request) {
                            $fallback->whereNull('sold_at')->whereDate('created_at', $request->date);
                        });
                });
            })
            ->latest('id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Sales/V2/Riwayat', [
            'sales' => $sales,
            'filters' => $request->only(['search', 'date']),
        ]);
    }

    public function pay(Request $request, Sale $sale, OperationalJournal $journal)
    {
        $validated = $request->validate([
            'amount_paid' => 'required|numeric|min:0.01',
            'payment_method' => ['nullable', 'string', Rule::in(self::SPLIT_METHODS)],
        ]);

        if ($sale->payment_status === 'lunas') {
            return back()->with('error', 'Transaksi ini sudah lunas.');
        }

        $amount = (float) $validated['amount_paid'];
        $method = $validated['payment_method'] ?? 'cash';

        $newAmountPaid = (float) $sale->amount_paid + $amount;
        $changeAmount = max(0, $newAmountPaid - (float) $sale->total_amount);
        $status = $newAmountPaid >= (float) $sale->total_amount ? 'lunas' : 'belum_lunas';

        $sale->update([
            'amount_paid' => $newAmountPaid,
            'change_amount' => $changeAmount,
            'payment_status' => $status,
        ]);

        SalePayment::create([
            'sale_id' => $sale->id,
            'method' => $method,
            'amount' => $amount,
        ]);

        $journal->cash('income', 'pos_payment', $amount, $sale, 'Pelunasan POS v2 '.$sale->receipt_number);
        $journal->audit('pay', 'sale', $sale, 'Pembayaran piutang POS v2.', ['amount' => $amount, 'method' => $method]);

        return back()->with('success', 'Pembayaran piutang berhasil disimpan.');
    }

    public function destroy(Request $request, Sale $sale, OperationalJournal $journal)
    {
        $validated = $request->validate([
            'cancel_reason' => 'required|string|min:5|max:255',
        ]);

        DB::transaction(function () use ($sale, $journal, $validated) {
            $sale->load('items.sparePart');
            foreach ($sale->items as $item) {
                $part = $item->sparePart;
                $before = $part->stock;
                $part->increment('stock', $item->quantity);
                $part->refresh();
                $journal->stock($part, 'return', $item->quantity, $before, $part->stock, $sale, 'Stok dikembalikan karena POS v2 dihapus');
            }

            $journal->cash('refund', 'pos_cancel', (float) $sale->amount_paid, $sale, 'Penghapusan POS v2 '.$sale->receipt_number);
            $journal->audit('delete', 'sale', $sale, 'Transaksi POS v2 dihapus: '.$validated['cancel_reason'], [
                'cancel_reason' => $validated['cancel_reason'],
            ]);
            $sale->delete();
        });

        return redirect()->route('admin.sales.v2.riwayat')
            ->with('success', 'Transaksi dihapus dan stok dikembalikan.');
    }
}
