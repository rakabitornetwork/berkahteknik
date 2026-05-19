import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AuthScreen from '../../../Components/AuthScreen';

export default function PortalRegister() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/portal/register');
    };

    return (
        <AuthScreen
            headTitle="Daftar Pelanggan"
            title="Daftar Akun Pelanggan"
            subtitle="Buat akun untuk memantau servis AC kendaraan Anda secara mandiri."
            backHref="/portal/login"
            backLabel="Kembali ke login"
            maxWidth={460}
        >
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label className="form-label" htmlFor="name">
                        Nama Lengkap <span style={{ color: 'var(--color-danger)' }}>*</span>
                    </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="form-input"
                        placeholder="Nama lengkap Anda"
                        autoFocus
                    />
                    {errors.name && <FieldError message={errors.name} />}
                </div>

                <div>
                    <label className="form-label" htmlFor="reg-phone">
                        Nomor Telepon <span style={{ color: 'var(--color-danger)' }}>*</span>
                    </label>
                    <input
                        id="reg-phone"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="form-input"
                        placeholder="Nomor HP aktif"
                        autoComplete="tel"
                    />
                    {errors.phone && <FieldError message={errors.phone} />}
                </div>

                <div>
                    <label className="form-label" htmlFor="address">Alamat</label>
                    <textarea
                        id="address"
                        name="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        className="form-input"
                        rows={2}
                        placeholder="Alamat lengkap (opsional)"
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                        <label className="form-label" htmlFor="password">
                            Password <span style={{ color: 'var(--color-danger)' }}>*</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="form-input"
                            placeholder="Min. 8 karakter"
                            autoComplete="new-password"
                        />
                        {errors.password && <FieldError message={errors.password} />}
                    </div>
                    <div>
                        <label className="form-label" htmlFor="password_confirmation">
                            Konfirmasi <span style={{ color: 'var(--color-danger)' }}>*</span>
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="form-input"
                            placeholder="Ulangi password"
                            autoComplete="new-password"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={processing}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                >
                    {processing ? 'Mendaftar...' : 'Buat Akun'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Sudah punya akun?{' '}
                <Link href="/portal/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                    Masuk di sini
                </Link>
            </div>
        </AuthScreen>
    );
}

function FieldError({ message }) {
    return <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{message}</div>;
}
