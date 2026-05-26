import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { Save, ArrowLeft } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Form({ supplier = null, errors = {} }) {
    const isEditing = !!supplier;

    const [formData, setFormData] = useState({
        name: supplier?.name || '',
        phone: supplier?.phone || '',
        email: supplier?.email || '',
        address: supplier?.address || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            router.put(route('suppliers.update', supplier.id), formData, { preserveScroll: true });
        } else {
            router.post(route('suppliers.store'), formData, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title={isEditing ? 'Edit Supplier' : 'Tambah Supplier'}>
            <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Link
                        href={route('suppliers.index')}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            color: 'var(--color-text-muted)', textDecoration: 'none',
                            fontSize: '0.875rem',
                        }}
                    >
                        <ArrowLeft size={16} /> Kembali
                    </Link>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                        {isEditing ? 'Edit Supplier' : 'Tambah Supplier'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    maxWidth: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                }}>
                    {/* Nama */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                            Nama Supplier <span style={{ color: 'var(--color-danger)' }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
                                border: errors.name ? '1px solid var(--color-danger)' : '1px solid var(--color-border)',
                                background: 'var(--color-bg-secondary)', color: 'var(--color-text-main)',
                                fontSize: '0.9rem', boxSizing: 'border-box',
                            }}
                        />
                        {errors.name && <p style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.name}</p>}
                    </div>

                    {/* Telepon */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                            Telepon
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Contoh: 0811-2345-6789"
                            style={{
                                width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-bg-secondary)', color: 'var(--color-text-main)',
                                fontSize: '0.9rem', boxSizing: 'border-box',
                            }}
                        />
                        {errors.phone && <p style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@supplier.com"
                            style={{
                                width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-bg-secondary)', color: 'var(--color-text-main)',
                                fontSize: '0.9rem', boxSizing: 'border-box',
                            }}
                        />
                        {errors.email && <p style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.email}</p>}
                    </div>

                    {/* Alamat */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                            Alamat
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Alamat lengkap supplier..."
                            style={{
                                width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-bg-secondary)', color: 'var(--color-text-main)',
                                fontSize: '0.9rem', boxSizing: 'border-box', resize: 'vertical',
                            }}
                        />
                        {errors.address && <p style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.address}</p>}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem' }}>
                        <Link
                            href={route('suppliers.index')}
                            style={{
                                padding: '0.6rem 1.25rem', borderRadius: '0.5rem',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-muted)', textDecoration: 'none',
                                fontSize: '0.9rem', fontWeight: 500,
                            }}
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.6rem 1.25rem', borderRadius: '0.5rem',
                                background: 'var(--color-primary)', color: '#fff',
                                border: 'none', cursor: 'pointer',
                                fontSize: '0.9rem', fontWeight: 600,
                            }}
                        >
                            <Save size={16} /> Simpan
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
