import React from 'react';
import { router, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Ban, Printer, ShoppingBag } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';

const statusConfig = {
    pending:   { label: 'Menunggu',   color: '#d97706', bg: '#fef3c7' },
    completed: { label: 'Selesai',    color: '#059669', bg: '#d1fae5' },
    cancelled: { label: 'Dibatalkan', color: '#dc2626', bg: '#fee2e2' },
};

export default function Show({ order }) {
    const s = statusConfig[order.status] || statusConfig.pending;

    const handleStatus = (status) => {
        const msg = status === 'completed'
            ? 'Tandai PO ini sebagai selesai? Stok spare part akan bertambah otomatis.'
            : 'Batalkan Purchase Order ini?';
        if (confirm(msg)) {
            router.patch(route('admin.purchase-orders.status', order.id), { status });
        }
    };

    const total = order.items?.reduce(
        (sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0
    ) || 0;

    return (
        <AdminLayout title={`Detail PO: ${order.po_number}`}>
            <div style={{ padding: '1.5rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Link href={route('admin.purchase-orders.index')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                            <ArrowLeft size={16} /> Kembali
                        </Link>
                        <ShoppingBag size={20} style={{ color: 'var(--color-primary)' }} />
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                            Detail Purchase Order
                        </h2>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                        {order.status === 'pending' && (
                            <>
                                <button
                                    onClick={() => handleStatus('completed')}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                        padding: '0.5rem 1rem', borderRadius: '0.5rem',
                                        background: '#059669', color: '#fff',
                                        border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                                    }}
                                >
                                    <CheckCircle size={15} /> Tandai Selesai
                                </button>
                                <button
                                    onClick={() => handleStatus('cancelled')}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                        padding: '0.5rem 1rem', borderRadius: '0.5rem',
                                        background: 'transparent',
                                        border: '1px solid var(--color-danger)', color: 'var(--color-danger)',
                                        cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                                    }}
                                >
                                    <Ban size={15} /> Batalkan
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => window.print()}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.5rem 1rem', borderRadius: '0.5rem',
                                background: 'transparent',
                                border: '1px solid var(--color-border)', color: 'var(--color-text-muted)',
                                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                            }}
                        >
                            <Printer size={15} /> Print
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    {/* Info PO */}
                    <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '0.75rem', padding: '1.25rem' }}>
                        <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Informasi PO
                        </h3>
                        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                            <tbody>
                                {[
                                    ['Nomor PO', <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>{order.po_number}</span>],
                                    ['Tanggal Order', order.order_date],
                                    ['Status', <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, color: s.color, background: s.bg }}>{s.label}</span>],
                                    ['Total', <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Rp {total.toLocaleString('id-ID')}</span>],
                                ].map(([label, value]) => (
                                    <tr key={label} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '0.6rem 0', color: 'var(--color-text-muted)', width: '40%' }}>{label}</td>
                                        <td style={{ padding: '0.6rem 0', color: 'var(--color-text-main)', fontWeight: 500 }}>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Info Supplier */}
                    <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '0.75rem', padding: '1.25rem' }}>
                        <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Informasi Supplier
                        </h3>
                        {order.supplier ? (
                            <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                                <tbody>
                                    {[
                                        ['Nama', order.supplier.name],
                                        ['Telepon', order.supplier.phone || '—'],
                                        ['Email', order.supplier.email || '—'],
                                        ['Alamat', order.supplier.address || '—'],
                                    ].map(([label, value]) => (
                                        <tr key={label} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '0.6rem 0', color: 'var(--color-text-muted)', width: '40%' }}>{label}</td>
                                            <td style={{ padding: '0.6rem 0', color: 'var(--color-text-main)', fontWeight: 500 }}>{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Data supplier tidak ditemukan.</p>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '0.75rem', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
                        <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Daftar Item Spare Part
                        </h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ background: 'var(--color-bg-secondary)' }}>
                                <th style={{ padding: '0.7rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)' }}>Spare Part</th>
                                <th style={{ padding: '0.7rem 1rem', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-muted)' }}>Qty</th>
                                <th style={{ padding: '0.7rem 1rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-muted)' }}>Harga Satuan</th>
                                <th style={{ padding: '0.7rem 1rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-muted)' }}>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '0.7rem 1rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
                                        {item.spare_part?.name || `Spare Part #${item.spare_part_id}`}
                                    </td>
                                    <td style={{ padding: '0.7rem 1rem', textAlign: 'center', color: 'var(--color-text-main)' }}>
                                        {item.quantity}
                                    </td>
                                    <td style={{ padding: '0.7rem 1rem', textAlign: 'right', color: 'var(--color-text-muted)' }}>
                                        Rp {Number(item.unit_price).toLocaleString('id-ID')}
                                    </td>
                                    <td style={{ padding: '0.7rem 1rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-main)' }}>
                                        Rp {(Number(item.quantity) * Number(item.unit_price)).toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr style={{ background: 'var(--color-bg-secondary)' }}>
                                <td colSpan={3} style={{ padding: '0.8rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--color-text-main)' }}>
                                    TOTAL
                                </td>
                                <td style={{ padding: '0.8rem 1rem', textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary)' }}>
                                    Rp {total.toLocaleString('id-ID')}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Info otomatisasi stok */}
                {order.status === 'pending' && (
                    <div style={{
                        marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                        background: '#eff6ff', border: '1px solid #bfdbfe',
                        fontSize: '0.8rem', color: '#1d4ed8',
                    }}>
                        💡 Saat PO ditandai <strong>Selesai</strong>, stok semua spare part di atas akan bertambah otomatis dan harga beli akan diperbarui.
                    </div>
                )}
                {order.status === 'completed' && (
                    <div style={{
                        marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                        background: '#d1fae5', border: '1px solid #6ee7b7',
                        fontSize: '0.8rem', color: '#065f46',
                    }}>
                        ✅ PO ini telah selesai. Stok spare part sudah diperbarui secara otomatis.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
