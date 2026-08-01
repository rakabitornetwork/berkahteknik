import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AuthScreen, { AuthField } from '../../Components/AuthScreen';

export default function AdminLogin() {
    const { shop } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <AuthScreen
            variant="admin"
            headTitle="Admin Login"
            title="Masuk ke panel admin"
            subtitle={`Gunakan akun staf ${shop?.short_name || shop?.app_name || 'bengkel'} untuk mengelola operasional harian.`}
            backHref="/"
            backLabel="Kembali ke beranda"
        >
            <form onSubmit={submit} className="auth-form">
                <AuthField label="Email" htmlFor="email" error={errors.email}>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="auth-input"
                        autoComplete="username"
                        autoFocus
                        placeholder="nama@bengkel.com"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                </AuthField>

                <AuthField label="Password" htmlFor="password" error={errors.password}>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="auth-input"
                        autoComplete="current-password"
                        placeholder="Masukkan password"
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
                    {processing ? 'Memproses...' : 'Masuk ke Admin'}
                </button>
            </form>
        </AuthScreen>
    );
}
