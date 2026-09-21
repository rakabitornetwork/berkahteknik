import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search, ShoppingCart, Trash2 } from 'lucide-react';
import AdminLayout from '../../../../Layouts/AdminLayout';
import DataTable from '../../../../Components/DataTable';
import Pagination from '../../../../Components/Pagination';
import PosTabs from '../PosTabs';
import { formatReceiptNumber } from '../../../../lib/receiptNumber';
import { salePaymentLabel } from '../../../../lib/salePaymentLabels';

function formatCurrency(amount) {
    return `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;
}

export default function PosV2Riwayat({ sales, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [date, setDate] = useState(filters.date || '');
    const [cancelTarget, setCancelTarget] = useState(null);
    const [cancelReason, setCancelReason] = useState('');

    const applyFilter = (e) => {
        e?.preventDefault();
        router.get('/admin/sales/v2/riwayat', { search, date }, { preserveState: true });
    };

    const submitCancel = (e) => {
        e.preventDefault();
        if (!cancelReason.trim() || cancelReason.trim().length < 5) {
            return;
        }
        router.delete(`/admin/sales/v2/${cancelTarget.id}`, {
            data: { cancel_reason: cancelReason.trim() },
            onSuccess: () => {
                setCancelTarget(null);
                setCancelReason('');
            },
        });
    };

    const columns = [
        {
            header: 'No. Nota',
            accessor: 'receipt_number',
            cell: (r) => (
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {formatReceiptNumber(r.receipt_number, r.sold_at || r.created_at)}
                </span>
            ),
        },
        {
            header: 'Tanggal',
            accessor: 'created_at',
            cell: (r) => new Date(r.sold_at || r.created_at).toLocaleString('id-ID'),
        },
        { header: 'Pelanggan', accessor: 'customer_name', cell: (r) => r.customer_name || 'Umum' },
        { header: 'Metode', accessor: 'payment_method', cell: (r) => salePaymentLabel(r.payment_method) },
        { header: 'Total', accessor: 'total_amount', cell: (r) => formatCurrency(r.total_amount) },
        {
            header: 'Status',
            accessor: 'payment_status',
            cell: (r) => (
                <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    backgroundColor: r.payment_status === 'lunas' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: r.payment_status === 'lunas' ? '#10b981' : '#ef4444',
                }}>
                    {r.payment_status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                </span>
            ),
        },
        {
            header: 'Aksi',
            accessor: 'id',
            cell: (r) => (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/admin/sales/${r.id}`} style={{ color: 'var(--color-primary)', display: 'flex' }} title="Lihat detail">
                        <Eye size={16} />
                    </Link>
                    <button
                        type="button"
                        onClick={() => { setCancelTarget(r); setCancelReason(''); }}
                        style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
                        title="Hapus"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Riwayat POS v2">
            <Head title="Riwayat POS v2" />

            <div className="pos-desk pos-desk-list pos-v2">
                <PosTabs active="riwayat" />
            </div>

            <div className="glass-panel list-panel" style={{ marginBottom: '1rem' }}>
                <form onSubmit={applyFilter} className="toolbar-search-row">
                    <input
                        type="date"
                        className="form-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            className="form-input toolbar-search-input"
                            placeholder="Cari no nota atau pelanggan"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: '2.25rem', width: '100%' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-outline">Filter</button>
                    <Link href="/admin/sales/v2" className="btn btn-primary">Kasir v2</Link>
                </form>
            </div>

            <div className="glass-panel list-panel">
                {sales.data.length > 0 ? (
                    <>
                        <DataTable columns={columns} data={sales.data} />
                        <Pagination links={sales.links} query={{ search, date }} />
                    </>
                ) : (
                    <div className="list-empty-state">
                        <ShoppingCart size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                        <p>Belum ada transaksi pada filter ini.</p>
                    </div>
                )}
            </div>

            {cancelTarget && (
                <div className="pos-modal-backdrop" onClick={() => setCancelTarget(null)}>
                    <form className="pos-modal" onClick={(e) => e.stopPropagation()} onSubmit={submitCancel}>
                        <header>
                            <Trash2 size={18} />
                            <h3>Hapus penjualan</h3>
                        </header>
                        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            Transaksi {formatReceiptNumber(cancelTarget.receipt_number, cancelTarget.sold_at || cancelTarget.created_at)} hanya bisa dihapus jika alasan diisi.
                        </p>
                        <label className="pos-field">
                            <span>Alasan hapus</span>
                            <textarea
                                className="form-input"
                                rows={3}
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Minimal 5 karakter"
                                required
                                minLength={5}
                                autoFocus
                            />
                        </label>
                        <footer>
                            <button type="button" className="btn btn-outline" onClick={() => setCancelTarget(null)}>Batal</button>
                            <button type="submit" className="btn btn-primary" disabled={cancelReason.trim().length < 5}>
                                Hapus transaksi
                            </button>
                        </footer>
                    </form>
                </div>
            )}
        </AdminLayout>
    );
}
