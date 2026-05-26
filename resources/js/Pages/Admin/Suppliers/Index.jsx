import React from 'react';
import { router, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2, Truck } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index({ suppliers }) {
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus supplier ini?')) {
            router.delete(route('suppliers.destroy', id));
        }
    };

    return (
        <AdminLayout title="Manajemen Supplier">
            <div style={{ padding: '1.5rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Truck size={22} style={{ color: 'var(--color-primary)' }} />
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                            Daftar Supplier
                        </h2>
                    </div>
                    <Link
                        href={route('suppliers.create')}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.6rem 1.1rem', borderRadius: '0.5rem',
                            background: 'var(--color-primary)', color: '#fff',
                            textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem',
                        }}
                    >
                        <Plus size={16} /> Tambah Supplier
                    </Link>
                </div>

                {/* Table */}
                <div style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)' }}>Nama</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)' }}>Telepon</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)' }}>Email</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)' }}>Alamat</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-muted)' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        Belum ada supplier. Tambahkan supplier pertama Anda.
                                    </td>
                                </tr>
                            ) : (
                                suppliers.data.map((supplier) => (
                                    <tr key={supplier.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-main)', fontWeight: 500 }}>{supplier.name}</td>
                                        <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>{supplier.phone || '—'}</td>
                                        <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>{supplier.email || '—'}</td>
                                        <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {supplier.address || '—'}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                                <Link
                                                    href={route('suppliers.edit', supplier.id)}
                                                    title="Edit"
                                                    style={{ color: 'var(--color-primary)', display: 'inline-flex' }}
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(supplier.id)}
                                                    title="Hapus"
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', display: 'inline-flex', padding: 0 }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {suppliers.links && (
                    <div style={{ marginTop: '1rem' }} dangerouslySetInnerHTML={{ __html: suppliers.links }} />
                )}
            </div>
        </AdminLayout>
    );
}
