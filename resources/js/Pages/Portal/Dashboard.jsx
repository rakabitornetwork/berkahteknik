import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PortalLayout from '../../Layouts/PortalLayout';
import StatusBadge from '../../Components/StatusBadge';
import { CheckCircle, Clock, Check, Car, ArrowRight } from 'lucide-react';

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

const statusSteps = ['antri', 'dikerjakan', 'selesai'];
const statusLabel = { antri: 'Antri', dikerjakan: 'Dikerjakan', selesai: 'Selesai' };

function ServiceTracker({ status }) {
    const currentIdx = statusSteps.indexOf(status);
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '1rem 0' }}>
            {statusSteps.map((s, i) => (
                <React.Fragment key={s}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '0.85rem', transition: 'all var(--transition-normal)',
                            background: i <= currentIdx ? 'var(--color-primary)' : 'var(--color-border)',
                            color: i <= currentIdx ? 'white' : 'var(--color-text-muted)',
                            boxShadow: i === currentIdx ? 'var(--shadow-glow)' : 'none',
                        }}>
                            {i < currentIdx ? <Check size={16} strokeWidth={2.5} /> : i + 1}
                        </div>
                        <span style={{ fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: i === currentIdx ? 600 : 400, color: i === currentIdx ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                            {statusLabel[s]}
                        </span>
                    </div>
                    {i < statusSteps.length - 1 && (
                        <div style={{ height: '2px', flex: 2, background: i < currentIdx ? 'var(--color-primary)' : 'var(--color-border)', transition: 'background var(--transition-normal)', marginBottom: '1.25rem' }} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

export default function PortalDashboard({ customer, vehicles, activeService }) {
    const [activeVehicle, setActiveVehicle] = useState(vehicles?.[0]?.id || null);

    const selectedVehicle = vehicles?.find(v => v.id === activeVehicle);

    return (
        <PortalLayout customer={customer}>
            <Head title="Dashboard Pelanggan" />

            {/* Welcome */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary-dark)', margin: 0 }}>
                        Selamat datang, {customer?.name}!
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem', margin: 0 }}>
                        Pantau status pengerjaan AC mobil Anda secara real-time.
                    </p>
                </div>
                {vehicles?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link href="/portal/vehicles/create" className="btn btn-outline" style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
                            + Tambah Kendaraan
                        </Link>
                        <Link href="/portal/bookings/create" className="btn btn-primary" style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
                            Booking Servis AC
                        </Link>
                    </div>
                )}
            </div>

            {/* Active Service Banner */}
            {activeService && (
                <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', borderLeft: '4px solid var(--color-info)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-info)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Servis Aktif</div>
                        <div style={{ fontWeight: 600 }}>{activeService.description}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>Teknisi: {activeService.technician || 'Menunggu teknisi'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <StatusBadge status={activeService.status} />
                        <Link href={`/portal/services/${activeService.id}`} className="btn btn-primary" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Detail <ArrowRight size={14} /></Link>
                    </div>
                </div>
            )}

            {/* No vehicles */}
            {vehicles?.length === 0 && (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--color-text-muted)' }}><Car size={48} strokeWidth={1.5} /></div>
                    <h2 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Belum ada kendaraan terdaftar</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Daftarkan kendaraan Anda terlebih dahulu untuk mulai melakukan reservasi servis AC secara online.</p>
                    <Link href="/portal/vehicles/create" className="btn btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                        + Daftarkan Kendaraan Sekarang
                    </Link>
                </div>
            )}

            {/* Vehicle Tabs */}
            {vehicles?.length > 0 && (
                <>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                        {vehicles.map(v => (
                            <button key={v.id} onClick={() => setActiveVehicle(v.id)}
                                style={{
                                    padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid',
                                    fontWeight: 500, cursor: 'pointer', fontSize: '0.85rem',
                                    transition: 'all var(--transition-fast)',
                                    borderColor: activeVehicle === v.id ? 'var(--color-primary)' : 'var(--color-border)',
                                    background: activeVehicle === v.id ? 'var(--color-primary)' : 'white',
                                    color: activeVehicle === v.id ? 'white' : 'var(--color-text-muted)',
                                }}>
                                {v.brand} {v.model} · {v.license_plate}
                            </button>
                        ))}
                    </div>

                    {selectedVehicle && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {selectedVehicle.services?.length === 0 && (
                                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    Belum ada riwayat servis untuk kendaraan ini.
                                </div>
                            )}

                            {selectedVehicle.services?.map(s => (
                                <div key={s.id} className="glass-panel hover-lift" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                                        <div>
                                            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>#{String(s.id).padStart(4, '0')} · {s.created_at}</div>
                                            <div style={{ fontWeight: 600, fontSize: '1rem' }}>{s.description}</div>
                                        </div>
                                        <StatusBadge status={s.status} />
                                    </div>

                                    <ServiceTracker status={s.status} />

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>TEKNISI</div>
                                            <div style={{ fontWeight: 500, marginTop: '0.125rem' }}>{s.technician || '-'}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>TOTAL BIAYA</div>
                                            <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)', marginTop: '0.125rem', fontSize: '1.1rem' }}>{fmt(s.total)}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>PEMBAYARAN</div>
                                            <div style={{ fontWeight: 600, marginTop: '0.125rem', color: s.payment_status === 'lunas' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    {s.payment_status === 'lunas' ? <><CheckCircle size={14} strokeWidth={2.5} /> Lunas</> : <><Clock size={14} strokeWidth={2.5} /> Belum Lunas</>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                                        <Link href={`/portal/services/${s.id}`} style={{ color: 'var(--color-primary)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>Lihat Detail Lengkap <ArrowRight size={14} /></span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </PortalLayout>
    );
}
