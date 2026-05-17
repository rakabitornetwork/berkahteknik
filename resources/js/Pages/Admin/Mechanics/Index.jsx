import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Search, Trash2, Edit, Wrench } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import DataTable from '../../../Components/DataTable';
import StatusBadge from '../../../Components/StatusBadge';

export default function MechanicsIndex({ mechanics, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMechanic, setEditingMechanic] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/mechanics', { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingMechanic(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (mechanic) => {
        setEditingMechanic(mechanic);
        setData({
            name: mechanic.name,
            email: mechanic.email,
            username: mechanic.username || '',
            password: '',
            password_confirmation: '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (editingMechanic) {
            put(`/admin/mechanics/${editingMechanic.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/admin/mechanics', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data mekanik ini?')) {
            router.delete(`/admin/mechanics/${id}`);
        }
    };

    const columns = [
        { header: 'Nama Lengkap', accessor: 'name', cell: r => <span style={{ fontWeight: 600 }}>{r.name}</span> },
        { header: 'Username', accessor: 'username', cell: r => r.username || '-' },
        { header: 'Email', accessor: 'email' },
        { header: 'Bergabung', accessor: 'created_at', cell: r => new Date(r.created_at).toLocaleDateString('id-ID') },
        { header: 'Aksi', accessor: 'id', cell: r => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openEditModal(r)} style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Edit">
                    <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(r.id)} style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Hapus">
                    <Trash2 size={16} />
                </button>
            </div>
        )},
    ];

    return (
        <AdminLayout title="Data Mekanik">
            <Head title="Manajemen Mekanik" />

            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '250px', maxWidth: '400px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Cari mekanik..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: '2.25rem', width: '100%' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }}><Search size={16} /></button>
                </form>

                <button onClick={openCreateModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={16} /> Tambah Mekanik
                </button>
            </div>

            {/* Data Table */}
            <div className="glass-panel">
                <DataTable columns={columns} data={mechanics.data} />
                
                {mechanics.data.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <Wrench size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                        <p>Belum ada data mekanik.</p>
                    </div>
                )}
            </div>

            {/* Pagination Placeholder (Simplify for now) */}
            {mechanics.links && mechanics.links.length > 3 && (
                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '1rem', justifyContent: 'center' }}>
                    {mechanics.links.map((link, k) => (
                        <Link 
                            key={k} 
                            href={link.url || '#'}
                            className={`btn ${link.active ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', opacity: link.url ? 1 : 0.5 }}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)}></div>
                    <div className="glass-panel" style={{ position: 'relative', width: '100%', maxWidth: '450px', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.25rem 0' }}>
                            {editingMechanic ? 'Edit Data Mekanik' : 'Tambah Mekanik Baru'}
                        </h2>

                        <form onSubmit={submitForm} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Nama Lengkap *</label>
                                <input type="text" className="form-input" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                {errors.name && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</div>}
                            </div>
                            
                            <div>
                                <label className="form-label">Username</label>
                                <input type="text" className="form-input" value={data.username} onChange={e => setData('username', e.target.value)} />
                                {errors.username && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.username}</div>}
                            </div>

                            <div>
                                <label className="form-label">Email *</label>
                                <input type="email" className="form-input" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                {errors.email && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</div>}
                            </div>

                            <div>
                                <label className="form-label">{editingMechanic ? 'Password Baru (Opsional)' : 'Password *'}</label>
                                <input type="password" className="form-input" value={data.password} onChange={e => setData('password', e.target.value)} required={!editingMechanic} />
                                {errors.password && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</div>}
                            </div>

                            <div>
                                <label className="form-label">Konfirmasi Password {editingMechanic ? '(Opsional)' : '*'}</label>
                                <input type="password" className="form-input" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required={!editingMechanic} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Batal</button>
                                <button type="submit" className="btn btn-primary" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
