import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import MasterDataTabs from '../MasterData/MasterDataTabs';
import { ArrowLeft } from 'lucide-react';

export default function Form({ item = null }) {
    const isEditing = !!item;
    const { data, setData, post, put, processing, errors } = useForm({
        name: item?.name || '',
        description: item?.description || '',
        is_active: item?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/product-types/${item.id}`);
        } else {
            post('/admin/product-types');
        }
    };

    return (
        <AdminLayout title={isEditing ? 'Edit Kategori Produk' : 'Tambah Kategori Produk'}>
            <Head title={isEditing ? 'Edit Kategori Produk' : 'Tambah Kategori Produk'} />
            <MasterDataTabs />
            <div style={{ maxWidth: '600px' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link href="/admin/product-types" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <ArrowLeft size={14} /> Kembali
                        </Link>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>
                            {isEditing ? 'Edit Kategori Produk' : 'Tambah Kategori Produk'}
                        </h2>
                    </div>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label className="form-label">Nama Kategori Produk <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                            <input className="form-input" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Contoh: Komponen AC, Filter, Freon" required />
                            {errors.name && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</div>}
                        </div>

                        <div>
                            <label className="form-label">Deskripsi</label>
                            <textarea className="form-input" rows={2} value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Keterangan opsional..." />
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }} />
                            <span style={{ fontSize: '0.875rem' }}>Aktif</span>
                        </label>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={processing} style={{ flex: 1 }}>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <Link href="/admin/product-types" className="btn btn-outline">Batal</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
