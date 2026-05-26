import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';

export default function ExpenseForm({ expense, categories }) {
    const isEditing = !!expense;
    
    // Determine initial custom category state
    const isInitialCategoryCustom = expense && !categories.includes(expense.category);

    const [customCategory, setCustomCategory] = useState(isInitialCategoryCustom);
    const [typedCategory, setTypedCategory] = useState(isInitialCategoryCustom ? expense.category : '');

    const { data, setData, post, put, processing, errors } = useForm({
        expense_date: expense?.expense_date ? expense.expense_date.split('T')[0] : new Date().toISOString().split('T')[0],
        category:     expense?.category || categories[0] || '',
        amount:       expense?.amount || '',
        description:  expense?.description || '',
    });

    const handleCategorySelectChange = (e) => {
        const value = e.target.value;
        if (value === 'custom') {
            setCustomCategory(true);
            setData('category', typedCategory);
        } else {
            setCustomCategory(false);
            setData('category', value);
        }
    };

    const handleCustomCategoryTextChange = (e) => {
        const value = e.target.value;
        setTypedCategory(value);
        setData('category', value);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/expenses/${expense.id}`);
        } else {
            post('/admin/expenses');
        }
    };

    return (
        <AdminLayout title={isEditing ? 'Edit Catatan Pengeluaran' : 'Catat Pengeluaran Baru'}>
            <Head title={isEditing ? 'Edit Pengeluaran' : 'Catat Pengeluaran'} />

            <div style={{ maxWidth: '600px' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link href="/admin/expenses"
                            style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <ArrowLeft size={14} /> Kembali ke Daftar
                        </Link>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>
                            {isEditing ? 'Edit Catatan Pengeluaran' : 'Catat Pengeluaran Baru'}
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                            Catat pengeluaran operasional bengkel secara berkala untuk keperluan pembukuan rugi laba.
                        </p>
                    </div>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        
                        {/* Expense Date */}
                        <div>
                            <label className="form-label">Tanggal Pengeluaran <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                            <input
                                type="date"
                                value={data.expense_date}
                                onChange={e => setData('expense_date', e.target.value)}
                                className="form-input"
                                required
                            />
                            {errors.expense_date && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.expense_date}</div>}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="form-label">Kategori Pengeluaran <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                            <select
                                value={customCategory ? 'custom' : data.category}
                                onChange={handleCategorySelectChange}
                                className="form-input"
                                style={{ marginBottom: customCategory ? '0.5rem' : '0' }}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                <option value="custom">-- Kategori Lain / Kustom --</option>
                            </select>

                            {customCategory && (
                                <input
                                    type="text"
                                    value={typedCategory}
                                    onChange={handleCustomCategoryTextChange}
                                    placeholder="Masukkan nama kategori kustom..."
                                    className="form-input"
                                    required
                                />
                            )}
                            {errors.category && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.category}</div>}
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="form-label">Jumlah Pengeluaran (Rp) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                            <input
                                type="number"
                                value={data.amount}
                                onChange={e => setData('amount', e.target.value)}
                                placeholder="Contoh: 500000"
                                className="form-input"
                                min="0"
                                step="0.01"
                                required
                            />
                            {errors.amount && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.amount}</div>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="form-label">Keterangan / Deskripsi</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Contoh: Pembayaran tagihan listrik PLN bulan Mei 2026"
                                className="form-input"
                                rows="4"
                            ></textarea>
                            {errors.description && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.description}</div>}
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={processing} style={{ flex: 1 }}>
                                {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Catatan' : 'Catat Pengeluaran')}
                            </button>
                            <Link href="/admin/expenses" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
