<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Customer;
use App\Models\Sale;
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
            // Service revenue
            $services = Service::where('status', 'selesai')
                ->whereYear('completed_at', $year)
                ->whereMonth('completed_at', $m)
                ->with('spareParts')
                ->get();

            $serviceRevenue = $services->sum(fn($s) =>
                $s->service_fee + $s->spareParts->sum(fn($p) => $p->pivot->quantity * $p->pivot->unit_price)
            );

            // Sale revenue
            $sales = Sale::where('payment_status', 'lunas')
                ->whereYear('created_at', $year)
                ->whereMonth('created_at', $m)
                ->get();

            $saleRevenue = $sales->sum('total_amount');

            $monthlyData[] = [
                'month'           => Carbon::create($year, $m, 1)->locale('id')->isoFormat('MMM'),
                'service_revenue' => (float) $serviceRevenue,
                'sale_revenue'    => (float) $saleRevenue,
                'revenue'         => (float) ($serviceRevenue + $saleRevenue),
                'count'           => $services->count(),
                'sales_count'     => $sales->count(),
            ];
        }

        // Filtered services for the detail table
        $queryServices = Service::with(['vehicle.customer', 'technician', 'spareParts'])
            ->where('status', 'selesai')
            ->whereYear('completed_at', $year);

        if ($month) {
            $queryServices->whereMonth('completed_at', $month);
        }

        $services = $queryServices->latest('completed_at')
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
                'type'           => 'service',
            ]);

        // Filtered sales for the detail table
        $querySales = Sale::where('payment_status', 'lunas')
            ->whereYear('created_at', $year);

        if ($month) {
            $querySales->whereMonth('created_at', $month);
        }

        $sales = $querySales->latest('created_at')
            ->get()
            ->map(fn($s) => [
                'id'             => $s->id,
                'receipt_number' => $s->receipt_number,
                'customer'       => $s->customer_name ?: 'Pelanggan Umum',
                'payment_method' => $s->payment_method,
                'total'          => (float) $s->total_amount,
                'completed_at'   => $s->created_at->format('d M Y'),
                'type'           => 'sale',
            ]);

        // Calculate combined summary
        $totalServiceRevenue = $services->sum('total');
        $totalSaleRevenue = $sales->sum('total');

        $summary = [
            'total_revenue'         => $totalServiceRevenue + $totalSaleRevenue,
            'total_service_revenue' => $totalServiceRevenue,
            'total_sale_revenue'    => $totalSaleRevenue,
            'total_services'        => $services->count(),
            'total_sales'           => $sales->count(),
            'paid_services'         => $services->where('payment_status', 'lunas')->count(),
            'unpaid_services'       => $services->where('payment_status', 'belum_lunas')->count(),
            'total_customers'       => Customer::count(),
        ];

        $availableYears = range(now()->year, max(2024, now()->year - 4));

        return Inertia::render('Admin/Reports/Index', [
            'monthlyData'    => $monthlyData,
            'services'       => $services,
            'sales'          => $sales,
            'summary'        => $summary,
            'filters'        => ['year' => (int)$year, 'month' => $month ? (int)$month : null],
            'availableYears' => $availableYears,
        ]);
    }
}
