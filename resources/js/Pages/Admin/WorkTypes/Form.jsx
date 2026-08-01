import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import MasterDataTabs from '../MasterData/MasterDataTabs';
import { UNIT_OPTIONS } from '../../../constants/units';
import { ArrowLeft } from 'lucide-react';

export default function Form({ item = null, categories = [] }) {
    const isEditing = !!item;
    const { data, setData, post, put, processing, errors } = useForm({
        name: item?.name || '',
        service_category_id: item?.service_category_id || '',
        unit: (item?.unit || 'job').toLowerCase(),
        default_fee: item?.default_fee ?? 0,
        description: item?.description || '',
        is_active: item?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/work-types/${item.id}`);
        } else {
            post('/admin/work-types');
        }
    };

    return (
        <AdminLayout title={isEditing ? 'Edit Data Jasa' : 'Tambah Data Jasa'}>
            <Head title={isEditing ? 'Edit Data Jasa' : 'Tambah Data Jasa'} />
            <MasterDataTabs />
            <div style={{ maxWidth: '600px' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link href="/admin/work-types" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <ArrowLeft size={14} /> Kembali
                        </Link>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>
                            {isEditing ? 'Edit Data Jasa' : 'Tambah Data Jasa'}
                        </h2>
                    </div>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label className="form-label">Nama Jasa <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                            <input className="form-input" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Contoh: Cuci evaporator, isi freon" required />
                            {errors.name && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</div>}
                        </div>

                        <div>
                            <label className="form-label">Kategori Jasa</label>
                            <select className="form-input" value={data.service_category_id} onChange={e => setData('service_category_id', e.target.value)}>
                                <option value="">-- Pilih kategori --</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Satuan</label>
                                <select className="form-input" value={data.unit} onChange={e => setData('unit', e.target.value)}>
                                    {UNIT_OPTIONS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Biaya Default (Rp)</label>
                                <input type="number" min={0} className="form-input" value={data.default_fee} onChange={e => setData('default_fee', e.target.value)} />
                            </div>
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
                            <Link href="/admin/work-types" className="btn btn-outline">Batal</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
