<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PortalDashboardController extends Controller
{
    public function index()
    {
        $customer = Auth::guard('customer')->user();

        $vehicles = Vehicle::where('customer_id', $customer->id)
            ->with(['services' => function ($q) {
                $q->with(['technician', 'spareParts'])
                  ->latest()
                  ->take(5);
            }])
            ->get()
            ->map(function ($v) {
                return [
                    'id'            => $v->id,
                    'brand'         => $v->brand,
                    'model'         => $v->model,
                    'license_plate' => $v->license_plate,
                    'year'          => $v->year,
                    'services'      => $v->services->map(function ($s) {
                        $partsTotal = $s->spareParts->sum(fn($p) => $p->pivot->quantity * $p->pivot->unit_price);
                        return [
                            'id'             => $s->id,
                            'status'         => $s->status,
                            'description'    => $s->description,
                            'diagnosis'      => $s->diagnosis,
                            'service_fee'    => $s->service_fee,
                            'payment_status' => $s->payment_status,
                            'total'          => $partsTotal + $s->service_fee,
                            'technician'     => $s->technician?->name,
                            'started_at'     => $s->started_at?->format('d M Y H:i'),
                            'completed_at'   => $s->completed_at?->format('d M Y H:i'),
                            'created_at'     => $s->created_at->format('d M Y H:i'),
                            'scheduled_at'   => $s->scheduled_at?->format('d M Y H:i'),
                            'parts'          => $s->spareParts->map(fn($p) => [
                                'name'       => $p->name,
                                'quantity'   => $p->pivot->quantity,
                                'unit'       => $p->unit,
                                'unit_price' => $p->pivot->unit_price,
                            ]),
                        ];
                    }),
                ];
            });

        $activeService = $vehicles->flatMap(fn($v) => $v['services'])
            ->whereIn('status', ['antri', 'dikerjakan'])
            ->first();

        return Inertia::render('Portal/Dashboard', [
            'customer'      => $customer,
            'vehicles'      => $vehicles,
            'activeService' => $activeService,
        ]);
    }

    public function serviceDetail(int $id)
    {
        $customer = Auth::guard('customer')->user();

        $service = \App\Models\Service::with(['vehicle.customer', 'technician', 'spareParts'])
            ->whereHas('vehicle', fn($q) => $q->where('customer_id', $customer->id))
            ->findOrFail($id);

        $partsTotal = $service->spareParts->sum(fn($p) => $p->pivot->quantity * $p->pivot->unit_price);

        return Inertia::render('Portal/ServiceDetail', [
            'service'    => [
                'id'             => $service->id,
                'status'         => $service->status,
                'description'    => $service->description,
                'diagnosis'      => $service->diagnosis,
                'service_fee'    => $service->service_fee,
                'payment_status' => $service->payment_status,
                'total'          => $partsTotal + $service->service_fee,
                'technician'     => $service->technician?->name,
                'started_at'     => $service->started_at?->format('d M Y H:i'),
                'completed_at'   => $service->completed_at?->format('d M Y H:i'),
                'created_at'     => $service->created_at->format('d M Y H:i'),
                'scheduled_at'   => $service->scheduled_at?->format('d M Y H:i'),
                'vehicle'        => "{$service->vehicle->brand} {$service->vehicle->model} ({$service->vehicle->license_plate})",
                'parts'          => $service->spareParts->map(fn($p) => [
                    'name'       => $p->name,
                    'quantity'   => $p->pivot->quantity,
                    'unit'       => $p->unit,
                    'unit_price' => $p->pivot->unit_price,
                ]),
                'effective_warranty_months' => $service->effective_warranty_months,
                'warranty_expires_at' => $service->warranty_expires_at,
                'warranty_starts_at' => $service->warranty_starts_at?->format('d M Y'),
                'has_active_warranty' => $service->has_active_warranty,
                'warranty_notes' => $service->warranty_notes,
            ],
            'customer' => $customer,
        ]);
    }

    public function createVehicle()
    {
        return Inertia::render('Portal/VehicleForm', [
            'customer' => Auth::guard('customer')->user(),
        ]);
    }

    public function storeVehicle(Request $request)
    {
        $customer = Auth::guard('customer')->user();

        $validated = $request->validate([
            'license_plate' => 'required|string|max:20|unique:vehicles,license_plate',
            'brand'         => 'required|string|max:50',
            'model'         => 'required|string|max:50',
            'year'          => 'nullable|integer|min:1990|max:' . (date('Y') + 1),
        ]);

        $validated['customer_id'] = $customer->id;

        Vehicle::create($validated);

        return redirect()->route('portal.dashboard')
            ->with('success', 'Kendaraan berhasil ditambahkan.');
    }

    public function createBooking()
    {
        $customer = Auth::guard('customer')->user();
        $vehicles = Vehicle::where('customer_id', $customer->id)->get();

        return Inertia::render('Portal/BookingForm', [
            'customer' => $customer,
            'vehicles' => $vehicles,
        ]);
    }

    public function storeBooking(Request $request)
    {
        $customer = Auth::guard('customer')->user();

        $validated = $request->validate([
            'vehicle_id'   => 'required|exists:vehicles,id,customer_id,' . $customer->id,
            'service_name' => 'required|string|max:255',
            'description'  => 'required|string',
            'scheduled_at' => 'required|date|after:today',
        ]);

        \App\Models\Service::create([
            'vehicle_id'   => $validated['vehicle_id'],
            'service_name' => $validated['service_name'],
            'description'  => $validated['description'],
            'scheduled_at' => $validated['scheduled_at'],
            'status'       => 'booking',
            'service_fee'  => 0,
        ]);

        return redirect()->route('portal.dashboard')
            ->with('success', 'Booking servis berhasil diajukan. Silakan tunggu konfirmasi admin.');
    }
}
