import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, Briefcase } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import DataTable from '../../../Components/DataTable';
import Pagination from '../../../Components/Pagination';
import EmployeeTabs from './EmployeeTabs';

export default function Positions({ positions }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        is_active: true,
    });

    const openCreate = () => {
        setEditing(null);
        reset();
        setData({ name: '', description: '', is_active: true });
        clearErrors();
        setIsModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setData({
            name: item.name,
            description: item.description || '',
            is_active: item.is_active ?? true,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(`/admin/karyawan/jabatan/${editing.id}`, { onSuccess: () => setIsModalOpen(false) });
        } else {
            post('/admin/karyawan/jabatan', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus jabatan ini?')) {
            router.delete(`/admin/karyawan/jabatan/${id}`);
        }
    };

    const columns = [
        { header: 'Nama Jabatan', accessor: 'name', cell: r => <span style={{ fontWeight: 600 }}>{r.name}</span> },
        { header: 'Deskripsi', accessor: 'description', cell: r => r.description || '—' },
        { header: 'Jumlah Karyawan', accessor: 'employees_count', cell: r => r.employees_count ?? 0 },
        { header: 'Status', accessor: 'is_active', cell: r => (
            <span style={{ fontWeight: 600, color: r.is_active ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                {r.is_active ? 'Aktif' : 'Nonaktif'}
            </span>
        )},
        { header: 'Aksi', accessor: 'id', cell: r => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={() => openEdit(r)} style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <Edit size={16} />
                </button>
                <button type="button" onClick={() => handleDelete(r.id)} style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <Trash2 size={16} />
                </button>
            </div>
        )},
    ];

    return (
        <AdminLayout title="Data Jabatan">
            <Head title="Data Jabatan" />
            <EmployeeTabs />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Briefcase size={20} style={{ color: 'var(--color-primary)' }} />
                        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Master Jabatan</h2>
                    </div>
                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Isi jabatan sesuai orang dan job masing-masing, lalu pilih di Data Karyawan.
                    </p>
                </div>
                <button type="button" onClick={openCreate} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Plus size={16} /> Tambah Jabatan
                </button>
            </div>

            <div className="glass-panel list-panel">
                {positions.data.length > 0 ? (
                    <>
                        <DataTable columns={columns} data={positions.data} />
                        <Pagination links={positions.links} />
                    </>
                ) : (
                    <div className="list-empty-state">
                        <Briefcase size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                        <p>Belum ada data jabatan.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
                    <div className="glass-panel" style={{ position: 'relative', width: '100%', maxWidth: '450px', padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.25rem' }}>
                            {editing ? 'Edit Jabatan' : 'Tambah Jabatan'}
                        </h2>
                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Nama Jabatan *</label>
                                <input className="form-input" value={data.name} onChange={e => setData('name', e.target.value)} required placeholder="Contoh: Teknisi Senior" />
                                {errors.name && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</div>}
                            </div>
                            <div>
                                <label className="form-label">Deskripsi</label>
                                <textarea className="form-input" rows={2} value={data.description} onChange={e => setData('description', e.target.value)} />
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }} />
                                <span style={{ fontSize: '0.875rem' }}>Aktif</span>
                            </label>
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
