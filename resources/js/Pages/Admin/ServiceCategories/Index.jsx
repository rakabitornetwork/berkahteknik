import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Briefcase } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';
import MasterDataTabs from '../MasterData/MasterDataTabs';

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

export default function Index({ items }) {
    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus kategori jasa ini?')) {
            router.delete(`/admin/service-categories/${id}`);
        }
    };

    return (
        <AdminLayout title="Master Data · Kategori Jasa">
            <Head title="Kategori Jasa" />
            <div style={{ padding: '0.25rem 0' }}>
                <MasterDataTabs />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Briefcase size={22} style={{ color: 'var(--color-primary)' }} />
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Kategori Jasa</h2>
                    </div>
                    <Link href="/admin/service-categories/create" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
                        <Plus size={16} /> Tambah Kategori
                    </Link>
                </div>

                <div className="glass-panel" style={{ overflow: 'hidden' }}>
                    <table className="hd-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th style={{ textAlign: 'center' }}>Satuan</th>
                                <th style={{ textAlign: 'right' }}>Biaya Default</th>
                                <th style={{ textAlign: 'center' }}>Status</th>
                                <th style={{ textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                                        Belum ada kategori jasa.
                                    </td>
                                </tr>
                            ) : items.data.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                                        {item.description && (
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.description}</div>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem' }}>{item.unit}</span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>{fmt(item.default_fee)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{
                                            fontSize: '0.75rem', fontWeight: 600,
                                            color: item.is_active ? 'var(--color-success)' : 'var(--color-text-muted)',
                                        }}>
                                            {item.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                            <Link href={`/admin/service-categories/${item.id}/edit`} style={{ color: 'var(--color-primary)' }}><Edit size={16} /></Link>
                                            <button type="button" onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', padding: 0 }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination links={items.links} />
            </div>
        </AdminLayout>
    );
}
