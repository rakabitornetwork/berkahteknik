import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';
import { Edit, Trash2, Search, Filter, Calendar, Info, Wallet } from 'lucide-react';

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

export default function ExpensesIndex({ expenses, categories, totalAmount, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [category, setCategory] = useState(filters?.category || '');
    const [startDate, setStartDate] = useState(filters?.start_date || '');
    const [endDate, setEndDate] = useState(filters?.end_date || '');

    const applyFilter = (params = {}) => {
        router.get('/admin/expenses', {
            search,
            category,
            start_date: startDate,
            end_date: endDate,
            ...params
        }, { preserveState: true });
    };

    const handleClearFilters = () => {
        setSearch('');
        setCategory('');
        setStartDate('');
        setEndDate('');
        router.get('/admin/expenses', {});
    };

    const handleDelete = (id, category, date) => {
        if (window.confirm(`Yakin ingin menghapus catatan pengeluaran "${category}" tanggal ${fmtDate(date)}?`)) {
            router.delete(`/admin/expenses/${id}`);
        }
    };

    return (
        <AdminLayout title="Pengeluaran Bengkel">
            <Head title="Pengeluaran Bengkel" />

            {/* Total Summary Card */}
            <div className="glass-panel hover-lift" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '1.5rem', maxWidth: '350px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', padding: '0.75rem', borderRadius: '12px' }}>
                        <Wallet size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Total Pengeluaran (Terfilter)</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-danger)', lineHeight: 1.1 }}>{fmt(totalAmount)}</div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    {/* Search */}
                    <div style={{ flex: '1 1 200px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Cari Deskripsi</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && applyFilter()}
                                type="text"
                                placeholder="Cari kata kunci..."
                                className="form-input"
                                style={{ paddingLeft: '2rem' }}
                            />
                            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        </div>
                    </div>

                    {/* Category */}
                    <div style={{ flex: '1 1 150px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Kategori</label>
                        <select
                            value={category}
                            onChange={e => { setCategory(e.target.value); applyFilter({ category: e.target.value }); }}
                            className="form-input"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Date range */}
                    <div style={{ display: 'flex', gap: '0.5rem', flex: '2 1 300px' }}>
                        <div style={{ flex: 1 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Mulai Tanggal</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="form-input" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Hingga Tanggal</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="form-input" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="button" onClick={() => applyFilter()} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', height: '38px', padding: '0.5rem 1rem' }}>
                            <Filter size={14} /> Filter
                        </button>
                        <button type="button" onClick={handleClearFilters} className="btn btn-outline" style={{ height: '38px', padding: '0.5rem 1rem', color: 'var(--color-text-muted)' }}>
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* List panel */}
            <div className="glass-panel list-panel">
                <header className="list-page-toolbar">
                    <h2 className="list-page-title" style={{ margin: 0 }}>Daftar Pengeluaran Operasional</h2>
                    <Link href="/admin/expenses/create" className="btn btn-primary">
                        + Catat Pengeluaran
                    </Link>
                </header>

                <div className="table-responsive">
                    <table className="hd-table">
                        <thead>
                            <tr>
                                <th style={{ width: '150px' }}>Tanggal</th>
                                <th>Kategori</th>
                                <th style={{ textAlign: 'right', width: '180px' }}>Jumlah</th>
                                <th>Keterangan</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.data?.length > 0 ? (
                                expenses.data.map(exp => (
                                    <tr key={exp.id}>
                                        <td>{fmtDate(exp.expense_date)}</td>
                                        <td>
                                            <span style={{
                                                fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: '4px',
                                                background: exp.category.includes('Gaji') ? 'rgba(59,130,246,0.1)' : exp.category.includes('Sewa') ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)',
                                                color: exp.category.includes('Gaji') ? '#3b82f6' : exp.category.includes('Sewa') ? '#10b981' : 'var(--color-text-main)'
                                            }}>
                                                {exp.category}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-danger)' }}>{fmt(exp.amount)}</td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{exp.description || '-'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                <Link href={`/admin/expenses/${exp.id}/edit`} style={{ color: 'var(--color-text-muted)', display: 'flex' }} title="Edit">
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(exp.id, exp.category, exp.expense_date)}
                                                    style={{ border: 'none', background: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 0, display: 'flex' }}
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                                        Tidak ada catatan pengeluaran.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={expenses.links} query={{ search, category, start_date: startDate, end_date: endDate }} />
            </div>
        </AdminLayout>
    );
}
