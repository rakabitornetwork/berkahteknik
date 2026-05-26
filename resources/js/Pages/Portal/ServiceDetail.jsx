import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PortalLayout from '../../Layouts/PortalLayout';
import StatusBadge from '../../Components/StatusBadge';
import { CheckCircle, Clock, Check, Wrench, ArrowLeft } from 'lucide-react';

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
                            {i < currentIdx ? <Check size={16} strokeWidth={2.5} /> : i + 1}
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
    const isBooking = service.status === 'booking';
    const [newSchedule, setNewSchedule] = useState('');
    const [claimText, setClaimText] = useState('');

    return (
        <PortalLayout customer={customer}>
            <Head title={isBooking ? `Detail Booking #${String(service.id).padStart(4, '0')}` : `Detail Servis #${String(service.id).padStart(4, '0')}`} />

            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                {/* Back */}
                <Link href="/portal/dashboard" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem' }}>
                    <ArrowLeft size={14} /> Kembali ke Dashboard
                </Link>

                {isBooking ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Booking Header */}
                        <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--color-warning)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'monospace', marginBottom: '0.25rem' }}>
                                        Tiket Reservasi #{String(service.id).padStart(4, '0')}
                                    </div>
                                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{service.vehicle}</h1>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Diajukan: {service.created_at}</div>
                                </div>
                                <StatusBadge status={service.status} />
                            </div>

                            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                                <span style={{ display: 'flex', color: 'var(--color-warning)' }}><Clock size={24} strokeWidth={2} /></span>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--color-warning)' }}>Reservasi Menunggu Konfirmasi</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Silakan datang ke bengkel sesuai dengan jadwal rencana kedatangan Anda di bawah.</div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detail Reservasi</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>RENCANA KEDATANGAN</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>{service.scheduled_at}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>RENCANA JASA SERVIS</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{service.service_name}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>KELUHAN KENDARAAN</div>
                                    <div style={{ fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{service.description}</div>
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'grid', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => router.patch(`/portal/bookings/${service.id}/cancel`)}>
                                        Batalkan Booking
                                    </button>
                                </div>
                                <form onSubmit={e => { e.preventDefault(); router.patch(`/portal/bookings/${service.id}/reschedule`, { scheduled_at: newSchedule }); }} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <input className="form-input" type="datetime-local" value={newSchedule} onChange={e => setNewSchedule(e.target.value)} required style={{ maxWidth: '240px' }} />
                                    <button type="submit" className="btn btn-primary">Ajukan Ubah Jadwal</button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
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
                                    <span style={{ display: 'flex', color: 'var(--color-success)' }}><CheckCircle size={24} strokeWidth={2} /></span>
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                    <Wrench size={16} strokeWidth={2} /> <span>Dikerjakan oleh: <strong>{service.technician}</strong></span>
                                </div>
                            )}
                        </div>

                        {service.status === 'selesai' && (
                            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                                <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Garansi Servis</h2>
                                <div style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                                    <p style={{ margin: '0 0 0.5rem' }}>Masa garansi: <strong>{service.effective_warranty_months} bulan</strong></p>
                                    {service.warranty_starts_at && <p style={{ margin: '0 0 0.5rem' }}>Mulai: {service.warranty_starts_at}</p>}
                                    {service.warranty_expires_at && <p style={{ margin: '0 0 0.5rem' }}>Berlaku hingga: {new Date(service.warranty_expires_at).toLocaleDateString('id-ID')}</p>}
                                    <p style={{ margin: 0, fontWeight: 600, color: service.has_active_warranty ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                                        {service.has_active_warranty ? 'Status: Garansi masih aktif' : 'Status: Garansi tidak aktif / telah berakhir'}
                                    </p>
                                    {service.warranty_notes && <p style={{ marginTop: '0.75rem', color: 'var(--color-text-muted)' }}>{service.warranty_notes}</p>}
                                </div>
                                {service.has_active_warranty && (
                                    <form onSubmit={e => { e.preventDefault(); router.post(`/portal/services/${service.id}/warranty-claims`, { complaint: claimText }); }} style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
                                        <textarea className="form-input" rows={3} value={claimText} onChange={e => setClaimText(e.target.value)} placeholder="Jelaskan keluhan untuk klaim garansi..." required />
                                        <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>Ajukan Klaim Garansi</button>
                                    </form>
                                )}
                            </div>
                        )}

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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                                    <span style={{
                                        fontWeight: 600, fontSize: '0.875rem', padding: '0.25rem 0.75rem', borderRadius: '9999px',
                                        background: service.payment_status === 'lunas' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                        color: service.payment_status === 'lunas' ? 'var(--color-success)' : 'var(--color-warning)',
                                        display: 'inline-flex', alignItems: 'center', gap: '0.375rem'
                                    }}>
                                        {service.payment_status === 'lunas' ? <><CheckCircle size={14} strokeWidth={2.5} /> Sudah Dibayar</> : <><Clock size={14} strokeWidth={2.5} /> Belum Dibayar</>}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </PortalLayout>
    );
}
