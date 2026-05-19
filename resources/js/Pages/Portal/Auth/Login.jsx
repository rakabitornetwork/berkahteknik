import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AuthScreen from '../../../Components/AuthScreen';

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
            headTitle="Login Pelanggan"
            title="Portal Pelanggan"
            subtitle="Masuk untuk memantau status servis AC kendaraan Anda."
            backHref="/"
            backLabel="Kembali ke beranda"
        >
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                    <label className="form-label" htmlFor="phone">Nomor Telepon</label>
                    <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        className="form-input"
                        placeholder="Contoh: 08123456789"
                        autoComplete="tel"
                        autoFocus
                        onChange={(e) => setData('phone', e.target.value)}
                    />
                    {errors.phone && (
                        <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.phone}</div>
                    )}
                </div>

                <div>
                    <label className="form-label" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="form-input"
                        placeholder="Password Anda"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && (
                        <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</div>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        id="remember"
                        type="checkbox"
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        style={{ marginRight: '0.5rem' }}
                    />
                    <label htmlFor="remember" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        Ingat Saya
                    </label>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    disabled={processing}
                >
                    {processing ? 'Memproses...' : 'Login Sekarang'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Belum punya akun?{' '}
                <Link href="/portal/register" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                    Daftar di sini
                </Link>
            </div>
        </AuthScreen>
    );
}
