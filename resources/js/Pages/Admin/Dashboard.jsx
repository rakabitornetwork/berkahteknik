import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import MetricCard from '../../Components/MetricCard';
import DataTable from '../../Components/DataTable';
import StatusBadge from '../../Components/StatusBadge';

const fmt = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

export default function Dashboard({ auth, stats, activeServices }) {
    const columns = [
        { header: '#', accessor: 'id', cell: r => <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>#{String(r.id).padStart(4, '0')}</span> },
        { header: 'Pelanggan', accessor: 'customer_name', cell: r => <span style={{ fontWeight: 500 }}>{r.customer_name}</span> },
        { header: 'Kendaraan', accessor: 'vehicle' },
        { header: 'Status', accessor: 'status', cell: r => <StatusBadge status={r.status} /> },
        { header: 'Mekanik', accessor: 'technician' },
        { header: 'Masuk', accessor: 'created_at', cell: r => <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{r.created_at}</span> },
        { header: 'Aksi', accessor: 'id', cell: r => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href={`/admin/services/${r.id}`} style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>Detail</Link>
                {r.status === 'antri' && (
                    <button onClick={() => router.patch(`/admin/services/${r.id}/status`, { status: 'dikerjakan' })}
                        style={{ fontSize: '0.75rem', color: 'var(--color-info)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                        Mulai →
                    </button>
                )}
                {r.status === 'dikerjakan' && (
                    <button onClick={() => router.patch(`/admin/services/${r.id}/status`, { status: 'selesai' })}
                        style={{ fontSize: '0.75rem', color: 'var(--color-success)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                        Selesai ✓
                    </button>
                )}
            </div>
        )},
    ];

    return (
        <AdminLayout title="Dashboard Overview">
            <Head title="Dashboard Admin" />

            {/* Metric Grid */}
            <div className="hd-grid hd-grid-cols-4" style={{ marginBottom: '1rem' }}>
                <MetricCard title="Kendaraan Masuk Hari Ini" value={stats.today_vehicles} icon="🚗" trend={`${stats.queue_services} antri`} />
                <MetricCard title="Sedang Dikerjakan" value={stats.active_services} icon="🔧" />
                <MetricCard title="Selesai Hari Ini" value={stats.completed_today} icon="✅" />
                <MetricCard title="Pendapatan Hari Ini" value={fmt(stats.revenue_today)} icon="💰" trend={`Bulan ini: ${fmt(stats.revenue_month)}`} />
            </div>

            <div className="hd-grid hd-grid-cols-4" style={{ marginBottom: '1.5rem' }}>
                <MetricCard title="Total Pelanggan" value={stats.total_customers} icon="👤" />
                <MetricCard title="Stok Menipis" value={stats.low_stock_parts} icon="⚠️"
                    trend={stats.low_stock_parts > 0 ? 'Perlu restock!' : 'Stok aman'} />
                <div className="glass-panel hover-lift" style={{ padding: '1.5rem', gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Aksi Cepat</div>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <Link href="/admin/services/create" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>+ Servis Baru</Link>
                            <Link href="/admin/customers/create" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>+ Pelanggan</Link>
                            <Link href="/admin/spare-parts/create" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>+ Spare Part</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Services Table */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Antrian & Servis Aktif</h2>
                    <Link href="/admin/services" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>Lihat Semua →</Link>
                </div>
                <DataTable columns={columns} data={activeServices} />
            </div>
        </AdminLayout>
    );
}
