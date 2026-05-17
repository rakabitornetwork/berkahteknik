<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Service;
use App\Models\SparePart;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id'   => 'required|exists:vehicles,id',
            'user_id'      => 'nullable|exists:users,id',
            'service_name' => 'required|string|max:255',
            'description'  => 'required|string',
            'is_bring_own_part' => 'boolean',
            'service_fee'  => 'nullable|numeric|min:0',
            'parts'        => 'nullable|array',
            'parts.*.spare_part_id' => 'exists:spare_parts,id',
            'parts.*.quantity'      => 'integer|min:1',
        ]);

        $service = Service::create([
            'vehicle_id'  => $validated['vehicle_id'],
            'user_id'     => $validated['user_id'] ?? null,
            'service_name'=> $validated['service_name'],
            'description' => $validated['description'],
            'is_bring_own_part' => $validated['is_bring_own_part'] ?? false,
            'service_fee' => $validated['service_fee'] ?? 0,
            'status'      => 'antri',
        ]);

        // Attach spare parts and decrement stock
        if (!empty($validated['parts'])) {
            foreach ($validated['parts'] as $part) {
                $sparePart = SparePart::find($part['spare_part_id']);
                $service->spareParts()->attach($sparePart->id, [
                    'quantity'   => $part['quantity'],
                    'unit_price' => $sparePart->sell_price,
                ]);
                $sparePart->decrement('stock', $part['quantity']);
            }
        }

        return redirect()->route('admin.services.index')
            ->with('success', 'Servis baru berhasil ditambahkan.');
    }

    public function show(Service $service)
    {
        $service->load(['vehicle.customer', 'technician', 'spareParts']);

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
            'status'         => 'required|in:antri,dikerjakan,selesai',
            'service_name'   => 'required|string|max:255',
            'description'    => 'required|string',
            'diagnosis'      => 'nullable|string',
            'is_bring_own_part' => 'boolean',
            'service_fee'    => 'nullable|numeric|min:0',
            'payment_status' => 'nullable|in:belum_lunas,lunas',
        ]);

        if ($validated['status'] === 'dikerjakan' && !$service->started_at) {
            $validated['started_at'] = now();
        }
        if ($validated['status'] === 'selesai' && !$service->completed_at) {
            $validated['completed_at'] = now();
        }

        $service->update($validated);

        return redirect()->route('admin.services.show', $service)
            ->with('success', 'Data servis berhasil diperbarui.');
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->route('admin.services.index')
            ->with('success', 'Data servis berhasil dihapus.');
    }

    public function updateStatus(Request $request, Service $service)
    {
        $request->validate(['status' => 'required|in:antri,dikerjakan,selesai']);

        $update = ['status' => $request->status];
        if ($request->status === 'dikerjakan' && !$service->started_at) {
            $update['started_at'] = now();
        }
        if ($request->status === 'selesai' && !$service->completed_at) {
            $update['completed_at'] = now();
        }

        $service->update($update);

        return back()->with('success', 'Status berhasil diperbarui.');
    }
}
