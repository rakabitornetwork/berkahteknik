<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class MechanicController extends Controller
{
    /**
     * Display a listing of mechanics.
     */
    public function index(Request $request)
    {
        $mechanics = User::where('role', 'mechanic')
            ->when($request->search, function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Mechanics/Index', [
            'mechanics' => $mechanics,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created mechanic in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'nullable|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'] ?? null,
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => 'mechanic',
        ]);

        return redirect()->route('admin.mechanics.index')
            ->with('success', 'Data mekanik berhasil ditambahkan.');
    }

    /**
     * Update the specified mechanic in storage.
     */
    public function update(Request $request, User $mechanic)
    {
        // Pastikan hanya update user dengan role mechanic
        if ($mechanic->role !== 'mechanic') {
            abort(403, 'Aksi tidak diizinkan.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'nullable|string|max:255|unique:users,username,'.$mechanic->id,
            'email' => 'required|string|email|max:255|unique:users,email,'.$mechanic->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $mechanic->name = $validated['name'];
        $mechanic->username = $validated['username'] ?? null;
        $mechanic->email = $validated['email'];
        
        if (!empty($validated['password'])) {
            $mechanic->password = $validated['password'];
        }

        $mechanic->save();

        return redirect()->route('admin.mechanics.index')
            ->with('success', 'Data mekanik berhasil diperbarui.');
    }

    /**
     * Remove the specified mechanic from storage.
     */
    public function destroy(User $mechanic)
    {
        if ($mechanic->role !== 'mechanic') {
            abort(403, 'Aksi tidak diizinkan.');
        }

        $mechanic->delete();

        return redirect()->route('admin.mechanics.index')
            ->with('success', 'Data mekanik berhasil dihapus.');
    }
}
