import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AuthScreen, { AuthField } from '../../../Components/AuthScreen';

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
            variant="portal"
            headTitle="Daftar Pelanggan"
            title="Buat akun pelanggan"
            subtitle="Daftar sekali untuk memantau servis AC kendaraan dan mengajukan booking secara mandiri."
            backHref="/portal/login"
            backLabel="Kembali ke login"
            maxWidth="28rem"
        >
            <form onSubmit={submit} className="auth-form">
                <AuthField label="Nama lengkap" htmlFor="name" error={errors.name} required>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="auth-input"
                        placeholder="Nama lengkap Anda"
                        autoFocus
                    />
                </AuthField>

                <AuthField label="Nomor telepon" htmlFor="reg-phone" error={errors.phone} required>
                    <input
                        id="reg-phone"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="auth-input"
                        placeholder="Nomor HP aktif"
                        autoComplete="tel"
                    />
                </AuthField>

                <AuthField label="Alamat" htmlFor="address" error={errors.address}>
                    <textarea
                        id="address"
                        name="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        className="auth-input"
                        rows={2}
                        placeholder="Alamat lengkap (opsional)"
                        style={{ resize: 'vertical', minHeight: '4.5rem' }}
                    />
                </AuthField>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <AuthField label="Password" htmlFor="password" error={errors.password} required>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="auth-input"
                            placeholder="Min. 8 karakter"
                            autoComplete="new-password"
                        />
                    </AuthField>
                    <AuthField label="Konfirmasi" htmlFor="password_confirmation" required>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="auth-input"
                            placeholder="Ulangi"
                            autoComplete="new-password"
                        />
                    </AuthField>
                </div>

                <button type="submit" className="auth-submit" disabled={processing}>
                    {processing ? 'Mendaftar...' : 'Buat akun'}
                </button>
            </form>

            <div className="auth-footer">
                Sudah punya akun?{' '}
                <Link href="/portal/login">Masuk di sini</Link>
            </div>
        </AuthScreen>
    );
}
