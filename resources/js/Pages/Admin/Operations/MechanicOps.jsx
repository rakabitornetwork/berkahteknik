import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function MechanicOps({ attendanceRows = [], commissionRows = [], mechanics = [] }) {
    const [attendance, setAttendance] = useState({ user_id: '', attendance_date: new Date().toISOString().slice(0, 10), status: 'present', check_in: '', check_out: '', notes: '' });
    const [commission, setCommission] = useState({ start_date: new Date().toISOString().slice(0, 10), end_date: new Date().toISOString().slice(0, 10), rate: 10 });

    const submitAttendance = (e) => {
        e.preventDefault();
        router.post('/admin/mechanic-ops/attendance', attendance, { preserveScroll: true });
    };

    const generateCommissions = (e) => {
        e.preventDefault();
        router.post('/admin/mechanic-ops/commissions/generate', commission, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Operasional Mekanik">
            <Head title="Operasional Mekanik" />

            <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>Absensi, Jadwal & Komisi Mekanik</h2>
                    <p style={{ margin: '0.35rem 0 0', color: 'var(--color-text-muted)' }}>Catat kehadiran mekanik dan hitung komisi dari jasa servis selesai.</p>
                </div>

                <div className="hd-grid hd-grid-cols-2">
                    <form onSubmit={submitAttendance} className="glass-panel" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
                        <h3 style={{ margin: 0 }}>Catat Absensi</h3>
                        <select className="form-input" value={attendance.user_id} onChange={e => setAttendance({ ...attendance, user_id: e.target.value })} required>
                            <option value="">Pilih mekanik...</option>
                            {mechanics.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        <input className="form-input" type="date" value={attendance.attendance_date} onChange={e => setAttendance({ ...attendance, attendance_date: e.target.value })} required />
                        <select className="form-input" value={attendance.status} onChange={e => setAttendance({ ...attendance, status: e.target.value })}>
                            <option value="present">Hadir</option>
                            <option value="permission">Izin</option>
                            <option value="sick">Sakit</option>
                            <option value="absent">Alfa</option>
                        </select>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            <input className="form-input" type="time" value={attendance.check_in} onChange={e => setAttendance({ ...attendance, check_in: e.target.value })} />
                            <input className="form-input" type="time" value={attendance.check_out} onChange={e => setAttendance({ ...attendance, check_out: e.target.value })} />
                        </div>
                        <textarea className="form-input" rows={3} placeholder="Catatan" value={attendance.notes} onChange={e => setAttendance({ ...attendance, notes: e.target.value })} />
                        <button className="btn btn-primary" type="submit">Simpan Absensi</button>
                    </form>

                    <form onSubmit={generateCommissions} className="glass-panel" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
                        <h3 style={{ margin: 0 }}>Hitung Komisi</h3>
                        <input className="form-input" type="date" value={commission.start_date} onChange={e => setCommission({ ...commission, start_date: e.target.value })} required />
                        <input className="form-input" type="date" value={commission.end_date} onChange={e => setCommission({ ...commission, end_date: e.target.value })} required />
                        <input className="form-input" type="number" min="0" max="100" step="0.1" value={commission.rate} onChange={e => setCommission({ ...commission, rate: e.target.value })} required />
                        <button className="btn btn-primary" type="submit">Generate Komisi</button>
                    </form>
                </div>

                <SimpleTable title="Absensi Terbaru" rows={attendanceRows} />
                <SimpleTable title="Komisi Terbaru" rows={commissionRows} />
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
                <thead>
                    <tr>{columns.map(column => <th key={column}>{column}</th>)}</tr>
                </thead>
                <tbody>
                    {rows.length > 0 ? rows.map((row, i) => (
                        <tr key={i}>{columns.map(column => <td key={column}>{row[column]}</td>)}</tr>
                    )) : (
                        <tr><td colSpan={columns.length || 1} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Belum ada data.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
