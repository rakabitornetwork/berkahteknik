import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import StatusBadge from '../../../Components/StatusBadge';

const fmt = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

export default function ServiceShow({ service }) {
    const partsTotal = service.spare_parts?.reduce((sum, p) => sum + (p.pivot.quantity * p.pivot.unit_price), 0) || 0;
    const grandTotal = partsTotal + Number(service.service_fee || 0);

    return (
        <AdminLayout title={`Detail Servis #${String(service.id).padStart(4, '0')}`}>
            <Head title={`Servis #${service.id}`} />

            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Header Card */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <Link href="/admin/services" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>← Kembali ke Daftar</Link>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>
                                Servis #{String(service.id).padStart(4, '0')}
                            </h2>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                Masuk: {new Date(service.created_at).toLocaleString('id-ID')}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <StatusBadge status={service.status} />
                            <Link href={`/admin/services/${service.id}/edit`} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Edit</Link>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {/* Pelanggan & Kendaraan */}
                    <div className="glass-panel" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem' }}>Kendaraan & Pelanggan</h3>
                        <InfoRow label="Pelanggan" value={service.vehicle?.customer?.name} />
                        <InfoRow label="Telepon" value={service.vehicle?.customer?.phone} />
                        <InfoRow label="Kendaraan" value={`${service.vehicle?.brand} ${service.vehicle?.model}`} />
                        <InfoRow label="Plat Nomor" value={service.vehicle?.license_plate} bold />
                        <InfoRow label="Tahun" value={service.vehicle?.year || '-'} />
                    </div>

                    {/* Penanganan */}
                    <div className="glass-panel" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem' }}>Info Penanganan</h3>
                        <InfoRow label="Teknisi" value={service.technician?.name || 'Belum ditugaskan'} />
                        <InfoRow label="Status" value={<StatusBadge status={service.status} />} />
                        <InfoRow label="Mulai" value={service.started_at ? new Date(service.started_at).toLocaleString('id-ID') : '-'} />
                        <InfoRow label="Selesai" value={service.completed_at ? new Date(service.completed_at).toLocaleString('id-ID') : '-'} />
                        <InfoRow label="Pembayaran" value={
                            <span style={{ fontWeight: 600, color: service.payment_status === 'lunas' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                                {service.payment_status === 'lunas' ? '✓ Lunas' : '⏳ Belum Lunas'}
                            </span>
                        } />
                    </div>
                </div>

                {/* Keluhan & Diagnosa */}
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem' }}>Keluhan & Diagnosa</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>KELUHAN PELANGGAN</div>
                            <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{service.description}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>DIAGNOSA TEKNISI</div>
                            <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{service.diagnosis || <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Belum ada diagnosa</span>}</div>
                        </div>
                    </div>
                </div>

                {/* Spare Parts & Invoice */}
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem' }}>Spare Part & Rincian Biaya</h3>
                    <table className="hd-table" style={{ marginBottom: '1rem' }}>
                        <thead>
                            <tr>
                                <th>Nama Spare Part</th>
                                <th style={{ textAlign: 'center' }}>Qty</th>
                                <th style={{ textAlign: 'right' }}>Harga Satuan</th>
                                <th style={{ textAlign: 'right' }}>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {service.spare_parts?.length > 0 ? service.spare_parts.map((p, i) => (
                                <tr key={i}>
                                    <td>{p.name}</td>
                                    <td style={{ textAlign: 'center' }}>{p.pivot.quantity} {p.unit}</td>
                                    <td style={{ textAlign: 'right' }}>{fmt(p.pivot.unit_price)}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 500 }}>{fmt(p.pivot.quantity * p.pivot.unit_price)}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Tidak ada spare part</td></tr>
                            )}
                            <tr style={{ borderTop: '2px solid var(--color-border)' }}>
                                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 500, paddingTop: '0.75rem' }}>Biaya Jasa</td>
                                <td style={{ textAlign: 'right', paddingTop: '0.75rem' }}>{fmt(service.service_fee)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary-dark)' }}>TOTAL</td>
                                <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary-dark)' }}>{fmt(grandTotal)}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Status Update Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px dashed var(--color-border)', flexWrap: 'wrap' }}>
                        {service.status === 'antri' && (
                            <button onClick={() => router.patch(`/admin/services/${service.id}/status`, { status: 'dikerjakan' })}
                                className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                                🔧 Mulai Pengerjaan
                            </button>
                        )}
                        {service.status === 'dikerjakan' && (
                            <button onClick={() => router.patch(`/admin/services/${service.id}/status`, { status: 'selesai' })}
                                className="btn btn-primary" style={{ fontSize: '0.85rem', background: 'var(--color-success)' }}>
                                ✓ Tandai Selesai
                            </button>
                        )}
                        {service.payment_status === 'belum_lunas' && service.status === 'selesai' && (
                            <button onClick={() => router.put(`/admin/services/${service.id}`, { ...service, payment_status: 'lunas', status: 'selesai' })}
                                className="btn btn-outline" style={{ fontSize: '0.85rem', borderColor: 'var(--color-success)', color: 'var(--color-success)' }}>
                                💳 Tandai Lunas
                            </button>
                        )}
                        <button onClick={() => { if (confirm('Hapus servis ini?')) router.delete(`/admin/services/${service.id}`) }}
                            className="btn btn-outline" style={{ fontSize: '0.85rem', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', marginLeft: 'auto' }}>
                            Hapus Servis
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function InfoRow({ label, value, bold }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem', gap: '1rem' }}>
            <span style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>{label}</span>
            <span style={{ fontWeight: bold ? 700 : 400, textAlign: 'right' }}>{value}</span>
        </div>
    );
}
