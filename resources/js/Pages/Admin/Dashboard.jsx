import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    CarFront,
    Wrench,
    CheckCircle,
    BadgeCheck,
    HandCoins,
    UsersRound,
    PackageX,
    ArrowRight,
    Eye,
    ShoppingBag,
    ShoppingCart,
    FileWarning,
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
    fontSize: '0.88rem',
    padding: '0.55rem 1rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem', gap: '1rem' }}>
            <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
            }}>
                {icon} {title}
            </h2>
            <Link href={linkHref} style={{ fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                {linkLabel} <ArrowRight size={15} />
            </Link>
        </div>
    );
}

export default function Dashboard({ auth, stats, activeServices, lowStockParts = [], salesSummary = {}, recentSales = [] }) {
    const columns = [
        { header: '#', accessor: 'id', cell: r => <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>#{String(r.id).padStart(4, '0')}</span> },
        { header: 'Pelanggan', accessor: 'customer_name', cell: r => <span style={{ fontWeight: 600 }}>{r.customer_name}</span> },
        { header: 'Kendaraan', accessor: 'vehicle' },
        { header: 'Status', accessor: 'status', cell: r => <StatusBadge status={r.status} /> },
        { header: 'Mekanik', accessor: 'technician' },
        { header: 'Masuk', accessor: 'created_at', cell: r => <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{r.created_at}</span> },
        { header: 'Aksi', accessor: 'id', cell: r => (
            <div style={{ display: 'flex', gap: '0.55rem' }}>
                <Link href={`/admin/services/${r.id}`} style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex' }} title="Detail">
                    <Eye size={17} />
                </Link>
                {r.status === 'antri' && (
                    <button onClick={() => router.patch(`/admin/services/${r.id}/status`, { status: 'dikerjakan' })}
                        style={{ color: 'var(--color-info)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }} title="Mulai Pengerjaan">
                        <Wrench size={17} />
                    </button>
                )}
                {r.status === 'dikerjakan' && (
                    <button onClick={() => router.patch(`/admin/services/${r.id}/status`, { status: 'selesai' })}
                        style={{ color: 'var(--color-success)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }} title="Tandai Selesai">
                        <CheckCircle size={17} />
                    </button>
                )}
            </div>
        )},
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard Admin" />

            <div className="hd-grid hd-grid-cols-4" style={{ gap: '1.15rem', marginBottom: '1.15rem' }}>
                <MetricCard
                    title="Kendaraan Masuk"
                    value={stats.today_vehicles}
                    icon={<CarFront size={18} strokeWidth={1.75} />}
                    trend={`${stats.queue_services} antri`}
                    gradient="linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)"
                />
                <MetricCard
                    title="Sedang Dikerjakan"
                    value={stats.active_services}
                    icon={<Wrench size={18} strokeWidth={1.75} />}
                    gradient="linear-gradient(135deg, #b45309 0%, #f59e0b 100%)"
                />
                <MetricCard
                    title="Selesai Hari Ini"
                    value={stats.completed_today}
                    icon={<BadgeCheck size={18} strokeWidth={1.75} />}
                    gradient="linear-gradient(135deg, #047857 0%, #10b981 100%)"
                />
                <MetricCard
                    title="Pendapatan Harian"
                    value={fmt(stats.revenue_today)}
                    icon={<HandCoins size={18} strokeWidth={1.75} />}
                    trend={`Bulan ini: ${fmt(stats.revenue_month)}`}
                    gradient="linear-gradient(135deg, #134e4a 0%, #0f766e 100%)"
                />
            </div>

            <div className="hd-grid hd-grid-cols-4" style={{ gap: '1.15rem', marginBottom: '1.5rem' }}>
                <MetricCard
                    title="Total Pelanggan"
                    value={stats.total_customers}
                    icon={<UsersRound size={18} strokeWidth={1.75} />}
                    gradient="linear-gradient(135deg, #1e3a5f 0%, #3b82f6 100%)"
                />
                <MetricCard
                    title="Stok Menipis"
                    value={stats.low_stock_parts}
                    icon={<PackageX size={18} strokeWidth={1.75} />}
                    trend={stats.low_stock_parts > 0 ? 'Perlu restock' : 'Stok aman'}
                    gradient="linear-gradient(135deg, #9a3412 0%, #ea580c 100%)"
                />
                <MetricCard
                    title="Penjualan Hari Ini"
                    value={salesSummary.today_count ?? 0}
                    icon={<ShoppingBag size={18} strokeWidth={1.75} />}
                    trend={`Total: ${fmt(salesSummary.today_total ?? 0)}`}
                    gradient="linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)"
                />
                <MetricCard
                    title="Piutang Penjualan"
                    value={fmt(stats.piutang)}
                    icon={<FileWarning size={18} strokeWidth={1.75} />}
                    trend={stats.piutang > 0 ? `${salesSummary.unpaid_count ?? 0} belum lunas` : 'Lunas semua'}
                    gradient="linear-gradient(135deg, #be123c 0%, #f43f5e 100%)"
                />
            </div>

            <div className="hd-grid hd-grid-cols-2" style={{ gap: '1.15rem', marginBottom: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <PanelHeader title="Stok Menipis" icon={<Package size={18} style={{ color: 'var(--color-warning)' }} />} linkHref="/admin/spare-parts" linkLabel="Kelola Stok" />
                    {lowStockParts.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {lowStockParts.map((part) => (
                                <div key={part.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.85rem',
                                    padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)',
                                    background: 'rgba(217, 119, 6, 0.07)', border: '1px solid rgba(217, 119, 6, 0.2)',
                                }}>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.92rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{part.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{part.code}</div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: part.stock === 0 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                                            {part.stock} {part.unit}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>min. {part.min_stock}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            padding: '2rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.55rem',
                            color: 'var(--color-text-muted)',
                            fontSize: '0.92rem',
                        }}>
                            <CheckCircle size={18} style={{ color: 'var(--color-success)', opacity: 0.85, flexShrink: 0 }} />
                            <span>Semua stok spare part masih aman.</span>
                        </div>
                    )}
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <PanelHeader title="Penjualan Singkat" icon={<ShoppingCart size={18} style={{ color: 'var(--color-primary)' }} />} linkHref="/admin/sales" linkLabel="Lihat Semua" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.15rem' }}>
                        <div style={{ padding: '0.9rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-alpha)', border: '1px solid rgba(15, 118, 110, 0.15)' }}>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>Transaksi Hari Ini</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em' }}>{salesSummary.today_count ?? 0}</div>
                        </div>
                        <div style={{ padding: '0.9rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.18)' }}>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>Omzet Lunas Hari Ini</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--color-success)' }}>{fmt(salesSummary.today_lunas ?? 0)}</div>
                        </div>
                    </div>
                    {recentSales.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {recentSales.map((sale) => (
                                <Link key={sale.id} href={`/admin/sales/${sale.id}`} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.85rem',
                                    padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)', textDecoration: 'none', color: 'inherit',
                                }}>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>{sale.receipt_number}</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{sale.customer_name}</div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                                            {sale.created_at} · {paymentLabel[sale.payment_method] || sale.payment_method || '-'}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{fmt(sale.total_amount)}</div>
                                        <span style={{
                                            fontSize: '0.75rem', fontWeight: 600, padding: '0.15rem 0.45rem', borderRadius: '6px',
                                            background: sale.payment_status === 'lunas' ? 'rgba(16,185,129,0.12)' : 'rgba(225,29,72,0.1)',
                                            color: sale.payment_status === 'lunas' ? 'var(--color-success)' : 'var(--color-danger)',
                                        }}>
                                            {sale.payment_status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
                            Belum ada transaksi penjualan.
                            <div style={{ marginTop: '0.9rem' }}>
                                <Link href="/admin/sales/create" className="btn btn-primary">+ Transaksi POS</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.15rem', flexWrap: 'wrap' }}>
                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--color-text-main)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                }}>
                    <Zap size={17} strokeWidth={2.25} style={{ color: 'var(--color-primary)' }} />
                    Aksi Cepat
                </div>
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <QuickActionLink href="/admin/services/create" className="btn btn-primary" icon={<Wrench size={15} strokeWidth={2.25} />}>
                        Servis
                    </QuickActionLink>
                    <QuickActionLink href="/admin/sales/create" className="btn btn-outline" icon={<ShoppingCart size={15} strokeWidth={2.25} />}>
                        Penjualan POS
                    </QuickActionLink>
                    <QuickActionLink href="/admin/customers/create" className="btn btn-outline" icon={<UserPlus size={15} strokeWidth={2.25} />}>
                        Pelanggan
                    </QuickActionLink>
                    <QuickActionLink href="/admin/spare-parts/create" className="btn btn-outline" icon={<Package size={15} strokeWidth={2.25} />}>
                        Spare Part
                    </QuickActionLink>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem', gap: '1rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
                        Antrian & Servis Aktif
                    </h2>
                    <Link href="/admin/services" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        Lihat Semua <ArrowRight size={15} />
                    </Link>
                </div>
                <DataTable columns={columns} data={activeServices} />
            </div>
        </AdminLayout>
    );
}
