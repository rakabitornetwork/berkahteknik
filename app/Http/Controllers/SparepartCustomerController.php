<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SparepartCustomerController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->get('type'); // sparepart|bengkel|all

        $customers = Customer::sparepartBuyers()
            ->when($type === 'sparepart', fn ($q) => $q->where('customer_type', Customer::TYPE_SPAREPART))
            ->when($type === 'bengkel', fn ($q) => $q->where('customer_type', Customer::TYPE_BENGKEL))
            ->when($request->search, fn ($q) => $q->where(function ($inner) use ($request) {
                $inner->where('name', 'like', "%{$request->search}%")
                    ->orWhere('phone', 'like', "%{$request->search}%");
            }))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/MasterData/SparepartCustomers', [
            'customers' => $customers,
            'filters' => [
                'search' => $request->search,
                'type' => $type ?: 'all',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validated($request);
        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        Customer::create($validated);

        return redirect()->route('admin.master-data.pelanggan-sparepart.index', [
            'type' => $validated['customer_type'],
        ])->with('success', 'Data berhasil ditambahkan.');
    }

    public function update(Request $request, Customer $pelanggan_sparepart)
    {
        if (! in_array($pelanggan_sparepart->customer_type, [Customer::TYPE_SPAREPART, Customer::TYPE_BENGKEL], true)) {
            abort(404);
        }

        $validated = $this->validated($request, $pelanggan_sparepart->id);
        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $pelanggan_sparepart->update($validated);

        return redirect()->route('admin.master-data.pelanggan-sparepart.index', [
            'type' => $validated['customer_type'],
        ])->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Customer $pelanggan_sparepart)
    {
        if (! in_array($pelanggan_sparepart->customer_type, [Customer::TYPE_SPAREPART, Customer::TYPE_BENGKEL], true)) {
            abort(404);
        }

        $pelanggan_sparepart->delete();

        return redirect()->route('admin.master-data.pelanggan-sparepart.index')
            ->with('success', 'Data berhasil dihapus.');
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name' => 'required|string|max:100',
            'phone' => ['required', 'string', 'max:20', Rule::unique('customers', 'phone')->ignore($ignoreId)],
            'address' => 'nullable|string',
            'customer_type' => 'required|in:sparepart,bengkel',
            'password' => 'nullable|string|min:8',
        ]);
    }
}
