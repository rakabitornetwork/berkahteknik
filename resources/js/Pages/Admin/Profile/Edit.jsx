import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Camera, Save, Lock } from 'lucide-react';

export default function EditProfile({ user }) {
    const { props } = usePage();
    const [photoPreview, setPhotoPreview] = useState(
        user.photo ? `/storage/${user.photo}` : null
    );

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        photo: null,
    });

    const { 
        data: pwdData, 
        setData: setPwdData, 
        put: putPwd, 
        processing: pwdProcessing, 
        errors: pwdErrors,
        reset: pwdReset,
        recentlySuccessful: pwdSuccessful
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const submitProfile = (e) => {
        e.preventDefault();
        post('/admin/profile', {
            preserveScroll: true,
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        putPwd('/admin/profile/password', {
            preserveScroll: true,
            onSuccess: () => pwdReset(),
        });
    };

    return (
        <AdminLayout title="Pengaturan Profil">
            <Head title="Profil Saya" />

            <div className="hd-grid hd-grid-cols-2" style={{ gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
                
                {/* Informasi Profil */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Informasi Profil</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        Perbarui informasi profil dan alamat email akun Anda.
                    </p>

                    <form onSubmit={submitProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Foto */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ 
                                width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                border: '2px solid var(--color-border)', flexShrink: 0, position: 'relative'
                            }}>
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label className="btn btn-outline" style={{ fontSize: '0.75rem', cursor: 'pointer', padding: '0.35rem 0.75rem' }}>
                                    <Camera size={14} style={{ marginRight: '0.375rem' }} /> Pilih Foto Baru
                                    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handlePhotoChange} />
                                </label>
                                {errors.photo && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.photo}</div>}
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Nama Lengkap</label>
                            <input type="text" className="form-input" value={data.name} onChange={e => setData('name', e.target.value)} required />
                            {errors.name && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors.name}</div>}
                        </div>

                        <div>
                            <label className="form-label">Username</label>
                            <input type="text" className="form-input" value={data.username} onChange={e => setData('username', e.target.value)} />
                            {errors.username && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors.username}</div>}
                        </div>

                        <div>
                            <label className="form-label">Email</label>
                            <input type="email" className="form-input" value={data.email} onChange={e => setData('email', e.target.value)} required />
                            {errors.email && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors.email}</div>}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                            <button type="submit" disabled={processing} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                                <Save size={16} style={{ marginRight: '0.5rem' }} /> Simpan Profil
                            </button>
                            {recentlySuccessful && <span style={{ color: 'var(--color-success)', fontSize: '0.8rem', fontWeight: 500 }}>Tersimpan.</span>}
                        </div>
                    </form>
                </div>

                {/* Ganti Password */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Perbarui Password</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        Pastikan akun Anda menggunakan password yang panjang dan acak agar tetap aman.
                    </p>

                    <form onSubmit={submitPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="form-label">Password Saat Ini</label>
                            <input type="password" className="form-input" value={pwdData.current_password} onChange={e => setPwdData('current_password', e.target.value)} required />
                            {pwdErrors.current_password && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{pwdErrors.current_password}</div>}
                        </div>

                        <div>
                            <label className="form-label">Password Baru</label>
                            <input type="password" className="form-input" value={pwdData.password} onChange={e => setPwdData('password', e.target.value)} required />
                            {pwdErrors.password && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{pwdErrors.password}</div>}
                        </div>

                        <div>
                            <label className="form-label">Konfirmasi Password Baru</label>
                            <input type="password" className="form-input" value={pwdData.password_confirmation} onChange={e => setPwdData('password_confirmation', e.target.value)} required />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                            <button type="submit" disabled={pwdProcessing} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                                <Lock size={16} style={{ marginRight: '0.5rem' }} /> Simpan Password
                            </button>
                            {pwdSuccessful && <span style={{ color: 'var(--color-success)', fontSize: '0.8rem', fontWeight: 500 }}>Password diperbarui.</span>}
                        </div>
                    </form>
                </div>

            </div>
        </AdminLayout>
    );
}
