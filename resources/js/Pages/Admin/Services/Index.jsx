import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import StatusBadge from '../../../Components/StatusBadge';
import Pagination from '../../../Components/Pagination';
import { Eye, Edit, Printer } from 'lucide-react';

const fmt = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

export default function ServicesIndex({ services, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');

    const applyFilter = (params) => {
        router.get('/admin/services', { search, status, ...params }, { preserveState: true });
    };

    const statuses = [
        { value: '', label: 'Semua Status' },
        { value: 'antri', label: 'Antri' },
        { value: 'dikerjakan', label: 'Dikerjakan' },
        { value: 'selesai', label: 'Selesai' },
    ];

    return (
        <AdminLayout title="Manajemen Servis">
            <Head title="Daftar Servis" />

            <div className="glass-panel list-panel">
                <header className="list-page-toolbar">
                    <h2 className="list-page-title">Daftar Servis AC</h2>

                    <div className="filter-pills">
                        {statuses.map((s) => (
                            <button
                                key={s.value}
                                type="button"
                                className={`filter-pill${status === s.value ? ' is-active' : ''}`}
                                onClick={() => {
                                    setStatus(s.value);
                                    applyFilter({ status: s.value });
                                }}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <div className="toolbar-search-row">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter({})}
                            type="text"
                            placeholder="Cari plat / pelanggan..."
                            className="form-input toolbar-search-input"
                        />
                        <Link href="/admin/services/create" className="btn btn-primary toolbar-action-btn">
                            + Input Servis
                        </Link>
                    </div>
                </header>

                <div className="table-responsive">
                    <table className="hd-table">
                        <thead>
                            <tr>
                                <th>No. SPK</th>
                                <th>Pelanggan</th>
                                <th>Kendaraan</th>
                                <th>Jasa Utama</th>
                                <th>Mekanik</th>
                                <th>Status</th>
                                <th>Biaya Jasa</th>
                                <th>Pembayaran</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.data?.length > 0 ? (
                                services.data.map((s) => (
                                    <tr key={s.id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>{s.spk_number || '-'}</td>
                                        <td style={{ fontWeight: 500 }}>{s.vehicle?.customer?.name ?? '-'}</td>
                                        <td style={{ fontSize: '0.8rem' }}>{s.vehicle ? `${s.vehicle.brand} ${s.vehicle.model} (${s.vehicle.license_plate})` : '-'}</td>
                                        <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--color-primary)' }}>{s.service_name}</td>
                                        <td style={{ fontSize: '0.8rem' }}>{s.technician?.name ?? '-'}</td>
                                        <td><StatusBadge status={s.status} /></td>
                                        <td style={{ fontSize: '0.8rem' }}>{fmt(s.service_fee)}</td>
                                        <td>
                                            <span
                                                style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.125rem 0.5rem',
                                                    borderRadius: '9999px',
                                                    fontWeight: 600,
                                                    background: s.payment_status === 'lunas' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                                    color: s.payment_status === 'lunas' ? 'var(--color-success)' : 'var(--color-warning)',
                                                }}
                                            >
                                                {s.payment_status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <Link href={`/admin/services/${s.id}`} style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex' }} title="Detail">
                                                    <Eye size={18} />
                                                </Link>
                                                <a href={`/admin/services/${s.id}/spk?print=1`} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-muted)', display: 'flex' }} title="Cetak SPK">
                                                    <Printer size={18} />
                                                </a>
                                                <Link href={`/admin/services/${s.id}/edit`} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', display: 'flex' }} title="Edit">
                                                    <Edit size={18} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                                        Tidak ada data servis.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={services.links} query={{ search, status }} />
            </div>
        </AdminLayout>
    );
}
