<?php

namespace App\Http\Controllers;

use App\Models\EmployeeSalary;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeSalaryController extends Controller
{
    private array $staffRoles = ['mechanic', 'cashier', 'admin', 'purchasing'];

    public function index(Request $request)
    {
        $salaries = EmployeeSalary::with(['employee.position'])
            ->when($request->year, fn ($q) => $q->where('period_year', $request->year))
            ->when($request->month, fn ($q) => $q->where('period_month', $request->month))
            ->latest('period_year')
            ->latest('period_month')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Employees/Salaries', [
            'salaries' => $salaries,
            'employees' => User::whereIn('role', $this->staffRoles)
                ->with('position')
                ->orderBy('name')
                ->get([
                    'id', 'name', 'role', 'position_id',
                    'base_salary', 'transport_allowance', 'tenure_allowance', 'thr',
                ]),
            'filters' => [
                'month' => $request->month,
                'year' => $request->year ?: now()->year,
            ],
            'shop' => app(\App\Services\ShopSettingService::class)->forFrontend(),
        ]);
    }

    public function store(Request $request)
    {
        EmployeeSalary::create($this->validated($request));

        return redirect()->route('admin.karyawan.gaji.index')
            ->with('success', 'Data gaji berhasil ditambahkan.');
    }

    public function update(Request $request, EmployeeSalary $gaji)
    {
        $gaji->update($this->validated($request, $gaji->id));

        return redirect()->route('admin.karyawan.gaji.index')
            ->with('success', 'Data gaji berhasil diperbarui.');
    }

    public function destroy(EmployeeSalary $gaji)
    {
        $gaji->delete();

        return redirect()->route('admin.karyawan.gaji.index')
            ->with('success', 'Data gaji berhasil dihapus.');
    }

    public function slip(EmployeeSalary $gaji)
    {
        $gaji->load(['employee.position']);

        return Inertia::render('Admin/Employees/SalarySlipPrint', [
            'salary' => $gaji,
            'shop' => app(\App\Services\ShopSettingService::class)->forFrontend(),
        ]);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        $uniqueRule = Rule::unique('employee_salaries', 'user_id')
            ->where(fn ($q) => $q
                ->where('period_month', $request->input('period_month'))
                ->where('period_year', $request->input('period_year')));

        if ($ignoreId) {
            $uniqueRule->ignore($ignoreId);
        }

        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id', $uniqueRule],
            'period_month' => 'required|integer|min:1|max:12',
            'period_year' => 'required|integer|min:2000|max:2100',
            'pendapatan' => 'required|numeric|min:0',
            'potongan' => 'nullable|numeric|min:0',
            'tunjangan_transport' => 'nullable|numeric|min:0',
            'intensif_jasa' => 'nullable|numeric|min:0',
            'intensif_sparepart' => 'nullable|numeric|min:0',
            'status' => 'required|in:draft,paid',
            'paid_at' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $data['potongan'] = $data['potongan'] ?? 0;
        $data['tunjangan_transport'] = $data['tunjangan_transport'] ?? 0;
        $data['intensif_jasa'] = $data['intensif_jasa'] ?? 0;
        $data['intensif_sparepart'] = $data['intensif_sparepart'] ?? 0;
        $data['net_salary'] = EmployeeSalary::calculateNet(
            (float) $data['pendapatan'],
            (float) $data['tunjangan_transport'],
            (float) $data['intensif_jasa'],
            (float) $data['intensif_sparepart'],
            (float) $data['potongan'],
        );

        if ($data['status'] === 'paid' && empty($data['paid_at'])) {
            $data['paid_at'] = now()->toDateString();
        }

        if ($data['status'] !== 'paid') {
            $data['paid_at'] = null;
        }

        return $data;
    }
}
