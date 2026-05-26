import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MechanicLayout from '../../Layouts/MechanicLayout';
import StatusBadge from '../../Components/StatusBadge';
import { Calendar, Play, Eye, CheckCircle2, ClipboardList, CheckCircle } from 'lucide-react';

export default function MechanicDashboard({ mechanic, activeServices, completedServices }) {
    const [tab, setTab] = useState('active'); // 'active' or 'completed'

    return (
        <MechanicLayout mechanic={mechanic}>
            <Head title="Dashboard Mekanik" />

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary-dark)', margin: 0 }}>
                    Halo, {mechanic.name}!
                </h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem', margin: 0 }}>
                    Berikut adalah daftar pekerjaan servis AC mobil yang ditugaskan kepada Anda.
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem', gap: '1.5rem' }}>
                <button
                    onClick={() => setTab('active')}
                    style={{
                        padding: '0.75rem 0.25rem', fontSize: '0.9rem', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer',
                        color: tab === 'active' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        borderBottom: tab === 'active' ? '2.5px solid var(--color-primary)' : 'none',
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem'
                    }}
                >
                    <ClipboardList size={16} /> Aktif / Antrean ({activeServices.length})
                </button>
                <button
                    onClick={() => setTab('completed')}
                    style={{
                        padding: '0.75rem 0.25rem', fontSize: '0.9rem', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer',
                        color: tab === 'completed' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        borderBottom: tab === 'completed' ? '2.5px solid var(--color-primary)' : 'none',
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem'
                    }}
                >
                    <CheckCircle2 size={16} /> Selesai Dikerjakan ({completedServices.length})
                </button>
            </div>

            {tab === 'active' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {activeServices.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            <CheckCircle size={40} style={{ color: 'var(--color-success)', marginBottom: '0.75rem' }} />
                            <div style={{ fontWeight: 600 }}>Hebat! Tidak ada antrean kerja untuk Anda saat ini.</div>
                            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Silakan bersantai atau hubungi admin jika ada kendaraan masuk.</p>
                        </div>
                    ) : (
                        activeServices.map(s => (
                            <div key={s.id} className="glass-panel hover-lift" style={{ padding: '1.25rem 1.5rem', borderLeft: s.status === 'dikerjakan' ? '4px solid var(--color-info)' : '4px solid var(--color-warning)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.85rem' }}>
                                                {s.spk_number || `Servis #${String(s.id).padStart(4, '0')}`}
                                            </span>
                                            {s.scheduled_at && (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary-light)', padding: '0.15rem 0.35rem', borderRadius: '4px', fontWeight: 600 }}>
                                                    <Calendar size={10} /> Booking: {s.scheduled_at}
                                                </span>
                                            )}
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.25rem 0' }}>{s.vehicle}</h3>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', fontWeight: 550 }}>Layanan: {s.service_name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Pelanggan: {s.customer_name}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <StatusBadge status={s.status} />
                                        <Link href={`/mechanic/services/${s.id}`} className="btn btn-primary" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
                                            {s.status === 'antri' ? <Play size={12} fill="white" /> : <Eye size={12} />}
                                            {s.status === 'antri' ? 'Mulai Kerja' : 'Detail'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {completedServices.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            Belum ada penugasan yang selesai dikerjakan pada bulan ini.
                        </div>
                    ) : (
                        completedServices.map(s => (
                            <div key={s.id} className="glass-panel" style={{ padding: '1.25rem 1.5rem', opacity: 0.85 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                            {s.spk_number || `Servis #${String(s.id).padStart(4, '0')}`}
                                        </div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0.25rem 0' }}>{s.vehicle}</h3>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>Layanan: {s.service_name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Pelanggan: {s.customer_name} · Selesai: {s.completed_at}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-success)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '9999px' }}>
                                            Selesai
                                        </span>
                                        <Link href={`/mechanic/services/${s.id}`} className="btn btn-outline" style={{ fontSize: '0.8rem', textDecoration: 'none' }}>
                                            Lihat Riwayat
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </MechanicLayout>
    );
}
