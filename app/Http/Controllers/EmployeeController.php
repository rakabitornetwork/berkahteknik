<?php

namespace App\Http\Controllers;

use App\Models\Position;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    private array $staffRoles = ['mechanic', 'cashier', 'admin', 'purchasing'];

    public function index(Request $request)
    {
        $employees = User::with('position')
            ->whereIn('role', $this->staffRoles)
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($inner) use ($request) {
                    $inner->where('name', 'like', "%{$request->search}%")
                        ->orWhere('phone', 'like', "%{$request->search}%")
                        ->orWhere('email', 'like', "%{$request->search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Employees/Index', [
            'employees' => $employees,
            'positions' => Position::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search']),
            'roleOptions' => [
                ['value' => 'mechanic', 'label' => 'Teknisi / Mekanik'],
                ['value' => 'cashier', 'label' => 'Kasir'],
                ['value' => 'admin', 'label' => 'Admin'],
                ['value' => 'purchasing', 'label' => 'Purchasing'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validated($request);
        unset($validated['ktp_photo'], $validated['password_confirmation']);

        $validated['ktp_photo_path'] = $this->storeKtp($request);

        User::create($validated);

        return redirect()->route('admin.karyawan.index')
            ->with('success', 'Data karyawan berhasil ditambahkan.');
    }

    public function update(Request $request, User $karyawan)
    {
        if (! in_array($karyawan->role, $this->staffRoles, true)) {
            abort(403, 'Aksi tidak diizinkan.');
        }

        $validated = $this->validated($request, $karyawan);

        if ($request->hasFile('ktp_photo')) {
            if ($karyawan->ktp_photo_path) {
                Storage::disk('public')->delete($karyawan->ktp_photo_path);
            }
            $validated['ktp_photo_path'] = $this->storeKtp($request);
        }

        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        unset($validated['ktp_photo'], $validated['password_confirmation']);

        $karyawan->fill($validated);
        $karyawan->save();

        return redirect()->route('admin.karyawan.index')
            ->with('success', 'Data karyawan berhasil diperbarui.');
    }

    public function destroy(User $karyawan)
    {
        if (! in_array($karyawan->role, $this->staffRoles, true)) {
            abort(403, 'Aksi tidak diizinkan.');
        }

        if ($karyawan->ktp_photo_path) {
            Storage::disk('public')->delete($karyawan->ktp_photo_path);
        }

        $karyawan->delete();

        return redirect()->route('admin.karyawan.index')
            ->with('success', 'Data karyawan berhasil dihapus.');
    }

    private function validated(Request $request, ?User $employee = null): array
    {
        $employeeId = $employee?->id;

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'position_id' => 'nullable|exists:positions,id',
            'phone' => 'nullable|string|max:50',
            'base_salary' => 'nullable|numeric|min:0',
            'transport_allowance' => 'nullable|numeric|min:0',
            'tenure_allowance' => 'nullable|numeric|min:0',
            'thr' => 'nullable|numeric|min:0',
            'ktp_photo' => 'nullable|image|max:4096',
            'username' => ['nullable', 'string', 'max:255', Rule::unique('users', 'username')->ignore($employeeId)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($employeeId)],
            'role' => ['required', Rule::in($this->staffRoles)],
            'password' => $employee
                ? ['nullable', 'confirmed', Rules\Password::defaults()]
                : ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $username = isset($data['username']) ? trim((string) $data['username']) : '';

        return [
            'name' => $data['name'],
            'position_id' => $data['position_id'] ?? null,
            'phone' => $data['phone'] ?? null,
            'base_salary' => $data['base_salary'] ?? 0,
            'transport_allowance' => $data['transport_allowance'] ?? 0,
            'tenure_allowance' => $data['tenure_allowance'] ?? 0,
            'thr' => $data['thr'] ?? 0,
            'username' => $username !== '' ? $username : null,
            'email' => $data['email'],
            'role' => $data['role'],
            'password' => $data['password'] ?? null,
            'password_confirmation' => $data['password_confirmation'] ?? null,
            'ktp_photo' => $data['ktp_photo'] ?? null,
        ];
    }

    private function storeKtp(Request $request): ?string
    {
        if (! $request->hasFile('ktp_photo')) {
            return null;
        }

        return $request->file('ktp_photo')->store('ktp', 'public');
    }
}
