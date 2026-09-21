import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    Banknote,
    PackagePlus,
    ScanLine,
    Search,
    UserRoundSearch,
    Wallet,
} from 'lucide-react';
import AdminLayout from '../../../../Layouts/AdminLayout';
import { toast } from '../../../../Components/Toast';
import { computeSaleTotals, lineTotal } from '../../../../lib/saleTotals';
import PosQuickProductModal from '../PosQuickProductModal';
import PosTabs from '../PosTabs';

function formatCurrency(amount) {
    return `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;
}

function formatMoney(amount) {
    return Number(amount || 0).toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function toLocalInput(date) {
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const PAY_METHODS = [
    { id: 'cash', label: 'Tunai' },
    { id: 'bank', label: 'Bank' },
    { id: 'emoney', label: 'E-Money' },
    { id: 'multi', label: 'Multi' },
    { id: 'credit', label: 'Hutang' },
];

const SPLIT_METHODS = [
    { id: 'cash', label: 'Tunai' },
    { id: 'bank', label: 'Bank' },
    { id: 'emoney', label: 'E-Money' },
];

export default function PosV2Kasir({ spareParts = [], productTypes = [], customers = [], warehouses = [], cashiers = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const defaultWarehouse = warehouses.find((w) => w.is_default) || warehouses[0];
    const defaultCashier = cashiers.find((c) => c.id === user?.id) || cashiers[0];

    const { data, setData, post, processing, errors, transform } = useForm({
        customer_name: '',
        customer_id: '',
        sold_at: toLocalInput(new Date()),
        payment_method: 'cash',
        amount_paid: '',
        discount_percent: '',
        discount_amount: '',
        tax_enabled: false,
        tax_percent: 11,
        notes: '',
        cashier_id: defaultCashier ? String(defaultCashier.id) : '',
        warehouse_id: defaultWarehouse ? String(defaultWarehouse.id) : '',
        items: [],
        payments: [
            { method: 'cash', amount: '' },
            { method: 'bank', amount: '' },
        ],
    });

    const [partSearch, setPartSearch] = useState('');
    const [showPartResults, setShowPartResults] = useState(false);
    const [catalog, setCatalog] = useState(spareParts);
    const [customerList, setCustomerList] = useState(customers);
    const [selectedRow, setSelectedRow] = useState(-1);
    const [showPay, setShowPay] = useState(false);
    const [showCustomer, setShowCustomer] = useState(false);
    const [showQuickProduct, setShowQuickProduct] = useState(false);
    const [customerQuery, setCustomerQuery] = useState('');
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });
    const [savingCustomer, setSavingCustomer] = useState(false);

    const codeInputRef = useRef(null);
    const discountRef = useRef(null);
    const taxRef = useRef(null);
    const customerSearchRef = useRef(null);

    const totals = computeSaleTotals(data);
    const { subtotal, discount_total: discount, tax_amount: tax, grand_total: grandTotal } = totals;
    const paid = Number(data.amount_paid || 0);
    const multiPaid = (data.payments || []).reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const effectivePaid = data.payment_method === 'multi' ? multiPaid : paid;
    const change = Math.max(0, effectivePaid - grandTotal);
    const isPaid = grandTotal > 0 && effectivePaid >= grandTotal;
    const hasItems = data.items.length > 0;
    const selectedCustomer = customerList.find((c) => String(c.id) === String(data.customer_id));

    const filteredSpareParts = useMemo(() => {
        const q = partSearch.trim().toLowerCase();
        const matched = !q ? catalog : catalog.filter((part) => {
            const code = (part.code || '').toLowerCase();
            const barcode = (part.barcode || '').toLowerCase();
            const name = (part.name || '').toLowerCase();
            const desc = (part.description || '').toLowerCase();
            return code.includes(q) || barcode.includes(q) || name.includes(q) || desc.includes(q);
        });
        return matched.slice(0, q ? 60 : 40);
    }, [partSearch, catalog]);

    const soldDate = (data.sold_at || '').slice(0, 10);
    const soldTime = (data.sold_at || '').slice(11, 16);
    const ghostRows = Math.max(0, 10 - data.items.length);

    const filteredCustomers = useMemo(() => {
        const q = customerQuery.trim().toLowerCase();
        if (!q) return customerList;
        return customerList.filter((customer) => {
            return (customer.name || '').toLowerCase().includes(q)
                || (customer.phone || '').toLowerCase().includes(q);
        });
    }, [customerQuery, customerList]);

    useEffect(() => {
        setCatalog(spareParts);
    }, [spareParts]);

    useEffect(() => {
        setCustomerList(customers);
    }, [customers]);

    const clearScan = () => {
        setPartSearch('');
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
        const exact = catalog.find((part) => {
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
            toast.error('Kode item tidak ditemukan. Pilih dari daftar atau tambah produk.');
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
        const part = catalog.find((p) => p.id === item.spare_part_id);
        if (part && nextQty > part.stock) {
            toast.error(`Stok ${item.name} tidak mencukupi. Sisa stok: ${part.stock}`);
            return;
        }
        setData('items', data.items.map((row, i) => (i === index ? { ...row, quantity: nextQty } : row)));
    };

    const handleLineDiscountChange = (index, value) => {
        setData('items', data.items.map((row, i) => (
            i === index ? { ...row, discount_percent: value } : row
        )));
    };

    const handleQuickProductCreated = (part, qty) => {
        setCatalog((prev) => (prev.some((item) => item.id === part.id) ? prev : [...prev, part]));
        setShowQuickProduct(false);
        const added = addPartToCart(part, qty);
        if (added) {
            toast.success(`${part.name} tersimpan di master data dan masuk keranjang.`);
        }
    };

    const selectCustomer = (customer) => {
        setData('customer_id', customer ? String(customer.id) : '');
        setData('customer_name', customer ? customer.name : '');
        setShowCustomer(false);
        setCustomerQuery('');
        codeInputRef.current?.focus();
    };

    const handleCreateCustomer = async (e) => {
        e.preventDefault();
        if (!newCustomer.name.trim()) {
            toast.error('Nama pelanggan wajib diisi.');
            return;
        }
        setSavingCustomer(true);
        try {
            const { data: payload } = await axios.post('/admin/sales/v2/customers', {
                name: newCustomer.name,
                phone: newCustomer.phone || null,
            }, { headers: { Accept: 'application/json' } });
            setCustomerList((prev) => [payload.customer, ...prev]);
            selectCustomer(payload.customer);
            setNewCustomer({ name: '', phone: '' });
            toast.success('Pelanggan ditambahkan.');
        } catch (error) {
            const message = error.response?.data?.message
                || Object.values(error.response?.data?.errors || {}).flat()[0]
                || 'Gagal menambah pelanggan.';
            toast.error(String(message));
        } finally {
            setSavingCustomer(false);
        }
    };

    const openPay = () => {
        if (!hasItems) {
            toast.error('Tambahkan barang sebelum membayar.');
            return;
        }
        if (data.payment_method !== 'credit' && data.payment_method !== 'multi' && !data.amount_paid) {
            setData('amount_paid', String(grandTotal));
        }
        setShowPay(true);
    };

    const submitSale = () => {
        if (!hasItems) {
            toast.error('Tambahkan minimal 1 barang.');
            return;
        }
        if (data.payment_method === 'credit' && !data.customer_id) {
            toast.error('Pilih pelanggan terdaftar untuk transaksi hutang.');
            setShowPay(false);
            setShowCustomer(true);
            return;
        }

        transform((formData) => ({
            customer_name: formData.customer_name,
            customer_id: formData.customer_id || null,
            sold_at: formData.sold_at,
            notes: formData.notes,
            cashier_id: formData.cashier_id || null,
            warehouse_id: formData.warehouse_id || null,
            payment_method: formData.payment_method,
            amount_paid: formData.payment_method === 'multi'
                ? (formData.payments || []).reduce((sum, row) => sum + Number(row.amount || 0), 0)
                : Number(formData.amount_paid || 0),
            discount_percent: Number(formData.discount_percent || 0),
            discount_amount: Number(formData.discount_amount || 0),
            tax_enabled: Boolean(formData.tax_enabled),
            tax_percent: Number(formData.tax_percent || 0),
            payments: formData.payment_method === 'multi' ? formData.payments : undefined,
            items: formData.items.map(({ spare_part_id, quantity, discount_percent }) => ({
                spare_part_id,
                quantity: Math.max(1, parseInt(quantity, 10) || 1),
                discount_percent: Number(discount_percent || 0),
            })),
        }));
        post('/admin/sales/v2');
    };

    const actionsRef = useRef({});
    actionsRef.current = {
        openPay,
        submitSale,
        showPay,
        showCustomer,
        handleRemoveSelected,
        openCustomer: () => {
            setShowCustomer(true);
            setTimeout(() => customerSearchRef.current?.focus(), 50);
        },
        focusSearch: () => {
            setShowPartResults(true);
            codeInputRef.current?.focus();
        },
        focusDiscount: () => discountRef.current?.focus(),
        focusTax: () => {
            setData('tax_enabled', true);
            setTimeout(() => taxRef.current?.focus(), 30);
        },
    };

    useEffect(() => {
        const onKey = (event) => {
            const actions = actionsRef.current;
            const tag = event.target?.tagName;
            if (event.key === 'F5') {
                event.preventDefault();
                if (!actions.showPay && !actions.showCustomer) actions.focusSearch();
            }
            if (event.key === 'F1') {
                event.preventDefault();
                if (!actions.showPay) actions.openCustomer();
            }
            if (event.key === 'F3') {
                event.preventDefault();
                if (!actions.showPay && !actions.showCustomer) actions.focusDiscount();
            }
            if (event.key === 'F4') {
                event.preventDefault();
                if (!actions.showPay && !actions.showCustomer) actions.focusTax();
            }
            if (event.key === 'F6') {
                event.preventDefault();
                if (actions.showPay) actions.submitSale();
                else actions.openPay();
            }
            if (event.key === 'Delete' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
                event.preventDefault();
                actions.handleRemoveSelected();
            }
        };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, [setData]);

    useEffect(() => {
        if (showCustomer) {
            setTimeout(() => customerSearchRef.current?.focus(), 40);
        }
    }, [showCustomer]);

    return (
        <AdminLayout title="Kasir v2">
            <Head title="Kasir POS v2" />

            <div className="pos-desk pos-v2">
                <PosTabs active="kasir-v2" />

                <section className="pos-desk-card pos-v2-card">
                    <div className="pos-v2-body">
                        <div className="pos-v2-work">
                            <form className="pos-v2-scan" onSubmit={handleScanSubmit}>
                                <label className="pos-field pos-v2-scan-code">
                                    <span>Kode / Nama Item</span>
                                    <div className="pos-part-search-wrap">
                                        <div className="pos-part-search-field">
                                            <Search size={18} className="pos-part-search-icon" aria-hidden />
                                            <input
                                                ref={codeInputRef}
                                                type="text"
                                                className="form-input pos-part-search-input pos-v2-search-input"
                                                placeholder="Scan barcode, cari nama, atau pilih dari daftar"
                                                value={partSearch}
                                                onChange={(e) => {
                                                    setPartSearch(e.target.value);
                                                    setShowPartResults(true);
                                                }}
                                                onFocus={() => setShowPartResults(true)}
                                                onBlur={() => setTimeout(() => setShowPartResults(false), 160)}
                                                autoComplete="off"
                                                autoFocus
                                            />
                                            <span className="pos-v2-search-kbd" aria-hidden>F5</span>
                                            <button
                                                type="button"
                                                className="btn btn-primary pos-v2-add-btn"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => setShowQuickProduct(true)}
                                            >
                                                <PackagePlus size={15} /> Tambah
                                            </button>
                                        </div>
                                        {showPartResults && (
                                            <ul className="pos-part-search-results pos-v2-search-results" role="listbox">
                                                {filteredSpareParts.length > 0 ? (
                                                    filteredSpareParts.map((part) => (
                                                        <li key={part.id}>
                                                            <button
                                                                type="button"
                                                                className={`pos-part-search-option${part.stock <= 0 ? ' is-disabled' : ''}`}
                                                                disabled={part.stock <= 0}
                                                                onMouseDown={(e) => e.preventDefault()}
                                                                onClick={() => part.stock > 0 && addPartToCart(part)}
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
                                                    <li className="pos-part-search-empty">
                                                        Tidak ada produk yang cocok.
                                                        <button
                                                            type="button"
                                                            className="pos-part-search-create"
                                                            onMouseDown={(e) => e.preventDefault()}
                                                            onClick={() => setShowQuickProduct(true)}
                                                        >
                                                            Tambah produk baru
                                                        </button>
                                                    </li>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </label>
                            </form>

                            <div className="pos-grid-wrap pos-v2-grid-wrap">
                                <table className="pos-grid pos-v2-grid">
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
                                            <th>Nama Item</th>
                                            <th>Qty</th>
                                            <th>Satuan</th>
                                            <th>Harga</th>
                                            <th>Disc %</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.items.map((item, index) => (
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
                                                    />
                                                </td>
                                                <td className="is-num">{formatCurrency(lineTotal(item))}</td>
                                            </tr>
                                        ))}
                                        {Array.from({ length: ghostRows }).map((_, index) => (
                                            <tr
                                                key={`ghost-${index}`}
                                                className="pos-v2-ghost-row"
                                                onClick={() => {
                                                    setShowPartResults(true);
                                                    codeInputRef.current?.focus();
                                                }}
                                            >
                                                <td className="is-idx">{data.items.length + index + 1}</td>
                                                <td colSpan="7">
                                                    {data.items.length === 0 && index === 0 ? (
                                                        <span className="pos-v2-ghost-hint">
                                                            <ScanLine size={14} aria-hidden /> Scan, cari nama, atau pilih dari daftar (F5)
                                                        </span>
                                                    ) : null}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <aside className="pos-v2-side">
                            <div className="pos-v2-hero-total" aria-live="polite">
                                <span>Total</span>
                                <strong>{formatCurrency(grandTotal)}</strong>
                            </div>

                            <div className="pos-v2-side-block">
                                <label className="pos-v2-side-row">
                                    <span>No. Transaksi</span>
                                    <input className="form-input" value="Otomatis" readOnly />
                                </label>
                                <div className="pos-v2-side-row">
                                    <span>Tanggal</span>
                                    <div className="pos-v2-datetime">
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={soldDate}
                                            onChange={(e) => setData('sold_at', `${e.target.value}T${soldTime || '00:00'}`)}
                                        />
                                        <input
                                            type="time"
                                            className="form-input"
                                            value={soldTime}
                                            onChange={(e) => setData('sold_at', `${soldDate || toLocalInput(new Date()).slice(0, 10)}T${e.target.value}`)}
                                        />
                                    </div>
                                </div>
                                <div className="pos-v2-side-row">
                                    <span>Pelanggan</span>
                                    <button type="button" className="pos-v2-customer-btn" onClick={() => setShowCustomer(true)}>
                                        <UserRoundSearch size={15} />
                                        <em>{selectedCustomer?.name || data.customer_name || 'UMUM'}</em>
                                    </button>
                                </div>
                                <label className="pos-v2-side-row">
                                    <span>Diskon Faktur</span>
                                    <div className="pos-v2-affix">
                                        <input
                                            ref={discountRef}
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            className="form-input"
                                            value={data.discount_percent ?? ''}
                                            onChange={(e) => setData('discount_percent', e.target.value)}
                                            placeholder="0"
                                        />
                                        <i>%</i>
                                    </div>
                                </label>
                                <label className="pos-v2-side-row">
                                    <span>Diskon Rp</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="100"
                                        className="form-input"
                                        value={data.discount_amount ?? ''}
                                        onChange={(e) => setData('discount_amount', e.target.value)}
                                        placeholder="0"
                                    />
                                </label>
                                <div className="pos-v2-side-row">
                                    <span>PPN</span>
                                    <div className="pos-v2-tax-row">
                                        <label className="pos-v2-tax-check">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(data.tax_enabled)}
                                                onChange={(e) => setData('tax_enabled', e.target.checked)}
                                            />
                                        </label>
                                        <div className="pos-v2-affix">
                                            <input
                                                ref={taxRef}
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                className="form-input"
                                                value={data.tax_percent ?? ''}
                                                disabled={!data.tax_enabled}
                                                onChange={(e) => setData('tax_percent', e.target.value)}
                                            />
                                            <i>%</i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pos-v2-totals">
                                <div><span>Subtotal</span><strong>{formatMoney(subtotal)}</strong></div>
                                <div><span>Diskon</span><strong>{formatMoney(discount)}</strong></div>
                                <div><span>PPN{data.tax_enabled ? ` ${Number(data.tax_percent || 0)}%` : ''}</span><strong>{formatMoney(tax)}</strong></div>
                                <div className="is-total"><span>Grand Total</span><strong>{formatMoney(grandTotal)}</strong></div>
                            </div>
                        </aside>
                    </div>
                </section>

                <footer className="pos-v2-fbar" role="toolbar" aria-label="Shortcut kasir">
                    <button type="button" className="pos-v2-fkey" onClick={() => setShowCustomer(true)}>
                        <kbd>F1</kbd>
                        <span>Pelanggan</span>
                    </button>
                    <button type="button" className="pos-v2-fkey" onClick={() => discountRef.current?.focus()}>
                        <kbd>F3</kbd>
                        <span>Diskon Faktur</span>
                    </button>
                    <button type="button" className="pos-v2-fkey" onClick={() => { setData('tax_enabled', true); taxRef.current?.focus(); }}>
                        <kbd>F4</kbd>
                        <span>PPN</span>
                    </button>
                    <button type="button" className="pos-v2-fkey" onClick={() => { setShowPartResults(true); codeInputRef.current?.focus(); }}>
                        <kbd>F5</kbd>
                        <span>Cari Item</span>
                    </button>
                    <button type="button" className="pos-v2-fkey" onClick={handleRemoveSelected}>
                        <kbd>Del</kbd>
                        <span>Hapus</span>
                    </button>
                    <button type="button" className="pos-v2-fkey is-pay" onClick={openPay} disabled={processing || !hasItems}>
                        <kbd>F6</kbd>
                        <span><Banknote size={15} /> Bayar</span>
                    </button>
                </footer>

                {(errors.message || errors.items || errors.customer_id) && (
                    <p className="pos-error">
                        {errors.message || errors.customer_id || 'Tambahkan minimal 1 barang.'}
                    </p>
                )}
            </div>

            {showCustomer && (
                <div className="pos-modal-backdrop" onClick={() => setShowCustomer(false)}>
                    <div className="pos-modal pos-modal-wide" onClick={(e) => e.stopPropagation()} role="dialog">
                        <header>
                            <UserRoundSearch size={18} />
                            <h3>Cari Pelanggan</h3>
                        </header>
                        <input
                            ref={customerSearchRef}
                            className="form-input"
                            placeholder="Ketik nama atau telepon"
                            value={customerQuery}
                            onChange={(e) => setCustomerQuery(e.target.value)}
                        />
                        <button type="button" className="btn btn-outline" onClick={() => selectCustomer(null)}>
                            Gunakan UMUM
                        </button>
                        <ul className="pos-v2-customer-list">
                            {filteredCustomers.map((customer) => (
                                <li key={customer.id}>
                                    <button type="button" onClick={() => selectCustomer(customer)}>
                                        <strong>{customer.name}</strong>
                                        <small>{customer.phone || 'Tanpa telepon'}</small>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <form className="pos-v2-customer-new" onSubmit={handleCreateCustomer}>
                            <strong>Pelanggan baru</strong>
                            <div className="pos-v2-customer-new-grid">
                                <input
                                    className="form-input"
                                    placeholder="Nama"
                                    value={newCustomer.name}
                                    onChange={(e) => setNewCustomer((prev) => ({ ...prev, name: e.target.value }))}
                                />
                                <input
                                    className="form-input"
                                    placeholder="Telepon (opsional)"
                                    value={newCustomer.phone}
                                    onChange={(e) => setNewCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                                />
                                <button type="submit" className="btn btn-primary" disabled={savingCustomer}>
                                    Simpan
                                </button>
                            </div>
                        </form>
                        <footer>
                            <button type="button" className="btn btn-outline" onClick={() => setShowCustomer(false)}>Tutup</button>
                        </footer>
                    </div>
                </div>
            )}

            {showPay && (
                <div className="pos-modal-backdrop" onClick={() => setShowPay(false)}>
                    <div className="pos-modal pos-modal-wide" onClick={(e) => e.stopPropagation()} role="dialog">
                        <header>
                            <Wallet size={18} />
                            <h3>Pembayaran</h3>
                        </header>
                        <div className="pos-pay-total">
                            <span>Total ditagih</span>
                            <strong>{formatCurrency(grandTotal)}</strong>
                        </div>
                        <div className="pos-v2-pay-methods">
                            {PAY_METHODS.map((method) => (
                                <button
                                    key={method.id}
                                    type="button"
                                    className={data.payment_method === method.id ? 'is-active' : ''}
                                    onClick={() => setData({
                                        ...data,
                                        payment_method: method.id,
                                        amount_paid: method.id !== 'credit' && method.id !== 'multi' && !data.amount_paid
                                            ? String(grandTotal)
                                            : data.amount_paid,
                                    })}
                                >
                                    {method.label}
                                </button>
                            ))}
                        </div>

                        {data.payment_method === 'multi' ? (
                            <div className="pos-v2-multi">
                                {data.payments.map((row, index) => (
                                    <div key={`${row.method}-${index}`} className="pos-v2-multi-row">
                                        <select
                                            className="form-input"
                                            value={row.method}
                                            onChange={(e) => setData('payments', data.payments.map((item, i) => (
                                                i === index ? { ...item, method: e.target.value } : item
                                            )))}
                                        >
                                            {SPLIT_METHODS.map((method) => (
                                                <option key={method.id} value={method.id}>{method.label}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-input"
                                            value={row.amount}
                                            onChange={(e) => setData('payments', data.payments.map((item, i) => (
                                                i === index ? { ...item, amount: e.target.value } : item
                                            )))}
                                            placeholder="Nominal"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setData('payments', [...data.payments, { method: 'cash', amount: '' }])}
                                >
                                    + Metode
                                </button>
                                <div className="pos-v2-multi-sum">
                                    Total dibayar: <strong>{formatCurrency(multiPaid)}</strong>
                                </div>
                            </div>
                        ) : (
                            <label className="pos-field">
                                <span>{data.payment_method === 'credit' ? 'Bayar sekarang (opsional)' : 'Uang Dibayar'}</span>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="0"
                                    value={data.amount_paid ?? ''}
                                    onChange={(e) => setData('amount_paid', e.target.value)}
                                    autoFocus
                                />
                            </label>
                        )}

                        <div className={`pos-pay-status ${isPaid ? 'is-paid' : 'is-unpaid'}`}>
                            {data.payment_method === 'credit' && !isPaid ? 'HUTANG' : isPaid ? 'LUNAS' : 'BELUM LUNAS'}
                        </div>
                        {data.payment_method === 'cash' && (
                            <div className="pos-pay-change">
                                <span>Kembalian</span>
                                <strong>{formatCurrency(change)}</strong>
                            </div>
                        )}
                        <footer>
                            <button type="button" className="btn btn-outline" onClick={() => setShowPay(false)}>Tutup</button>
                            <button type="button" className="btn btn-primary" onClick={submitSale} disabled={processing}>
                                Proses Pembayaran
                            </button>
                        </footer>
                    </div>
                </div>
            )}

            <PosQuickProductModal
                open={showQuickProduct}
                onClose={() => setShowQuickProduct(false)}
                onCreated={handleQuickProductCreated}
                productTypes={productTypes}
                initialQuery={partSearch}
            />
        </AdminLayout>
    );
}
