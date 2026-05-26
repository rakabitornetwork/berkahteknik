import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function BranchesWarehouses({ branches = [], warehouses = [] }) {
    const [branch, setBranch] = useState({ code: '', name: '', address: '', phone: '' });
    const [warehouse, setWarehouse] = useState({ code: '', name: '', branch_id: '' });

    return (
        <AdminLayout title="Cabang & Gudang">
            <Head title="Cabang & Gudang" />
            <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>Multi-Cabang & Gudang</h2>
                    <p style={{ margin: '0.35rem 0 0', color: 'var(--color-text-muted)' }}>Fondasi awal untuk cabang dan gudang. Data lama tetap memakai cabang/gudang default.</p>
                </div>

                <div className="hd-grid hd-grid-cols-2">
                    <form className="glass-panel" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }} onSubmit={e => { e.preventDefault(); router.post('/admin/branches', branch, { preserveScroll: true }); }}>
                        <h3 style={{ margin: 0 }}>Tambah Cabang</h3>
                        <input className="form-input" placeholder="Kode" value={branch.code} onChange={e => setBranch({ ...branch, code: e.target.value })} required />
                        <input className="form-input" placeholder="Nama cabang" value={branch.name} onChange={e => setBranch({ ...branch, name: e.target.value })} required />
                        <input className="form-input" placeholder="Telepon" value={branch.phone} onChange={e => setBranch({ ...branch, phone: e.target.value })} />
                        <textarea className="form-input" rows={3} placeholder="Alamat" value={branch.address} onChange={e => setBranch({ ...branch, address: e.target.value })} />
                        <button className="btn btn-primary">Simpan Cabang</button>
                    </form>

                    <form className="glass-panel" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }} onSubmit={e => { e.preventDefault(); router.post('/admin/warehouses', warehouse, { preserveScroll: true }); }}>
                        <h3 style={{ margin: 0 }}>Tambah Gudang</h3>
                        <input className="form-input" placeholder="Kode" value={warehouse.code} onChange={e => setWarehouse({ ...warehouse, code: e.target.value })} required />
                        <input className="form-input" placeholder="Nama gudang" value={warehouse.name} onChange={e => setWarehouse({ ...warehouse, name: e.target.value })} required />
                        <input className="form-input" type="number" placeholder="ID Cabang (opsional)" value={warehouse.branch_id} onChange={e => setWarehouse({ ...warehouse, branch_id: e.target.value })} />
                        <button className="btn btn-primary">Simpan Gudang</button>
                    </form>
                </div>

                <SimpleTable title="Daftar Cabang" rows={branches} />
                <SimpleTable title="Daftar Gudang" rows={warehouses} />
            </div>
        </AdminLayout>
    );
}

function SimpleTable({ title, rows }) {
    const columns = rows?.[0] ? Object.keys(rows[0]) : [];

    return (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <h3 style={{ padding: '1rem', margin: 0 }}>{title}</h3>
            <table className="hd-table">
                <thead><tr>{columns.map(column => <th key={column}>{column}</th>)}</tr></thead>
                <tbody>
                    {rows.length > 0 ? rows.map((row, i) => <tr key={i}>{columns.map(column => <td key={column}>{row[column]}</td>)}</tr>) : (
                        <tr><td colSpan={columns.length || 1} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Belum ada data.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
