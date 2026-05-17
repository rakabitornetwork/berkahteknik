import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PortalLayout from '../../Layouts/PortalLayout';
import StatusBadge from '../../Components/StatusBadge';

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

const statusSteps = ['antri', 'dikerjakan', 'selesai'];
const statusLabel = { antri: 'Antri', dikerjakan: 'Dikerjakan', selesai: 'Selesai' };

function Tracker({ status }) {
    const currentIdx = statusSteps.indexOf(status);
    return (
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
            {statusSteps.map((s, i) => (
                <React.Fragment key={s}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <div style={{
                            width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '0.9rem',
                            background: i <= currentIdx ? 'var(--color-primary)' : 'var(--color-border)',
                            color: i <= currentIdx ? 'white' : 'var(--color-text-muted)',
                            boxShadow: i === currentIdx ? 'var(--shadow-glow)' : 'none',
                        }}>
                            {i < currentIdx ? '✓' : i + 1}
                        </div>
                        <span style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: i === currentIdx ? 600 : 400, color: i === currentIdx ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                            {statusLabel[s]}
                        </span>
                    </div>
                    {i < statusSteps.length - 1 && (
                        <div style={{ height: '2px', flex: 2, background: i < currentIdx ? 'var(--color-primary)' : 'var(--color-border)', marginBottom: '1.5rem' }} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

export default function PortalServiceDetail({ service, customer }) {
    return (
        <PortalLayout customer={customer}>
            <Head title={`Detail Servis #${String(service.id).padStart(4, '0')}`} />

            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                {/* Back */}
                <Link href="/portal/dashboard" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>
                    ← Kembali ke Dashboard
                </Link>

                {/* Header */}
                <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'monospace', marginBottom: '0.25rem' }}>
                                Tiket Servis #{String(service.id).padStart(4, '0')}
                            </div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{service.vehicle}</h1>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Masuk: {service.created_at}</div>
                        </div>
                        <StatusBadge status={service.status} />
                    </div>

                    <Tracker status={service.status} />

                    {service.status === 'selesai' && (
                        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '1.25rem' }}>✅</span>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--color-success)' }}>Servis Selesai</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Kendaraan dapat diambil. Selesai pada: {service.completed_at}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Keluhan & Diagnosa */}
                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Keluhan & Diagnosa</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '0.5rem' }}>KELUHAN ANDA</div>
                            <div style={{ lineHeight: 1.7 }}>{service.description}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '0.5rem' }}>DIAGNOSA TEKNISI</div>
                            <div style={{ lineHeight: 1.7 }}>{service.diagnosis || <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Belum ada diagnosa</span>}</div>
                        </div>
                    </div>
                    {service.technician && (
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            🔧 Dikerjakan oleh: <strong>{service.technician}</strong>
                        </div>
                    )}
                </div>

                {/* Rincian Biaya */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rincian Biaya</h2>

                    {service.parts?.length > 0 && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '0.375rem 0', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.75rem' }}>Spare Part</th>
                                    <th style={{ textAlign: 'center', padding: '0.375rem 0', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.75rem' }}>Qty</th>
                                    <th style={{ textAlign: 'right', padding: '0.375rem 0', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.75rem' }}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {service.parts.map((p, i) => (
                                    <tr key={i} style={{ borderTop: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '0.5rem 0' }}>{p.name}</td>
                                        <td style={{ padding: '0.5rem 0', textAlign: 'center' }}>{p.quantity} {p.unit}</td>
                                        <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{fmt(p.quantity * p.unit_price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem', color: 'var(--color-text-muted)' }}>
                            <span>Biaya Jasa</span>
                            <span>{fmt(service.service_fee)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-primary-dark)', paddingTop: '0.5rem', borderTop: '2px solid var(--color-border)', marginTop: '0.5rem' }}>
                            <span>Total</span>
                            <span>{fmt(service.total)}</span>
                        </div>
                        <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
                            <span style={{
                                fontWeight: 600, fontSize: '0.875rem', padding: '0.25rem 0.75rem', borderRadius: '9999px',
                                background: service.payment_status === 'lunas' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                color: service.payment_status === 'lunas' ? 'var(--color-success)' : 'var(--color-warning)',
                            }}>
                                {service.payment_status === 'lunas' ? '✓ Sudah Dibayar' : '⏳ Belum Dibayar'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
