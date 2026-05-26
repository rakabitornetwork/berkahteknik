import React, { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function MechanicOps({ attendanceRows = [], commissionRows = [], mechanics = [] }) {
    const [attendance, setAttendance] = useState({ user_id: '', attendance_date: new Date().toISOString().slice(0, 10), status: 'present', check_in: '', check_out: '', notes: '' });
    const [commission, setCommission] = useState({ start_date: new Date().toISOString().slice(0, 10), end_date: new Date().toISOString().slice(0, 10), rate: 10 });
    const [qrPayload, setQrPayload] = useState('');
    const [cameraScanning, setCameraScanning] = useState(false);
    const [scannerMessage, setScannerMessage] = useState('');
    const videoRef = useRef(null);

    const submitAttendance = (e) => {
        e.preventDefault();
        router.post('/admin/mechanic-ops/attendance', attendance, { preserveScroll: true });
    };

    const generateCommissions = (e) => {
        e.preventDefault();
        router.post('/admin/mechanic-ops/commissions/generate', commission, { preserveScroll: true });
    };

    const submitQrAttendance = (payload = qrPayload) => {
        if (!payload) {
            setScannerMessage('Scan QR atau tempel token QR terlebih dahulu.');
            return;
        }

        router.post('/admin/mechanic-ops/attendance/scan', { qr_payload: payload }, {
            preserveScroll: true,
            onSuccess: () => setQrPayload(''),
        });
    };

    useEffect(() => {
        if (!cameraScanning) return undefined;

        let stream;
        let frame;
        let stopped = false;

        const stopCamera = () => {
            stopped = true;
            if (frame) cancelAnimationFrame(frame);
            if (stream) stream.getTracks().forEach(track => track.stop());
        };

        const start = async () => {
            if (!('BarcodeDetector' in window)) {
                setScannerMessage('Browser belum mendukung scan QR langsung. Gunakan input token manual atau browser Chrome/Edge terbaru.');
                setCameraScanning(false);
                return;
            }

            try {
                const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if (!videoRef.current) return;

                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setScannerMessage('Arahkan kamera ke QR mekanik.');

                const scan = async () => {
                    if (stopped || !videoRef.current) return;

                    try {
                        const codes = await detector.detect(videoRef.current);
                        if (codes.length > 0) {
                            const value = codes[0].rawValue;
                            setQrPayload(value);
                            setCameraScanning(false);
                            stopCamera();
                            submitQrAttendance(value);
                            return;
                        }
                    } catch (error) {
                        setScannerMessage('QR belum terbaca, pastikan QR jelas dan pencahayaan cukup.');
                    }

                    frame = requestAnimationFrame(scan);
                };

                scan();
            } catch (error) {
                setScannerMessage('Kamera tidak dapat diakses. Periksa izin kamera browser.');
                setCameraScanning(false);
                stopCamera();
            }
        };

        start();

        return stopCamera;
    }, [cameraScanning]);

    return (
        <AdminLayout title="Operasional Mekanik">
            <Head title="Operasional Mekanik" />

            <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>Absensi, Jadwal & Komisi Mekanik</h2>
                    <p style={{ margin: '0.35rem 0 0', color: 'var(--color-text-muted)' }}>Catat kehadiran mekanik dan hitung komisi dari jasa servis selesai.</p>
                </div>

                <div className="glass-panel" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
                    <div>
                        <h3 style={{ margin: 0 }}>Scan QR Absensi Mekanik</h3>
                        <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            Scan pertama hari ini menjadi check-in. Scan berikutnya menjadi check-out.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) auto auto', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                            className="form-input"
                            value={qrPayload}
                            onChange={e => setQrPayload(e.target.value)}
                            placeholder="Scan QR atau tempel token QR mekanik"
                        />
                        <button type="button" className="btn btn-outline" onClick={() => setCameraScanning(true)} disabled={cameraScanning}>
                            {cameraScanning ? 'Memindai...' : 'Scan Kamera'}
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => submitQrAttendance()}>
                            Proses Absensi
                        </button>
                    </div>
                    {cameraScanning && (
                        <video ref={videoRef} muted playsInline style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                    )}
                    {scannerMessage && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{scannerMessage}</div>}
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
                        <label style={{ display: 'grid', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            Tanggal Mulai
                            <input className="form-input" type="date" value={commission.start_date} onChange={e => setCommission({ ...commission, start_date: e.target.value })} required />
                        </label>
                        <label style={{ display: 'grid', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            Tanggal Selesai
                            <input className="form-input" type="date" value={commission.end_date} onChange={e => setCommission({ ...commission, end_date: e.target.value })} required />
                        </label>
                        <label style={{ display: 'grid', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            Persentase Komisi dari Biaya Jasa
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="form-input"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={commission.rate}
                                    onChange={e => setCommission({ ...commission, rate: e.target.value })}
                                    required
                                    style={{ paddingRight: '2.25rem' }}
                                />
                                <span style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--color-text-muted)', pointerEvents: 'none' }}>
                                    %
                                </span>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                                Contoh: isi 10 untuk komisi 10% dari biaya jasa servis.
                            </span>
                        </label>
                        <button className="btn btn-primary" type="submit">Generate Komisi</button>
                    </form>
                </div>

                <div className="glass-panel" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                            <h3 style={{ margin: 0 }}>Kartu QR Mekanik</h3>
                            <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                Cetak atau simpan QR ini untuk absensi mekanik. Token QR tidak menampilkan data pribadi.
                            </p>
                        </div>
                        <button type="button" className="btn btn-outline" onClick={() => window.print()}>Cetak QR</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                        {mechanics.length > 0 ? mechanics.map(mechanic => (
                            <div key={mechanic.id} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', display: 'grid', gap: '0.75rem', justifyItems: 'center', textAlign: 'center' }}>
                                <QRCodeSVG value={mechanic.attendance_qr_payload} size={132} includeMargin />
                                <div>
                                    <div style={{ fontWeight: 800 }}>{mechanic.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>QR Absensi Mekanik</div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => window.confirm(`Buat ulang QR untuk ${mechanic.name}? QR lama tidak bisa dipakai lagi.`) && router.patch(`/admin/mechanic-ops/mechanics/${mechanic.id}/qr-token`, {}, { preserveScroll: true })}
                                    style={{ fontSize: '0.72rem', padding: '0.3rem 0.55rem' }}
                                >
                                    Buat Ulang QR
                                </button>
                            </div>
                        )) : (
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Belum ada mekanik.</div>
                        )}
                    </div>
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
