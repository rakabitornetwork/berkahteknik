<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\ProductType;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SalePayment;
use App\Models\SparePart;
use App\Models\User;
use App\Services\OperationalJournal;
use App\Services\SaleTotals;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PosV2Controller extends Controller
{
    private const PAYMENT_METHODS = ['cash', 'bank', 'emoney', 'multi', 'credit'];

    private const SPLIT_METHODS = ['cash', 'bank', 'emoney', 'qris', 'transfer'];

    public function create()
    {
        return Inertia::render('Admin/Sales/V2/Kasir', $this->posPayload());
    }

    public function store(Request $request, OperationalJournal $journal)
    {
        $validated = $this->validatedSale($request);

        $sale = DB::transaction(function () use ($validated, $journal) {
            $soldAt = ! empty($validated['sold_at']) ? $validated['sold_at'] : now();
            $customer = $this->resolveCustomer($validated);
            $lines = [];

            $sale = Sale::create([
                'receipt_number' => Sale::nextReceiptNumber($soldAt),
                'customer_name' => $customer['name'],
                'customer_id' => $customer['id'],
                'payment_status' => 'belum_lunas',
                'payment_method' => $validated['payment_method'],
                'discount_percent' => $validated['discount_percent'] ?? 0,
                'discount_amount' => $validated['discount_amount'] ?? 0,
                'tax_enabled' => filter_var($validated['tax_enabled'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'tax_percent' => $validated['tax_percent'] ?? 11,
                'total_amount' => 0,
                'sold_at' => $soldAt,
                'notes' => $validated['notes'] ?? null,
                'cashier_id' => $validated['cashier_id'] ?? null,
                'warehouse_id' => $validated['warehouse_id'] ?? null,
                'pos_version' => 2,
            ]);

            foreach ($validated['items'] as $item) {
                $sparePart = SparePart::lockForUpdate()->findOrFail($item['spare_part_id']);

                if ($sparePart->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'message' => "Stok {$sparePart->name} tidak mencukupi.",
                    ]);
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
                $journal->stock($sparePart, 'out', $item['quantity'], $before, $sparePart->stock, $sale, 'Penjualan POS v2', $sparePart->buy_price);
            }

            $totals = SaleTotals::invoice(
                $lines,
                (float) ($validated['discount_percent'] ?? 0),
                (float) ($validated['discount_amount'] ?? 0),
                filter_var($validated['tax_enabled'] ?? false, FILTER_VALIDATE_BOOLEAN),
                (float) ($validated['tax_percent'] ?? 11)
            );

            $payments = $this->normalizedPayments($validated, $totals['total_amount']);
            $amountPaid = round(array_sum(array_column($payments, 'amount')), 2);
            $changeAmount = max(0, $amountPaid - $totals['total_amount']);
            $paymentStatus = $amountPaid >= $totals['total_amount'] ? 'lunas' : 'belum_lunas';

            if ($validated['payment_method'] === 'credit' && empty($customer['id']) && $this->isGeneralCustomer($customer['name'])) {
                throw ValidationException::withMessages([
                    'customer_id' => 'Pilih pelanggan terdaftar untuk transaksi hutang.',
                ]);
            }

            foreach ($payments as $payment) {
                if ($payment['amount'] <= 0) {
                    continue;
                }
                SalePayment::create([
                    'sale_id' => $sale->id,
                    'method' => $payment['method'],
                    'amount' => $payment['amount'],
                ]);
            }

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
                $journal->cash(
                    'income',
                    'pos_sale',
                    min($amountPaid, (float) $totals['total_amount']),
                    $sale,
                    'Pembayaran POS v2 '.$sale->receipt_number
                );
            }
            $journal->audit('create', 'sale', $sale, 'Transaksi POS v2 dibuat.');

            return $sale;
        });

        return redirect()->route('admin.sales.show', $sale)
            ->with('success', 'Transaksi POS v2 berhasil disimpan.');
    }

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

    public function storeCustomer(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:20|unique:customers,phone',
            'address' => 'nullable|string',
        ]);

        if (empty($validated['phone'])) {
            $validated['phone'] = 'POS-'.now()->format('ymdHis').random_int(10, 99);
        }

        $customer = Customer::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'] ?? null,
            'customer_type' => Customer::TYPE_SPAREPART,
        ]);

        return response()->json([
            'customer' => $customer->only(['id', 'name', 'phone']),
            'message' => 'Pelanggan berhasil ditambahkan.',
        ], 201);
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

    private function posPayload(): array
    {
        $warehouses = Schema::hasTable('warehouses')
            ? DB::table('warehouses')->orderByDesc('is_default')->orderBy('name')->get(['id', 'code', 'name', 'is_default'])
            : collect();

        return [
            'spareParts' => SparePart::query()->orderBy('name')->get([
                'id', 'code', 'barcode', 'name', 'unit', 'stock', 'sell_price', 'description',
            ]),
            'productTypes' => ProductType::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'customers' => Customer::query()->orderBy('name')->get(['id', 'name', 'phone']),
            'warehouses' => $warehouses,
            'cashiers' => User::query()
                ->whereIn('role', ['cashier', 'admin', 'owner', 'superadmin'])
                ->orderBy('name')
                ->get(['id', 'name', 'role']),
        ];
    }

    private function validatedSale(Request $request): array
    {
        return $request->validate([
            'customer_name' => 'nullable|string|max:255',
            'customer_id' => 'nullable|exists:customers,id',
            'sold_at' => 'nullable|date',
            'notes' => 'nullable|string|max:500',
            'cashier_id' => 'nullable|exists:users,id',
            'warehouse_id' => 'nullable|integer',
            'payment_method' => ['required', Rule::in(self::PAYMENT_METHODS)],
            'amount_paid' => 'nullable|numeric|min:0',
            'discount_percent' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'tax_enabled' => 'nullable|boolean',
            'tax_percent' => 'nullable|numeric|min:0|max:100',
            'payments' => 'nullable|array',
            'payments.*.method' => ['required_with:payments', Rule::in(self::SPLIT_METHODS)],
            'payments.*.amount' => 'required_with:payments|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.spare_part_id' => 'required|exists:spare_parts,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.discount_percent' => 'nullable|numeric|min:0|max:100',
        ]);
    }

    private function resolveCustomer(array $validated): array
    {
        if (! empty($validated['customer_id'])) {
            $customer = Customer::find($validated['customer_id']);
            if ($customer) {
                return ['id' => $customer->id, 'name' => $customer->name];
            }
        }

        $name = trim((string) ($validated['customer_name'] ?? ''));
        if ($name === '' || strtoupper($name) === 'UMUM') {
            $name = 'Pelanggan Umum';
        }

        return ['id' => null, 'name' => $name];
    }

    private function isGeneralCustomer(string $name): bool
    {
        $normalized = strtoupper(trim($name));

        return $normalized === '' || $normalized === 'UMUM' || $normalized === 'PELANGGAN UMUM';
    }

    /**
     * @return array<int, array{method: string, amount: float}>
     */
    private function normalizedPayments(array $validated, float $totalAmount): array
    {
        $method = $validated['payment_method'];

        if ($method === 'multi') {
            $rows = collect($validated['payments'] ?? [])
                ->map(fn ($row) => [
                    'method' => $row['method'],
                    'amount' => round((float) $row['amount'], 2),
                ])
                ->filter(fn ($row) => $row['amount'] > 0)
                ->values()
                ->all();

            if ($rows === []) {
                throw ValidationException::withMessages([
                    'payments' => 'Isi minimal satu nominal pada pembayaran multi.',
                ]);
            }

            return $rows;
        }

        if ($method === 'credit') {
            $paid = round((float) ($validated['amount_paid'] ?? 0), 2);
            if ($paid <= 0) {
                return [];
            }

            return [[
                'method' => 'cash',
                'amount' => $paid,
            ]];
        }

        $paid = $validated['amount_paid'] ?? $totalAmount;

        return [[
            'method' => $method === 'bank' ? 'bank' : $method,
            'amount' => round((float) $paid, 2),
        ]];
    }
}
