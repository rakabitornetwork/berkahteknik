import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend
} from 'recharts';

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass-panel" style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', border: '1px solid var(--color-border)' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color }}>
                    {p.name === 'revenue' ? `Pendapatan: ${fmt(p.value)}` : `Servis: ${p.value} kendaraan`}
                </div>
            ))}
        </div>
    );
};

export default function ReportsIndex({ monthlyData, services, summary, filters, availableYears }) {
    const [year, setYear]   = useState(filters.year);
    const [month, setMonth] = useState(filters.month || '');

    const applyFilter = (newYear, newMonth) => {
        router.get('/admin/reports', { year: newYear, month: newMonth || '' }, { preserveState: true });
    };

    return (
        <AdminLayout title="Laporan Keuangan">
            <Head title="Laporan" />

            {/* Summary Cards */}
            <div className="hd-grid hd-grid-cols-4" style={{ marginBottom: '1.5rem' }}>
                {[
                    { label: 'Total Pendapatan', value: fmt(summary.total_revenue), icon: '💰', sub: `${summary.total_services} servis selesai` },
                    { label: 'Sudah Dibayar', value: summary.paid_services, icon: '✅', sub: 'servis lunas' },
                    { label: 'Belum Dibayar', value: summary.unpaid_services, icon: '⏳', sub: 'servis belum lunas' },
                    { label: 'Total Pelanggan', value: summary.total_customers, icon: '👤', sub: 'terdaftar' },
                ].map((card, i) => (
                    <div key={i} className="glass-panel hover-lift" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{card.label}</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1 }}>{card.value}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.375rem' }}>{card.sub}</div>
                            </div>
                            <span style={{ fontSize: '1.75rem' }}>{card.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Filter:</span>
                <select value={year} onChange={e => { setYear(Number(e.target.value)); applyFilter(Number(e.target.value), month); }}
                    className="form-input" style={{ width: '120px' }}>
                    {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>

                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                    <button onClick={() => { setMonth(''); applyFilter(year, ''); }}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '9999px', border: '1px solid', cursor: 'pointer',
                            borderColor: !month ? 'var(--color-primary)' : 'var(--color-border)',
                            background: !month ? 'var(--color-primary)' : 'transparent',
                            color: !month ? 'white' : 'var(--color-text-muted)' }}>
                        Semua Bulan
                    </button>
                    {MONTHS.map((m, i) => (
                        <button key={i} onClick={() => { setMonth(i + 1); applyFilter(year, i + 1); }}
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', borderRadius: '9999px', border: '1px solid', cursor: 'pointer',
                                borderColor: month === i + 1 ? 'var(--color-primary)' : 'var(--color-border)',
                                background: month === i + 1 ? 'var(--color-primary)' : 'transparent',
                                color: month === i + 1 ? 'white' : 'var(--color-text-muted)' }}>
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Charts */}
            <div className="hd-grid chart-grid" style={{ marginBottom: '1.25rem' }}>
                {/* Revenue Bar Chart */}
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Pendapatan per Bulan ({year})</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={monthlyData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
                            <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(0)}jt` : v} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="revenue" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Service Count Line Chart */}
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Jumlah Servis per Bulan</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
                            <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="count" stroke="var(--color-primary-light)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-primary)' }} name="count" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detail Table */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>
                    Detail Servis Selesai {month ? `— ${MONTHS[month - 1]} ${year}` : `— ${year}`}
                    <span style={{ marginLeft: '0.75rem', fontWeight: 400, color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>({services.length} transaksi)</span>
                </h3>

                <div style={{ overflowX: 'auto' }}>
                    <table className="hd-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Pelanggan</th>
                                <th>Kendaraan</th>
                                <th>Teknisi</th>
                                <th style={{ textAlign: 'right' }}>Biaya Jasa</th>
                                <th style={{ textAlign: 'right' }}>Part</th>
                                <th style={{ textAlign: 'right' }}>Total</th>
                                <th>Bayar</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.length > 0 ? services.map(s => (
                                <tr key={s.id}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>#{String(s.id).padStart(4, '0')}</td>
                                    <td style={{ fontWeight: 500 }}>{s.customer}</td>
                                    <td style={{ fontSize: '0.8rem' }}>{s.vehicle}</td>
                                    <td style={{ fontSize: '0.8rem' }}>{s.technician}</td>
                                    <td style={{ textAlign: 'right', fontSize: '0.8rem' }}>{fmt(s.service_fee)}</td>
                                    <td style={{ textAlign: 'right', fontSize: '0.8rem' }}>{fmt(s.parts_total)}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(s.total)}</td>
                                    <td>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600,
                                            color: s.payment_status === 'lunas' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                                            {s.payment_status === 'lunas' ? '✓ Lunas' : '⏳ Belum'}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{s.completed_at}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>Tidak ada data untuk periode ini.</td></tr>
                            )}
                        </tbody>
                        {services.length > 0 && (
                            <tfoot>
                                <tr style={{ borderTop: '2px solid var(--color-border)' }}>
                                    <td colSpan="6" style={{ textAlign: 'right', fontWeight: 700, paddingTop: '0.75rem' }}>TOTAL PENDAPATAN</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '1rem', paddingTop: '0.75rem' }}>{fmt(summary.total_revenue)}</td>
                                    <td colSpan="2"></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
