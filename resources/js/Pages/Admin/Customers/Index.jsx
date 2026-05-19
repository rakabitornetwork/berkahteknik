import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';
import { Eye, Edit, Trash2 } from 'lucide-react';

export default function CustomersIndex({ customers, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/customers', { search }, { preserveState: true });
    };

    return (
        <AdminLayout title="Manajemen Pelanggan">
            <Head title="Pelanggan" />

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <h2 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Daftar Pelanggan</h2>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%', maxWidth: 'max-content' }}>
                        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 auto', minWidth: '200px' }}>
                            <input value={search} onChange={e => setSearch(e.target.value)}
                                type="text" placeholder="Cari nama / telepon..."
                                className="form-input" style={{ width: '100%' }} />
                            <button type="submit" className="btn btn-outline" style={{ fontSize: '0.875rem' }}>Cari</button>
                        </form>
                        <Link href="/admin/customers/create" className="btn btn-primary" style={{ fontSize: '0.875rem', whiteSpace: 'nowrap', flex: '0 0 auto' }}>+ Tambah Pelanggan</Link>
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table className="hd-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nama</th>
                                <th>Telepon</th>
                                <th>Alamat</th>
                                <th>Kendaraan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.data?.length > 0 ? customers.data.map(c => (
                                <tr key={c.id}>
                                    <td style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: '0.875rem' }}>#{c.id}</td>
                                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                                    <td>{c.phone}</td>
                                    <td style={{ color: 'var(--color-text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.address || '-'}</td>
                                    <td>
                                        <span style={{ background: 'var(--color-primary-alpha)', color: 'var(--color-primary)', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                                            {c.vehicles_count} kendaraan
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <Link href={`/admin/customers/${c.id}`} style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex' }} title="Detail">
                                                <Eye size={18} />
                                            </Link>
                                            <Link href={`/admin/customers/${c.id}/edit`} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', display: 'flex' }} title="Edit">
                                                <Edit size={18} />
                                            </Link>
                                            <button onClick={() => { if (confirm('Hapus pelanggan ini?')) router.delete(`/admin/customers/${c.id}`) }}
                                                style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }} title="Hapus">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Tidak ada pelanggan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={customers.links} query={{ search }} />
            </div>
        </AdminLayout>
    );
}
