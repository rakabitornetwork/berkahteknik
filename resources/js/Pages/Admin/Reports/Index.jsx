import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend
} from 'recharts';
import { Wallet, CheckCircle, Clock, Users, Wrench, Receipt } from 'lucide-react';

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass-panel" style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', border: '1px solid var(--color-border)', background: 'rgba(15, 23, 42, 0.9)', color: '#fff' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: '#fff' }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color, margin: '0.15rem 0' }}>
                    {p.name === 'service_revenue' ? `Servis: ${fmt(p.value)}` :
                     p.name === 'sale_revenue' ? `Penjualan POS: ${fmt(p.value)}` :
                     p.name === 'count' ? `Servis: ${p.value} kendaraan` :
                     p.name === 'sales_count' ? `Penjualan POS: ${p.value} transaksi` :
                     `${p.name}: ${p.value}`}
                </div>
            ))}
        </div>
    );
};

export default function ReportsIndex({ monthlyData, services, sales, summary, filters, availableYears }) {
    const [year, setYear]   = useState(filters.year);
    const [month, setMonth] = useState(filters.month || '');
    const [activeTab, setActiveTab] = useState('services'); // 'services' or 'sales'

    const applyFilter = (newYear, newMonth) => {
        router.get('/admin/reports', { year: newYear, month: newMonth || '' }, { preserveState: true });
    };

    const paymentMethodLabel = (method) => {
        const labels = { cash: 'Tunai', transfer: 'Transfer', qris: 'QRIS' };
        return labels[method] || method || '-';
    };

    return (
        <AdminLayout title="Laporan Keuangan">
            <Head title="Laporan Keuangan" />

            {/* Summary Cards */}
            <div className="hd-grid hd-grid-cols-4" style={{ marginBottom: '1.5rem' }}>
                {[
                    { label: 'Total Pendapatan', value: fmt(summary.total_revenue), icon: <Wallet size={24} strokeWidth={1.5} />, sub: `${summary.total_services} servis + ${summary.total_sales} POS` },
                    { label: 'Omzet Servis', value: fmt(summary.total_service_revenue), icon: <Wrench size={24} strokeWidth={1.5} />, sub: `${summary.total_services} kendaraan selesai` },
                    { label: 'Omzet Penjualan POS', value: fmt(summary.total_sale_revenue), icon: <Receipt size={24} strokeWidth={1.5} />, sub: `${summary.total_sales} transaksi lunas` },
                    { label: 'Total Pelanggan', value: summary.total_customers, icon: <Users size={24} strokeWidth={1.5} />, sub: 'terdaftar di sistem' },
                ].map((card, i) => (
                    <div key={i} className="glass-panel hover-lift" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{card.label}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.1 }}>{card.value}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.375rem' }}>{card.sub}</div>
                            </div>
                            <span style={{ fontSize: '1.75rem', color: 'var(--color-primary)' }}>{card.icon}</span>
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
                {/* Revenue Stacked Bar Chart */}
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Pendapatan per Bulan ({year})</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={monthlyData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
                            <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(0)}jt` : v} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Bar dataKey="service_revenue" stackId="a" fill="var(--color-primary)" name="service_revenue" label="Servis" />
                            <Bar dataKey="sale_revenue" stackId="a" fill="#0ea5e9" name="sale_revenue" label="Penjualan POS" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Transaction Volume Line Chart */}
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Volume Transaksi per Bulan</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
                            <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Line type="monotone" dataKey="count" stroke="var(--color-primary-light)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-primary)' }} name="count" label="Servis" />
                            <Line type="monotone" dataKey="sales_count" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#d97706' }} name="sales_count" label="Penjualan POS" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detail Tables with Tabs */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', pb: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => setActiveTab('services')}
                            style={{
                                padding: '0.5rem 0.25rem', fontSize: '0.9rem', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer',
                                color: activeTab === 'services' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                borderBottom: activeTab === 'services' ? '2.5px solid var(--color-primary)' : 'none',
                                display: 'inline-flex', alignItems: 'center', gap: '0.35rem'
                            }}
                        >
                            <Wrench size={16} /> Pekerjaan Servis ({services.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('sales')}
                            style={{
                                padding: '0.5rem 0.25rem', fontSize: '0.9rem', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer',
                                color: activeTab === 'sales' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                borderBottom: activeTab === 'sales' ? '2.5px solid var(--color-primary)' : 'none',
                                display: 'inline-flex', alignItems: 'center', gap: '0.35rem'
                            }}
                        >
                            <Receipt size={16} /> Penjualan Kasir / POS ({sales.length})
                        </button>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Periode: {month ? `${MONTHS[month - 1]} ${year}` : year}
                    </span>
                </div>

                {activeTab === 'services' ? (
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
                                    <th>Tanggal Selesai</th>
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
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: s.payment_status === 'lunas' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                                                {s.payment_status === 'lunas' ? <><CheckCircle size={14} strokeWidth={2.5} /> Lunas</> : <><Clock size={14} strokeWidth={2.5} /> Belum</>}
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{s.completed_at}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>Tidak ada data servis selesai untuk periode ini.</td></tr>
                                )}
                            </tbody>
                            {services.length > 0 && (
                                <tfoot>
                                    <tr style={{ borderTop: '2px solid var(--color-border)' }}>
                                        <td colSpan="6" style={{ textAlign: 'right', fontWeight: 700, paddingTop: '0.75rem' }}>TOTAL OMZET SERVIS</td>
                                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '1rem', paddingTop: '0.75rem' }}>{fmt(summary.total_service_revenue)}</td>
                                        <td colSpan="2"></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="hd-table">
                            <thead>
                                <tr>
                                    <th>No. Nota</th>
                                    <th>Pelanggan</th>
                                    <th>Metode Bayar</th>
                                    <th style={{ textAlign: 'right' }}>Total Transaksi</th>
                                    <th>Tanggal Transaksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.length > 0 ? sales.map(s => (
                                    <tr key={s.id}>
                                        <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>{s.receipt_number}</td>
                                        <td style={{ fontWeight: 500 }}>{s.customer}</td>
                                        <td style={{ fontSize: '0.8rem' }}>{paymentMethodLabel(s.payment_method)}</td>
                                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(s.total)}</td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{s.completed_at}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>Tidak ada data penjualan langsung untuk periode ini.</td></tr>
                                )}
                            </tbody>
                            {sales.length > 0 && (
                                <tfoot>
                                    <tr style={{ borderTop: '2px solid var(--color-border)' }}>
                                        <td colSpan="3" style={{ textAlign: 'right', fontWeight: 700, paddingTop: '0.75rem' }}>TOTAL OMZET PENJUALAN POS</td>
                                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#0284c7', fontSize: '1rem', paddingTop: '0.75rem' }}>{fmt(summary.total_sale_revenue)}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
