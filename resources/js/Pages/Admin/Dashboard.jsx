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
    Check,
    Eye,
    AlertCircle
} from 'lucide-react';
import AdminLayout from '../../Layouts/AdminLayout';
import MetricCard from '../../Components/MetricCard';
import DataTable from '../../Components/DataTable';
import StatusBadge from '../../Components/StatusBadge';

const fmt = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

export default function Dashboard({ auth, stats, activeServices }) {
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

            {/* Metric Grid */}
            <div className="hd-grid hd-grid-cols-4" style={{ gap: '0.75rem', marginBottom: '0.75rem' }}>
                <MetricCard title="Kendaraan Masuk" value={stats.today_vehicles} icon={<Car size={16} />} trend={`${stats.queue_services} antri`} accentColor="#3b82f6" />
                <MetricCard title="Sedang Dikerjakan" value={stats.active_services} icon={<Wrench size={16} />} accentColor="#f59e0b" />
                <MetricCard title="Selesai Hari Ini" value={stats.completed_today} icon={<CheckCircle size={16} />} accentColor="#10b981" />
                <MetricCard title="Pendapatan Harian" value={fmt(stats.revenue_today)} icon={<Wallet size={16} />} trend={`Bulan ini: ${fmt(stats.revenue_month)}`} accentColor="#8b5cf6" />
            </div>

            <div className="hd-grid hd-grid-cols-4" style={{ gap: '0.75rem', marginBottom: '1.25rem' }}>
                <MetricCard title="Total Pelanggan" value={stats.total_customers} icon={<Users size={16} />} accentColor="#6366f1" />
                <MetricCard title="Piutang Penjualan" value={fmt(stats.piutang)} icon={<AlertCircle size={16} />}
                    trend={stats.piutang > 0 ? 'Belum lunas!' : 'Lunas semua'} accentColor="#ef4444" />
                <div className="glass-panel hover-lift" style={{ padding: '1rem', gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '2px solid #a8a29e', borderTopLeftRadius: 'var(--radius-sm)', borderTopRightRadius: 'var(--radius-sm)' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Aksi Cepat</div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <Link href="/admin/services/create" className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>+ Servis</Link>
                            <Link href="/admin/customers/create" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>+ Pelanggan</Link>
                            <Link href="/admin/spare-parts/create" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>+ Spare Part</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Services Table */}
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
