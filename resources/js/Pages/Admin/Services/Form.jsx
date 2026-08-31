import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

function lineTotal(qty, price) {
    return Number(qty || 0) * Number(price || 0);
}

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

export default function ServiceForm({ service, customers, technicians, spareParts, serviceCategories = [], workTypes = [] }) {
    const { shop } = usePage().props;
    const isEditing = !!service;
    const [selectedCustomer, setSelectedCustomer] = useState(
        service?.vehicle?.customer_id || null
    );
    const [parts, setParts] = useState(
        service?.spare_parts?.map(p => ({
            spare_part_id: p.id,
            quantity: p.pivot.quantity,
            unit_price: p.pivot.unit_price ?? p.sell_price ?? 0,
        })) || []
    );
    const [workItems, setWorkItems] = useState(
        service?.work_items?.map(item => {
            const workType = workTypes.find(wt => String(wt.id) === String(item.work_type_id));
            const storedPrice = Number(item.unit_price);
            return {
                work_type_id: item.work_type_id || '',
                name: item.name,
                quantity: item.quantity,
                unit: (item.unit || 'job').toLowerCase(),
                unit_price: storedPrice > 0 ? storedPrice : (workType?.default_fee ?? 0),
            };
        }) || []
    );

    const { data, setData, post, put, processing, errors } = useForm({
        vehicle_id:   service?.vehicle_id || '',
        user_id:      service?.user_id || '',
        service_name: service?.service_name || '',
        service_category_id: service?.service_category_id || '',
        description:  service?.description || '',
        work_instructions: service?.work_instructions || '',
        diagnosis:    service?.diagnosis || '',
        mechanic_notes: service?.mechanic_notes || '',
        is_bring_own_part: service?.is_bring_own_part === 1 || service?.is_bring_own_part === true,
        service_fee:  service?.service_fee || 0,
        status:       service?.status || 'antri',
        payment_status: service?.payment_status || 'belum_lunas',
        parts:        parts,
        work_items:   workItems,
        warranty_months: service?.warranty_months ?? '',
        warranty_notes: service?.warranty_notes || '',
        warranty_terms: service?.warranty_terms || '',
    });

    const applyServiceCategory = (categoryId) => {
        if (!categoryId) {
            setData('service_category_id', '');
            return;
        }
        const category = serviceCategories.find(c => String(c.id) === String(categoryId));
        if (!category) {
            setData('service_category_id', categoryId);
            return;
        }
        setData({
            ...data,
            service_category_id: categoryId,
            service_name: category.name,
            service_fee: (!isEditing || Number(data.service_fee) === 0)
                ? (category.default_fee ?? 0)
                : data.service_fee,
        });
    };

    const customerVehicles = customers?.find(c => c.id == selectedCustomer)?.vehicles || [];

    const partsTotal = data.parts.reduce((sum, part) => sum + lineTotal(part.quantity, part.unit_price), 0);
    const workItemsTotal = data.work_items.reduce((sum, item) => sum + lineTotal(item.quantity, item.unit_price), 0);

    const addPart = () => {
        const newParts = [...data.parts, { spare_part_id: '', quantity: 1, unit_price: 0 }];
        setParts(newParts);
        setData('parts', newParts);
    };

    const removePart = (idx) => {
        const newParts = data.parts.filter((_, i) => i !== idx);
        setParts(newParts);
        setData('parts', newParts);
    };

    const updatePart = (idx, field, value) => {
        const newParts = data.parts.map((p, i) => {
            if (i !== idx) return p;
            if (field === 'spare_part_id') {
                const sparePart = spareParts.find(sp => String(sp.id) === String(value));
                return {
                    ...p,
                    spare_part_id: value,
                    unit_price: sparePart?.sell_price ?? 0,
                };
            }
            return { ...p, [field]: value };
        });
        setParts(newParts);
        setData('parts', newParts);
    };

    const addWorkItem = () => {
        const next = [...data.work_items, { work_type_id: '', name: '', quantity: 1, unit: 'job', unit_price: 0 }];
        setWorkItems(next);
        setData('work_items', next);
    };

    const removeWorkItem = (idx) => {
        const next = data.work_items.filter((_, i) => i !== idx);
        setWorkItems(next);
        setData('work_items', next);
    };

    const updateWorkItem = (idx, field, value) => {
        const next = data.work_items.map((item, i) => {
            if (i !== idx) return item;
            if (field === 'work_type_id') {
                const workType = workTypes.find(wt => String(wt.id) === String(value));
                return {
                    ...item,
                    work_type_id: value,
                    name: workType?.name || item.name,
                    unit: (workType?.unit || item.unit || 'job').toLowerCase(),
                    unit_price: workType?.default_fee ?? 0,
                };
            }
            return { ...item, [field]: value };
        });
        setWorkItems(next);
        setData('work_items', next);
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

            <div style={{ maxWidth: '960px' }}>
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

                        <FormSection title="Item Sparepart">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem', overflowX: 'auto' }}>
                                {data.parts.length > 0 && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) 70px 130px 130px auto', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Spare Part</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Qty</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Harga (Rp)</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'right' }}>Jumlah</span>
                                        <span></span>
                                    </div>
                                )}
                                {data.parts.map((part, idx) => (
                                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) 70px 130px 130px auto', gap: '0.5rem', alignItems: 'center' }}>
                                        <select className="form-input" value={part.spare_part_id}
                                            onChange={e => updatePart(idx, 'spare_part_id', e.target.value)}>
                                            <option value="">-- Pilih Spare Part --</option>
                                            {spareParts?.map(sp => (
                                                <option key={sp.id} value={sp.id}>
                                                    {sp.name} (Stok: {sp.stock}) · {fmt(sp.sell_price)}
                                                </option>
                                            ))}
                                        </select>
                                        <input type="number" className="form-input" value={part.quantity} min={1}
                                            onChange={e => updatePart(idx, 'quantity', e.target.value)}
                                            placeholder="Qty" />
                                        <input type="number" className="form-input" value={part.unit_price} min={0}
                                            onChange={e => updatePart(idx, 'unit_price', e.target.value)}
                                            placeholder="0" />
                                        <div style={{ textAlign: 'right', fontSize: '0.85rem', fontWeight: 600 }}>
                                            {fmt(lineTotal(part.quantity, part.unit_price))}
                                        </div>
                                        <button type="button" onClick={() => removePart(idx)}
                                            style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1 }}>×</button>
                                    </div>
                                ))}
                                {data.parts.length === 0 && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                        Belum ada spare part.
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button type="button" onClick={addPart} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
                                    + Tambah Spare Part
                                </button>
                                {data.parts.length > 0 && (
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                                        Subtotal spare part: {fmt(partsTotal)}
                                    </div>
                                )}
                            </div>
                        </FormSection>

                        <FormSection title="Item Pengerjaan">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem', overflowX: 'auto' }}>
                                {data.work_items.length > 0 && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr) 64px 56px 120px 120px auto', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Jenis</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Nama</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Qty</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Satuan</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Harga (Rp)</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'right' }}>Jumlah</span>
                                        <span></span>
                                    </div>
                                )}
                                {data.work_items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr) 64px 56px 120px 120px auto', gap: '0.5rem', alignItems: 'center' }}>
                                        <select
                                            className="form-input"
                                            value={item.work_type_id}
                                            onChange={e => updateWorkItem(idx, 'work_type_id', e.target.value)}
                                        >
                                            <option value="">-- Pilih jenis pengerjaan --</option>
                                            {workTypes.map(wt => (
                                                <option key={wt.id} value={wt.id}>
                                                    {wt.name} ({wt.unit}) · {fmt(wt.default_fee)}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={item.name}
                                            onChange={e => updateWorkItem(idx, 'name', e.target.value)}
                                            placeholder="Nama pengerjaan"
                                        />
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={item.quantity}
                                            min={1}
                                            onChange={e => updateWorkItem(idx, 'quantity', e.target.value)}
                                            placeholder="Qty"
                                        />
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={(item.unit || 'job').toLowerCase()}
                                            readOnly
                                            title="Satuan"
                                            style={{ textAlign: 'center', fontWeight: 700, textTransform: 'capitalize' }}
                                        />
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={item.unit_price}
                                            min={0}
                                            onChange={e => updateWorkItem(idx, 'unit_price', e.target.value)}
                                            placeholder="0"
                                        />
                                        <div style={{ textAlign: 'right', fontSize: '0.85rem', fontWeight: 600 }}>
                                            {fmt(lineTotal(item.quantity, item.unit_price))}
                                        </div>
                                        <button type="button" onClick={() => removeWorkItem(idx)}
                                            style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1 }}>×</button>
                                    </div>
                                ))}
                                {data.work_items.length === 0 && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                        Belum ada item pengerjaan.
                                    </div>
                                )}
                                {workTypes.length === 0 && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                        Belum ada master Jenis Pengerjaan. Tambahkan di menu Jenis Pengerjaan.
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button type="button" onClick={addWorkItem} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
                                    + Tambah Item Pengerjaan
                                </button>
                                {data.work_items.length > 0 && (
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                                        Subtotal pengerjaan: {fmt(workItemsTotal)}
                                    </div>
                                )}
                            </div>
                        </FormSection>

                        <FormSection title="Jasa">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label className="form-label">Kategori Jasa</label>
                                    <select
                                        className="form-input"
                                        value={data.service_category_id}
                                        onChange={e => applyServiceCategory(e.target.value)}
                                    >
                                        <option value="">-- Pilih kategori (opsional) --</option>
                                        {serviceCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name} · {cat.unit} · Rp {Number(cat.default_fee || 0).toLocaleString('id-ID')}
                                            </option>
                                        ))}
                                    </select>
                                    {serviceCategories.length === 0 && (
                                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                            Belum ada master Kategori Jasa. Tambahkan di menu Kategori Jasa.
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="form-label">Jenis Jasa <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <input type="text" className="form-input" value={data.service_name} onChange={e => setData('service_name', e.target.value)}
                                        placeholder="Contoh: Pemasangan Kompresor Baru" required />
                                    {errors.service_name && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.service_name}</div>}
                                </div>
                                <div>
                                    <label className="form-label">Biaya Jasa (Rp)</label>
                                    <input type="number" value={data.service_fee} onChange={e => setData('service_fee', e.target.value)}
                                        className="form-input" placeholder="0" min={0} />
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                                        Harga spare part dan item pengerjaan terisi otomatis dari master data, dan bisa diubah.
                                    </div>
                                </div>
                            </div>
                        </FormSection>

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
