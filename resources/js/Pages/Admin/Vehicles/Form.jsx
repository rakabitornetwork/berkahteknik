import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';

export default function VehicleForm({ vehicle, customer, customers }) {
    const isEditing = !!vehicle;
    const { data, setData, post, put, processing, errors } = useForm({
        customer_id:   vehicle?.customer_id   || customer?.id || '',
        license_plate: vehicle?.license_plate || '',
        brand:         vehicle?.brand         || '',
        model:         vehicle?.model         || '',
        year:          vehicle?.year          || '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/vehicles/${vehicle.id}`);
        } else {
            post('/admin/vehicles');
        }
    };

    const currentCustomer = vehicle?.customer || customer || customers?.find(c => c.id == data.customer_id);

    return (
        <AdminLayout title={isEditing ? 'Edit Kendaraan' : 'Tambah Kendaraan'}>
            <Head title={isEditing ? 'Edit Kendaraan' : 'Tambah Kendaraan'} />

            <div style={{ maxWidth: '600px' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link href={currentCustomer ? `/admin/customers/${currentCustomer.id}` : '/admin/customers'}
                            style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><ArrowLeft size={14} /> Kembali</Link>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>
                            {isEditing ? 'Edit Kendaraan' : 'Tambah Kendaraan Baru'}
                        </h2>
                        {currentCustomer && (
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                Pelanggan: <strong>{currentCustomer.name}</strong>
                            </div>
                        )}
                    </div>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {!isEditing && !customer && (
                            <div>
                                <label className="form-label">Pelanggan <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                <select value={data.customer_id} onChange={e => setData('customer_id', e.target.value)} className="form-input">
                                    <option value="">-- Pilih Pelanggan --</option>
                                    {customers?.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                                </select>
                                {errors.customer_id && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.customer_id}</div>}
                            </div>
                        )}

                        <div>
                            <label className="form-label">Plat Nomor <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                            <input type="text" value={data.license_plate} onChange={e => setData('license_plate', e.target.value.toUpperCase())}
                                className="form-input" placeholder="Contoh: B 1234 CD" style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em' }} />
                            {errors.license_plate && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.license_plate}</div>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Merek <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                <input type="text" value={data.brand} onChange={e => setData('brand', e.target.value)}
                                    className="form-input" placeholder="Contoh: Toyota" />
                                {errors.brand && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.brand}</div>}
                            </div>
                            <div>
                                <label className="form-label">Model <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                <input type="text" value={data.model} onChange={e => setData('model', e.target.value)}
                                    className="form-input" placeholder="Contoh: Avanza" />
                                {errors.model && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.model}</div>}
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Tahun</label>
                            <input type="number" value={data.year} onChange={e => setData('year', e.target.value)}
                                className="form-input" placeholder="Contoh: 2020" min={1990} max={new Date().getFullYear() + 1} />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={processing} style={{ flex: 1 }}>
                                {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Kendaraan')}
                            </button>
                            <Link href={currentCustomer ? `/admin/customers/${currentCustomer.id}` : '/admin/customers'} className="btn btn-outline">Batal</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
