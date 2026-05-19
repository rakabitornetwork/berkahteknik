import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Eye, Trash2, ShoppingCart } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import DataTable from '../../../Components/DataTable';
import Pagination from '../../../Components/Pagination';

export default function SalesIndex({ sales, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/sales', { search, status: filters.status }, { preserveState: true });
    };

    const handleFilterStatus = (status) => {
        router.get('/admin/sales', { search, status }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin membatalkan transaksi ini? Stok akan dikembalikan otomatis.')) {
            router.delete(`/admin/sales/${id}`);
        }
    };

    const formatCurrency = (amount) => `Rp ${Number(amount).toLocaleString('id-ID')}`;

    const columns = [
        { header: 'No. Nota', accessor: 'receipt_number', cell: r => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{r.receipt_number}</span> },
        { header: 'Tanggal', accessor: 'created_at', cell: r => new Date(r.created_at).toLocaleDateString('id-ID') },
        { header: 'Pelanggan', accessor: 'customer_name', cell: r => r.customer_name || 'Umum' },
        { header: 'Total', accessor: 'total_amount', cell: r => formatCurrency(r.total_amount) },
        { header: 'Status', accessor: 'payment_status', cell: r => (
            <span style={{
                padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600,
                backgroundColor: r.payment_status === 'lunas' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: r.payment_status === 'lunas' ? '#10b981' : '#ef4444'
            }}>
                {r.payment_status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
            </span>
        ) },
        { header: 'Aksi', accessor: 'id', cell: r => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href={`/admin/sales/${r.id}`} style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex' }} title="Lihat Struk">
                    <Eye size={16} />
                </Link>
                <button onClick={() => handleDelete(r.id)} style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }} title="Batalkan">
                    <Trash2 size={16} />
                </button>
            </div>
        )},
    ];

    const hasData = sales.data.length > 0;

    return (
        <AdminLayout title="Riwayat Penjualan">
            <Head title="Penjualan POS" />

            <div className="glass-panel list-panel" style={{ marginBottom: '1rem' }}>
                <header className="list-page-toolbar" style={{ marginBottom: 0 }}>
                    <div className="filter-pills">
                        <button
                            type="button"
                            onClick={() => handleFilterStatus('')}
                            className={`filter-pill${!filters.status ? ' is-active' : ''}`}
                        >
                            Semua
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFilterStatus('lunas')}
                            className={`filter-pill${filters.status === 'lunas' ? ' is-active' : ''}`}
                        >
                            Lunas
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFilterStatus('belum_lunas')}
                            className={`filter-pill${filters.status === 'belum_lunas' ? ' is-active' : ''}`}
                        >
                            Belum Lunas
                        </button>
                    </div>

                    <form onSubmit={handleSearch} className="toolbar-search-row">
                        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                            <input
                                type="text"
                                className="form-input toolbar-search-input"
                                placeholder="Cari no nota atau nama..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ paddingLeft: '2.25rem', width: '100%' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-outline toolbar-action-btn" aria-label="Cari">
                            <Search size={16} />
                        </button>
                        <Link href="/admin/sales/create" className="btn btn-primary toolbar-action-btn">
                            <Plus size={16} style={{ marginRight: '0.35rem' }} />
                            Transaksi Baru
                        </Link>
                    </form>
                </header>
            </div>

            <div className="glass-panel list-panel">
                {hasData ? (
                    <>
                        <DataTable columns={columns} data={sales.data} />
                        <Pagination links={sales.links} query={{ search, status: filters.status }} />
                    </>
                ) : (
                    <div className="list-empty-state">
                        <ShoppingCart size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                        <p>Belum ada transaksi penjualan langsung.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
