import React, { useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Search, Trash2, Edit, Users, IdCard } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import DataTable from '../../../Components/DataTable';
import Pagination from '../../../Components/Pagination';
import EmployeeTabs from './EmployeeTabs';

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

export default function EmployeesIndex({ employees, positions = [], filters, roleOptions = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [ktpPreview, setKtpPreview] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        position_id: '',
        phone: '',
        base_salary: 0,
        transport_allowance: 0,
        tenure_allowance: 0,
        thr: 0,
        ktp_photo: null,
        email: '',
        username: '',
        role: 'mechanic',
        password: '',
        password_confirmation: '',
        _method: 'post',
    });

    const totalGaji = useMemo(() => (
        Number(data.base_salary || 0)
        + Number(data.transport_allowance || 0)
        + Number(data.tenure_allowance || 0)
        + Number(data.thr || 0)
    ), [data.base_salary, data.transport_allowance, data.tenure_allowance, data.thr]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/karyawan', { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditing(null);
        reset();
        setKtpPreview(null);
        setData({
            name: '',
            position_id: '',
            phone: '',
            base_salary: 0,
            transport_allowance: 0,
            tenure_allowance: 0,
            thr: 0,
            ktp_photo: null,
            email: '',
            username: '',
            role: 'mechanic',
            password: '',
            password_confirmation: '',
            _method: 'post',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (employee) => {
        setEditing(employee);
        setKtpPreview(employee.ktp_photo_url || null);
        setData({
            name: employee.name || '',
            position_id: employee.position_id || '',
            phone: employee.phone || '',
            base_salary: employee.base_salary || 0,
            transport_allowance: employee.transport_allowance || 0,
            tenure_allowance: employee.tenure_allowance || 0,
            thr: employee.thr || 0,
            ktp_photo: null,
            email: employee.email || '',
            username: employee.username || '',
            role: employee.role || 'mechanic',
            password: '',
            password_confirmation: '',
            _method: 'put',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const onKtpChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('ktp_photo', file);
        setKtpPreview(URL.createObjectURL(file));
    };

    const submitForm = (e) => {
        e.preventDefault();
        const opts = {
            forceFormData: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                setKtpPreview(null);
            },
        };

        if (editing) {
            post(`/admin/karyawan/${editing.id}`, opts);
        } else {
            post('/admin/karyawan', opts);
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data karyawan ini?')) {
            router.delete(`/admin/karyawan/${id}`);
        }
    };

    const columns = [
        { header: 'Nama Lengkap', accessor: 'name', cell: r => <span style={{ fontWeight: 600 }}>{r.name}</span> },
        { header: 'Jabatan', accessor: 'position', cell: r => r.position?.name || '—' },
        { header: 'Email', accessor: 'email', cell: r => r.email || '—' },
        { header: 'No HP', accessor: 'phone', cell: r => r.phone || '—' },
        { header: 'Gaji Pokok', accessor: 'base_salary', cell: r => fmt(r.base_salary) },
        { header: 'Tj. Transport', accessor: 'transport_allowance', cell: r => fmt(r.transport_allowance) },
        { header: 'Tj. Masa Kerja', accessor: 'tenure_allowance', cell: r => fmt(r.tenure_allowance) },
        { header: 'THR', accessor: 'thr', cell: r => fmt(r.thr) },
        { header: 'Total Gaji', accessor: 'total_salary', cell: r => <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{fmt(r.total_salary)}</span> },
        { header: 'KTP', accessor: 'ktp_photo_url', cell: r => r.ktp_photo_url ? (
            <a href={r.ktp_photo_url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <IdCard size={14} /> Lihat
            </a>
        ) : '—' },
        { header: 'Aksi', accessor: 'id', cell: r => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={() => openEditModal(r)} style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Edit size={16} /></button>
                <button type="button" onClick={() => handleDelete(r.id)} style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Trash2 size={16} /></button>
            </div>
        )},
    ];

    return (
        <AdminLayout title="Data Karyawan">
            <Head title="Data Karyawan" />
            <EmployeeTabs />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '250px', maxWidth: '400px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input type="text" className="form-input" placeholder="Cari nama / email / no HP..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem', width: '100%' }} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }}><Search size={16} /></button>
                </form>
                <button type="button" onClick={openCreateModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={16} /> Tambah Karyawan
                </button>
            </div>

            <div className="glass-panel list-panel">
                {employees.data.length > 0 ? (
                    <>
                        <DataTable columns={columns} data={employees.data} />
                        <Pagination links={employees.links} query={{ search }} />
                    </>
                ) : (
                    <div className="list-empty-state">
                        <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                        <p>Belum ada data karyawan.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
                    <div className="glass-panel" style={{ position: 'relative', width: '100%', maxWidth: '640px', padding: '1.5rem', maxHeight: '92vh', overflowY: 'auto' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.25rem' }}>
                            {editing ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
                        </h2>

                        <form onSubmit={submitForm} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                            <div>
                                <label className="form-label">Nama Lengkap *</label>
                                <input className="form-input" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                {errors.name && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</div>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label className="form-label">Jabatan</label>
                                    <select className="form-input" value={data.position_id} onChange={e => setData('position_id', e.target.value)}>
                                        <option value="">-- Pilih jabatan --</option>
                                        {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                        Isi sesuai orang dan job masing-masing di menu Data Jabatan.
                                    </div>
                                    {errors.position_id && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.position_id}</div>}
                                </div>
                                <div>
                                    <label className="form-label">No HP</label>
                                    <input className="form-input" value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="08xxxxxxxxxx" />
                                    {errors.phone && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.phone}</div>}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label className="form-label">Gaji Pokok</label>
                                    <input type="number" min={0} className="form-input" value={data.base_salary} onChange={e => setData('base_salary', e.target.value)} />
                                    {errors.base_salary && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.base_salary}</div>}
                                </div>
                                <div>
                                    <label className="form-label">Tunjangan Transportasi</label>
                                    <input type="number" min={0} className="form-input" value={data.transport_allowance} onChange={e => setData('transport_allowance', e.target.value)} />
                                    {errors.transport_allowance && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.transport_allowance}</div>}
                                </div>
                                <div>
                                    <label className="form-label">Tunjangan Masa Kerja</label>
                                    <input type="number" min={0} className="form-input" value={data.tenure_allowance} onChange={e => setData('tenure_allowance', e.target.value)} />
                                    {errors.tenure_allowance && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.tenure_allowance}</div>}
                                </div>
                                <div>
                                    <label className="form-label">THR</label>
                                    <input type="number" min={0} className="form-input" value={data.thr} onChange={e => setData('thr', e.target.value)} />
                                    {errors.thr && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.thr}</div>}
                                </div>
                            </div>

                            <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(15,118,110,0.08)', border: '1px solid rgba(15,118,110,0.25)', fontWeight: 700 }}>
                                Total Gaji: {fmt(totalGaji)}
                            </div>

                            <div>
                                <label className="form-label">Upload Foto KTP</label>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <label className="btn btn-outline" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
                                        Pilih File
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={onKtpChange} />
                                    </label>
                                    {ktpPreview && (
                                        <a href={ktpPreview} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                                            Preview KTP
                                        </a>
                                    )}
                                </div>
                                {ktpPreview && (
                                    <img src={ktpPreview} alt="KTP" style={{ marginTop: '0.5rem', width: '100%', maxHeight: '140px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                                )}
                                {errors.ktp_photo && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors.ktp_photo}</div>}
                            </div>

                            <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>AKSES SISTEM</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                                    Email dan username bersifat opsional, tetapi harus unik jika diisi. Username dan email boleh dikosongkan.
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div>
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-input" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="opsional" />
                                        {errors.email && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</div>}
                                    </div>
                                    <div>
                                        <label className="form-label">Peran Akses *</label>
                                        <select className="form-input" value={data.role} onChange={e => setData('role', e.target.value)}>
                                            {roleOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                        </select>
                                        {errors.role && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.role}</div>}
                                    </div>
                                    <div>
                                        <label className="form-label">Username</label>
                                        <input className="form-input" value={data.username} onChange={e => setData('username', e.target.value)} />
                                        {errors.username && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.username}</div>}
                                    </div>
                                    <div>
                                        <label className="form-label">{editing ? 'Password Baru (opsional)' : 'Password *'}</label>
                                        <input type="password" className="form-input" value={data.password} onChange={e => setData('password', e.target.value)} required={!editing} />
                                        {errors.password && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</div>}
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label className="form-label">Konfirmasi Password {editing ? '(opsional)' : '*'}</label>
                                        <input type="password" className="form-input" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required={!editing} />
                                        {errors.password_confirmation && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password_confirmation}</div>}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Batal</button>
                                <button type="submit" className="btn btn-primary" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan Data'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
