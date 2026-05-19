<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Service;
use App\Models\Sale;
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
            'revenue_today'    => 
                Service::with('spareParts')->where('status', 'selesai')->whereDate('completed_at', $today)->get()->sum(fn ($s) => $s->total_cost) +
                Sale::where('payment_status', 'lunas')->whereDate('created_at', $today)->sum('total_amount'),
            'revenue_month'    => 
                Service::with('spareParts')->where('status', 'selesai')->whereMonth('completed_at', $today->month)->get()->sum(fn ($s) => $s->total_cost) +
                Sale::where('payment_status', 'lunas')->whereMonth('created_at', $today->month)->sum('total_amount'),
            'piutang'          => Sale::where('payment_status', 'belum_lunas')->get()->sum(fn($s) => $s->total_amount - $s->amount_paid),
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

        $lowStockParts = SparePart::whereColumn('stock', '<=', 'min_stock')
            ->orderBy('stock')
            ->orderBy('name')
            ->take(8)
            ->get(['id', 'code', 'name', 'stock', 'min_stock', 'unit']);

        $salesTodayQuery = Sale::whereDate('created_at', $today);

        $salesSummary = [
            'today_count'  => (clone $salesTodayQuery)->count(),
            'today_total'  => (float) (clone $salesTodayQuery)->sum('total_amount'),
            'today_lunas'  => (float) Sale::whereDate('created_at', $today)->where('payment_status', 'lunas')->sum('total_amount'),
            'unpaid_count' => Sale::where('payment_status', 'belum_lunas')->count(),
        ];

        $recentSales = Sale::latest()
            ->take(5)
            ->get()
            ->map(fn ($s) => [
                'id'              => $s->id,
                'receipt_number'  => $s->receipt_number,
                'customer_name'   => $s->customer_name ?: 'Pelanggan Umum',
                'total_amount'    => $s->total_amount,
                'payment_status'  => $s->payment_status,
                'payment_method'  => $s->payment_method,
                'created_at'      => $s->created_at->format('d M Y H:i'),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'auth'           => ['user' => Auth::user()],
            'stats'          => $stats,
            'activeServices' => $activeServices,
            'lowStockParts'  => $lowStockParts,
            'salesSummary'   => $salesSummary,
            'recentSales'    => $recentSales,
        ]);
    }
}
