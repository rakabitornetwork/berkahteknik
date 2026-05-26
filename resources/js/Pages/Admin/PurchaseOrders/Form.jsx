import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { Save, ArrowLeft, Plus, Trash2, ShoppingBag } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Form({ order = null, suppliers = [], spareParts = [], errors = {} }) {
    const isEditing = !!order;

    const [formData, setFormData] = useState({
        supplier_id: order?.supplier_id || '',
        order_date: order?.order_date || new Date().toISOString().slice(0, 10),
        items: order?.items?.length
            ? order.items.map(i => ({
                spare_part_id: i.spare_part_id,
                quantity: i.quantity,
                unit_price: i.unit_price,
            }))
            : [{ spare_part_id: '', quantity: 1, unit_price: '' }],
    });

    const handleHeaderChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Auto-fill harga beli terakhir saat pilih spare part
        if (field === 'spare_part_id') {
            const part = spareParts.find(p => p.id === parseInt(value));
            if (part) {
                newItems[index].unit_price = part.buy_price || '';
            }
        }
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { spare_part_id: '', quantity: 1, unit_price: '' }],
        }));
    };

    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const total = formData.items.reduce(
        (sum, item) => sum + (Number(item.quantity) * Number(item.unit_price) || 0), 0
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            router.put(route('admin.purchase-orders.update', order.id), formData, { preserveScroll: true });
        } else {
            router.post(route('admin.purchase-orders.store'), formData, { preserveScroll: true });
        }
    };

    const inputStyle = {
        width: '100%', padding: '0.5rem 0.65rem', borderRadius: '0.4rem',
        border: '1px solid var(--color-border)',
        background: 'var(--color-bg-secondary)', color: 'var(--color-text-main)',
        fontSize: '0.875rem', boxSizing: 'border-box',
    };

    return (
        <AdminLayout title={isEditing ? 'Edit Purchase Order' : 'Buat Purchase Order'}>
            <div style={{ padding: '1.5rem' }}>
                {/* Back + Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Link href={route('admin.purchase-orders.index')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                        <ArrowLeft size={16} /> Kembali
                    </Link>
                    <ShoppingBag size={20} style={{ color: 'var(--color-primary)' }} />
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                        {isEditing ? `Edit PO: ${order.po_number}` : 'Buat Purchase Order Baru'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Header PO */}
                    <div style={{
                        background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                        borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.25rem',
                    }}>
                        <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                            Informasi PO
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {/* Supplier */}
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                    Supplier <span style={{ color: 'var(--color-danger)' }}>*</span>
                                </label>
                                <select
                                    name="supplier_id"
                                    value={formData.supplier_id}
                                    onChange={handleHeaderChange}
                                    required
                                    style={inputStyle}
                                >
                                    <option value="">— Pilih Supplier —</option>
                                    {suppliers.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                {errors.supplier_id && <p style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.supplier_id}</p>}
                            </div>

                            {/* Tanggal */}
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                    Tanggal Order <span style={{ color: 'var(--color-danger)' }}>*</span>
                                </label>
                                <input
                                    type="date"
                                    name="order_date"
                                    value={formData.order_date}
                                    onChange={handleHeaderChange}
                                    required
                                    style={inputStyle}
                                />
                                {errors.order_date && <p style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.order_date}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div style={{
                        background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                        borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.25rem',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                                Item Spare Part
                            </h3>
                            <button
                                type="button"
                                onClick={addItem}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                    padding: '0.4rem 0.85rem', borderRadius: '0.4rem',
                                    background: 'var(--color-primary)', color: '#fff',
                                    border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                                }}
                            >
                                <Plus size={14} /> Tambah Item
                            </button>
                        </div>

                        {errors.items && <p style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{errors.items}</p>}

                        {/* Item rows */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {/* Header row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Spare Part</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Qty</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Harga Beli (Rp)</span>
                                <span></span>
                            </div>

                            {formData.items.map((item, index) => (
                                <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                                    <select
                                        value={item.spare_part_id}
                                        onChange={e => handleItemChange(index, 'spare_part_id', e.target.value)}
                                        required
                                        style={inputStyle}
                                    >
                                        <option value="">— Pilih Spare Part —</option>
                                        {spareParts.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} (Stok: {p.stock})
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                                        required
                                        style={inputStyle}
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        step="100"
                                        value={item.unit_price}
                                        onChange={e => handleItemChange(index, 'unit_price', e.target.value)}
                                        required
                                        placeholder="0"
                                        style={inputStyle}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        disabled={formData.items.length === 1}
                                        style={{
                                            background: 'none', border: 'none', cursor: formData.items.length === 1 ? 'not-allowed' : 'pointer',
                                            color: formData.items.length === 1 ? 'var(--color-text-muted)' : 'var(--color-danger)',
                                            display: 'inline-flex', padding: '0.25rem',
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div style={{
                            marginTop: '1rem', paddingTop: '1rem',
                            borderTop: '1px solid var(--color-border)',
                            display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem',
                        }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Total:</span>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                                Rp {total.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <Link
                            href={route('admin.purchase-orders.index')}
                            style={{
                                padding: '0.6rem 1.25rem', borderRadius: '0.5rem',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-muted)', textDecoration: 'none',
                                fontSize: '0.9rem', fontWeight: 500,
                            }}
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.6rem 1.25rem', borderRadius: '0.5rem',
                                background: 'var(--color-primary)', color: '#fff',
                                border: 'none', cursor: 'pointer',
                                fontSize: '0.9rem', fontWeight: 600,
                            }}
                        >
                            <Save size={16} /> {isEditing ? 'Simpan Perubahan' : 'Buat Purchase Order'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
