import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AuthScreen, { AuthField } from '../../../Components/AuthScreen';

export default function PortalLogin() {
    const { data, setData, post, processing, errors } = useForm({
        phone: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/portal/login');
    };

    return (
        <AuthScreen
            variant="portal"
            headTitle="Login Pelanggan"
            title="Selamat datang kembali"
            subtitle="Masuk untuk melihat status servis, booking jadwal, dan riwayat kendaraan Anda."
            backHref="/"
            backLabel="Kembali ke beranda"
        >
            <form onSubmit={submit} className="auth-form">
                <AuthField label="Nomor telepon" htmlFor="phone" error={errors.phone}>
                    <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        className="auth-input"
                        placeholder="Contoh: 08123456789"
                        autoComplete="tel"
                        autoFocus
                        onChange={(e) => setData('phone', e.target.value)}
                    />
                </AuthField>

                <AuthField label="Password" htmlFor="password" error={errors.password}>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="auth-input"
                        placeholder="Password Anda"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                </AuthField>

                <div className="auth-row">
                    <label className="auth-check" htmlFor="remember">
                        <input
                            id="remember"
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        Ingat saya
                    </label>
                </div>

                <button type="submit" className="auth-submit" disabled={processing}>
                    {processing ? 'Memproses...' : 'Masuk ke Portal'}
                </button>
            </form>

            <div className="auth-footer">
                Belum punya akun?{' '}
                <Link href="/portal/register">Daftar di sini</Link>
            </div>
        </AuthScreen>
    );
}
