import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Eye, Trash2, ShoppingCart } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import DataTable from '../../../Components/DataTable';
import StatusBadge from '../../../Components/StatusBadge';

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

    return (
        <AdminLayout title="Riwayat Penjualan">
            <Head title="Penjualan POS" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                    <button 
                        onClick={() => handleFilterStatus('')} 
                        className={`btn ${!filters.status ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                    >
                        Semua
                    </button>
                    <button 
                        onClick={() => handleFilterStatus('lunas')} 
                        className={`btn ${filters.status === 'lunas' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                    >
                        Lunas
                    </button>
                    <button 
                        onClick={() => handleFilterStatus('belum_lunas')} 
                        className={`btn ${filters.status === 'belum_lunas' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                    >
                        Belum Lunas
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', minWidth: '250px' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Cari no nota atau nama..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ paddingLeft: '2.25rem', width: '100%' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }}><Search size={16} /></button>
                    </form>

                    <Link href="/admin/sales/create" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                        <Plus size={16} /> Transaksi Baru
                    </Link>
                </div>
            </div>

            <div className="glass-panel">
                <DataTable columns={columns} data={sales.data} />
                
                {sales.data.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <ShoppingCart size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                        <p>Belum ada transaksi penjualan langsung.</p>
                    </div>
                )}
            </div>

            {sales.links && sales.links.length > 3 && (
                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '1rem', justifyContent: 'center' }}>
                    {sales.links.map((link, k) => (
                        <Link 
                            key={k} 
                            href={link.url || '#'}
                            className={`btn ${link.active ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', opacity: link.url ? 1 : 0.5 }}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
