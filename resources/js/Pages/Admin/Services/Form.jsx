import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';

export default function ServiceForm({ service, customers, technicians, spareParts }) {
    const isEditing = !!service;
    const [selectedCustomer, setSelectedCustomer] = useState(
        service?.vehicle?.customer_id || null
    );
    const [parts, setParts] = useState(
        service?.spare_parts?.map(p => ({
            spare_part_id: p.id,
            quantity: p.pivot.quantity,
        })) || []
    );

    const { data, setData, post, put, processing, errors } = useForm({
        vehicle_id:   service?.vehicle_id || '',
        user_id:      service?.user_id || '',
        service_name: service?.service_name || '',
        description:  service?.description || '',
        diagnosis:    service?.diagnosis || '',
        is_bring_own_part: service?.is_bring_own_part === 1 || service?.is_bring_own_part === true,
        service_fee:  service?.service_fee || 0,
        status:       service?.status || 'antri',
        payment_status: service?.payment_status || 'belum_lunas',
        parts:        parts,
    });

    const customerVehicles = customers?.find(c => c.id == selectedCustomer)?.vehicles || [];

    const addPart = () => {
        const newParts = [...data.parts, { spare_part_id: '', quantity: 1 }];
        setParts(newParts);
        setData('parts', newParts);
    };

    const removePart = (idx) => {
        const newParts = data.parts.filter((_, i) => i !== idx);
        setParts(newParts);
        setData('parts', newParts);
    };

    const updatePart = (idx, field, value) => {
        const newParts = data.parts.map((p, i) => i === idx ? { ...p, [field]: value } : p);
        setParts(newParts);
        setData('parts', newParts);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/services/${service.id}`);
        } else {
            post('/admin/services');
        }
    };

    const inputStyle = { marginBottom: 0 };
    const Section = ({ title, children }) => (
        <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>{title}</h3>
            {children}
        </div>
    );

    return (
        <AdminLayout title={isEditing ? 'Edit Servis' : 'Input Servis Baru'}>
            <Head title={isEditing ? 'Edit Servis' : 'Input Servis Baru'} />

            <div style={{ maxWidth: '750px' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link href="/admin/services" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><ArrowLeft size={14} /> Kembali</Link>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>{isEditing ? 'Edit Data Servis' : 'Input Servis Baru'}</h2>
                    </div>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

                        <Section title="Data Kendaraan">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="form-label">Pelanggan <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <select className="form-input" value={selectedCustomer || ''}
                                        onChange={e => { setSelectedCustomer(e.target.value); setData('vehicle_id', ''); }}
                                        disabled={isEditing}>
                                        <option value="">-- Pilih Pelanggan --</option>
                                        {customers?.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Kendaraan <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <select className="form-input" value={data.vehicle_id}
                                        onChange={e => setData('vehicle_id', e.target.value)}
                                        disabled={isEditing || !selectedCustomer}>
                                        <option value="">-- Pilih Kendaraan --</option>
                                        {customerVehicles.map(v => <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.license_plate})</option>)}
                                    </select>
                                    {errors.vehicle_id && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.vehicle_id}</div>}
                                </div>
                            </div>
                        </Section>

                        <Section title="Informasi Servis">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label className="form-label">Jenis Jasa <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <input type="text" className="form-input" value={data.service_name} onChange={e => setData('service_name', e.target.value)} 
                                        placeholder="Contoh: Pemasangan Kompresor Baru" required />
                                    {errors.service_name && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.service_name}</div>}
                                </div>
                                <div>
                                    <label className="form-label">Keluhan Pelanggan <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <textarea value={data.description} onChange={e => setData('description', e.target.value)}
                                        className="form-input" rows={2} placeholder="Jelaskan keluhan pelanggan..." />
                                    {errors.description && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.description}</div>}
                                </div>
                                
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={data.is_bring_own_part} 
                                        onChange={e => setData('is_bring_own_part', e.target.checked)}
                                        style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                                    />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Pelanggan Membawa Spare Part Sendiri</span>
                                </label>
                                {isEditing && (
                                    <div>
                                        <label className="form-label">Diagnosa Teknisi</label>
                                        <textarea value={data.diagnosis} onChange={e => setData('diagnosis', e.target.value)}
                                            className="form-input" rows={2} placeholder="Hasil diagnosa..." />
                                    </div>
                                )}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label className="form-label">Teknisi</label>
                                        <select className="form-input" value={data.user_id} onChange={e => setData('user_id', e.target.value)}>
                                            <option value="">-- Belum Ditugaskan --</option>
                                            {technicians?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                    {isEditing && (
                                        <>
                                            <div>
                                                <label className="form-label">Status Servis</label>
                                                <select className="form-input" value={data.status} onChange={e => setData('status', e.target.value)}>
                                                    <option value="antri">Antri</option>
                                                    <option value="dikerjakan">Dikerjakan</option>
                                                    <option value="selesai">Selesai</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="form-label">Status Bayar</label>
                                                <select className="form-input" value={data.payment_status} onChange={e => setData('payment_status', e.target.value)}>
                                                    <option value="belum_lunas">Belum Lunas</option>
                                                    <option value="lunas">Lunas</option>
                                                </select>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Section>

                        {!isEditing && (
                            <Section title="Spare Part yang Dipakai">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                    {data.parts.map((part, idx) => (
                                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 80px auto', gap: '0.5rem', alignItems: 'center' }}>
                                            <select className="form-input" value={part.spare_part_id}
                                                onChange={e => updatePart(idx, 'spare_part_id', e.target.value)}>
                                                <option value="">-- Pilih Spare Part --</option>
                                                {spareParts?.map(sp => <option key={sp.id} value={sp.id}>{sp.name} (Stok: {sp.stock})</option>)}
                                            </select>
                                            <input type="number" className="form-input" value={part.quantity} min={1}
                                                onChange={e => updatePart(idx, 'quantity', e.target.value)}
                                                placeholder="Qty" />
                                            <button type="button" onClick={() => removePart(idx)}
                                                style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1 }}>×</button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={addPart} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
                                    + Tambah Spare Part
                                </button>
                            </Section>
                        )}

                        <Section title="Biaya">
                            <div>
                                <label className="form-label">Biaya Jasa (Rp)</label>
                                <input type="number" value={data.service_fee} onChange={e => setData('service_fee', e.target.value)}
                                    className="form-input" placeholder="0" min={0} />
                            </div>
                        </Section>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={processing} style={{ flex: 1 }}>
                                {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Simpan Servis')}
                            </button>
                            <Link href="/admin/services" className="btn btn-outline">Batal</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
