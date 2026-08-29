import React, { useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, Wallet, Printer } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import DataTable from '../../../Components/DataTable';
import Pagination from '../../../Components/Pagination';
import EmployeeTabs from './EmployeeTabs';

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;
const months = [
    { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' }, { value: 3, label: 'Maret' },
    { value: 4, label: 'April' }, { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' }, { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' }, { value: 11, label: 'November' }, { value: 12, label: 'Desember' },
];

export default function Salaries({ salaries, employees = [], filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [month, setMonth] = useState(filters.month || '');
    const [year, setYear] = useState(filters.year || new Date().getFullYear());

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        user_id: '',
        period_month: new Date().getMonth() + 1,
        period_year: new Date().getFullYear(),
        pendapatan: 0,
        potongan: 0,
        potongan_absensi: 0,
        potongan_piutang: 0,
        tunjangan_transport: 0,
        intensif_jasa: 0,
        intensif_sparepart: 0,
        bonus_reward: 0,
        status: 'draft',
        paid_at: '',
        notes: '',
    });

    const netPreview = useMemo(() => (
        Math.max(
            0,
            Number(data.pendapatan || 0)
            + Number(data.tunjangan_transport || 0)
            + Number(data.intensif_jasa || 0)
            + Number(data.intensif_sparepart || 0)
            + Number(data.bonus_reward || 0)
            - Number(data.potongan || 0)
            - Number(data.potongan_absensi || 0)
            - Number(data.potongan_piutang || 0),
        )
    ), [data.pendapatan, data.tunjangan_transport, data.intensif_jasa, data.intensif_sparepart, data.bonus_reward, data.potongan, data.potongan_absensi, data.potongan_piutang]);

    const applyFilter = (e) => {
        e.preventDefault();
        router.get('/admin/karyawan/gaji', { month: month || undefined, year }, { preserveState: true });
    };

    const openCreate = () => {
        setEditing(null);
        reset();
        setData({
            user_id: '',
            period_month: new Date().getMonth() + 1,
            period_year: new Date().getFullYear(),
            pendapatan: 0,
            potongan: 0,
            potongan_absensi: 0,
            potongan_piutang: 0,
            tunjangan_transport: 0,
            intensif_jasa: 0,
            intensif_sparepart: 0,
            bonus_reward: 0,
            status: 'draft',
            paid_at: '',
            notes: '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setData({
            user_id: item.user_id,
            period_month: item.period_month,
            period_year: item.period_year,
            pendapatan: item.pendapatan,
            potongan: item.potongan,
            potongan_absensi: item.potongan_absensi || 0,
            potongan_piutang: item.potongan_piutang || 0,
            tunjangan_transport: item.tunjangan_transport,
            intensif_jasa: item.intensif_jasa,
            intensif_sparepart: item.intensif_sparepart,
            bonus_reward: item.bonus_reward || 0,
            status: item.status,
            paid_at: item.paid_at ? String(item.paid_at).slice(0, 10) : '',
            notes: item.notes || '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const onEmployeeChange = (userId) => {
        const emp = employees.find(e => String(e.id) === String(userId));
        setData({
            ...data,
            user_id: userId,
            pendapatan: emp?.base_salary || 0,
            tunjangan_transport: emp?.transport_allowance || 0,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(`/admin/karyawan/gaji/${editing.id}`, { onSuccess: () => setIsModalOpen(false) });
        } else {
            post('/admin/karyawan/gaji', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data gaji ini?')) {
            router.delete(`/admin/karyawan/gaji/${id}`);
        }
    };

    const columns = [
        { header: 'Karyawan', accessor: 'employee', cell: r => (
            <div>
                <div style={{ fontWeight: 600 }}>{r.employee?.name || '—'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{r.employee?.position?.name || '—'}</div>
            </div>
        )},
        { header: 'Periode', accessor: 'period_month', cell: r => `${months.find(m => m.value === r.period_month)?.label || r.period_month} ${r.period_year}` },
        { header: 'Pendapatan', accessor: 'pendapatan', cell: r => fmt(r.pendapatan) },
        { header: 'Tj. Transport', accessor: 'tunjangan_transport', cell: r => fmt(r.tunjangan_transport) },
        { header: 'Ins. Jasa', accessor: 'intensif_jasa', cell: r => fmt(r.intensif_jasa) },
        { header: 'Ins. Sparepart', accessor: 'intensif_sparepart', cell: r => fmt(r.intensif_sparepart) },
        { header: 'Bonus / Reward', accessor: 'bonus_reward', cell: r => fmt(r.bonus_reward) },
        { header: 'Potongan', accessor: 'potongan', cell: r => fmt(
            Number(r.potongan || 0) + Number(r.potongan_absensi || 0) + Number(r.potongan_piutang || 0)
        ) },
        { header: 'Gaji Bersih', accessor: 'net_salary', cell: r => <span style={{ fontWeight: 700 }}>{fmt(r.net_salary)}</span> },
        { header: 'Status', accessor: 'status', cell: r => (
            <span style={{ fontWeight: 600, color: r.status === 'paid' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                {r.status === 'paid' ? 'Dibayar' : 'Draft'}
            </span>
        )},
        { header: 'Aksi', accessor: 'id', cell: r => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a href={`/admin/karyawan/gaji/${r.id}/slip?print=1`} target="_blank" rel="noreferrer" title="Cetak Slip" style={{ color: 'var(--color-primary)', display: 'inline-flex' }}>
                    <Printer size={16} />
                </a>
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
        <AdminLayout title="Gaji Karyawan">
            <Head title="Gaji Karyawan" />
            <EmployeeTabs />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                <form onSubmit={applyFilter} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select className="form-input" value={month} onChange={e => setMonth(e.target.value)} style={{ width: '140px' }}>
                        <option value="">Semua bulan</option>
                        {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                    <input type="number" className="form-input" value={year} onChange={e => setYear(e.target.value)} style={{ width: '100px' }} min={2000} max={2100} />
                    <button type="submit" className="btn btn-outline">Filter</button>
                </form>
                <button type="button" onClick={openCreate} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Plus size={16} /> Input Gaji
                </button>
            </div>

            <div className="glass-panel list-panel">
                {salaries.data.length > 0 ? (
                    <>
                        <DataTable columns={columns} data={salaries.data} />
                        <Pagination links={salaries.links} query={{ month, year }} />
                    </>
                ) : (
                    <div className="list-empty-state">
                        <Wallet size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                        <p>Belum ada data gaji karyawan.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
                    <div className="glass-panel" style={{ position: 'relative', width: '100%', maxWidth: '640px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.25rem' }}>
                            {editing ? 'Edit Gaji Karyawan' : 'Input Gaji Karyawan'}
                        </h2>
                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                            <div>
                                <label className="form-label">Karyawan *</label>
                                <select className="form-input" value={data.user_id} onChange={e => onEmployeeChange(e.target.value)} required>
                                    <option value="">-- Pilih karyawan --</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name}{emp.position?.name ? ` · ${emp.position.name}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.user_id && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors.user_id}</div>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label className="form-label">Bulan *</label>
                                    <select className="form-input" value={data.period_month} onChange={e => setData('period_month', e.target.value)} required>
                                        {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Tahun *</label>
                                    <input type="number" className="form-input" value={data.period_year} onChange={e => setData('period_year', e.target.value)} required min={2000} max={2100} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label className="form-label">Pendapatan pokok *</label>
                                    <input type="number" min={0} className="form-input" value={data.pendapatan} onChange={e => setData('pendapatan', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="form-label">Potongan lainnya</label>
                                    <input type="number" min={0} className="form-input" value={data.potongan} onChange={e => setData('potongan', e.target.value)} />
                                </div>
                                <div>
                                    <label className="form-label">Tunjangan Transport</label>
                                    <input type="number" min={0} className="form-input" value={data.tunjangan_transport} onChange={e => setData('tunjangan_transport', e.target.value)} />
                                </div>
                                <div>
                                    <label className="form-label">Potongan absensi</label>
                                    <input type="number" min={0} className="form-input" value={data.potongan_absensi} onChange={e => setData('potongan_absensi', e.target.value)} />
                                </div>
                                <div>
                                    <label className="form-label">Intensif Jasa</label>
                                    <input type="number" min={0} className="form-input" value={data.intensif_jasa} onChange={e => setData('intensif_jasa', e.target.value)} />
                                </div>
                                <div>
                                    <label className="form-label">Potongan piutang</label>
                                    <input type="number" min={0} className="form-input" value={data.potongan_piutang} onChange={e => setData('potongan_piutang', e.target.value)} />
                                </div>
                                <div>
                                    <label className="form-label">Intensif Sparepart</label>
                                    <input type="number" min={0} className="form-input" value={data.intensif_sparepart} onChange={e => setData('intensif_sparepart', e.target.value)} />
                                </div>
                                <div>
                                    <label className="form-label">Bonus / Reward</label>
                                    <input type="number" min={0} className="form-input" value={data.bonus_reward} onChange={e => setData('bonus_reward', e.target.value)} />
                                </div>
                                <div>
                                    <label className="form-label">Status *</label>
                                    <select className="form-input" value={data.status} onChange={e => setData('status', e.target.value)}>
                                        <option value="draft">Draft</option>
                                        <option value="paid">Dibayar</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(15,118,110,0.08)', border: '1px solid rgba(15,118,110,0.2)', fontWeight: 700 }}>
                                Gaji Bersih: {fmt(netPreview)}
                            </div>

                            <div>
                                <label className="form-label">Tanggal Bayar</label>
                                <input type="date" className="form-input" value={data.paid_at} onChange={e => setData('paid_at', e.target.value)} disabled={data.status !== 'paid'} />
                            </div>

                            <div>
                                <label className="form-label">Catatan</label>
                                <textarea className="form-input" rows={2} value={data.notes} onChange={e => setData('notes', e.target.value)} />
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
