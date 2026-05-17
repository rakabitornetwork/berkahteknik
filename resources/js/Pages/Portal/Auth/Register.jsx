import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function PortalRegister() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', phone: '', address: '', password: '', password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/portal/register');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4f8 50%, #f0f7ff 100%)' }}>
            <Head title="Daftar Pelanggan" />

            <div style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>AC</div>
                <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>Bengkel AC Berkah</span>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ width: '100%', maxWidth: '460px' }}>
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>❄️</div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>Daftar Akun Pelanggan</h1>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Buat akun untuk memantau servis AC mobil Anda secara mandiri.</p>
                        </div>

                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Nama Lengkap <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                    className="form-input" placeholder="Nama lengkap Anda" />
                                {errors.name && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</div>}
                            </div>
                            <div>
                                <label className="form-label">Nomor Telepon <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)}
                                    className="form-input" placeholder="Nomor HP aktif" />
                                {errors.phone && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.phone}</div>}
                            </div>
                            <div>
                                <label className="form-label">Alamat</label>
                                <textarea value={data.address} onChange={e => setData('address', e.target.value)}
                                    className="form-input" rows={2} placeholder="Alamat lengkap (opsional)" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label className="form-label">Password <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                        className="form-input" placeholder="Min. 8 karakter" />
                                    {errors.password && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</div>}
                                </div>
                                <div>
                                    <label className="form-label">Konfirmasi Password <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                        className="form-input" placeholder="Ulangi password" />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={processing}
                                style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}>
                                {processing ? 'Mendaftar...' : 'Buat Akun'}
                            </button>
                        </form>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            Sudah punya akun?{' '}
                            <Link href="/portal/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Masuk di sini</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
