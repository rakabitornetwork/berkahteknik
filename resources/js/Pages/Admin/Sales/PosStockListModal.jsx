import React, { useEffect, useMemo, useState } from 'react';
import { Package, PackagePlus, Search } from 'lucide-react';

function formatCurrency(amount) {
    return `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;
}

export default function PosStockListModal({
    open,
    onClose,
    catalog = [],
    initialQuery = '',
    onAdd,
    onCreateNew,
}) {
    const [query, setQuery] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        if (!open) return;
        setQuery(String(initialQuery || '').trim());
        setSelectedId(null);
        setQty(1);
    }, [open, initialQuery]);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const rows = !q ? catalog : catalog.filter((part) => {
            const code = (part.code || '').toLowerCase();
            const barcode = (part.barcode || '').toLowerCase();
            const name = (part.name || '').toLowerCase();
            const desc = (part.description || '').toLowerCase();
            return code.includes(q) || barcode.includes(q) || name.includes(q) || desc.includes(q);
        });
        return rows;
    }, [catalog, query]);

    const selected = filtered.find((part) => part.id === selectedId) || null;

    if (!open) return null;

    const submit = (event) => {
        event.preventDefault();
        if (!selected) return;
        const added = onAdd(selected, qty);
        if (added) onClose();
    };

    return (
        <div className="pos-modal-backdrop" onClick={onClose}>
            <form
                className="pos-modal pos-modal-stock"
                onClick={(event) => event.stopPropagation()}
                onSubmit={submit}
                role="dialog"
                aria-labelledby="pos-stock-title"
            >
                <header>
                    <Package size={18} />
                    <h3 id="pos-stock-title">Daftar Stok</h3>
                </header>
                <p className="pos-quick-hint">
                    Pilih barang dari stok yang tersedia, lalu masukkan ke keranjang.
                </p>

                <label className="pos-field">
                    <span>Cari kode atau nama</span>
                    <div className="pos-stock-search">
                        <Search size={16} aria-hidden />
                        <input
                            className="form-input"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setSelectedId(null);
                            }}
                            placeholder="Ketik kode, barcode, atau nama barang"
                            autoFocus
                        />
                    </div>
                </label>

                <div className="pos-stock-list" role="listbox" aria-label="Daftar stok">
                    {filtered.length > 0 ? (
                        filtered.map((part) => {
                            const out = Number(part.stock) <= 0;
                            const active = selectedId === part.id;
                            return (
                                <button
                                    key={part.id}
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    className={`pos-stock-row${active ? ' is-selected' : ''}${out ? ' is-disabled' : ''}`}
                                    disabled={out}
                                    onClick={() => {
                                        setSelectedId(part.id);
                                        setQty(1);
                                    }}
                                >
                                    <span className="pos-stock-main">
                                        <strong>{part.code || '-'}</strong>
                                        <em>{part.name}</em>
                                    </span>
                                    <span className="pos-stock-meta">
                                        Stok {part.stock}
                                        {part.unit ? ` · ${part.unit}` : ''}
                                        {' · '}
                                        {formatCurrency(part.sell_price)}
                                    </span>
                                </button>
                            );
                        })
                    ) : (
                        <p className="pos-stock-empty">Tidak ada barang yang cocok di daftar stok.</p>
                    )}
                </div>

                <footer className="pos-stock-footer">
                    <label className="pos-field pos-stock-qty">
                        <span>Qty</span>
                        <input
                            type="number"
                            min="1"
                            className="form-input"
                            value={qty}
                            onChange={(event) => setQty(event.target.value)}
                        />
                    </label>
                    <div className="pos-stock-actions">
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            Batal
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => onCreateNew(query)}
                        >
                            <PackagePlus size={15} /> Produk baru
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={!selected}>
                            Tambah Cart
                        </button>
                    </div>
                </footer>
            </form>
        </div>
    );
}
