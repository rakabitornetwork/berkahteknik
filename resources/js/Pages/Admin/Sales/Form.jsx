import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Banknote,
    Calculator,
    Clock3,
    FolderOpen,
    ListOrdered,
    ScanLine,
    Search,
    Trash2,
    Wallet,
} from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { toast } from '../../../Components/Toast';
import { computeSaleTotals, lineTotal } from '../../../lib/saleTotals';
import PosTabs from './PosTabs';

const PENDING_KEY = 'berkahteknik_pos_pending';

function formatCurrency(amount) {
    return `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;
}

function formatMoney(amount) {
    return Number(amount || 0).toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function readPending() {
    try {
        const raw = localStorage.getItem(PENDING_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writePending(items) {
    localStorage.setItem(PENDING_KEY, JSON.stringify(items));
}

export default function SalesForm({ spareParts = [], customers = [], warehouses = [], cashiers = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const defaultWarehouse = warehouses.find((w) => w.is_default) || warehouses[0];
    const defaultCashier = cashiers.find((c) => c.id === user?.id) || cashiers[0];

    const { data, setData, post, processing, errors, reset, transform } = useForm({
        customer_name: '',
        payment_method: 'cash',
        amount_paid: '',
        discount_percent: '',
        discount_amount: '',
        tax_enabled: false,
        tax_percent: 11,
        items: [],
    });

    const [partSearch, setPartSearch] = useState('');
    const [showPartResults, setShowPartResults] = useState(false);
    const [selectedRow, setSelectedRow] = useState(-1);
    const [detailTab, setDetailTab] = useState('rincian');
    const [cashierId, setCashierId] = useState(defaultCashier ? String(defaultCashier.id) : '');
    const [warehouseId, setWarehouseId] = useState(defaultWarehouse ? String(defaultWarehouse.id) : '');
    const [notes, setNotes] = useState('');
    const [now, setNow] = useState(() => new Date());
    const [showPay, setShowPay] = useState(false);
    const [showPending, setShowPending] = useState(false);
    const [pendingList, setPendingList] = useState(() => readPending());
    const codeInputRef = useRef(null);

    const totals = computeSaleTotals(data);
    const { subtotal, discount_total: discount, tax_amount: tax, grand_total: grandTotal } = totals;
    const paid = Number(data.amount_paid || 0);
    const change = Math.max(0, paid - grandTotal);
    const isPaid = grandTotal > 0 && paid >= grandTotal;
    const hasItems = data.items.length > 0;
    const isDirty = hasItems
        || Boolean(data.customer_name)
        || Boolean(notes)
        || Number(data.discount_percent) > 0
        || Number(data.discount_amount) > 0
        || Boolean(data.tax_enabled);

    const filteredSpareParts = useMemo(() => {
        const q = partSearch.trim().toLowerCase();
        if (!q) return [];

        return spareParts.filter((part) => {
            const code = (part.code || '').toLowerCase();
            const barcode = (part.barcode || '').toLowerCase();
            const name = (part.name || '').toLowerCase();
            const desc = (part.description || '').toLowerCase();
            return code.includes(q) || barcode.includes(q) || name.includes(q) || desc.includes(q);
        });
    }, [partSearch, spareParts]);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const clearScan = () => {
        setPartSearch('');
        setShowPartResults(false);
        codeInputRef.current?.focus();
    };

    const addPartToCart = (part, qty = 1) => {
        const amount = Math.max(1, parseInt(qty, 10) || 1);
        const existingItem = data.items.find((item) => item.spare_part_id === part.id);
        const currentQty = existingItem ? existingItem.quantity : 0;

        if (currentQty + amount > part.stock) {
            toast.error(`Stok ${part.name} tidak mencukupi. Sisa stok: ${part.stock}`);
            return false;
        }

        let nextItems = [...data.items];
        if (existingItem) {
            nextItems = nextItems.map((item) => (
                item.spare_part_id === part.id
                    ? { ...item, quantity: item.quantity + amount }
                    : item
            ));
        } else {
            nextItems.push({
                spare_part_id: part.id,
                code: part.code,
                name: part.name,
                unit: part.unit || 'pcs',
                unit_price: part.sell_price,
                quantity: amount,
                discount_percent: '',
            });
        }

        setData('items', nextItems);
        setSelectedRow(nextItems.findIndex((item) => item.spare_part_id === part.id));
        clearScan();
        return true;
    };

    const resolvePartFromQuery = () => {
        const q = partSearch.trim().toLowerCase();
        if (!q) return null;

        const exact = spareParts.find((part) => {
            const code = (part.code || '').toLowerCase();
            const barcode = (part.barcode || '').toLowerCase();
            return code === q || barcode === q;
        });

        if (exact) return exact;
        if (filteredSpareParts.length === 1) return filteredSpareParts[0];
        return null;
    };

    const handleScanSubmit = (e) => {
        e.preventDefault();
        const part = resolvePartFromQuery();
        if (part) {
            addPartToCart(part);
            return;
        }
        if (partSearch.trim()) {
            setShowPartResults(true);
            toast.error('Kode item tidak ditemukan. Pilih dari daftar pencarian.');
        }
    };

    const handleRemoveSelected = () => {
        if (selectedRow < 0) {
            toast.error('Pilih baris yang ingin dihapus.');
            return;
        }
        const nextItems = data.items.filter((_, index) => index !== selectedRow);
        setData('items', nextItems);
        setSelectedRow(nextItems.length ? Math.min(selectedRow, nextItems.length - 1) : -1);
    };

    const handleQtyChange = (index, value) => {
        if (value === '' || value === '0') {
            setData('items', data.items.map((row, i) => (i === index ? { ...row, quantity: '' } : row)));
            return;
        }

        const nextQty = parseInt(value, 10);
        if (Number.isNaN(nextQty) || nextQty < 0) return;

        const item = data.items[index];
        const part = spareParts.find((p) => p.id === item.spare_part_id);
        if (part && nextQty > part.stock) {
            toast.error(`Stok ${item.name} tidak mencukupi. Sisa stok: ${part.stock}`);
            return;
        }
        setData('items', data.items.map((row, i) => (i === index ? { ...row, quantity: nextQty } : row)));
    };

    const handleQtyBlur = (index) => {
        const qty = parseInt(data.items[index]?.quantity, 10);
        if (!qty || qty < 1) {
            setData('items', data.items.map((row, i) => (i === index ? { ...row, quantity: 1 } : row)));
        }
    };

    const handleLineDiscountChange = (index, value) => {
        setData('items', data.items.map((row, i) => (
            i === index ? { ...row, discount_percent: value } : row
        )));
    };

    const parseOptionalNumber = (value) => {
        if (value === '' || value === null || value === undefined) return '';
        return value;
    };

    const clearZeroValue = (value) => (
        value === '' || value === null || value === undefined || Number(value) === 0 ? '' : value
    );

    const resetTransaction = () => {
        reset();
        setData({
            customer_name: '',
            payment_method: 'cash',
            amount_paid: '',
            discount_percent: '',
            discount_amount: '',
            tax_enabled: false,
            tax_percent: 11,
            items: [],
        });
        setNotes('');
        setSelectedRow(-1);
        setShowPay(false);
        clearScan();
    };

    const handleNewTransaction = () => {
        if (isDirty && !confirm('Buat transaksi baru? Data yang belum disimpan akan hilang.')) return;
        resetTransaction();
    };

    const handleCancel = () => {
        if (isDirty && !confirm('Batalkan transaksi ini?')) return;
        router.visit('/admin/sales');
    };

    const submitSale = () => {
        if (!hasItems) {
            toast.error('Tambahkan minimal 1 barang.');
            return;
        }

        transform((formData) => ({
            customer_name: !formData.customer_name || formData.customer_name.trim().toUpperCase() === 'UMUM'
                ? 'Pelanggan Umum'
                : formData.customer_name,
            payment_method: formData.payment_method,
            amount_paid: formData.amount_paid,
            discount_percent: Number(formData.discount_percent || 0),
            discount_amount: Number(formData.discount_amount || 0),
            tax_enabled: Boolean(formData.tax_enabled),
            tax_percent: Number(formData.tax_percent || 0),
            items: formData.items.map(({ spare_part_id, quantity, discount_percent }) => ({
                spare_part_id,
                quantity: Math.max(1, parseInt(quantity, 10) || 1),
                discount_percent: Number(discount_percent || 0),
            })),
        }));
        post('/admin/sales');
    };

    const openPay = () => {
        if (!hasItems) {
            toast.error('Tambahkan barang sebelum membayar.');
            return;
        }
        if (!data.amount_paid) {
            setData('amount_paid', String(grandTotal));
        }
        setShowPay(true);
    };

    const holdPending = () => {
        if (!hasItems) {
            toast.error('Tidak ada barang untuk disimpan ke pending.');
            return;
        }

        const draft = {
            id: `${Date.now()}`,
            saved_at: new Date().toISOString(),
            customer_name: data.customer_name,
            payment_method: data.payment_method,
            discount_percent: data.discount_percent,
            discount_amount: data.discount_amount,
            tax_enabled: data.tax_enabled,
            tax_percent: data.tax_percent,
            items: data.items,
            notes,
            cashier_id: cashierId,
            warehouse_id: warehouseId,
        };
        const next = [draft, ...readPending()];
        writePending(next);
        setPendingList(next);
        resetTransaction();
        toast.success('Transaksi disimpan ke daftar pending.');
    };

    const restorePending = (draft) => {
        setData({
            customer_name: draft.customer_name || '',
            payment_method: draft.payment_method || 'cash',
            amount_paid: '',
            discount_percent: draft.discount_percent ?? '',
            discount_amount: draft.discount_amount ?? '',
            tax_enabled: Boolean(draft.tax_enabled),
            tax_percent: draft.tax_percent ?? 11,
            items: draft.items || [],
        });
        setNotes(draft.notes || '');
        setCashierId(draft.cashier_id || cashierId);
        setWarehouseId(draft.warehouse_id || warehouseId);
        setSelectedRow((draft.items || []).length ? 0 : -1);
        setShowPending(false);
        toast.success('Transaksi pending dimuat ke kasir.');
    };

    const deletePending = (id) => {
        const next = readPending().filter((item) => item.id !== id);
        writePending(next);
        setPendingList(next);
    };

    const showSelectedPrice = () => {
        const item = selectedRow >= 0 ? data.items[selectedRow] : null;
        if (!item) {
            toast.error('Pilih baris barang untuk melihat harga.');
            return;
        }
        toast.success(`${item.code || item.name}: ${formatCurrency(item.unit_price)}`);
    };

    const actionsRef = useRef({});
    actionsRef.current = { holdPending, openPay, submitSale, showPay };

    useEffect(() => {
        const onKey = (event) => {
            const actions = actionsRef.current;
            if (event.key === 'F5') {
                event.preventDefault();
                actions.holdPending();
            }
            if (event.key === 'F6') {
                event.preventDefault();
                setPendingList(readPending());
                setShowPending(true);
            }
            if (event.key === 'End' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
                event.preventDefault();
                if (actions.showPay) {
                    actions.submitSale();
                } else {
                    actions.openPay();
                }
            }
        };

        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, []);

    return (
        <AdminLayout title="Kasir">
            <Head title="Kasir Penjualan" />

            <div className="pos-desk">
                <PosTabs active="kasir" />

                <section className="pos-desk-card">
                    <header className="pos-header">
                        <div className="pos-header-fields">
                            <label className="pos-field">
                                <span>No. Transaksi</span>
                                <input className="form-input" value="Otomatis saat simpan" readOnly />
                            </label>
                            <label className="pos-field pos-field-date">
                                <span>Tanggal</span>
                                <div className="pos-date-row">
                                    <input
                                        className="form-input"
                                        value={now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        readOnly
                                    />
                                    <span className="pos-time">{now.toLocaleTimeString('id-ID')}</span>
                                </div>
                            </label>
                            <label className="pos-field pos-field-customer">
                                <span>Pelanggan</span>
                                <input
                                    className="form-input"
                                    list="pos-customer-list"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    placeholder="UMUM"
                                />
                                <datalist id="pos-customer-list">
                                    <option value="UMUM" />
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.name}>
                                            {customer.phone || ''}
                                        </option>
                                    ))}
                                </datalist>
                            </label>
                            <div className="pos-user-pills">
                                <span>
                                    <small>Gudang</small>
                                    {defaultWarehouse?.code || 'GUDANG'}
                                </span>
                                <span>
                                    <small>Kasir</small>
                                    {user?.name || 'Kasir'}
                                </span>
                            </div>
                        </div>

                        <div className="pos-grand" aria-live="polite">
                            <div className="pos-grand-meta">
                                <small>Total ditagih</small>
                                <span>{data.items.length} item</span>
                            </div>
                            <strong>
                                <em>Rp</em>
                                {formatMoney(grandTotal)}
                            </strong>
                        </div>
                    </header>

                    <form className="pos-scan" onSubmit={handleScanSubmit}>
                        <label className="pos-field pos-field-code">
                            <span>Kode / Nama Item</span>
                            <div className="pos-part-search-wrap">
                                <div className="pos-part-search-field">
                                    <Search size={18} className="pos-part-search-icon" aria-hidden />
                                    <input
                                        ref={codeInputRef}
                                        type="text"
                                        className="form-input pos-part-search-input"
                                        placeholder="Scan barcode atau ketik kode / nama barang"
                                        value={partSearch}
                                        onChange={(e) => {
                                            setPartSearch(e.target.value);
                                            setShowPartResults(true);
                                        }}
                                        onFocus={() => partSearch.trim() && setShowPartResults(true)}
                                        onBlur={() => setTimeout(() => setShowPartResults(false), 150)}
                                        autoComplete="off"
                                        autoFocus
                                    />
                                    <span className="pos-scan-kbd" aria-hidden>
                                        Enter
                                    </span>
                                </div>
                                {showPartResults && partSearch.trim() && (
                                    <ul className="pos-part-search-results" role="listbox">
                                        {filteredSpareParts.length > 0 ? (
                                            filteredSpareParts.map((part) => (
                                                <li key={part.id}>
                                                    <button
                                                        type="button"
                                                        className="pos-part-search-option"
                                                        onMouseDown={(e) => e.preventDefault()}
                                                        onClick={() => addPartToCart(part)}
                                                    >
                                                        <span className="pos-part-search-option-main">
                                                            <strong>{part.code}</strong> — {part.name}
                                                        </span>
                                                        <span className="pos-part-search-option-meta">
                                                            Stok {part.stock} · {formatCurrency(part.sell_price)}
                                                            {part.unit ? ` · ${part.unit}` : ''}
                                                        </span>
                                                    </button>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="pos-part-search-empty">Tidak ada spare part yang cocok.</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        </label>
                    </form>

                    <div className="pos-grid-wrap">
                        <table className="pos-grid">
                            <colgroup>
                                <col className="pos-col-no" />
                                <col className="pos-col-code" />
                                <col className="pos-col-name" />
                                <col className="pos-col-qty" />
                                <col className="pos-col-unit" />
                                <col className="pos-col-price" />
                                <col className="pos-col-disc" />
                                <col className="pos-col-total" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Kode</th>
                                    <th>Keterangan</th>
                                    <th>Qty</th>
                                    <th>Satuan</th>
                                    <th>Harga</th>
                                    <th>Pot %</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.length === 0 ? (
                                    <tr className="pos-grid-empty">
                                        <td colSpan="8">
                                            <div className="pos-empty">
                                                <ScanLine size={28} aria-hidden />
                                                <strong>Siap menerima barang</strong>
                                                <p>Scan barcode atau ketik kode / nama, lalu tekan Enter.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    data.items.map((item, index) => (
                                        <tr
                                            key={`${item.spare_part_id}-${index}`}
                                            className={selectedRow === index ? 'is-selected' : ''}
                                            onClick={() => setSelectedRow(index)}
                                        >
                                            <td className="is-idx">{index + 1}</td>
                                            <td className="is-code">{item.code || '-'}</td>
                                            <td className="is-name">{item.name}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="pos-qty-input"
                                                    value={item.quantity ?? ''}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => handleQtyChange(index, e.target.value)}
                                                    onBlur={() => handleQtyBlur(index)}
                                                />
                                            </td>
                                            <td>{item.unit || 'pcs'}</td>
                                            <td className="is-num">{formatCurrency(item.unit_price)}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    className="pos-qty-input"
                                                    value={item.discount_percent ?? ''}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => handleLineDiscountChange(index, e.target.value)}
                                                    onBlur={(e) => handleLineDiscountChange(index, clearZeroValue(e.target.value))}
                                                />
                                            </td>
                                            <td className="is-num">{formatCurrency(lineTotal(item))}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pos-bottom">
                        <div className="pos-detail">
                            <div className="pos-detail-tabs">
                                <button
                                    type="button"
                                    className={detailTab === 'rincian' ? 'is-active' : ''}
                                    onClick={() => setDetailTab('rincian')}
                                >
                                    Rincian
                                </button>
                                <button
                                    type="button"
                                    className={detailTab === 'potongan' ? 'is-active' : ''}
                                    onClick={() => setDetailTab('potongan')}
                                >
                                    Potongan
                                </button>
                            </div>

                            {detailTab === 'rincian' ? (
                                <div className="pos-detail-body">
                                    <div className="pos-detail-actions">
                                        <button type="button" className="btn btn-outline" onClick={handleRemoveSelected} disabled={selectedRow < 0}>
                                            <Trash2 size={14} /> Hapus Detail
                                        </button>
                                        <button type="button" className="btn btn-outline" onClick={showSelectedPrice}>
                                            Lihat Harga
                                        </button>
                                    </div>

                                    <div className="pos-detail-fields">
                                        <label className="pos-field">
                                            <span>Sales</span>
                                            <select className="form-input" value={cashierId} onChange={(e) => setCashierId(e.target.value)}>
                                                {cashiers.length === 0 && <option value="">{user?.name || 'Kasir aktif'}</option>}
                                                {cashiers.map((cashier) => (
                                                    <option key={cashier.id} value={cashier.id}>{cashier.name}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <label className="pos-field">
                                            <span>Keluar dari</span>
                                            <select className="form-input" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}>
                                                {warehouses.length === 0 && <option value="">Gudang utama</option>}
                                                {warehouses.map((warehouse) => (
                                                    <option key={warehouse.id} value={warehouse.id}>
                                                        {warehouse.code} — {warehouse.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <label className="pos-field pos-field-notes">
                                            <span>Keterangan</span>
                                            <input
                                                className="form-input"
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Catatan transaksi"
                                            />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="pos-detail-body pos-adjust-grid">
                                    <label className="pos-field">
                                        <span>Potongan (%)</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            className="form-input"
                                            value={data.discount_percent ?? ''}
                                            onChange={(e) => setData('discount_percent', parseOptionalNumber(e.target.value))}
                                            onBlur={(e) => setData('discount_percent', clearZeroValue(e.target.value))}
                                        />
                                    </label>
                                    <label className="pos-field">
                                        <span>Potongan (Rp)</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="100"
                                            className="form-input"
                                            value={data.discount_amount ?? ''}
                                            onChange={(e) => setData('discount_amount', parseOptionalNumber(e.target.value))}
                                            onBlur={(e) => setData('discount_amount', clearZeroValue(e.target.value))}
                                        />
                                    </label>
                                    <label className="pos-field pos-tax-toggle">
                                        <span>Pajak</span>
                                        <label className="pos-check">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(data.tax_enabled)}
                                                onChange={(e) => setData('tax_enabled', e.target.checked)}
                                            />
                                            Kenakan pajak
                                        </label>
                                    </label>
                                    <label className="pos-field">
                                        <span>Pajak (%)</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            className="form-input"
                                            value={data.tax_percent ?? ''}
                                            disabled={!data.tax_enabled}
                                            onChange={(e) => setData('tax_percent', parseOptionalNumber(e.target.value))}
                                            onBlur={(e) => setData('tax_percent', clearZeroValue(e.target.value))}
                                        />
                                    </label>
                                    <p className="pos-adjust-hint">
                                        Potongan dihitung setelah diskon per barang. Pajak dihitung dari subtotal setelah potongan transaksi.
                                    </p>
                                </div>
                            )}
                        </div>

                        <aside className="pos-summary">
                            <div className="pos-summary-head">Ringkasan</div>
                            <div className="pos-summary-row">
                                <span>Subtotal</span>
                                <strong>{formatMoney(subtotal)}</strong>
                            </div>
                            <button type="button" className="pos-summary-row is-button" onClick={() => setDetailTab('potongan')}>
                                <span>Potongan</span>
                                <span className="pos-summary-value">
                                    <strong>{formatMoney(discount)}</strong>
                                    <Calculator size={14} />
                                </span>
                            </button>
                            <button type="button" className="pos-summary-row is-button" onClick={() => setDetailTab('potongan')}>
                                <span>Pajak{data.tax_enabled ? ` ${Number(data.tax_percent || 0)}%` : ''}</span>
                                <span className="pos-summary-value">
                                    <strong>{formatMoney(tax)}</strong>
                                    <Calculator size={14} />
                                </span>
                            </button>
                            <div className="pos-summary-row is-total">
                                <span>Total</span>
                                <strong>{formatMoney(grandTotal)}</strong>
                            </div>
                        </aside>
                    </div>
                </section>

                <footer className="pos-actions">
                    <div className="pos-actions-group">
                        <button type="button" className="btn btn-outline" onClick={handleNewTransaction} disabled={!isDirty}>
                            Baru
                        </button>
                        <button type="button" className="btn btn-outline" onClick={submitSale} disabled={processing || !hasItems}>
                            Simpan
                        </button>
                        <button type="button" className="btn btn-outline" onClick={handleCancel}>
                            Batal
                        </button>
                        <button type="button" className="btn btn-outline" disabled title="Cetak tersedia setelah transaksi disimpan">
                            Cetak
                        </button>
                    </div>
                    <div className="pos-actions-group">
                        <button type="button" className="btn btn-outline" onClick={holdPending} disabled={!hasItems}>
                            <Clock3 size={16} /> Pending
                            <kbd>F5</kbd>
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => {
                                setPendingList(readPending());
                                setShowPending(true);
                            }}
                        >
                            <ListOrdered size={16} /> Daftar Pending
                            {pendingList.length > 0 && <span className="pos-badge">{pendingList.length}</span>}
                            <kbd>F6</kbd>
                        </button>
                    </div>
                    <div className="pos-actions-group is-pay">
                        <button type="button" className="btn btn-primary pos-pay-btn" onClick={openPay} disabled={processing || !hasItems}>
                            <Banknote size={18} /> Bayar
                            <kbd>End</kbd>
                        </button>
                    </div>
                </footer>

                {(errors.message || errors.items) && (
                    <p className="pos-error">
                        {errors.message || 'Tambahkan minimal 1 barang.'}
                    </p>
                )}
            </div>

            {showPay && (
                <div className="pos-modal-backdrop" onClick={() => setShowPay(false)}>
                    <div className="pos-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="pos-pay-title">
                        <header>
                            <Wallet size={18} />
                            <h3 id="pos-pay-title">Pembayaran</h3>
                        </header>
                        <div className="pos-pay-total">
                            <span>Total ditagih</span>
                            <strong>{formatCurrency(grandTotal)}</strong>
                        </div>
                        <label className="pos-field">
                            <span>Metode Pembayaran</span>
                            <select className="form-input" value={data.payment_method} onChange={(e) => setData('payment_method', e.target.value)}>
                                <option value="cash">Tunai (Cash)</option>
                                <option value="transfer">Transfer Bank</option>
                                <option value="qris">QRIS</option>
                            </select>
                        </label>
                        <label className="pos-field">
                            <span>Uang Dibayar</span>
                            <input
                                type="number"
                                className="form-input"
                                min="0"
                                value={data.amount_paid ?? ''}
                                onChange={(e) => setData('amount_paid', parseOptionalNumber(e.target.value))}
                                onBlur={(e) => setData('amount_paid', clearZeroValue(e.target.value))}
                                autoFocus
                            />
                        </label>
                        <div className={`pos-pay-status ${isPaid ? 'is-paid' : 'is-unpaid'}`}>
                            {isPaid ? 'LUNAS' : 'BELUM LUNAS'}
                        </div>
                        <div className="pos-pay-change">
                            <span>Kembalian</span>
                            <strong>{formatCurrency(change)}</strong>
                        </div>
                        <footer>
                            <button type="button" className="btn btn-outline" onClick={() => setShowPay(false)}>Tutup</button>
                            <button type="button" className="btn btn-primary" onClick={submitSale} disabled={processing}>
                                Proses Pembayaran
                            </button>
                        </footer>
                    </div>
                </div>
            )}

            {showPending && (
                <div className="pos-modal-backdrop" onClick={() => setShowPending(false)}>
                    <div className="pos-modal pos-modal-wide" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="pos-pending-title">
                        <header>
                            <FolderOpen size={18} />
                            <h3 id="pos-pending-title">Daftar Pending</h3>
                        </header>
                        {pendingList.length === 0 ? (
                            <p className="pos-detail-empty">Tidak ada transaksi pending.</p>
                        ) : (
                            <table className="pos-grid">
                                <thead>
                                    <tr>
                                        <th>Waktu</th>
                                        <th>Pelanggan</th>
                                        <th>Item</th>
                                        <th>Total</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingList.map((draft) => {
                                        const total = computeSaleTotals(draft).grand_total;
                                        return (
                                            <tr key={draft.id}>
                                                <td>{new Date(draft.saved_at).toLocaleString('id-ID')}</td>
                                                <td>{draft.customer_name || 'UMUM'}</td>
                                                <td>{(draft.items || []).length}</td>
                                                <td className="is-num">{formatCurrency(total)}</td>
                                                <td>
                                                    <div className="pos-pending-actions">
                                                        <button type="button" className="btn btn-primary" onClick={() => restorePending(draft)}>Muat</button>
                                                        <button type="button" className="btn btn-outline" onClick={() => deletePending(draft.id)}>Hapus</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                        <footer>
                            <button type="button" className="btn btn-outline" onClick={() => setShowPending(false)}>Tutup</button>
                        </footer>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
