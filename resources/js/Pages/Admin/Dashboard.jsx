import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import MetricCard from '../../Components/MetricCard';
import DataTable from '../../Components/DataTable';
import StatusBadge from '../../Components/StatusBadge';

export default function Dashboard({ auth, stats, activeServices }) {
    const columns = [
        { header: 'No. Antrian', accessor: 'id', cell: row => `#${row.id.toString().padStart(4, '0')}` },
        { header: 'Pelanggan', accessor: 'customer_name' },
        { header: 'Kendaraan', accessor: 'vehicle' },
        { header: 'Status', accessor: 'status', cell: row => <StatusBadge status={row.status} /> },
        { header: 'Estimasi Biaya', accessor: 'cost', cell: row => row.cost ? `Rp ${Number(row.cost).toLocaleString('id-ID')}` : '-' },
        { header: 'Mekanik', accessor: 'technician' },
    ];

    // Dummy data for visual presentation if activeServices is empty
    const data = activeServices?.length > 0 ? activeServices : [
        { id: 1042, customer_name: 'Budi Santoso', vehicle: 'Toyota Avanza (B 1234 CD)', status: 'Dikerjakan', cost: 1500000, technician: 'Arif' },
        { id: 1043, customer_name: 'Siti Aminah', vehicle: 'Honda Brio (D 5678 EF)', status: 'Antri', cost: null, technician: '-' },
        { id: 1044, customer_name: 'Agus Wijaya', vehicle: 'Mitsubishi Xpander (F 9012 GH)', status: 'Selesai', cost: 850000, technician: 'Bambang' },
    ];

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Admin Dashboard" />

            <div className="hd-grid hd-grid-cols-4" style={{ marginBottom: '2rem' }}>
                <MetricCard title="Kendaraan Masuk Hari Ini" value={stats?.today_vehicles || 12} trend="+2 dari kemarin" icon="🚗" />
                <MetricCard title="Sedang Dikerjakan" value={stats?.active_services || 5} icon="🔧" />
                <MetricCard title="Selesai Hari Ini" value={stats?.completed_today || 8} icon="✅" />
                <MetricCard title="Pendapatan (Estimasi)" value={`Rp ${((stats?.revenue || 4500000)/1000000).toFixed(1)}M`} trend="+15% bulan ini" icon="💰" />
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Daftar Servis Aktif</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="text" placeholder="Cari plat nomor..." className="form-input" style={{ width: '200px' }} />
                        <button className="btn btn-outline">Filter</button>
                    </div>
                </div>
                <DataTable columns={columns} data={data} />
            </div>
        </AdminLayout>
    );
}
