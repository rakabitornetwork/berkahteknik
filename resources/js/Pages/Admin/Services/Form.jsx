import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';

function FormSection({ title, children }) {
    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
                fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)',
                marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)',
            }}>
                {title}
            </h3>
            {children}
        </div>
    );
}

export default function ServiceForm({ service, customers, technicians, spareParts }) {
    const { shop } = usePage().props;
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
        work_instructions: service?.work_instructions || '',
        diagnosis:    service?.diagnosis || '',
        mechanic_notes: service?.mechanic_notes || '',
        is_bring_own_part: service?.is_bring_own_part === 1 || service?.is_bring_own_part === true,
        service_fee:  service?.service_fee || 0,
        status:       service?.status || 'antri',
        payment_status: service?.payment_status || 'belum_lunas',
        parts:        parts,
        warranty_months: service?.warranty_months ?? '',
        warranty_notes: service?.warranty_notes || '',
        warranty_terms: service?.warranty_terms || '',
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

                        <FormSection title="Data Kendaraan">
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
                        </FormSection>

                        <FormSection title="Informasi Servis">
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
                                <div>
                                    <label className="form-label">Instruksi Kerja untuk Mekanik (SPK)</label>
                                    <textarea value={data.work_instructions} onChange={e => setData('work_instructions', e.target.value)}
                                        className="form-input" rows={2} placeholder="Contoh: Cek kebocoran freon, ganti filter kabin..." />
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Tercetak di Surat Perintah Kerja untuk mekanik.</div>
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
                                    <>
                                        <div>
                                            <label className="form-label">Diagnosa Teknisi</label>
                                            <textarea value={data.diagnosis} onChange={e => setData('diagnosis', e.target.value)}
                                                className="form-input" rows={2} placeholder="Hasil diagnosa..." />
                                        </div>
                                        <div>
                                            <label className="form-label">Catatan Mekanik (setelah selesai)</label>
                                            <textarea value={data.mechanic_notes} onChange={e => setData('mechanic_notes', e.target.value)}
                                                className="form-input" rows={2} placeholder="Catatan pekerjaan yang dilakukan..." />
                                        </div>
                                    </>
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
                        </FormSection>

                        {!isEditing && (
                            <FormSection title="Spare Part yang Dipakai">
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
                            </FormSection>
                        )}

                        <FormSection title="Garansi">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label className="form-label">Masa Garansi (bulan)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        min={0}
                                        max={120}
                                        value={data.warranty_months}
                                        onChange={e => setData('warranty_months', e.target.value)}
                                        placeholder={`Kosongkan = default ${shop?.warranty_default_months ?? 3} bulan`}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Catatan Garansi</label>
                                    <textarea className="form-input" rows={2} value={data.warranty_notes} onChange={e => setData('warranty_notes', e.target.value)} placeholder="Contoh: Garansi kompresor & freon" />
                                </div>
                                <div>
                                    <label className="form-label">Syarat Khusus (opsional)</label>
                                    <textarea className="form-input" rows={2} value={data.warranty_terms} onChange={e => setData('warranty_terms', e.target.value)} placeholder="Override kebijakan umum untuk servis ini" />
                                </div>
                                {shop?.warranty_policy && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '0.75rem', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)', whiteSpace: 'pre-line' }}>
                                        <strong>Kebijakan umum:</strong><br />{shop.warranty_policy}
                                    </div>
                                )}
                            </div>
                        </FormSection>

                        <FormSection title="Biaya">
                            <div>
                                <label className="form-label">Biaya Jasa (Rp)</label>
                                <input type="number" value={data.service_fee} onChange={e => setData('service_fee', e.target.value)}
                                    className="form-input" placeholder="0" min={0} />
                            </div>
                        </FormSection>

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
