import React from 'react';
import { router, Link } from '@inertiajs/react';
import { CheckCircle, XCircle, Plus, Eye, Trash2, ShoppingBag, Clock, Ban } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';

const statusConfig = {
    pending:   { label: 'Menunggu',  color: '#d97706', bg: '#fef3c7' },
    completed: { label: 'Selesai',   color: '#059669', bg: '#d1fae5' },
    cancelled: { label: 'Dibatalkan',color: '#dc2626', bg: '#fee2e2' },
};

export default function Index({ orders }) {
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus Purchase Order ini?')) {
            router.delete(route('admin.purchase-orders.destroy', id));
        }
    };

    const handleStatusUpdate = (id, status) => {
        router.patch(route('admin.purchase-orders.status', id), { status }, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Pengadaan Barang (PO)">
            <div style={{ padding: '1.5rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <ShoppingBag size={22} style={{ color: 'var(--color-primary)' }} />
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                            Daftar Purchase Order
                        </h2>
                    </div>
                    <Link
                        href={route('admin.purchase-orders.create')}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.6rem 1.1rem', borderRadius: '0.5rem',
                            background: 'var(--color-primary)', color: '#fff',
                            textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem',
                        }}
                    >
                        <Plus size={16} /> Buat PO Baru
                    </Link>
                </div>

                {/* Table */}
                <div style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)' }}>Nomor PO</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)' }}>Supplier</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)' }}>Tanggal</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-muted)' }}>Total</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-muted)' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        Belum ada Purchase Order. Buat PO pertama Anda.
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order) => {
                                    const s = statusConfig[order.status] || statusConfig.pending;
                                    return (
                                        <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.8rem' }}>
                                                {order.po_number}
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
                                                {order.supplier?.name || '—'}
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>
                                                {order.order_date}
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--color-text-main)', fontWeight: 600 }}>
                                                Rp {Number(order.total_amount || 0).toLocaleString('id-ID')}
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block', padding: '0.2rem 0.6rem',
                                                    borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
                                                    color: s.color, background: s.bg,
                                                }}>
                                                    {s.label}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
                                                    {/* Detail */}
                                                    <Link
                                                        href={route('admin.purchase-orders.show', order.id)}
                                                        title="Lihat Detail"
                                                        style={{ color: 'var(--color-primary)', display: 'inline-flex' }}
                                                    >
                                                        <Eye size={16} />
                                                    </Link>

                                                    {/* Tandai Selesai */}
                                                    {order.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                                                            title="Tandai Selesai (stok akan bertambah otomatis)"
                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#059669', display: 'inline-flex', padding: 0 }}
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}

                                                    {/* Batalkan */}
                                                    {order.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                                            title="Batalkan PO"
                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d97706', display: 'inline-flex', padding: 0 }}
                                                        >
                                                            <Ban size={16} />
                                                        </button>
                                                    )}

                                                    {/* Hapus */}
                                                    <button
                                                        onClick={() => handleDelete(order.id)}
                                                        title="Hapus"
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', display: 'inline-flex', padding: 0 }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {orders.links && (
                    <div style={{ marginTop: '1rem' }} dangerouslySetInnerHTML={{ __html: orders.links }} />
                )}
            </div>
        </AdminLayout>
    );
}
