import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import MechanicLayout from '../../Layouts/MechanicLayout';
import StatusBadge from '../../Components/StatusBadge';
import { ArrowLeft, Play, CheckCircle2, Save, Wrench, Phone, FileText } from 'lucide-react';

export default function MechanicServiceShow({ mechanic, service }) {
    const isCompleted = service.status === 'selesai';

    const { data, setData, post, processing, errors } = useForm({
        diagnosis: service.diagnosis || '',
        mechanic_notes: service.mechanic_notes || '',
    });

    const handleSaveNotes = (e) => {
        e.preventDefault();
        post(`/mechanic/services/${service.id}/notes`, {
            preserveScroll: true
        });
    };

    const handleStatusChange = (newStatus) => {
        const actionLabel = newStatus === 'dikerjakan' ? 'mulai pengerjaan' : 'menyelesaikan';
        if (!window.confirm(`Yakin ingin menandai ${actionLabel} servis ini?`)) {
            return;
        }

        router.patch(`/mechanic/services/${service.id}/status`, {
            status: newStatus
        }, {
            preserveScroll: true
        });
    };

    return (
        <MechanicLayout mechanic={mechanic}>
            <Head title={`Pekerjaan ${service.spk_number || 'Servis'}`} />

            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Header */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <Link href="/mechanic/dashboard" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <ArrowLeft size={14} /> Kembali ke Daftar Kerja
                            </Link>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>
                                {service.vehicle}
                            </h2>
                            {service.spk_number && (
                                <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.35rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <FileText size={14} /> {service.spk_number}
                                </div>
                            )}
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                                Tanggal SPK: {service.created_at}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <StatusBadge status={service.status} />
                        </div>
                    </div>
                </div>

                {/* Status Actions Banner */}
                {!isCompleted && (
                    <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid var(--color-primary)' }}>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                {service.status === 'antri' ? 'Pekerjaan Siap Dimulai' : 'Pekerjaan Sedang Berlangsung'}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                                {service.status === 'antri' 
                                    ? 'Klik tombol di samping jika Anda siap untuk mulai mengerjakan kendaraan ini.' 
                                    : 'Klik selesai jika seluruh perawatan AC kendaraan sudah beres.'}
                            </div>
                        </div>
                        <div>
                            {service.status === 'antri' && (
                                <button
                                    onClick={() => handleStatusChange('dikerjakan')}
                                    className="btn btn-primary"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                                >
                                    <Play size={14} fill="white" /> Mulai Pengerjaan
                                </button>
                            )}
                            {service.status === 'dikerjakan' && (
                                <button
                                    onClick={() => handleStatusChange('selesai')}
                                    className="btn btn-primary"
                                    style={{ background: 'var(--color-success)', borderColor: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                                >
                                    <CheckCircle2 size={14} /> Selesai Dikerjakan
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Info Pelanggan */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    <div className="glass-panel" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kendaraan & Pelanggan</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', pb: '0.25rem' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Pelanggan</span>
                                <span style={{ fontWeight: 600 }}>{service.customer_name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', pb: '0.25rem' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Plat Nomor</span>
                                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{service.license_plate}</span>
                            </div>
                            {service.customer_phone && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', pt: '0.25rem' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Kontak Pelanggan</span>
                                    <a href={`tel:${service.customer_phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary-light)', textDecoration: 'none', fontWeight: 600 }}>
                                        <Phone size={14} /> {service.customer_phone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Waktu Pengerjaan</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', pb: '0.25rem' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Mulai Kerja</span>
                                <span>{service.started_at || '-'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Selesai Kerja</span>
                                <span>{service.completed_at || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deskripsi & Instruksi Admin */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Keluhan & Instruksi Kerja</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>KELUHAN PELANGGAN</div>
                            <div style={{ fontSize: '0.9rem', lineHeight: 1.6, background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: '6px' }}>
                                {service.description}
                            </div>
                        </div>

                        {service.work_instructions && (
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-warning)', fontWeight: 600, marginBottom: '0.25rem' }}>INSTRUKSI KERJA ADMIN</div>
                                <div style={{ fontSize: '0.9rem', lineHeight: 1.6, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '0.75rem', borderRadius: '6px', color: 'var(--color-text-main)' }}>
                                    {service.work_instructions}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Pengisian Catatan Mekanik & Diagnosa */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Input Diagnosa & Catatan Teknis</h3>
                    <form onSubmit={handleSaveNotes} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="form-label" style={{ color: 'var(--color-text-main)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>
                                Diagnosa Kerusakan / Jasa Penanganan
                            </label>
                            <input
                                type="text"
                                value={data.diagnosis}
                                onChange={e => setData('diagnosis', e.target.value)}
                                className="form-input"
                                placeholder="Contoh: Evaporator bocor, ganti seal, vacum & isi freon ulang"
                                disabled={isCompleted}
                            />
                            {errors.diagnosis && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.diagnosis}</div>}
                        </div>

                        <div>
                            <label className="form-label" style={{ color: 'var(--color-text-main)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>
                                Catatan Hasil Kerja Mekanik
                            </label>
                            <textarea
                                value={data.mechanic_notes}
                                onChange={e => setData('mechanic_notes', e.target.value)}
                                className="form-input"
                                rows="4"
                                placeholder="Tuliskan catatan teknis hasil pengerjaan (misal: Kompresor AC dibersihkan, oli kompresor diganti baru)"
                                disabled={isCompleted}
                            ></textarea>
                            {errors.mechanic_notes && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.mechanic_notes}</div>}
                        </div>

                        {!isCompleted && (
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={processing}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', alignSelf: 'flex-start' }}
                            >
                                <Save size={16} /> {processing ? 'Menyimpan...' : 'Simpan Catatan Kerja'}
                            </button>
                        )}
                    </form>
                </div>

                {/* Suku Cadang yang Digunakan */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suku Cadang yang Dipasang (Ref)</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="hd-table">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Nama Spare Part</th>
                                    <th style={{ textAlign: 'center', width: '6rem' }}>Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {service.spare_parts?.length > 0 ? (
                                    service.spare_parts.map((p, i) => (
                                        <tr key={i}>
                                            <td>{p.name}</td>
                                            <td style={{ textAlign: 'center', fontWeight: 600 }}>{p.quantity} {p.unit}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '1.5rem' }}>
                                            Tidak ada penggantian suku cadang yang tercatat dari admin.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MechanicLayout>
    );
}
