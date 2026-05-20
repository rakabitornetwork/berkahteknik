import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Car,
    Wrench,
    CheckCircle,
    Wallet,
    Users,
    AlertTriangle,
    ArrowRight,
    Eye,
    AlertCircle,
    ShoppingCart,
    Package,
    UserPlus,
    Zap,
} from 'lucide-react';
import AdminLayout from '../../Layouts/AdminLayout';
import MetricCard from '../../Components/MetricCard';
import DataTable from '../../Components/DataTable';
import StatusBadge from '../../Components/StatusBadge';

const fmt = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;
const paymentLabel = { cash: 'Tunai', transfer: 'Transfer' };

const quickActionStyle = {
    fontSize: '0.75rem',
    padding: '0.35rem 0.75rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
};

function QuickActionLink({ href, className, icon, children }) {
    return (
        <Link href={href} className={className} style={quickActionStyle}>
            {icon}
            {children}
        </Link>
    );
}

function PanelHeader({ title, icon, linkHref, linkLabel }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {icon} {title}
            </h2>
            <Link href={linkHref} style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {linkLabel} <ArrowRight size={14} />
            </Link>
        </div>
    );
}

export default function Dashboard({ auth, stats, activeServices, lowStockParts = [], salesSummary = {}, recentSales = [] }) {
    const columns = [
        { header: '#', accessor: 'id', cell: r => <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>#{String(r.id).padStart(4, '0')}</span> },
        { header: 'Pelanggan', accessor: 'customer_name', cell: r => <span style={{ fontWeight: 500 }}>{r.customer_name}</span> },
        { header: 'Kendaraan', accessor: 'vehicle' },
        { header: 'Status', accessor: 'status', cell: r => <StatusBadge status={r.status} /> },
        { header: 'Mekanik', accessor: 'technician' },
        { header: 'Masuk', accessor: 'created_at', cell: r => <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{r.created_at}</span> },
        { header: 'Aksi', accessor: 'id', cell: r => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href={`/admin/services/${r.id}`} style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex' }} title="Detail">
                    <Eye size={16} />
                </Link>
                {r.status === 'antri' && (
                    <button onClick={() => router.patch(`/admin/services/${r.id}/status`, { status: 'dikerjakan' })}
                        style={{ color: 'var(--color-info)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }} title="Mulai Pengerjaan">
                        <Wrench size={16} />
                    </button>
                )}
                {r.status === 'dikerjakan' && (
                    <button onClick={() => router.patch(`/admin/services/${r.id}/status`, { status: 'selesai' })}
                        style={{ color: 'var(--color-success)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }} title="Tandai Selesai">
                        <CheckCircle size={16} />
                    </button>
                )}
            </div>
        )},
    ];

    return (
        <AdminLayout title="PANEL OPERASIONAL">
            <Head title="Dashboard Admin" />

            <div className="hd-grid hd-grid-cols-4" style={{ gap: '0.75rem', marginBottom: '0.75rem' }}>
                <MetricCard title="Kendaraan Masuk" value={stats.today_vehicles} icon={<Car size={16} />} trend={`${stats.queue_services} antri`} accentColor="#3b82f6" />
                <MetricCard title="Sedang Dikerjakan" value={stats.active_services} icon={<Wrench size={16} />} accentColor="#f59e0b" />
                <MetricCard title="Selesai Hari Ini" value={stats.completed_today} icon={<CheckCircle size={16} />} accentColor="#10b981" />
                <MetricCard title="Pendapatan Harian" value={fmt(stats.revenue_today)} icon={<Wallet size={16} />} trend={`Bulan ini: ${fmt(stats.revenue_month)}`} accentColor="#8b5cf6" />
            </div>

            <div className="hd-grid hd-grid-cols-4" style={{ gap: '0.75rem', marginBottom: '1.25rem' }}>
                <MetricCard title="Total Pelanggan" value={stats.total_customers} icon={<Users size={16} />} accentColor="#6366f1" />
                <MetricCard title="Stok Menipis" value={stats.low_stock_parts} icon={<AlertTriangle size={16} />}
                    trend={stats.low_stock_parts > 0 ? 'Perlu restock' : 'Stok aman'} accentColor="#f59e0b" />
                <MetricCard title="Penjualan Hari Ini" value={salesSummary.today_count ?? 0} icon={<ShoppingCart size={16} />}
                    trend={`Total: ${fmt(salesSummary.today_total ?? 0)}`} accentColor="#0ea5e9" />
                <MetricCard title="Piutang Penjualan" value={fmt(stats.piutang)} icon={<AlertCircle size={16} />}
                    trend={stats.piutang > 0 ? `${salesSummary.unpaid_count ?? 0} belum lunas` : 'Lunas semua'} accentColor="#ef4444" />
            </div>

            <div className="hd-grid hd-grid-cols-2" style={{ gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <PanelHeader title="Stok Menipis" icon={<Package size={16} style={{ color: 'var(--color-warning)' }} />} linkHref="/admin/spare-parts" linkLabel="Kelola Stok" />
                    {lowStockParts.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {lowStockParts.map((part) => (
                                <div key={part.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem',
                                    padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-sm)',
                                    background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)',
                                }}>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{part.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{part.code}</div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: part.stock === 0 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                                            {part.stock} {part.unit}
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>min. {part.min_stock}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            color: 'var(--color-text-muted)',
                            fontSize: '0.85rem',
                        }}>
                            <CheckCircle size={18} style={{ color: 'var(--color-success)', opacity: 0.8, flexShrink: 0 }} />
                            <span>Semua stok spare part masih aman.</span>
                        </div>
                    )}
                </div>

                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <PanelHeader title="Penjualan Singkat" icon={<ShoppingCart size={16} style={{ color: 'var(--color-info)' }} />} linkHref="/admin/sales" linkLabel="Lihat Semua" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.625rem', borderRadius: 'var(--radius-sm)', background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Transaksi Hari Ini</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{salesSummary.today_count ?? 0}</div>
                        </div>
                        <div style={{ padding: '0.625rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Omzet Lunas Hari Ini</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-success)' }}>{fmt(salesSummary.today_lunas ?? 0)}</div>
                        </div>
                    </div>
                    {recentSales.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {recentSales.map((sale) => (
                                <Link key={sale.id} href={`/admin/sales/${sale.id}`} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem',
                                    padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--color-border)', textDecoration: 'none', color: 'inherit',
                                }}>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>{sale.receipt_number}</div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{sale.customer_name}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                                            {sale.created_at} · {paymentLabel[sale.payment_method] || sale.payment_method || '-'}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{fmt(sale.total_amount)}</div>
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 600, padding: '0.1rem 0.4rem', borderRadius: '4px',
                                            background: sale.payment_status === 'lunas' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                                            color: sale.payment_status === 'lunas' ? 'var(--color-success)' : 'var(--color-danger)',
                                        }}>
                                            {sale.payment_status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                            Belum ada transaksi penjualan.
                            <div style={{ marginTop: '0.75rem' }}>
                                <Link href="/admin/sales/create" className="btn btn-primary" style={{ fontSize: '0.75rem' }}>+ Transaksi POS</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="glass-panel hover-lift" style={{ padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '2px solid #a8a29e' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Zap size={16} strokeWidth={2.25} style={{ color: 'var(--color-warning)' }} />
                    Aksi Cepat
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <QuickActionLink href="/admin/services/create" className="btn btn-primary" icon={<Wrench size={14} strokeWidth={2.25} />}>
                        Servis
                    </QuickActionLink>
                    <QuickActionLink href="/admin/sales/create" className="btn btn-outline" icon={<ShoppingCart size={14} strokeWidth={2.25} />}>
                        Penjualan POS
                    </QuickActionLink>
                    <QuickActionLink href="/admin/customers/create" className="btn btn-outline" icon={<UserPlus size={14} strokeWidth={2.25} />}>
                        Pelanggan
                    </QuickActionLink>
                    <QuickActionLink href="/admin/spare-parts/create" className="btn btn-outline" icon={<Package size={14} strokeWidth={2.25} />}>
                        Spare Part
                    </QuickActionLink>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Antrian & Servis Aktif</h2>
                    <Link href="/admin/services" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Lihat Semua <ArrowRight size={14} /></Link>
                </div>
                <DataTable columns={columns} data={activeServices} />
            </div>
        </AdminLayout>
    );
}
