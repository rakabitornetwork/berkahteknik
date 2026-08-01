import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, Store } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import DataTable from '../../../Components/DataTable';
import Pagination from '../../../Components/Pagination';
import MasterDataTabs from './MasterDataTabs';

const typeLabel = {
    sparepart: 'Pelanggan Sparepart',
    bengkel: 'Bengkel Sekitar',
};

export default function SparepartCustomers({ customers, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || 'all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        phone: '',
        address: '',
        customer_type: 'sparepart',
        password: '',
    });

    const applyFilter = (nextType = type) => {
        router.get('/admin/master-data/pelanggan-sparepart', {
            search: search || undefined,
            type: nextType === 'all' ? undefined : nextType,
        }, { preserveState: true });
    };

    const openCreate = (presetType = 'sparepart') => {
        setEditing(null);
        reset();
        setData({
            name: '',
            phone: '',
            address: '',
            customer_type: presetType,
            password: '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setData({
            name: item.name || '',
            phone: item.phone || '',
            address: item.address || '',
            customer_type: item.customer_type || 'sparepart',
            password: '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(`/admin/master-data/pelanggan-sparepart/${editing.id}`, { onSuccess: () => setIsModalOpen(false) });
        } else {
            post('/admin/master-data/pelanggan-sparepart', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            router.delete(`/admin/master-data/pelanggan-sparepart/${id}`);
        }
    };

    const columns = [
        { header: 'Nama', accessor: 'name', cell: r => <span style={{ fontWeight: 600 }}>{r.name}</span> },
        { header: 'Tipe', accessor: 'customer_type', cell: r => typeLabel[r.customer_type] || r.customer_type },
        { header: 'No HP', accessor: 'phone' },
        { header: 'Alamat', accessor: 'address', cell: r => r.address || '—' },
        { header: 'Aksi', accessor: 'id', cell: r => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={() => openEdit(r)} style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Edit size={16} /></button>
                <button type="button" onClick={() => handleDelete(r.id)} style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Trash2 size={16} /></button>
            </div>
        )},
    ];

    const filterBtn = (value, label) => {
        const active = type === value;
        return (
            <button
                type="button"
                onClick={() => { setType(value); applyFilter(value); }}
                style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    border: active ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                    background: active ? 'var(--color-primary)' : 'transparent',
                    color: active ? '#fff' : 'var(--color-text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                }}
            >
                {label}
            </button>
        );
    };

    return (
        <AdminLayout title="Master Data · Pelanggan Sparepart">
            <Head title="Pelanggan Sparepart" />
            <MasterDataTabs />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Store size={20} style={{ color: 'var(--color-primary)' }} />
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Pelanggan Sparepart & Bengkel</h2>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            Pembeli sparepart retail dan bengkel sekitar yang membeli sparepart.
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="btn btn-outline" onClick={() => openCreate('sparepart')} style={{ fontSize: '0.8rem' }}>
                        <Plus size={14} /> Pelanggan Sparepart
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => openCreate('bengkel')} style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Plus size={14} /> Bengkel Sekitar
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {filterBtn('all', 'Semua')}
                {filterBtn('sparepart', 'Pelanggan Sparepart')}
                {filterBtn('bengkel', 'Bengkel Sekitar')}
            </div>

            <form
                onSubmit={(e) => { e.preventDefault(); applyFilter(); }}
                style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', maxWidth: '420px' }}
            >
                <input className="form-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama / no HP..." />
                <button type="submit" className="btn btn-outline">Cari</button>
            </form>

            <div className="glass-panel list-panel">
                {customers.data.length > 0 ? (
                    <>
                        <DataTable columns={columns} data={customers.data} />
                        <Pagination links={customers.links} query={{ search, type: type === 'all' ? undefined : type }} />
                    </>
                ) : (
                    <div className="list-empty-state">
                        <Store size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                        <p>Belum ada data pelanggan sparepart / bengkel.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
                    <div className="glass-panel" style={{ position: 'relative', width: '100%', maxWidth: '480px', padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.25rem' }}>
                            {editing ? 'Edit Data' : 'Tambah Data'}
                        </h2>
                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                            <div>
                                <label className="form-label">Tipe *</label>
                                <select className="form-input" value={data.customer_type} onChange={e => setData('customer_type', e.target.value)} required>
                                    <option value="sparepart">Pelanggan Sparepart</option>
                                    <option value="bengkel">Bengkel Sekitar</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Nama *</label>
                                <input className="form-input" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                {errors.name && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors.name}</div>}
                            </div>
                            <div>
                                <label className="form-label">No HP *</label>
                                <input className="form-input" value={data.phone} onChange={e => setData('phone', e.target.value)} required />
                                {errors.phone && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors.phone}</div>}
                            </div>
                            <div>
                                <label className="form-label">Alamat</label>
                                <textarea className="form-input" rows={2} value={data.address} onChange={e => setData('address', e.target.value)} />
                            </div>
                            <div>
                                <label className="form-label">Password Portal (opsional)</label>
                                <input type="password" className="form-input" value={data.password} onChange={e => setData('password', e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Batal</button>
                                <button type="submit" className="btn btn-primary" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
