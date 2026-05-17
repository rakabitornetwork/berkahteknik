import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { AlertTriangle, CheckCircle, Edit, Trash2 } from 'lucide-react';

const fmt = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

export default function SparePartsIndex({ spareParts, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/spare-parts', { search }, { preserveState: true });
    };

    return (
        <AdminLayout title="Spare Part & Stok">
            <Head title="Spare Part" />

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <h2 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Katalog Spare Part AC</h2>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%', maxWidth: 'max-content' }}>
                        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 auto', minWidth: '200px' }}>
                            <input value={search} onChange={e => setSearch(e.target.value)}
                                type="text" placeholder="Cari nama / kode..."
                                className="form-input" style={{ width: '100%' }} />
                            <button type="submit" className="btn btn-outline" style={{ fontSize: '0.875rem' }}>Cari</button>
                        </form>
                        <Link href="/admin/spare-parts/create" className="btn btn-primary" style={{ fontSize: '0.875rem', whiteSpace: 'nowrap', flex: '0 0 auto' }}>+ Tambah Part</Link>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="hd-table">
                        <thead>
                            <tr>
                                <th>Kode</th>
                                <th>Nama Spare Part</th>
                                <th>Satuan</th>
                                <th style={{ textAlign: 'right' }}>Stok</th>
                                <th style={{ textAlign: 'right' }}>Harga Beli</th>
                                <th style={{ textAlign: 'right' }}>Harga Jual</th>
                                <th>Status Stok</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spareParts.data?.length > 0 ? spareParts.data.map(sp => (
                                <tr key={sp.id}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{sp.code}</td>
                                    <td style={{ fontWeight: 500 }}>{sp.name}</td>
                                    <td style={{ fontSize: '0.875rem' }}>{sp.unit}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem' }}>{sp.stock}</td>
                                    <td style={{ textAlign: 'right', fontSize: '0.875rem' }}>{fmt(sp.buy_price)}</td>
                                    <td style={{ textAlign: 'right', fontSize: '0.875rem' }}>{fmt(sp.sell_price)}</td>
                                    <td>
                                        {sp.stock <= sp.min_stock ? (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                <AlertTriangle size={12} strokeWidth={2.5} /> Menipis (min: {sp.min_stock})
                                            </span>
                                        ) : (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                <CheckCircle size={12} strokeWidth={2.5} /> Aman
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <Link href={`/admin/spare-parts/${sp.id}/edit`} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', display: 'flex' }} title="Edit">
                                                <Edit size={18} />
                                            </Link>
                                            <button onClick={() => { if (confirm('Hapus spare part ini?')) router.delete(`/admin/spare-parts/${sp.id}`) }}
                                                style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }} title="Hapus">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>Tidak ada spare part.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {spareParts.links && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                        {spareParts.links.map((link, i) => (
                            <button key={i} onClick={() => link.url && router.get(link.url, { search })}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                style={{
                                    padding: '0.3rem 0.65rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--color-border)',
                                    background: link.active ? 'var(--color-primary)' : 'transparent',
                                    color: link.active ? 'white' : 'var(--color-text-muted)',
                                    cursor: link.url ? 'pointer' : 'not-allowed',
                                }} />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
