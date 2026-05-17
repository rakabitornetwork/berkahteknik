<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Customer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $year  = $request->get('year', now()->year);
        $month = $request->get('month', null);

        // Revenue per month for the year (for chart)
        $monthlyData = [];
        for ($m = 1; $m <= 12; $m++) {
            $services = Service::where('status', 'selesai')
                ->whereYear('completed_at', $year)
                ->whereMonth('completed_at', $m)
                ->with('spareParts')
                ->get();

            $revenue = $services->sum(fn($s) =>
                $s->service_fee + $s->spareParts->sum(fn($p) => $p->pivot->quantity * $p->pivot->unit_price)
            );

            $monthlyData[] = [
                'month'   => Carbon::create($year, $m, 1)->locale('id')->isoFormat('MMM'),
                'revenue' => (float) $revenue,
                'count'   => $services->count(),
            ];
        }

        // Filtered services for the detail table
        $query = Service::with(['vehicle.customer', 'technician', 'spareParts'])
            ->where('status', 'selesai')
            ->whereYear('completed_at', $year);

        if ($month) {
            $query->whereMonth('completed_at', $month);
        }

        $services = $query->latest('completed_at')
            ->get()
            ->map(fn($s) => [
                'id'             => $s->id,
                'customer'       => $s->vehicle->customer->name ?? '-',
                'vehicle'        => "{$s->vehicle->brand} {$s->vehicle->model} ({$s->vehicle->license_plate})",
                'technician'     => $s->technician?->name ?? '-',
                'payment_status' => $s->payment_status,
                'service_fee'    => (float) $s->service_fee,
                'parts_total'    => (float) $s->spareParts->sum(fn($p) => $p->pivot->quantity * $p->pivot->unit_price),
                'total'          => (float) ($s->service_fee + $s->spareParts->sum(fn($p) => $p->pivot->quantity * $p->pivot->unit_price)),
                'completed_at'   => $s->completed_at?->format('d M Y'),
            ]);

        $summary = [
            'total_revenue'     => $services->sum('total'),
            'total_services'    => $services->count(),
            'paid_services'     => $services->where('payment_status', 'lunas')->count(),
            'unpaid_services'   => $services->where('payment_status', 'belum_lunas')->count(),
            'total_customers'   => Customer::count(),
        ];

        $availableYears = range(now()->year, max(2024, now()->year - 4));

        return Inertia::render('Admin/Reports/Index', [
            'monthlyData'    => $monthlyData,
            'services'       => $services,
            'summary'        => $summary,
            'filters'        => ['year' => (int)$year, 'month' => $month ? (int)$month : null],
            'availableYears' => $availableYears,
        ]);
    }
}
