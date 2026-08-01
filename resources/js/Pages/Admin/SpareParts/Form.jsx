import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import MasterDataTabs from '../MasterData/MasterDataTabs';
import { UNIT_OPTIONS } from '../../../constants/units';
import { ArrowLeft } from 'lucide-react';

export default function SparePartForm({ sparePart, productTypes = [] }) {
    const isEditing = !!sparePart;
    const { data, setData, post, put, processing, errors } = useForm({
        code:        sparePart?.code        || '',
        barcode:     sparePart?.barcode     || '',
        name:        sparePart?.name        || '',
        product_type_id: sparePart?.product_type_id || '',
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

    return (
        <AdminLayout title={isEditing ? 'Edit Data Produk' : 'Tambah Data Produk'}>
            <Head title={isEditing ? 'Edit Data Produk' : 'Tambah Data Produk'} />
            <MasterDataTabs />

            <div style={{ maxWidth: '600px' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link href="/admin/spare-parts" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><ArrowLeft size={14} /> Kembali</Link>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>{isEditing ? 'Edit Data Produk' : 'Tambah Data Produk'}</h2>
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
                                    {UNIT_OPTIONS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Barcode / QR Code</label>
                            <input type="text" value={data.barcode} onChange={e => setData('barcode', e.target.value)}
                                className="form-input" placeholder="Scan atau isi kode barcode" />
                            {errors.barcode && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.barcode}</div>}
                        </div>

                        <div>
                            <label className="form-label">Nama Spare Part <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                className="form-input" placeholder="Contoh: Kompresor AC Denso" />
                            {errors.name && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</div>}
                        </div>

                        <div>
                            <label className="form-label">Kategori Produk</label>
                            <select className="form-input" value={data.product_type_id} onChange={e => setData('product_type_id', e.target.value)}>
                                <option value="">-- Tanpa kategori --</option>
                                {productTypes.map(pt => (
                                    <option key={pt.id} value={pt.id}>{pt.name}</option>
                                ))}
                            </select>
                            {productTypes.length === 0 && (
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                    Belum ada kategori produk. Tambahkan di tab Kategori Produk.
                                </div>
                            )}
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
