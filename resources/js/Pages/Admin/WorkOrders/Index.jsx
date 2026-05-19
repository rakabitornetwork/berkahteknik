import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import StatusBadge from '../../../Components/StatusBadge';
import Pagination from '../../../Components/Pagination';
import { Eye, Printer, Search } from 'lucide-react';

export default function WorkOrdersIndex({ services, mechanics, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [mechanicId, setMechanicId] = useState(filters?.mechanic_id || '');

    const apply = (extra = {}) => {
        router.get('/admin/work-orders', {
            search,
            status,
            mechanic_id: mechanicId,
            ...extra,
        }, { preserveState: true });
    };

    return (
        <AdminLayout title="Surat Perintah Kerja">
            <Head title="Surat Perintah Kerja" />

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.35rem' }}>Daftar Surat Perintah Kerja (SPK)</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                        Setiap servis memiliki nomor SPK unik. Gunakan nomor ini saat menangani komplain pelanggan — lacak mekanik penanggung jawab dan detail pekerjaan.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && apply()}
                        type="text"
                        placeholder="Cari nomor SPK, plat, pelanggan..."
                        className="form-input"
                        style={{ flex: '1 1 200px', minWidth: '180px' }}
                    />
                    <select className="form-input" value={mechanicId} onChange={e => { setMechanicId(e.target.value); apply({ mechanic_id: e.target.value }); }} style={{ minWidth: '160px' }}>
                        <option value="">Semua Mekanik</option>
                        {mechanics?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                    <select className="form-input" value={status} onChange={e => { setStatus(e.target.value); apply({ status: e.target.value }); }} style={{ minWidth: '140px' }}>
                        <option value="">Semua Status</option>
                        <option value="antri">Antri</option>
                        <option value="dikerjakan">Dikerjakan</option>
                        <option value="selesai">Selesai</option>
                    </select>
                    <button type="button" onClick={() => apply()} className="btn btn-primary" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Search size={16} /> Cari
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="hd-table">
                        <thead>
                            <tr>
                                <th>No. SPK</th>
                                <th>Pelanggan</th>
                                <th>Kendaraan</th>
                                <th>Jenis Jasa</th>
                                <th>Mekanik</th>
                                <th>Status</th>
                                <th>Tgl SPK</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.data?.length > 0 ? services.data.map(s => (
                                <tr key={s.id}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-primary)' }}>{s.spk_number}</td>
                                    <td style={{ fontWeight: 500 }}>{s.vehicle?.customer?.name ?? '-'}</td>
                                    <td style={{ fontSize: '0.8rem' }}>{s.vehicle?.license_plate ?? '-'}</td>
                                    <td style={{ fontSize: '0.8rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.service_name}</td>
                                    <td style={{ fontSize: '0.8rem' }}>{s.technician?.name ?? <span style={{ color: 'var(--color-warning)' }}>Belum ditugaskan</span>}</td>
                                    <td><StatusBadge status={s.status} /></td>
                                    <td style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                        {s.spk_issued_at ? new Date(s.spk_issued_at).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link href={`/admin/services/${s.id}`} style={{ color: 'var(--color-primary)' }} title="Detail servis"><Eye size={18} /></Link>
                                            <a href={`/admin/services/${s.id}/spk?print=1`} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-muted)' }} title="Cetak SPK"><Printer size={18} /></a>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Belum ada SPK.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={services.links} query={{ search, status, mechanic_id: mechanicId }} />
            </div>
        </AdminLayout>
    );
}
