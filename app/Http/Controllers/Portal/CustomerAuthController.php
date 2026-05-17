<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerAuthController extends Controller
{
    public function showLoginForm()
    {
        if (Auth::guard('customer')->check()) {
            return redirect('/portal/dashboard');
        }
        return Inertia::render('Portal/Auth/Login');
    }

    public function showRegisterForm()
    {
        if (Auth::guard('customer')->check()) {
            return redirect('/portal/dashboard');
        }
        return Inertia::render('Portal/Auth/Register');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'phone'    => 'required|string',
            'password' => 'required|string',
        ]);

        if (Auth::guard('customer')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended('/portal/dashboard');
        }

        return back()->withErrors([
            'phone' => 'Nomor telepon atau password salah.',
        ])->onlyInput('phone');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'                  => 'required|string|max:100',
            'phone'                 => 'required|string|max:20|unique:customers,phone',
            'address'               => 'nullable|string',
            'password'              => 'required|string|min:8|confirmed',
        ]);

        $customer = \App\Models\Customer::create([
            'name'     => $validated['name'],
            'phone'    => $validated['phone'],
            'address'  => $validated['address'] ?? null,
            'password' => bcrypt($validated['password']),
        ]);

        Auth::guard('customer')->login($customer);
        $request->session()->regenerate();

        return redirect('/portal/dashboard');
    }

    public function logout(Request $request)
    {
        Auth::guard('customer')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/portal/login');
    }
}
