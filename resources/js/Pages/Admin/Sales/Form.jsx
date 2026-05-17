import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ShoppingCart, Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function SalesForm({ spareParts }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        payment_method: 'cash',
        amount_paid: '',
        items: [],
    });

    const [selectedPartId, setSelectedPartId] = useState('');
    const [quantity, setQuantity] = useState(1);

    const formatCurrency = (amount) => `Rp ${Number(amount).toLocaleString('id-ID')}`;

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!selectedPartId || quantity < 1) return;

        const part = spareParts.find(p => p.id === parseInt(selectedPartId));
        if (!part) return;

        // Check stock
        const existingItem = data.items.find(i => i.spare_part_id === part.id);
        const currentQty = existingItem ? existingItem.quantity : 0;
        
        if (currentQty + quantity > part.stock) {
            alert(`Stok ${part.name} tidak mencukupi. Sisa stok: ${part.stock}`);
            return;
        }

        let newItems = [...data.items];
        if (existingItem) {
            newItems = newItems.map(i => 
                i.spare_part_id === part.id ? { ...i, quantity: i.quantity + quantity } : i
            );
        } else {
            newItems.push({
                spare_part_id: part.id,
                name: part.name,
                unit_price: part.sell_price,
                quantity: quantity
            });
        }

        setData('items', newItems);
        setSelectedPartId('');
        setQuantity(1);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const calculateTotal = () => {
        return data.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/sales');
    };

    return (
        <AdminLayout title="Kasir Penjualan">
            <Head title="Point of Sales" />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Link href="/admin/sales" className="btn btn-outline" style={{ padding: '0.4rem' }}>
                    <ArrowLeft size={16} />
                </Link>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Transaksi Baru</h2>
            </div>

            <div className="hd-grid hd-grid-cols-3" style={{ gap: '1.5rem' }}>
                {/* Left Panel: Items Selection */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShoppingCart size={18} /> Tambah Barang
                        </h3>
                        
                        <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">Pilih Spare Part</label>
                                <select className="form-input" value={selectedPartId} onChange={e => setSelectedPartId(e.target.value)} required>
                                    <option value="">-- Pilih --</option>
                                    {spareParts.map(part => (
                                        <option key={part.id} value={part.id}>
                                            {part.code} - {part.name} (Stok: {part.stock}) - {formatCurrency(part.sell_price)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ width: '100px' }}>
                                <label className="form-label">Jumlah</label>
                                <input type="number" className="form-input" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} min="1" required />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ height: '38px', padding: '0 1rem' }}>
                                <Plus size={16} />
                            </button>
                        </form>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '300px' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Daftar Belanjaan</h3>
                        
                        {data.items.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem 0' }}>
                                Belum ada barang yang ditambahkan.
                            </div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                                        <th style={{ padding: '0.75rem 0.5rem' }}>Nama Barang</th>
                                        <th style={{ padding: '0.75rem 0.5rem' }}>Harga</th>
                                        <th style={{ padding: '0.75rem 0.5rem' }}>Qty</th>
                                        <th style={{ padding: '0.75rem 0.5rem' }}>Subtotal</th>
                                        <th style={{ padding: '0.75rem 0.5rem' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((item, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>{item.name}</td>
                                            <td style={{ padding: '0.75rem 0.5rem' }}>{formatCurrency(item.unit_price)}</td>
                                            <td style={{ padding: '0.75rem 0.5rem' }}>{item.quantity}</td>
                                            <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{formatCurrency(item.unit_price * item.quantity)}</td>
                                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                                                <button type="button" onClick={() => handleRemoveItem(index)} style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Right Panel: Checkout */}
                <div>
                    <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Pembayaran</h3>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Nama Pelanggan (Opsional)</label>
                                <input type="text" className="form-input" value={data.customer_name} onChange={e => setData('customer_name', e.target.value)} placeholder="Pelanggan Umum" />
                            </div>

                            <div>
                                <label className="form-label">Metode Pembayaran</label>
                                <select className="form-input" value={data.payment_method} onChange={e => setData('payment_method', e.target.value)}>
                                    <option value="cash">Tunai (Cash)</option>
                                    <option value="transfer">Transfer Bank</option>
                                    <option value="qris">QRIS</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Status Pembayaran (Otomatis)</label>
                                <div style={{ 
                                    padding: '0.75rem', 
                                    borderRadius: 'var(--radius-md)', 
                                    fontWeight: 600,
                                    textAlign: 'center',
                                    backgroundColor: (data.amount_paid >= calculateTotal() && calculateTotal() > 0) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: (data.amount_paid >= calculateTotal() && calculateTotal() > 0) ? 'var(--color-success)' : 'var(--color-danger)'
                                }}>
                                    {(data.amount_paid >= calculateTotal() && calculateTotal() > 0) ? 'LUNAS' : 'BELUM LUNAS'}
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0.5rem 0' }} />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(calculateTotal())}</span>
                            </div>

                            <div>
                                <label className="form-label">Uang Dibayar</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>Rp</span>
                                    <input 
                                        type="number" 
                                        className="form-input" 
                                        value={data.amount_paid} 
                                        onChange={e => setData('amount_paid', e.target.value)} 
                                        placeholder="0"
                                        style={{ paddingLeft: '2.5rem' }} 
                                    />
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Kembalian</span>
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: (data.amount_paid - calculateTotal()) >= 0 ? 'var(--color-success)' : 'var(--color-text-main)' }}>
                                    {formatCurrency(Math.max(0, (data.amount_paid || 0) - calculateTotal()))}
                                </span>
                            </div>

                            {errors.message && <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginBottom: '1rem' }}>{errors.message}</div>}
                            {errors.items && <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginBottom: '1rem' }}>Tambahkan minimal 1 barang.</div>}

                            <button type="submit" className="btn btn-primary" disabled={processing || data.items.length === 0} style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '1rem' }}>
                                <Save size={18} style={{ marginRight: '0.5rem' }} /> Proses Transaksi
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
