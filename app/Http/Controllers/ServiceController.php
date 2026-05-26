<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Service;
use App\Models\SparePart;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\OperationalJournal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $services = Service::with(['vehicle.customer', 'technician'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->search, fn($q) => $q->whereHas('vehicle', fn($vq) =>
                $vq->where('license_plate', 'like', "%{$request->search}%")
                   ->orWhereHas('customer', fn($cq) => $cq->where('name', 'like', "%{$request->search}%"))
            ))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
            'filters'  => $request->only(['status', 'search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Services/Form', [
            'customers'   => Customer::with('vehicles')->get(),
            'technicians' => User::where('role', 'mechanic')->get(['id', 'name']),
            'spareParts'  => SparePart::where('stock', '>', 0)->get(),
        ]);
    }

    public function store(Request $request, OperationalJournal $journal)
    {
        $validated = $request->validate([
            'vehicle_id'   => 'required|exists:vehicles,id',
            'user_id'      => 'nullable|exists:users,id',
            'service_name' => 'required|string|max:255',
            'description'  => 'required|string',
            'work_instructions' => 'nullable|string',
            'is_bring_own_part' => 'boolean',
            'service_fee'  => 'nullable|numeric|min:0',
            'parts'        => 'nullable|array',
            'parts.*.spare_part_id' => 'exists:spare_parts,id',
            'parts.*.quantity'      => 'integer|min:1',
            'warranty_months' => 'nullable|integer|min:0|max:120',
            'warranty_notes' => 'nullable|string',
            'warranty_terms' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $journal) {
            $service = Service::create([
                'vehicle_id'  => $validated['vehicle_id'],
                'user_id'     => $validated['user_id'] ?? null,
                'service_name'=> $validated['service_name'],
                'description' => $validated['description'],
                'work_instructions' => $validated['work_instructions'] ?? null,
                'is_bring_own_part' => $validated['is_bring_own_part'] ?? false,
                'service_fee' => $validated['service_fee'] ?? 0,
                'status'      => 'antri',
                'warranty_months' => $validated['warranty_months'] ?? null,
                'warranty_notes' => $validated['warranty_notes'] ?? null,
                'warranty_terms' => $validated['warranty_terms'] ?? null,
            ]);

            if (!empty($validated['parts'])) {
                foreach ($validated['parts'] as $part) {
                    $sparePart = SparePart::lockForUpdate()->find($part['spare_part_id']);
                    $before = $sparePart->stock;
                    $service->spareParts()->attach($sparePart->id, [
                        'quantity'   => $part['quantity'],
                        'unit_price' => $sparePart->sell_price,
                    ]);
                    $sparePart->decrement('stock', $part['quantity']);
                    $sparePart->refresh();
                    $journal->stock($sparePart, 'out', $part['quantity'], $before, $sparePart->stock, $service, 'Pemakaian spare part servis', $sparePart->buy_price);
                }
            }
            $journal->audit('create', 'service', $service, 'Servis baru dibuat.');
        });

        return redirect()->route('admin.services.index')
            ->with('success', 'Servis baru berhasil ditambahkan.');
    }

    public function show(Service $service)
    {
        $service->load(['vehicle.customer', 'technician', 'spareParts', 'payments']);

        return Inertia::render('Admin/Services/Show', [
            'service' => $service,
        ]);
    }

    public function edit(Service $service)
    {
        $service->load(['vehicle', 'spareParts']);

        return Inertia::render('Admin/Services/Form', [
            'service'     => $service,
            'customers'   => Customer::with('vehicles')->get(),
            'technicians' => User::where('role', 'mechanic')->get(['id', 'name']),
            'spareParts'  => SparePart::all(),
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'user_id'        => 'nullable|exists:users,id',
            'status'         => 'required|in:booking,antri,dikerjakan,selesai',
            'service_name'   => 'required|string|max:255',
            'description'    => 'required|string',
            'diagnosis'      => 'nullable|string',
            'work_instructions' => 'nullable|string',
            'mechanic_notes' => 'nullable|string',
            'is_bring_own_part' => 'boolean',
            'service_fee'    => 'nullable|numeric|min:0',
            'payment_status' => 'nullable|in:belum_lunas,lunas',
            'warranty_months' => 'nullable|integer|min:0|max:120',
            'warranty_notes' => 'nullable|string',
            'warranty_terms' => 'nullable|string',
            'warranty_starts_at' => 'nullable|date',
        ]);

        $this->applyStatusSideEffects($validated, $service);

        $service->update($validated);

        return redirect()->route('admin.services.show', $service)
            ->with('success', 'Data servis berhasil diperbarui.');
    }

    public function destroy(Service $service, OperationalJournal $journal)
    {
        DB::transaction(function () use ($service, $journal) {
            $service->load('spareParts');

            foreach ($service->spareParts as $sparePart) {
                $before = $sparePart->stock;
                $sparePart->increment('stock', $sparePart->pivot->quantity);
                $sparePart->refresh();
                $journal->stock($sparePart, 'return', $sparePart->pivot->quantity, $before, $sparePart->stock, $service, 'Stok dikembalikan karena servis dihapus');
            }

            $journal->audit('delete', 'service', $service, 'Servis dihapus.');
            $service->spareParts()->detach();
            $service->delete();
        });

        return redirect()->route('admin.services.index')
            ->with('success', 'Data servis berhasil dihapus.');
    }

    public function updateStatus(Request $request, Service $service)
    {
        $request->validate(['status' => 'required|in:booking,antri,dikerjakan,selesai']);

        $update = ['status' => $request->status];
        $this->applyStatusSideEffects($update, $service);

        $service->update($update);

        return back()->with('success', 'Status berhasil diperbarui.');
    }

    public function invoice(Service $service)
    {
        $service->load(['vehicle.customer', 'technician', 'spareParts', 'payments']);

        return Inertia::render('Admin/Services/InvoicePrint', [
            'service' => $service,
            'shop' => app(\App\Services\ShopSettingService::class)->forFrontend(),
        ]);
    }

    private function applyStatusSideEffects(array &$data, Service $service): void
    {
        $status = $data['status'] ?? $service->status;

        if ($status === 'dikerjakan' && ! $service->started_at && empty($data['started_at'])) {
            $data['started_at'] = now();
        }

        if ($status === 'selesai') {
            if (! $service->completed_at && empty($data['completed_at'])) {
                $data['completed_at'] = now();
            }
            if (! $service->warranty_starts_at && empty($data['warranty_starts_at'])) {
                $data['warranty_starts_at'] = now()->toDateString();
            }
        }
    }
}
