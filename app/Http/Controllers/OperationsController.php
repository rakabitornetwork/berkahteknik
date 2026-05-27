<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\PurchaseOrder;
use App\Models\Sale;
use App\Models\Service;
use App\Models\SparePart;
use App\Models\User;
use App\Services\OperationalJournal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OperationsController extends Controller
{
    public function proNotifications()
    {
        return $this->proPage('automatic_notifications');
    }

    public function proDigitalPayments()
    {
        return $this->proPage('digital_payments');
    }

    private function proPage(string $key)
    {
        $feature = config("features.pro.$key");

        return Inertia::render('Admin/Operations/ProLocked', [
            'featureKey' => $key,
            'feature' => $feature,
            'events' => $key === 'automatic_notifications'
                ? ['Booking dibuat', 'Booking disetujui/ditolak', 'Status servis berubah', 'Invoice jatuh tempo', 'Stok menipis', 'Garansi hampir habis']
                : ['QRIS dinamis', 'Virtual account', 'Payment link', 'Rekonsiliasi otomatis', 'Webhook status pembayaran'],
        ]);
    }

    public function bookings(Request $request)
    {
        $query = Service::with(['vehicle.customer', 'technician'])
            ->where('status', 'booking')
            ->when($request->booking_status, fn ($q) => $q->where('booking_status', $request->booking_status))
            ->latest('scheduled_at');

        $rows = $query->paginate(20)->withQueryString()->through(fn (Service $service) => [
            'id' => $service->id,
            'customer' => $service->vehicle?->customer?->name ?? '-',
            'vehicle' => trim(($service->vehicle?->brand ?? '').' '.($service->vehicle?->model ?? '')).' ('.$service->vehicle?->license_plate.')',
            'service_name' => $service->service_name,
            'scheduled_at' => $service->scheduled_at?->format('d M Y H:i') ?? '-',
            'booking_status' => $service->booking_status,
            'notes' => $service->booking_notes ?? '-',
        ]);

        return $this->tablePage('Manajemen Booking', 'Setujui, tolak, jadwalkan ulang, atau batalkan booking pelanggan.', [
            ['key' => 'id', 'label' => '#'],
            ['key' => 'customer', 'label' => 'Pelanggan'],
            ['key' => 'vehicle', 'label' => 'Kendaraan'],
            ['key' => 'service_name', 'label' => 'Jasa'],
            ['key' => 'scheduled_at', 'label' => 'Jadwal'],
            ['key' => 'booking_status', 'label' => 'Status Booking'],
            ['key' => 'notes', 'label' => 'Catatan'],
        ], $rows, [
            ['label' => 'Setujui', 'method' => 'patch', 'url' => '/admin/bookings/{id}/approve'],
            ['label' => 'Tolak', 'method' => 'patch', 'url' => '/admin/bookings/{id}/reject'],
            ['label' => 'Batalkan', 'method' => 'patch', 'url' => '/admin/bookings/{id}/cancel'],
        ], [
            [
                'title' => 'Ubah Jadwal Booking',
                'action' => '/admin/bookings/reschedule',
                'method' => 'patch',
                'fields' => [
                    ['name' => 'service_id', 'label' => 'ID Booking', 'type' => 'number', 'required' => true],
                    ['name' => 'scheduled_at', 'label' => 'Jadwal Baru', 'type' => 'datetime-local', 'required' => true],
                    ['name' => 'booking_notes', 'label' => 'Catatan', 'type' => 'textarea'],
                ],
            ],
        ]);
    }

    public function approveBooking(Service $service, OperationalJournal $journal)
    {
        $service->update(['booking_status' => 'approved', 'status' => 'antri', 'booking_notes' => 'Disetujui admin pada '.now()->format('d M Y H:i')]);
        $journal->audit('approve', 'booking', $service, 'Booking disetujui dan masuk antrian.');

        return back()->with('success', 'Booking disetujui dan masuk antrian.');
    }

    public function rejectBooking(Service $service, OperationalJournal $journal)
    {
        $service->update(['booking_status' => 'rejected', 'booking_notes' => 'Ditolak admin pada '.now()->format('d M Y H:i')]);
        $journal->audit('reject', 'booking', $service, 'Booking ditolak.');

        return back()->with('success', 'Booking ditolak.');
    }

    public function cancelBooking(Service $service, OperationalJournal $journal)
    {
        $service->update(['booking_status' => 'cancelled', 'booking_cancelled_at' => now(), 'booking_notes' => 'Dibatalkan pada '.now()->format('d M Y H:i')]);
        $journal->audit('cancel', 'booking', $service, 'Booking dibatalkan.');

        return back()->with('success', 'Booking dibatalkan.');
    }

    public function rescheduleBooking(Request $request, OperationalJournal $journal)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'scheduled_at' => 'required|date',
            'booking_notes' => 'nullable|string',
        ]);

        $service = Service::findOrFail($validated['service_id']);
        $service->update([
            'scheduled_at' => $validated['scheduled_at'],
            'booking_status' => 'rescheduled',
            'booking_notes' => $validated['booking_notes'] ?? 'Jadwal diubah admin.',
        ]);
        $journal->audit('reschedule', 'booking', $service, 'Booking dijadwalkan ulang.', $validated);

        return back()->with('success', 'Jadwal booking diperbarui.');
    }

    public function servicePayments(Request $request)
    {
        $rows = DB::table('service_payments')
            ->join('services', 'service_payments.service_id', '=', 'services.id')
            ->leftJoin('users', 'service_payments.user_id', '=', 'users.id')
            ->select('service_payments.*', 'services.spk_number', 'users.name as cashier')
            ->latest('service_payments.payment_date')
            ->paginate(20)
            ->withQueryString()
            ->through(fn ($row) => [
                'id' => $row->id,
                'service' => $row->spk_number ?: '#'.$row->service_id,
                'date' => $row->payment_date,
                'amount' => 'Rp '.number_format((float) $row->amount, 0, ',', '.'),
                'method' => $row->payment_method ?: '-',
                'cashier' => $row->cashier ?: '-',
                'notes' => $row->notes ?: '-',
            ]);

<<<<<<< Updated upstream
=======
        $unpaidServicesModels = Service::with(['vehicle.customer', 'spareParts'])
            ->where('status', 'selesai')
            ->where('payment_status', 'belum_lunas')
            ->orderBy('completed_at', 'desc')
            ->get();

        $unpaidServices = $unpaidServicesModels->mapWithKeys(function ($service) {
            $label = ($service->spk_number ? $service->spk_number . ' - ' : '') . 
                     ($service->vehicle?->customer?->name ?? 'Tanpa Pelanggan') . 
                     ' (' . ($service->vehicle?->license_plate ?? '') . ')';
            return [$service->id => $label];
        })->toArray();

        $serviceBalances = [];
        foreach ($unpaidServicesModels as $service) {
            $paidTotal = DB::table('service_payments')
                ->where('service_id', $service->id)
                ->sum('amount');
            $balanceDue = max(0, $service->total_cost - $paidTotal);
            $serviceBalances[$service->id] = $balanceDue;
        }

        $defaultServiceId = $request->get('service_id', '');
        $defaultAmount = '';
        if ($defaultServiceId && isset($serviceBalances[$defaultServiceId])) {
            $defaultAmount = $serviceBalances[$defaultServiceId];
        }

>>>>>>> Stashed changes
        return $this->tablePage('Pembayaran Servis', 'Catat pembayaran sebagian/lunas untuk invoice servis.', [
            ['key' => 'service', 'label' => 'Servis'],
            ['key' => 'date', 'label' => 'Tanggal'],
            ['key' => 'amount', 'label' => 'Nominal'],
            ['key' => 'method', 'label' => 'Metode'],
            ['key' => 'cashier', 'label' => 'Kasir'],
            ['key' => 'notes', 'label' => 'Catatan'],
        ], $rows, [], [
            [
                'title' => 'Catat Pembayaran Servis',
                'action' => '/admin/service-payments',
                'method' => 'post',
                'serviceBalances' => $serviceBalances,
                'fields' => [
<<<<<<< Updated upstream
                    ['name' => 'service_id', 'label' => 'ID Servis', 'type' => 'number', 'required' => true],
                    ['name' => 'amount', 'label' => 'Nominal', 'type' => 'number', 'required' => true],
=======
                    ['name' => 'service_id', 'label' => 'Pilih Servis', 'type' => 'select', 'options' => $unpaidServices, 'default' => $defaultServiceId, 'required' => true],
                    ['name' => 'amount', 'label' => 'Nominal', 'type' => 'number', 'default' => $defaultAmount, 'required' => true],
>>>>>>> Stashed changes
                    ['name' => 'payment_method', 'label' => 'Metode Bayar', 'type' => 'select', 'options' => ['cash' => 'Tunai', 'transfer' => 'Transfer', 'qris' => 'QRIS']],
                    ['name' => 'payment_date', 'label' => 'Tanggal Bayar', 'type' => 'date'],
                    ['name' => 'notes', 'label' => 'Catatan', 'type' => 'textarea'],
                ],
            ],
        ]);
    }

    public function storeServicePayment(Request $request, OperationalJournal $journal)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'nullable|string|max:50',
            'payment_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $journal) {
            $service = Service::with('spareParts')->findOrFail($validated['service_id']);
            $paymentId = DB::table('service_payments')->insertGetId([
                'service_id' => $service->id,
                'user_id' => Auth::id(),
                'payment_date' => $validated['payment_date'] ?? now()->toDateString(),
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $paid = DB::table('service_payments')->where('service_id', $service->id)->sum('amount');
            $service->payment_status = $paid >= $service->total_cost ? 'lunas' : 'belum_lunas';
            $service->save();

            $journal->cash('income', 'service_payment', (float) $validated['amount'], $service, 'Pembayaran servis '.$service->spk_number);
            $journal->audit('create', 'service_payment', $service, 'Pembayaran servis dicatat.', ['payment_id' => $paymentId]);
        });

        return back()->with('success', 'Pembayaran servis berhasil dicatat.');
    }

    public function finance(Request $request)
    {
        $start = $request->get('start_date', now()->startOfMonth()->toDateString());
        $end = $request->get('end_date', now()->endOfMonth()->toDateString());

        $ledger = DB::table('cash_ledger_entries')
            ->whereBetween(DB::raw('date(occurred_at)'), [$start, $end]);

        $income = (clone $ledger)->where('type', 'income')->sum('amount');
        $expense = (clone $ledger)->whereIn('type', ['expense', 'refund'])->sum('amount');
        $manualExpenses = Expense::whereBetween('expense_date', [$start, $end])->sum('amount');

        $rows = (clone $ledger)->latest('occurred_at')->paginate(30)->withQueryString()->through(fn ($row) => [
            'date' => $row->occurred_at,
            'type' => $row->type,
            'category' => $row->category,
            'description' => $row->description ?: '-',
            'amount' => 'Rp '.number_format((float) $row->amount, 0, ',', '.'),
        ]);

        return $this->tablePage('Buku Kas & Laba Rugi', 'Ringkasan kas, pemasukan, pengeluaran, refund, dan laba bersih periode terpilih.', [
            ['key' => 'date', 'label' => 'Tanggal'],
            ['key' => 'type', 'label' => 'Tipe'],
            ['key' => 'category', 'label' => 'Kategori'],
            ['key' => 'description', 'label' => 'Keterangan'],
            ['key' => 'amount', 'label' => 'Nominal'],
        ], $rows, [], [], [
            ['label' => 'Pemasukan', 'value' => 'Rp '.number_format((float) $income, 0, ',', '.')],
            ['label' => 'Pengeluaran Kas', 'value' => 'Rp '.number_format((float) $expense, 0, ',', '.')],
            ['label' => 'Pengeluaran Operasional', 'value' => 'Rp '.number_format((float) $manualExpenses, 0, ',', '.')],
            ['label' => 'Estimasi Laba Bersih', 'value' => 'Rp '.number_format((float) ($income - $expense - $manualExpenses), 0, ',', '.')],
        ], [
            'exports' => [
                ['label' => 'Export Buku Kas CSV', 'href' => '/admin/exports/cash-ledger'],
                ['label' => 'Export Laporan Laba Rugi CSV', 'href' => '/admin/exports/profit-loss'],
            ],
        ]);
    }

    public function stockMovements()
    {
        $rows = DB::table('stock_movements')
            ->join('spare_parts', 'stock_movements.spare_part_id', '=', 'spare_parts.id')
            ->leftJoin('users', 'stock_movements.user_id', '=', 'users.id')
            ->select('stock_movements.*', 'spare_parts.name as part_name', 'spare_parts.code', 'users.name as user_name')
            ->latest('stock_movements.occurred_at')
            ->paginate(30)
            ->withQueryString()
            ->through(fn ($row) => [
                'date' => $row->occurred_at,
                'part' => $row->code.' - '.$row->part_name,
                'type' => $row->type,
                'quantity' => $row->quantity,
                'before' => $row->stock_before,
                'after' => $row->stock_after,
                'user' => $row->user_name ?: '-',
                'notes' => $row->notes ?: '-',
            ]);

        return $this->tablePage('Kartu Stok', 'Riwayat semua mutasi stok dari servis, POS, PO, adjustment, retur, dan opname.', [
            ['key' => 'date', 'label' => 'Tanggal'],
            ['key' => 'part', 'label' => 'Spare Part'],
            ['key' => 'type', 'label' => 'Tipe'],
            ['key' => 'quantity', 'label' => 'Qty'],
            ['key' => 'before', 'label' => 'Sebelum'],
            ['key' => 'after', 'label' => 'Sesudah'],
            ['key' => 'user', 'label' => 'User'],
            ['key' => 'notes', 'label' => 'Catatan'],
        ], $rows, [], [], [], [
            'exports' => [['label' => 'Export Kartu Stok CSV', 'href' => '/admin/exports/stock-movements']],
        ]);
    }

    public function returns()
    {
        $rows = DB::table('return_transactions')
            ->leftJoin('users', 'return_transactions.user_id', '=', 'users.id')
            ->select('return_transactions.*', 'users.name as user_name')
            ->latest('processed_at')
            ->paginate(20)
            ->withQueryString()
            ->through(fn ($row) => [
                'id' => $row->id,
                'type' => $row->type,
                'status' => $row->status,
                'amount' => 'Rp '.number_format((float) $row->total_amount, 0, ',', '.'),
                'reason' => $row->reason ?: '-',
                'processed_at' => $row->processed_at ?: '-',
                'user' => $row->user_name ?: '-',
            ]);

        return $this->tablePage('Retur & Refund', 'Catat retur penjualan, refund, dan retur pembelian ke supplier.', [
            ['key' => 'id', 'label' => '#'],
            ['key' => 'type', 'label' => 'Tipe'],
            ['key' => 'status', 'label' => 'Status'],
            ['key' => 'amount', 'label' => 'Nominal'],
            ['key' => 'reason', 'label' => 'Alasan'],
            ['key' => 'processed_at', 'label' => 'Diproses'],
            ['key' => 'user', 'label' => 'User'],
        ], $rows, [], [
            [
                'title' => 'Catat Retur / Refund',
                'action' => '/admin/returns',
                'method' => 'post',
                'fields' => [
                    ['name' => 'type', 'label' => 'Tipe', 'type' => 'select', 'options' => ['sale_return' => 'Retur Penjualan', 'purchase_return' => 'Retur Pembelian', 'refund' => 'Refund']],
                    ['name' => 'sale_id', 'label' => 'ID Penjualan', 'type' => 'number'],
                    ['name' => 'purchase_order_id', 'label' => 'ID PO', 'type' => 'number'],
                    ['name' => 'spare_part_id', 'label' => 'ID Spare Part', 'type' => 'number'],
                    ['name' => 'quantity', 'label' => 'Qty', 'type' => 'number'],
                    ['name' => 'amount', 'label' => 'Nominal Refund', 'type' => 'number'],
                    ['name' => 'reason', 'label' => 'Alasan', 'type' => 'textarea'],
                ],
            ],
        ]);
    }

    public function storeReturn(Request $request, OperationalJournal $journal)
    {
        $validated = $request->validate([
            'type' => 'required|in:sale_return,purchase_return,refund',
            'sale_id' => 'nullable|exists:sales,id',
            'purchase_order_id' => 'nullable|exists:purchase_orders,id',
            'spare_part_id' => 'nullable|exists:spare_parts,id',
            'quantity' => 'nullable|integer|min:1',
            'amount' => 'nullable|numeric|min:0',
            'reason' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $journal) {
            $returnId = DB::table('return_transactions')->insertGetId([
                'sale_id' => $validated['sale_id'] ?? null,
                'purchase_order_id' => $validated['purchase_order_id'] ?? null,
                'user_id' => Auth::id(),
                'type' => $validated['type'],
                'status' => 'processed',
                'total_amount' => $validated['amount'] ?? 0,
                'reason' => $validated['reason'] ?? null,
                'processed_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!empty($validated['spare_part_id']) && !empty($validated['quantity'])) {
                $part = SparePart::findOrFail($validated['spare_part_id']);
                $before = $part->stock;
                $delta = $validated['type'] === 'purchase_return' ? -$validated['quantity'] : $validated['quantity'];
                $part->stock += $delta;
                $part->save();
                DB::table('return_items')->insert([
                    'return_transaction_id' => $returnId,
                    'spare_part_id' => $part->id,
                    'quantity' => $validated['quantity'],
                    'unit_price' => $validated['amount'] ?? 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $journal->stock($part, 'return', abs($delta), $before, $part->stock, $part, $validated['reason'] ?? 'Retur/refund');
            }

            if (($validated['amount'] ?? 0) > 0) {
                $journal->cash('refund', 'return_refund', (float) $validated['amount'], null, $validated['reason'] ?? 'Retur/refund');
            }
        });

        return back()->with('success', 'Retur/refund berhasil dicatat.');
    }

    public function warrantyClaims()
    {
        $rows = DB::table('warranty_claims')
            ->join('services', 'warranty_claims.service_id', '=', 'services.id')
            ->leftJoin('customers', 'warranty_claims.customer_id', '=', 'customers.id')
            ->leftJoin('users', 'warranty_claims.assigned_user_id', '=', 'users.id')
            ->select('warranty_claims.*', 'services.spk_number', 'customers.name as customer_name', 'users.name as mechanic_name')
            ->latest('warranty_claims.claimed_at')
            ->paginate(20)
            ->withQueryString()
            ->through(fn ($row) => [
                'id' => $row->id,
                'service' => $row->spk_number ?: '#'.$row->service_id,
                'customer' => $row->customer_name ?: '-',
                'status' => $row->status,
                'mechanic' => $row->mechanic_name ?: '-',
                'complaint' => $row->complaint,
                'claimed_at' => $row->claimed_at,
            ]);

        return $this->tablePage('Klaim Garansi', 'Validasi dan tindak lanjuti klaim garansi pelanggan.', [
            ['key' => 'id', 'label' => '#'],
            ['key' => 'service', 'label' => 'Servis'],
            ['key' => 'customer', 'label' => 'Pelanggan'],
            ['key' => 'status', 'label' => 'Status'],
            ['key' => 'mechanic', 'label' => 'Mekanik'],
            ['key' => 'complaint', 'label' => 'Keluhan'],
            ['key' => 'claimed_at', 'label' => 'Tanggal'],
        ], $rows, [
            ['label' => 'Validasi', 'method' => 'patch', 'url' => '/admin/warranty-claims/{id}/approve'],
            ['label' => 'Selesaikan', 'method' => 'patch', 'url' => '/admin/warranty-claims/{id}/resolve'],
        ], [
            [
                'title' => 'Buat Klaim Garansi',
                'action' => '/admin/warranty-claims',
                'method' => 'post',
                'fields' => [
                    ['name' => 'service_id', 'label' => 'ID Servis', 'type' => 'number', 'required' => true],
                    ['name' => 'assigned_user_id', 'label' => 'ID Mekanik', 'type' => 'number'],
                    ['name' => 'complaint', 'label' => 'Keluhan', 'type' => 'textarea', 'required' => true],
                ],
            ],
        ]);
    }

    public function storeWarrantyClaim(Request $request, OperationalJournal $journal)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'assigned_user_id' => 'nullable|exists:users,id',
            'complaint' => 'required|string',
        ]);
        $service = Service::with('vehicle.customer')->findOrFail($validated['service_id']);

        $claimId = DB::table('warranty_claims')->insertGetId([
            'service_id' => $service->id,
            'customer_id' => $service->vehicle?->customer?->id,
            'user_id' => Auth::id(),
            'assigned_user_id' => $validated['assigned_user_id'] ?? null,
            'status' => 'submitted',
            'complaint' => $validated['complaint'],
            'claimed_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $journal->audit('create', 'warranty_claim', $service, 'Klaim garansi dibuat.', ['claim_id' => $claimId]);

        return back()->with('success', 'Klaim garansi berhasil dibuat.');
    }

    public function approveWarrantyClaim(int $claimId, OperationalJournal $journal)
    {
        return $this->updateWarrantyClaim('approve', $claimId, $journal);
    }

    public function resolveWarrantyClaim(int $claimId, OperationalJournal $journal)
    {
        return $this->updateWarrantyClaim('resolve', $claimId, $journal);
    }

    private function updateWarrantyClaim(string $action, int $claimId, OperationalJournal $journal)
    {
        $status = $action === 'resolve' ? 'resolved' : 'approved';
        DB::table('warranty_claims')->where('id', $claimId)->update([
            'status' => $status,
            'resolved_at' => $status === 'resolved' ? now() : null,
            'updated_at' => now(),
        ]);
        $journal->audit($action, 'warranty_claim', null, "Klaim garansi #{$claimId} diperbarui ke {$status}.");

        return back()->with('success', 'Status klaim garansi diperbarui.');
    }

    public function mechanicOps()
    {
        $this->ensureMechanicAttendanceTokens();

        $attendanceRows = DB::table('mechanic_attendances')
            ->join('users', 'mechanic_attendances.user_id', '=', 'users.id')
            ->select('mechanic_attendances.*', 'users.name')
            ->latest('attendance_date')
            ->take(20)
            ->get()
            ->map(fn ($row) => [
                'date' => $row->attendance_date,
                'mechanic' => $row->name,
                'status' => $row->status,
                'check_in' => $row->check_in ?: '-',
                'check_out' => $row->check_out ?: '-',
                'notes' => $row->notes ?: '-',
            ]);

        $commissionRows = DB::table('mechanic_commissions')
            ->join('users', 'mechanic_commissions.user_id', '=', 'users.id')
            ->leftJoin('services', 'mechanic_commissions.service_id', '=', 'services.id')
            ->select('mechanic_commissions.*', 'users.name', 'services.spk_number')
            ->latest('commission_date')
            ->take(20)
            ->get()
            ->map(fn ($row) => [
                'date' => $row->commission_date,
                'mechanic' => $row->name,
                'service' => $row->spk_number ?: '-',
                'rate' => $row->rate.'%',
                'amount' => 'Rp '.number_format((float) $row->amount, 0, ',', '.'),
                'status' => $row->status,
            ]);

        return Inertia::render('Admin/Operations/MechanicOps', [
            'attendanceRows' => $attendanceRows,
            'commissionRows' => $commissionRows,
            'mechanics' => User::where('role', 'mechanic')
                ->orderBy('name')
                ->get(['id', 'name', 'attendance_qr_token'])
                ->map(fn (User $mechanic) => [
                    'id' => $mechanic->id,
                    'name' => $mechanic->name,
                    'attendance_qr_token' => $mechanic->attendance_qr_token,
                    'attendance_qr_payload' => 'MECHANIC_ATTENDANCE:'.$mechanic->attendance_qr_token,
                ]),
        ]);
    }

    public function scanAttendance(Request $request, OperationalJournal $journal)
    {
        $validated = $request->validate([
            'qr_payload' => 'required|string',
        ]);

        $token = trim($validated['qr_payload']);
        if (str_starts_with($token, 'MECHANIC_ATTENDANCE:')) {
            $token = substr($token, strlen('MECHANIC_ATTENDANCE:'));
        }

        $mechanic = User::where('role', 'mechanic')
            ->where('attendance_qr_token', $token)
            ->first();

        if (! $mechanic) {
            return back()->withErrors(['qr_payload' => 'QR mekanik tidak valid atau tidak terdaftar.']);
        }

        $today = now()->toDateString();
        $time = now()->format('H:i:s');
        $attendance = DB::table('mechanic_attendances')
            ->where('user_id', $mechanic->id)
            ->where('attendance_date', $today)
            ->first();

        if (! $attendance) {
            DB::table('mechanic_attendances')->insert([
                'user_id' => $mechanic->id,
                'branch_id' => $mechanic->branch_id ?? null,
                'attendance_date' => $today,
                'status' => 'present',
                'check_in' => $time,
                'notes' => 'Check-in via scan QR',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $journal->audit('check_in', 'mechanic_attendance', $mechanic, 'Check-in mekanik via scan QR.');

            return back()->with('success', "{$mechanic->name} berhasil check-in pada {$time}.");
        }

        if (! $attendance->check_in) {
            DB::table('mechanic_attendances')
                ->where('id', $attendance->id)
                ->update([
                    'status' => 'present',
                    'check_in' => $time,
                    'check_out' => null,
                    'notes' => trim(($attendance->notes ? $attendance->notes."\n" : '').'Check-in via scan QR'),
                    'updated_at' => now(),
                ]);
            $journal->audit('check_in', 'mechanic_attendance', $mechanic, 'Check-in mekanik via scan QR.');

            return back()->with('success', "{$mechanic->name} berhasil check-in pada {$time}.");
        }

        if (! $attendance->check_out) {
            DB::table('mechanic_attendances')
                ->where('id', $attendance->id)
                ->update([
                    'check_out' => $time,
                    'notes' => trim(($attendance->notes ? $attendance->notes."\n" : '').'Check-out via scan QR'),
                    'updated_at' => now(),
                ]);
            $journal->audit('check_out', 'mechanic_attendance', $mechanic, 'Check-out mekanik via scan QR.');

            return back()->with('success', "{$mechanic->name} berhasil check-out pada {$time}.");
        }

        return back()->with('success', "Absensi {$mechanic->name} hari ini sudah lengkap.");
    }

    public function regenerateMechanicQr(User $mechanic, OperationalJournal $journal)
    {
        abort_if($mechanic->role !== 'mechanic', 404);

        $mechanic->update(['attendance_qr_token' => $this->newAttendanceQrToken()]);
        $journal->audit('regenerate_qr', 'mechanic_attendance', $mechanic, 'Token QR absensi mekanik dibuat ulang.');

        return back()->with('success', "QR absensi {$mechanic->name} berhasil dibuat ulang.");
    }

    private function ensureMechanicAttendanceTokens(): void
    {
        User::where('role', 'mechanic')
            ->whereNull('attendance_qr_token')
            ->get()
            ->each(fn (User $mechanic) => $mechanic->update(['attendance_qr_token' => $this->newAttendanceQrToken()]));
    }

    private function newAttendanceQrToken(): string
    {
        do {
            $token = Str::random(48);
        } while (User::where('attendance_qr_token', $token)->exists());

        return $token;
    }

    public function storeAttendance(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'attendance_date' => 'required|date',
            'status' => 'required|in:present,permission,sick,absent',
            'check_in' => 'nullable',
            'check_out' => 'nullable',
            'notes' => 'nullable|string',
        ]);
        DB::table('mechanic_attendances')->updateOrInsert(
            ['user_id' => $validated['user_id'], 'attendance_date' => $validated['attendance_date']],
            [...$validated, 'updated_at' => now(), 'created_at' => now()]
        );

        return back()->with('success', 'Absensi mekanik disimpan.');
    }

    public function generateCommissions(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'rate' => 'required|numeric|min:0|max:100',
        ]);

        Service::with('spareParts')
            ->where('status', 'selesai')
            ->whereNotNull('user_id')
            ->whereBetween(DB::raw('date(completed_at)'), [$validated['start_date'], $validated['end_date']])
            ->get()
            ->each(function (Service $service) use ($validated) {
                $amount = ((float) $service->service_fee) * ((float) $validated['rate'] / 100);
                DB::table('mechanic_commissions')->updateOrInsert(
                    ['user_id' => $service->user_id, 'service_id' => $service->id],
                    [
                        'commission_date' => $service->completed_at?->toDateString() ?? now()->toDateString(),
                        'base_amount' => $service->service_fee,
                        'rate' => $validated['rate'],
                        'amount' => $amount,
                        'status' => 'unpaid',
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]
                );
            });

        return back()->with('success', 'Komisi mekanik berhasil dihitung.');
    }

    public function auditLogs(Request $request)
    {
        $rows = DB::table('audit_logs')
            ->leftJoin('users', 'audit_logs.user_id', '=', 'users.id')
            ->select('audit_logs.*', 'users.name as user_name')
            ->when($request->module, fn ($q) => $q->where('module', $request->module))
            ->latest('audit_logs.created_at')
            ->paginate(30)
            ->withQueryString()
            ->through(fn ($row) => [
                'date' => $row->created_at,
                'user' => $row->user_name ?: '-',
                'module' => $row->module,
                'action' => $row->action,
                'description' => $row->description ?: '-',
                'ip' => $row->ip_address ?: '-',
            ]);

        return $this->tablePage('Audit Log', 'Jejak aktivitas sensitif pada transaksi, stok, servis, PO, dan setting.', [
            ['key' => 'date', 'label' => 'Tanggal'],
            ['key' => 'user', 'label' => 'User'],
            ['key' => 'module', 'label' => 'Modul'],
            ['key' => 'action', 'label' => 'Aksi'],
            ['key' => 'description', 'label' => 'Keterangan'],
            ['key' => 'ip', 'label' => 'IP'],
        ], $rows);
    }

    public function crm()
    {
        $rows = DB::table('customer_follow_ups')
            ->join('customers', 'customer_follow_ups.customer_id', '=', 'customers.id')
            ->leftJoin('users', 'customer_follow_ups.user_id', '=', 'users.id')
            ->select('customer_follow_ups.*', 'customers.name as customer_name', 'customers.phone', 'users.name as user_name')
            ->latest('scheduled_at')
            ->paginate(20)
            ->withQueryString()
            ->through(fn ($row) => [
                'customer' => $row->customer_name,
                'phone' => $row->phone ?: '-',
                'type' => $row->type,
                'status' => $row->status,
                'scheduled_at' => $row->scheduled_at ?: '-',
                'user' => $row->user_name ?: '-',
                'notes' => $row->notes ?: '-',
            ]);

        return $this->tablePage('CRM Follow-up', 'Catat reminder servis berkala dan tindak lanjut pelanggan secara manual.', [
            ['key' => 'customer', 'label' => 'Pelanggan'],
            ['key' => 'phone', 'label' => 'Telepon'],
            ['key' => 'type', 'label' => 'Tipe'],
            ['key' => 'status', 'label' => 'Status'],
            ['key' => 'scheduled_at', 'label' => 'Jadwal'],
            ['key' => 'user', 'label' => 'PIC'],
            ['key' => 'notes', 'label' => 'Catatan'],
        ], $rows, [], [
            [
                'title' => 'Tambah Follow-up',
                'action' => '/admin/crm/follow-ups',
                'method' => 'post',
                'fields' => [
                    ['name' => 'customer_id', 'label' => 'ID Pelanggan', 'type' => 'number', 'required' => true],
                    ['name' => 'type', 'label' => 'Tipe', 'type' => 'select', 'options' => ['service_reminder' => 'Reminder Servis', 'promo' => 'Promo', 'complaint' => 'Keluhan']],
                    ['name' => 'scheduled_at', 'label' => 'Jadwal', 'type' => 'datetime-local'],
                    ['name' => 'notes', 'label' => 'Catatan', 'type' => 'textarea'],
                ],
            ],
        ]);
    }

    public function storeFollowUp(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'type' => 'required|string',
            'scheduled_at' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);
        DB::table('customer_follow_ups')->insert([
            ...$validated,
            'user_id' => Auth::id(),
            'status' => 'open',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Follow-up pelanggan berhasil dibuat.');
    }

    public function branchesWarehouses()
    {
        $branches = DB::table('branches')->get()->map(fn ($row) => [
            'code' => $row->code,
            'name' => $row->name,
            'address' => $row->address ?: '-',
            'phone' => $row->phone ?: '-',
            'default' => $row->is_default ? 'Ya' : 'Tidak',
        ]);
        $warehouses = DB::table('warehouses')
            ->leftJoin('branches', 'warehouses.branch_id', '=', 'branches.id')
            ->select('warehouses.*', 'branches.name as branch_name')
            ->get()
            ->map(fn ($row) => [
                'code' => $row->code,
                'name' => $row->name,
                'branch' => $row->branch_name ?: '-',
                'default' => $row->is_default ? 'Ya' : 'Tidak',
            ]);

        return Inertia::render('Admin/Operations/BranchesWarehouses', [
            'branches' => $branches,
            'warehouses' => $warehouses,
        ]);
    }

    public function storeBranch(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:branches,code',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
        ]);
        DB::table('branches')->insert([...$validated, 'created_at' => now(), 'updated_at' => now()]);

        return back()->with('success', 'Cabang berhasil ditambahkan.');
    }

    public function storeWarehouse(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'nullable|exists:branches,id',
            'code' => 'required|string|max:50|unique:warehouses,code',
            'name' => 'required|string|max:255',
        ]);
        DB::table('warehouses')->insert([...$validated, 'created_at' => now(), 'updated_at' => now()]);

        return back()->with('success', 'Gudang berhasil ditambahkan.');
    }

    public function backups()
    {
        $rows = DB::table('backup_records')->latest()->paginate(20)->withQueryString()->through(fn ($row) => [
            'id' => $row->id,
            'filename' => $row->filename,
            'size' => number_format($row->size / 1024, 1).' KB',
            'status' => $row->status,
            'created_at' => $row->created_at,
        ]);

        return $this->tablePage('Backup & Restore', 'Buat dan unduh backup database. Restore dibuat terbatas demi keamanan data.', [
            ['key' => 'id', 'label' => '#'],
            ['key' => 'filename', 'label' => 'File'],
            ['key' => 'size', 'label' => 'Ukuran'],
            ['key' => 'status', 'label' => 'Status'],
            ['key' => 'created_at', 'label' => 'Dibuat'],
        ], $rows, [], [
            [
                'title' => 'Buat Backup Database',
                'action' => '/admin/backups',
                'method' => 'post',
                'fields' => [],
            ],
        ]);
    }

    public function createBackup()
    {
        $source = database_path('database.sqlite');
        $directory = storage_path('app/backups');
        File::ensureDirectoryExists($directory);
        $filename = 'backup-'.now()->format('Ymd-His').'.sqlite';
        $path = $directory.DIRECTORY_SEPARATOR.$filename;
        File::copy($source, $path);

        DB::table('backup_records')->insert([
            'user_id' => Auth::id(),
            'filename' => $filename,
            'path' => $path,
            'size' => File::size($path),
            'status' => 'created',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Backup database berhasil dibuat.');
    }

    public function export(string $type)
    {
        $rows = match ($type) {
            'cash-ledger' => DB::table('cash_ledger_entries')->latest('occurred_at')->get(['occurred_at', 'type', 'category', 'description', 'amount']),
            'stock-movements' => DB::table('stock_movements')->join('spare_parts', 'stock_movements.spare_part_id', '=', 'spare_parts.id')->latest('occurred_at')->get(['occurred_at', 'spare_parts.code', 'spare_parts.name', 'type', 'quantity', 'stock_before', 'stock_after', 'notes']),
            'customers' => DB::table('customers')->get(['id', 'name', 'phone', 'email', 'address']),
            'sales' => DB::table('sales')->get(['receipt_number', 'customer_name', 'total_amount', 'amount_paid', 'payment_status', 'payment_method', 'created_at']),
            'purchase-orders' => DB::table('purchase_orders')->leftJoin('suppliers', 'purchase_orders.supplier_id', '=', 'suppliers.id')->get(['po_number', 'suppliers.name', 'order_date', 'total_amount', 'status']),
            'expenses' => DB::table('expenses')->get(['expense_date', 'category', 'amount', 'description']),
            default => collect(),
        };

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'w');
            if ($rows->isNotEmpty()) {
                fputcsv($handle, array_keys((array) $rows->first()));
                foreach ($rows as $row) {
                    fputcsv($handle, (array) $row);
                }
            }
            fclose($handle);
        }, $type.'-'.now()->format('Ymd-His').'.csv', ['Content-Type' => 'text/csv']);
    }

    private function tablePage(string $title, string $description, array $columns, mixed $rows, array $actions = [], array $forms = [], array $stats = [], array $extras = [])
    {
        return Inertia::render('Admin/Operations/Index', [
            'title' => $title,
            'description' => $description,
            'columns' => $columns,
            'rows' => $rows,
            'actions' => $actions,
            'forms' => $forms,
            'stats' => $stats,
            'extras' => $extras,
        ]);
    }
}
