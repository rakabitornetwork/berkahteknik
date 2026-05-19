import React, { useMemo, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ShoppingCart, Plus, Trash2, ArrowLeft, Save, Search } from 'lucide-react';
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
    const [partSearch, setPartSearch] = useState('');
    const [showPartResults, setShowPartResults] = useState(false);

    const formatCurrency = (amount) => `Rp ${Number(amount).toLocaleString('id-ID')}`;

    const filteredSpareParts = useMemo(() => {
        const q = partSearch.trim().toLowerCase();
        if (!q) return [];

        return spareParts.filter((part) => {
            const code = (part.code || '').toLowerCase();
            const name = (part.name || '').toLowerCase();
            const desc = (part.description || '').toLowerCase();
            return code.includes(q) || name.includes(q) || desc.includes(q);
        });
    }, [partSearch, spareParts]);

    const selectedPart = spareParts.find((p) => p.id === parseInt(selectedPartId, 10));

    const selectSparePart = (part) => {
        setSelectedPartId(String(part.id));
        setPartSearch(`${part.code} — ${part.name}`);
        setShowPartResults(false);
    };

    const clearPartSelection = () => {
        setSelectedPartId('');
        setPartSearch('');
        setShowPartResults(false);
    };

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
        clearPartSelection();
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

            <div className="pos-form-layout">
                <div className="pos-form-main">
                    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShoppingCart size={18} /> Tambah Barang
                        </h3>
                        
                        <form onSubmit={handleAddItem} className="pos-add-item-form">
                            <div className="pos-part-search-wrap">
                                <label className="form-label">Cari Spare Part</label>
                                <div className="pos-part-search-field">
                                    <Search size={16} className="pos-part-search-icon" aria-hidden />
                                    <input
                                        type="text"
                                        className="form-input pos-part-search-input"
                                        placeholder="Ketik kode, nama, atau deskripsi..."
                                        value={partSearch}
                                        onChange={(e) => {
                                            setPartSearch(e.target.value);
                                            setSelectedPartId('');
                                            setShowPartResults(true);
                                        }}
                                        onFocus={() => partSearch.trim() && setShowPartResults(true)}
                                        onBlur={() => setTimeout(() => setShowPartResults(false), 150)}
                                        autoComplete="off"
                                    />
                                    {selectedPartId && (
                                        <button
                                            type="button"
                                            className="pos-part-search-clear"
                                            onClick={clearPartSelection}
                                            aria-label="Hapus pilihan"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>

                                {showPartResults && partSearch.trim() && (
                                    <ul className="pos-part-search-results" role="listbox">
                                        {filteredSpareParts.length > 0 ? (
                                            filteredSpareParts.map((part) => (
                                                <li key={part.id}>
                                                    <button
                                                        type="button"
                                                        role="option"
                                                        className={`pos-part-search-option${selectedPartId === String(part.id) ? ' is-selected' : ''}`}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                        onClick={() => selectSparePart(part)}
                                                    >
                                                        <span className="pos-part-search-option-main">
                                                            <strong>{part.code}</strong> — {part.name}
                                                        </span>
                                                        <span className="pos-part-search-option-meta">
                                                            Stok: {part.stock} · {formatCurrency(part.sell_price)}
                                                        </span>
                                                    </button>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="pos-part-search-empty">Tidak ada spare part yang cocok.</li>
                                        )}
                                    </ul>
                                )}

                                {selectedPart && (
                                    <p className="pos-part-selected-hint">
                                        Terpilih: <strong>{selectedPart.code}</strong> — {selectedPart.name} ({formatCurrency(selectedPart.sell_price)}, stok {selectedPart.stock})
                                    </p>
                                )}
                            </div>

                            <div className="pos-add-item-actions">
                                <div className="pos-add-item-qty">
                                    <label className="form-label">Jumlah</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                                        min="1"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary pos-add-item-btn"
                                    disabled={!selectedPartId}
                                >
                                    <Plus size={16} /> Tambah
                                </button>
                            </div>
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

                <div className="pos-form-sidebar">
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
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
