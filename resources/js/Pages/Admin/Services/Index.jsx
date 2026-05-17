import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import StatusBadge from '../../../Components/StatusBadge';
import { Eye, Edit } from 'lucide-react';

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

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Daftar Servis AC</h2>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flex: '1 1 auto', justifyContent: 'flex-end' }}>
                        {/* Status Tabs */}
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                            {statuses.map(s => (
                                <button key={s.value} onClick={() => { setStatus(s.value); applyFilter({ status: s.value }); }}
                                    style={{
                                        padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderRadius: '9999px',
                                        border: '1px solid', cursor: 'pointer', transition: 'all var(--transition-fast)',
                                        borderColor: status === s.value ? 'var(--color-primary)' : 'var(--color-border)',
                                        background: status === s.value ? 'var(--color-primary)' : 'transparent',
                                        color: status === s.value ? 'white' : 'var(--color-text-muted)',
                                    }}>
                                    {s.label}
                                </button>
                            ))}
                        </div>
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyFilter({})}
                            type="text" placeholder="Cari plat / pelanggan..."
                            className="form-input" style={{ width: '100%', maxWidth: '200px', flex: '1 1 auto', minWidth: '150px' }} />
                        <Link href="/admin/services/create" className="btn btn-primary" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', flex: '0 0 auto' }}>+ Input Servis</Link>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="hd-table">
                        <thead>
                            <tr>
                                <th>#</th>
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
                            {services.data?.length > 0 ? services.data.map(s => (
                                <tr key={s.id}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>#{String(s.id).padStart(4, '0')}</td>
                                    <td style={{ fontWeight: 500 }}>{s.vehicle?.customer?.name ?? '-'}</td>
                                    <td style={{ fontSize: '0.8rem' }}>{s.vehicle ? `${s.vehicle.brand} ${s.vehicle.model} (${s.vehicle.license_plate})` : '-'}</td>
                                    <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--color-primary)' }}>{s.service_name}</td>
                                    <td style={{ fontSize: '0.8rem' }}>{s.technician?.name ?? '-'}</td>
                                    <td><StatusBadge status={s.status} /></td>
                                    <td style={{ fontSize: '0.8rem' }}>{fmt(s.service_fee)}</td>
                                    <td>
                                        <span style={{
                                            fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontWeight: 600,
                                            background: s.payment_status === 'lunas' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                            color: s.payment_status === 'lunas' ? 'var(--color-success)' : 'var(--color-warning)',
                                        }}>
                                            {s.payment_status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <Link href={`/admin/services/${s.id}`} style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex' }} title="Detail">
                                                <Eye size={18} />
                                            </Link>
                                            <Link href={`/admin/services/${s.id}/edit`} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', display: 'flex' }} title="Edit">
                                                <Edit size={18} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>Tidak ada data servis.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {services.links && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                        {services.links.map((link, i) => (
                            <button key={i} onClick={() => link.url && router.get(link.url, { search, status })}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                style={{
                                    padding: '0.3rem 0.65rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--color-border)',
                                    background: link.active ? 'var(--color-primary)' : 'transparent',
                                    color: link.active ? 'white' : 'var(--color-text-muted)',
                                    cursor: link.url ? 'pointer' : 'not-allowed',
                                }} />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
