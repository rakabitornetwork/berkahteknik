<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MechanicDashboardController extends Controller
{
    public function index()
    {
        $mechanicId = Auth::id();

        // Active jobs (antri, dikerjakan)
        $activeServices = Service::with(['vehicle.customer'])
            ->where('user_id', $mechanicId)
            ->whereIn('status', ['antri', 'dikerjakan'])
            ->orderByRaw("FIELD(status, 'dikerjakan', 'antri')") // prioritize active work
            ->orderBy('created_at')
            ->get()
            ->map(fn($s) => [
                'id'            => $s->id,
                'spk_number'    => $s->spk_number,
                'customer_name' => $s->vehicle->customer->name ?? '-',
                'vehicle'       => "{$s->vehicle->brand} {$s->vehicle->model} ({$s->vehicle->license_plate})",
                'service_name'  => $s->service_name,
                'status'        => $s->status,
                'created_at'    => $s->created_at->format('d M Y H:i'),
                'scheduled_at'  => $s->scheduled_at?->format('d M Y H:i'),
            ]);

        // Completed jobs (selesai)
        $completedServices = Service::with(['vehicle.customer'])
            ->where('user_id', $mechanicId)
            ->where('status', 'selesai')
            ->latest('completed_at')
            ->take(20)
            ->get()
            ->map(fn($s) => [
                'id'            => $s->id,
                'spk_number'    => $s->spk_number,
                'customer_name' => $s->vehicle->customer->name ?? '-',
                'vehicle'       => "{$s->vehicle->brand} {$s->vehicle->model} ({$s->vehicle->license_plate})",
                'service_name'  => $s->service_name,
                'status'        => $s->status,
                'completed_at'  => $s->completed_at?->format('d M Y H:i'),
            ]);

        return Inertia::render('Mechanic/Dashboard', [
            'mechanic'          => Auth::user(),
            'activeServices'    => $activeServices,
            'completedServices' => $completedServices,
        ]);
    }

    public function show(Service $service)
    {
        // Ensure this service is assigned to this mechanic
        if ($service->user_id !== Auth::id()) {
            abort(403, 'Anda tidak ditugaskan untuk pekerjaan ini.');
        }

        $service->load(['vehicle.customer', 'spareParts']);

        return Inertia::render('Mechanic/ServiceShow', [
            'service' => [
                'id'                => $service->id,
                'spk_number'        => $service->spk_number,
                'service_name'      => $service->service_name,
                'description'       => $service->description,
                'diagnosis'         => $service->diagnosis,
                'work_instructions' => $service->work_instructions,
                'mechanic_notes'    => $service->mechanic_notes,
                'status'            => $service->status,
                'vehicle'           => "{$service->vehicle->brand} {$service->vehicle->model}",
                'license_plate'     => $service->vehicle->license_plate,
                'customer_name'     => $service->vehicle->customer->name ?? '-',
                'customer_phone'    => $service->vehicle->customer->phone ?? '-',
                'created_at'        => $service->created_at->format('d M Y H:i'),
                'started_at'        => $service->started_at?->format('d M Y H:i'),
                'completed_at'      => $service->completed_at?->format('d M Y H:i'),
                'spare_parts'       => $service->spareParts->map(fn($p) => [
                    'name'     => $p->name,
                    'quantity' => $p->pivot->quantity,
                    'unit'     => $p->unit,
                ]),
            ],
            'mechanic' => Auth::user(),
        ]);
    }

    public function updateStatus(Request $request, Service $service)
    {
        if ($service->user_id !== Auth::id()) {
            abort(403, 'Anda tidak ditugaskan untuk pekerjaan ini.');
        }

        $request->validate([
            'status' => 'required|in:dikerjakan,selesai'
        ]);

        $update = ['status' => $request->status];

        if ($request->status === 'dikerjakan' && ! $service->started_at) {
            $update['started_at'] = now();
        }

        if ($request->status === 'selesai') {
            if (! $service->completed_at) {
                $update['completed_at'] = now();
            }
            if (! $service->warranty_starts_at) {
                $update['warranty_starts_at'] = now()->toDateString();
            }
        }

        $service->update($update);

        return back()->with('success', 'Status pengerjaan berhasil diperbarui.');
    }

    public function updateNotes(Request $request, Service $service)
    {
        if ($service->user_id !== Auth::id()) {
            abort(403, 'Anda tidak ditugaskan untuk pekerjaan ini.');
        }

        $validated = $request->validate([
            'diagnosis'      => 'nullable|string',
            'mechanic_notes' => 'nullable|string',
        ]);

        $service->update($validated);

        return back()->with('success', 'Catatan kerja berhasil disimpan.');
    }
}
