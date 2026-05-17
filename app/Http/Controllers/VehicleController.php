<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Service;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VehicleController extends Controller
{
    public function create(Request $request)
    {
        return Inertia::render('Admin/Vehicles/Form', [
            'customer' => $request->customer_id
                ? Customer::find($request->customer_id)
                : null,
            'customers' => Customer::all(['id', 'name', 'phone']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id'   => 'required|exists:customers,id',
            'license_plate' => 'required|string|max:20|unique:vehicles,license_plate',
            'brand'         => 'required|string|max:50',
            'model'         => 'required|string|max:50',
            'year'          => 'nullable|integer|min:1990|max:' . (date('Y') + 1),
        ]);

        Vehicle::create($validated);

        // Redirect back to customer detail
        return redirect()->route('admin.customers.show', $validated['customer_id'])
            ->with('success', 'Kendaraan berhasil ditambahkan.');
    }

    public function edit(Vehicle $vehicle)
    {
        return Inertia::render('Admin/Vehicles/Form', [
            'vehicle'   => $vehicle->load('customer'),
            'customers' => Customer::all(['id', 'name', 'phone']),
        ]);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'license_plate' => "required|string|max:20|unique:vehicles,license_plate,{$vehicle->id}",
            'brand'         => 'required|string|max:50',
            'model'         => 'required|string|max:50',
            'year'          => 'nullable|integer|min:1990|max:' . (date('Y') + 1),
        ]);

        $vehicle->update($validated);

        return redirect()->route('admin.customers.show', $vehicle->customer_id)
            ->with('success', 'Data kendaraan berhasil diperbarui.');
    }

    public function destroy(Vehicle $vehicle)
    {
        $customerId = $vehicle->customer_id;
        $vehicle->delete();

        return redirect()->route('admin.customers.show', $customerId)
            ->with('success', 'Kendaraan berhasil dihapus.');
    }
}
