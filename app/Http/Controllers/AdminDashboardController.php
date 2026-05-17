<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Service;
use App\Models\SparePart;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $stats = [
            'today_vehicles'   => Service::whereDate('created_at', $today)->count(),
            'active_services'  => Service::where('status', 'dikerjakan')->count(),
            'queue_services'   => Service::where('status', 'antri')->count(),
            'completed_today'  => Service::where('status', 'selesai')->whereDate('completed_at', $today)->count(),
            'total_customers'  => Customer::count(),
            'low_stock_parts'  => SparePart::whereColumn('stock', '<=', 'min_stock')->count(),
            'revenue_today'    => Service::where('status', 'selesai')
                ->whereDate('completed_at', $today)->get()
                ->sum(fn ($s) => $s->service_fee),
            'revenue_month'    => Service::where('status', 'selesai')
                ->whereMonth('completed_at', $today->month)->get()
                ->sum(fn ($s) => $s->service_fee),
        ];

        $activeServices = Service::with(['vehicle.customer', 'technician'])
            ->whereIn('status', ['antri', 'dikerjakan'])
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($s) => [
                'id'            => $s->id,
                'customer_name' => $s->vehicle->customer->name ?? '-',
                'vehicle'       => "{$s->vehicle->brand} {$s->vehicle->model} ({$s->vehicle->license_plate})",
                'status'        => $s->status,
                'technician'    => $s->technician->name ?? 'Belum ditugaskan',
                'service_fee'   => $s->service_fee,
                'created_at'    => $s->created_at->format('d M Y H:i'),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'auth'           => ['user' => Auth::user()],
            'stats'          => $stats,
            'activeServices' => $activeServices,
        ]);
    }
}
