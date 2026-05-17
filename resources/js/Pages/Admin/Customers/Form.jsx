import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function CustomerForm({ customer }) {
    const isEditing = !!customer;
    const { data, setData, post, put, processing, errors } = useForm({
        name: customer?.name || '',
        phone: customer?.phone || '',
        address: customer?.address || '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/customers/${customer.id}`);
        } else {
            post('/admin/customers');
        }
    };

    return (
        <AdminLayout title={isEditing ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}>
            <Head title={isEditing ? 'Edit Pelanggan' : 'Tambah Pelanggan'} />

            <div style={{ maxWidth: '600px' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link href="/admin/customers" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>← Kembali ke Daftar</Link>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>{isEditing ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}</h2>
                    </div>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="form-label">Nama Lengkap <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="form-input" placeholder="Contoh: Budi Santoso" />
                            {errors.name && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</div>}
                        </div>

                        <div>
                            <label className="form-label">Nomor Telepon <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                            <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} className="form-input" placeholder="Contoh: 0812-3456-7890" />
                            {errors.phone && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.phone}</div>}
                        </div>

                        <div>
                            <label className="form-label">Alamat</label>
                            <textarea value={data.address} onChange={e => setData('address', e.target.value)} className="form-input" rows={3} placeholder="Alamat lengkap pelanggan..." />
                            {errors.address && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.address}</div>}
                        </div>

                        <div>
                            <label className="form-label">Password Portal Pelanggan {isEditing && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>(kosongkan jika tidak diubah)</span>}</label>
                            <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="form-input" placeholder="Min. 8 karakter" />
                            {errors.password && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</div>}
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={processing} style={{ flex: 1 }}>
                                {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Pelanggan')}
                            </button>
                            <Link href="/admin/customers" className="btn btn-outline">Batal</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
