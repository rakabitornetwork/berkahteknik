import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import StatusBadge from '../../../Components/StatusBadge';
import { Car, Wrench, Edit, Trash2, ArrowRight, ArrowLeft, Phone, MapPin, Eye } from 'lucide-react';

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

export default function CustomerShow({ customer }) {
    return (
        <AdminLayout title={`Pelanggan: ${customer.name}`}>
            <Head title={`Pelanggan - ${customer.name}`} />

            <div style={{ maxWidth: '960px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* ── Header Card ─────────────────────────────────────── */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <Link href="/admin/customers" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><ArrowLeft size={14} /> Kembali ke Daftar Pelanggan</Link>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{customer.name}</h2>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}><Phone size={14} /> {customer.phone}</span>
                            {customer.address && <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}><MapPin size={14} /> {customer.address}</span>}
                        </div>
                    </div>
                    {/* Tombol Aksi Header */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Link
                            href={`/admin/vehicles/create?customer_id=${customer.id}`}
                            className="btn btn-primary"
                            style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                        >
                            <Car size={16} /> Tambah Kendaraan
                        </Link>
                        <Link
                            href={`/admin/customers/${customer.id}/edit`}
                            className="btn btn-outline"
                            style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                        >
                            <Edit size={16} /> Edit Profil
                        </Link>
                    </div>
                </div>

                {/* ── Empty State ─────────────────────────────────────── */}
                {(!customer.vehicles || customer.vehicles.length === 0) && (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--color-text-muted)' }}><Car size={48} strokeWidth={1.5} /></div>
                        <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Belum ada kendaraan terdaftar</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            Tambahkan kendaraan milik pelanggan untuk mulai mencatat riwayat servis.
                        </p>
                        <Link href={`/admin/vehicles/create?customer_id=${customer.id}`} className="btn btn-primary">
                            + Tambah Kendaraan Pertama
                        </Link>
                    </div>
                )}

                {/* ── Daftar Kendaraan ─────────────────────────────────── */}
                {customer.vehicles?.map(vehicle => (
                    <div key={vehicle.id} className="glass-panel" style={{ padding: '1.25rem' }}>

                        {/* Vehicle Header */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            marginBottom: '1rem',
                            flexWrap: 'wrap', gap: '0.75rem',
                            paddingBottom: vehicle.services?.length > 0 ? '1rem' : '0',
                            borderBottom: vehicle.services?.length > 0 ? '1px solid var(--color-border)' : 'none',
                        }}>
                            {/* Vehicle Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '46px', height: '46px', borderRadius: '12px',
                                    background: 'linear-gradient(135deg, var(--color-primary-alpha), rgba(0,91,150,0.15))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                                    flexShrink: 0, color: 'var(--color-primary-dark)'
                                }}><Car size={24} /></div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                                        {vehicle.brand} {vehicle.model}
                                        {vehicle.year && <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', fontSize: '0.875rem', marginLeft: '0.5rem' }}>({vehicle.year})</span>}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                                        <span style={{
                                            fontFamily: 'monospace', fontWeight: 700,
                                            color: 'var(--color-primary-dark)', fontSize: '0.95rem',
                                            background: 'var(--color-primary-alpha)',
                                            padding: '0.125rem 0.6rem', borderRadius: '4px',
                                            letterSpacing: '0.05em',
                                        }}>
                                            {vehicle.license_plate}
                                        </span>
                                        <span style={{
                                            background: 'rgba(100,116,139,0.1)', color: 'var(--color-text-muted)',
                                            padding: '0.125rem 0.5rem', borderRadius: '9999px',
                                            fontSize: '0.75rem', fontWeight: 600,
                                        }}>
                                            {vehicle.services?.length || 0} riwayat servis
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Action Buttons */}
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <Link
                                    href={`/admin/services/create?vehicle_id=${vehicle.id}&customer_id=${customer.id}`}
                                    className="btn btn-primary"
                                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                                >
                                    <Wrench size={14} /> Input Servis
                                </Link>
                                <Link
                                    href={`/admin/vehicles/${vehicle.id}/edit`}
                                    className="btn btn-outline"
                                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                                >
                                    <Edit size={14} /> Edit
                                </Link>
                                <button
                                    onClick={() => {
                                        if (confirm(`Hapus kendaraan ${vehicle.brand} ${vehicle.model} (${vehicle.license_plate})?\nSemua riwayat servisnya juga akan terhapus.`)) {
                                            router.delete(`/admin/vehicles/${vehicle.id}`);
                                        }
                                    }}
                                    style={{
                                        fontSize: '0.78rem', padding: '0.35rem 0.8rem',
                                        border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                                        background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem',
                                        color: 'var(--color-text-muted)', transition: 'all var(--transition-fast)',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-danger)'; e.currentTarget.style.color = 'var(--color-danger)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                                >
                                    <Trash2 size={14} /> Hapus
                                </button>
                            </div>
                        </div>

                        {/* Service History Table */}
                        {vehicle.services?.length > 0 ? (
                            <table className="hd-table">
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Keluhan</th>
                                        <th>Teknisi</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Total</th>
                                        <th>Tanggal</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicle.services.map(s => {
                                        const partsTotal = s.spare_parts?.reduce(
                                            (sum, p) => sum + ((p.pivot?.quantity ?? 0) * (p.pivot?.unit_price ?? 0)), 0
                                        ) || 0;
                                        const total = partsTotal + Number(s.service_fee || 0);
                                        return (
                                            <tr key={s.id}>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                                    #{String(s.id).padStart(4, '0')}
                                                </td>
                                                <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                                                    {s.description}
                                                </td>
                                                <td style={{ fontSize: '0.8rem' }}>{s.technician?.name || '-'}</td>
                                                <td><StatusBadge status={s.status} /></td>
                                                <td style={{ textAlign: 'right', fontSize: '0.85rem', fontWeight: 600 }}>{fmt(total)}</td>
                                                <td style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                                    {new Date(s.created_at).toLocaleDateString('id-ID')}
                                                </td>
                                                <td>
                                                    <Link href={`/admin/services/${s.id}`} style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex' }} title="Detail">
                                                        <Eye size={18} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{
                                padding: '1.25rem', background: 'rgba(0,91,150,0.02)',
                                borderRadius: 'var(--radius-md)', textAlign: 'center',
                                border: '1px dashed var(--color-border)',
                            }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                    Belum ada riwayat servis untuk kendaraan ini.
                                </div>
                                <Link
                                    href={`/admin/services/create?vehicle_id=${vehicle.id}&customer_id=${customer.id}`}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none', fontSize: '0.875rem' }}
                                >
                                    + Catat servis pertama <ArrowRight size={14} />
                                </Link>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
