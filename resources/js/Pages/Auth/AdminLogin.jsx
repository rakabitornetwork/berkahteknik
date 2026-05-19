import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AuthScreen from '../../Components/AuthScreen';

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
            headTitle="Admin Login"
            title={shop?.app_name || 'Admin Login'}
            subtitle="Masukkan kredensial Anda untuk masuk ke panel admin."
            backHref="/"
            backLabel="Kembali ke beranda"
            maxWidth={400}
        >
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="form-input"
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <FieldError message={errors.email} />}
                </div>

                <div>
                    <label className="form-label" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="form-input"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && <FieldError message={errors.password} />}
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
        </AuthScreen>
    );
}

function FieldError({ message }) {
    return <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{message}</div>;
}
