import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';

export default function SparePartForm({ sparePart }) {
    const isEditing = !!sparePart;
    const { data, setData, post, put, processing, errors } = useForm({
        code:        sparePart?.code        || '',
        name:        sparePart?.name        || '',
        unit:        sparePart?.unit        || 'pcs',
        stock:       sparePart?.stock       || 0,
        min_stock:   sparePart?.min_stock   || 5,
        buy_price:   sparePart?.buy_price   || 0,
        sell_price:  sparePart?.sell_price  || 0,
        description: sparePart?.description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/spare-parts/${sparePart.id}`);
        } else {
            post('/admin/spare-parts');
        }
    };

    const units = ['pcs', 'liter', 'set', 'meter', 'kg'];

    return (
        <AdminLayout title={isEditing ? 'Edit Spare Part' : 'Tambah Spare Part'}>
            <Head title={isEditing ? 'Edit Spare Part' : 'Tambah Spare Part'} />

            <div style={{ maxWidth: '600px' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link href="/admin/spare-parts" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><ArrowLeft size={14} /> Kembali</Link>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>{isEditing ? 'Edit Spare Part' : 'Tambah Spare Part Baru'}</h2>
                    </div>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Kode Part <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                <input type="text" value={data.code} onChange={e => setData('code', e.target.value.toUpperCase())}
                                    className="form-input" placeholder="Contoh: AC-KOMPR-001" style={{ fontFamily: 'monospace' }} />
                                {errors.code && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.code}</div>}
                            </div>
                            <div>
                                <label className="form-label">Satuan <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                <select value={data.unit} onChange={e => setData('unit', e.target.value)} className="form-input">
                                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Nama Spare Part <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                className="form-input" placeholder="Contoh: Kompresor AC Denso" />
                            {errors.name && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</div>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Stok Awal <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                <input type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} className="form-input" min={0} />
                                {errors.stock && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.stock}</div>}
                            </div>
                            <div>
                                <label className="form-label">Minimum Stok (Alert) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                <input type="number" value={data.min_stock} onChange={e => setData('min_stock', e.target.value)} className="form-input" min={0} />
                            </div>
                            <div>
                                <label className="form-label">Harga Beli (Rp) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                <input type="number" value={data.buy_price} onChange={e => setData('buy_price', e.target.value)} className="form-input" min={0} />
                            </div>
                            <div>
                                <label className="form-label">Harga Jual (Rp) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                <input type="number" value={data.sell_price} onChange={e => setData('sell_price', e.target.value)} className="form-input" min={0} />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Deskripsi</label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)}
                                className="form-input" rows={2} placeholder="Keterangan tambahan..." />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={processing} style={{ flex: 1 }}>
                                {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Spare Part')}
                            </button>
                            <Link href="/admin/spare-parts" className="btn btn-outline">Batal</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
