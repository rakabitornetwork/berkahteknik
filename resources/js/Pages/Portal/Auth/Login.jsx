import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Fan } from 'lucide-react';

export default function PortalLogin() {
    const { shop } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        phone: '', password: '', remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/portal/login');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4f8 50%, #f0f7ff 100%)' }}>
            <Head title="Login Pelanggan" />

            {/* Nav */}
            <div style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>AC</div>
                <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{shop?.short_name || shop?.app_name || 'Bengkel AC Berkah'}</span>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    {/* Card */}
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: '#fbbf24' }}><Fan size={48} strokeWidth={2} /></div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>Portal Pelanggan</h1>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Masuk untuk memantau status servis AC mobil Anda.</p>
                        </div>

                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="form-label">Nomor Telepon</label>
                                <input id="phone" type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)}
                                    className="form-input" placeholder="Contoh: 08123456789" autoFocus />
                                {errors.phone && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.phone}</div>}
                            </div>
                            <div>
                                <label className="form-label">Password</label>
                                <input id="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                    className="form-input" placeholder="Password Anda" />
                                {errors.password && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={processing}
                                style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
                                {processing ? 'Memproses...' : 'Masuk'}
                            </button>
                        </form>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            Belum punya akun?{' '}
                            <Link href="/portal/register" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Daftar di sini</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
