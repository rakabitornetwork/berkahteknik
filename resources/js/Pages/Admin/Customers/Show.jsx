import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import StatusBadge from '../../../Components/StatusBadge';

const fmt = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

export default function CustomerShow({ customer }) {
    return (
        <AdminLayout title={`Pelanggan: ${customer.name}`}>
            <Head title={`Pelanggan - ${customer.name}`} />

            <div style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Header */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <Link href="/admin/customers" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>← Kembali</Link>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{customer.name}</h2>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>📞 {customer.phone}</span>
                            {customer.address && <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>📍 {customer.address}</span>}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link href={`/admin/customers/${customer.id}/edit`} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Edit Profil</Link>
                    </div>
                </div>

                {/* Kendaraan */}
                {customer.vehicles?.map(vehicle => (
                    <div key={vehicle.id} className="glass-panel hover-lift" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{vehicle.brand} {vehicle.model}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '1rem' }}>{vehicle.license_plate}</span>
                                    {vehicle.year && ` · ${vehicle.year}`}
                                </div>
                            </div>
                            <span style={{ background: 'var(--color-primary-alpha)', color: 'var(--color-primary)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600 }}>
                                {vehicle.services?.length || 0} servis
                            </span>
                        </div>

                        {vehicle.services?.length > 0 && (
                            <table className="hd-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Keluhan</th>
                                        <th>Teknisi</th>
                                        <th>Status</th>
                                        <th>Total</th>
                                        <th>Tanggal</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicle.services.map(s => {
                                        const partsTotal = s.spare_parts?.reduce((sum, p) => sum + (p.pivot?.quantity * p.pivot?.unit_price || 0), 0) || 0;
                                        const total = partsTotal + Number(s.service_fee || 0);
                                        return (
                                            <tr key={s.id}>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>#{String(s.id).padStart(4, '0')}</td>
                                                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{s.description}</td>
                                                <td style={{ fontSize: '0.8rem' }}>{s.technician?.name || '-'}</td>
                                                <td><StatusBadge status={s.status} /></td>
                                                <td style={{ fontSize: '0.85rem', fontWeight: 500 }}>{fmt(total)}</td>
                                                <td style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{new Date(s.created_at).toLocaleDateString('id-ID')}</td>
                                                <td><Link href={`/admin/services/${s.id}`} style={{ color: 'var(--color-primary)', fontSize: '0.8rem', textDecoration: 'none' }}>Detail</Link></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                ))}

                {(!customer.vehicles || customer.vehicles.length === 0) && (
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        Pelanggan ini belum memiliki kendaraan yang terdaftar.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
