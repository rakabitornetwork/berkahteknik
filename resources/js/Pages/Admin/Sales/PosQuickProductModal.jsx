import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PackagePlus } from 'lucide-react';
import { UNIT_OPTIONS } from '../../../constants/units';

const emptyForm = {
    code: '',
    barcode: '',
    name: '',
    product_type_id: '',
    unit: 'pcs',
    stock: 1,
    buy_price: 0,
    sell_price: 0,
    quantity: 1,
};

function firstError(errors) {
    const first = Object.values(errors || {}).flat()[0];
    return first ? String(first) : 'Gagal menambahkan produk.';
}

export default function PosQuickProductModal({
    open,
    onClose,
    onCreated,
    productTypes = [],
    initialQuery = '',
}) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;

        const q = String(initialQuery || '').trim();
        const looksLikeCode = q !== '' && !q.includes(' ') && q.length <= 24;
        setForm({
            ...emptyForm,
            code: looksLikeCode ? q.toUpperCase() : '',
            name: looksLikeCode ? '' : q,
        });
        setErrors({});
        setSaving(false);
    }, [open, initialQuery]);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    const setField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => {
            if (!prev[key]) return prev;
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        try {
            const { data } = await axios.post('/admin/sales/quick-products', {
                code: form.code,
                barcode: form.barcode,
                name: form.name,
                product_type_id: form.product_type_id || null,
                unit: form.unit,
                stock: Number(form.stock || 0),
                min_stock: 0,
                buy_price: Number(form.buy_price || 0),
                sell_price: Number(form.sell_price || 0),
            }, {
                headers: { Accept: 'application/json' },
            });

            onCreated(data.spare_part, form.quantity);
        } catch (error) {
            const payload = error.response?.data;
            if (payload?.errors) {
                setErrors(payload.errors);
            } else {
                setErrors({ message: [payload?.message || firstError(payload?.errors) || 'Gagal menambahkan produk.'] });
            }
            setSaving(false);
            return;
        }

        setSaving(false);
    };

    return (
        <div className="pos-modal-backdrop" onClick={onClose}>
            <form
                className="pos-modal pos-modal-product"
                onClick={(e) => e.stopPropagation()}
                onSubmit={submit}
                role="dialog"
                aria-labelledby="pos-quick-title"
            >
                <header>
                    <PackagePlus size={18} />
                    <h3 id="pos-quick-title">Tambah Cart</h3>
                </header>
                <p className="pos-quick-hint">
                    Tambah data produk baru ke master, lalu langsung masukkan ke keranjang POS.
                </p>

                <div className="pos-quick-grid">
                    <label className="pos-field">
                        <span>Kode Part</span>
                        <input
                            className="form-input"
                            value={form.code}
                            onChange={(e) => setField('code', e.target.value.toUpperCase())}
                            placeholder="Otomatis jika kosong"
                            autoFocus
                            style={{ fontFamily: 'ui-monospace, Consolas, monospace' }}
                        />
                        {errors.code && <small className="pos-quick-error">{errors.code[0]}</small>}
                    </label>
                    <label className="pos-field">
                        <span>Satuan</span>
                        <select className="form-input" value={form.unit} onChange={(e) => setField('unit', e.target.value)}>
                            {UNIT_OPTIONS.map((unit) => (
                                <option key={unit.value} value={unit.value}>{unit.label}</option>
                            ))}
                        </select>
                    </label>
                    <label className="pos-field pos-quick-span">
                        <span>Nama Produk <em>*</em></span>
                        <input
                            className="form-input"
                            value={form.name}
                            onChange={(e) => setField('name', e.target.value)}
                            placeholder="Contoh: Filter Kabin"
                            required
                        />
                        {errors.name && <small className="pos-quick-error">{errors.name[0]}</small>}
                    </label>
                    <label className="pos-field pos-quick-span">
                        <span>Barcode / QR</span>
                        <input
                            className="form-input"
                            value={form.barcode}
                            onChange={(e) => setField('barcode', e.target.value)}
                            placeholder="Opsional"
                        />
                        {errors.barcode && <small className="pos-quick-error">{errors.barcode[0]}</small>}
                    </label>
                    <label className="pos-field pos-quick-span">
                        <span>Kategori Produk</span>
                        <select
                            className="form-input"
                            value={form.product_type_id}
                            onChange={(e) => setField('product_type_id', e.target.value)}
                        >
                            <option value="">-- Tanpa kategori --</option>
                            {productTypes.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </label>
                    <label className="pos-field">
                        <span>Stok Awal <em>*</em></span>
                        <input
                            type="number"
                            min="1"
                            className="form-input"
                            value={form.stock}
                            onChange={(e) => setField('stock', e.target.value)}
                            required
                        />
                        {errors.stock && <small className="pos-quick-error">{errors.stock[0]}</small>}
                    </label>
                    <label className="pos-field">
                        <span>Qty ke Cart</span>
                        <input
                            type="number"
                            min="1"
                            className="form-input"
                            value={form.quantity}
                            onChange={(e) => setField('quantity', e.target.value)}
                        />
                    </label>
                    <label className="pos-field">
                        <span>Harga Beli (Rp)</span>
                        <input
                            type="number"
                            min="0"
                            className="form-input"
                            value={form.buy_price}
                            onChange={(e) => setField('buy_price', e.target.value)}
                        />
                    </label>
                    <label className="pos-field">
                        <span>Harga Jual (Rp) <em>*</em></span>
                        <input
                            type="number"
                            min="0"
                            className="form-input"
                            value={form.sell_price}
                            onChange={(e) => setField('sell_price', e.target.value)}
                            required
                        />
                        {errors.sell_price && <small className="pos-quick-error">{errors.sell_price[0]}</small>}
                    </label>
                </div>

                {errors.message && <p className="pos-error">{firstError(errors)}</p>}

                <footer>
                    <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>
                        Batal
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Menyimpan...' : 'Simpan & Tambah Cart'}
                    </button>
                </footer>
            </form>
        </div>
    );
}
