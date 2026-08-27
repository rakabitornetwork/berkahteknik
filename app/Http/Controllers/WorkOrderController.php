<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\User;
use App\Services\ShopSettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkOrderController extends Controller
{
    public function index(Request $request)
    {
        $services = Service::with(['vehicle.customer', 'technician'])
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->when($request->mechanic_id, fn ($q) => $q->where('user_id', $request->mechanic_id))
            ->when($request->search, function ($q) use ($request) {
                $term = $request->search;
                $q->where(function ($query) use ($term) {
                    $query->where('spk_number', 'like', "%{$term}%")
                        ->orWhere('service_name', 'like', "%{$term}%")
                        ->orWhereHas('vehicle', fn ($vq) => $vq
                            ->where('license_plate', 'like', "%{$term}%")
                            ->orWhereHas('customer', fn ($cq) => $cq
                                ->where('name', 'like', "%{$term}%")
                                ->orWhere('phone', 'like', "%{$term}%")
                            )
                        );
                });
            })
            ->latest('spk_issued_at')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/WorkOrders/Index', [
            'services'  => $services,
            'mechanics' => User::where('role', 'mechanic')->orderBy('name')->get(['id', 'name']),
            'filters'   => $request->only(['status', 'search', 'mechanic_id']),
        ]);
    }

    public function print(Service $service)
    {
        $service->load(['vehicle.customer', 'technician', 'spareParts']);

        return Inertia::render('Admin/Services/SpkPrint', [
            'service' => $service,
            'shop' => app(ShopSettingService::class)->forFrontend(),
        ]);
    }
}
