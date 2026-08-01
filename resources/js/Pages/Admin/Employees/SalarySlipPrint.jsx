import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;
const months = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function SalarySlipPrint({ salary, shop }) {
    const employee = salary.employee;
    const periodLabel = `${months[salary.period_month] || salary.period_month} ${salary.period_year}`;

    useEffect(() => {
        if (new URLSearchParams(window.location.search).get('print') === '1') {
            const t = setTimeout(() => window.print(), 400);
            return () => clearTimeout(t);
        }
    }, []);

    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
            return;
        }
        router.visit('/admin/karyawan/gaji');
    };

    const row = (label, value, bold = false) => (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.45rem 0',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '0.85rem',
            fontWeight: bold ? 700 : 500,
        }}>
            <span style={{ color: '#475569' }}>{label}</span>
            <span style={{ color: '#0f172a' }}>{fmt(value)}</span>
        </div>
    );

    return (
        <>
            <Head title={`Slip Gaji ${employee?.name || ''} - ${periodLabel}`} />
            <style>{`
                .slip-shell { min-height: 100vh; background: #f8fafc; font-family: Inter, system-ui, sans-serif; }
                .slip-toolbar { display: flex; justify-content: center; gap: 0.75rem; padding: 1rem; }
                .slip-toolbar button {
                    font-size: 0.8rem; padding: 0.45rem 1.1rem; border-radius: 8px; cursor: pointer;
                    display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 500;
                }
                .btn-print { border: none; background: #0f766e; color: white; }
                .btn-back { background: white; border: 1px solid #cbd5e1; color: #334155; }
                .slip-page {
                    max-width: 190mm; margin: 0 auto 1.5rem; background: white; padding: 1.75rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 10px 30px rgba(0,0,0,0.03);
                }
                @media print {
                    .no-print { display: none !important; }
                    .slip-shell { background: white !important; }
                    .slip-page { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; padding: 0 !important; }
                }
                @page { margin: 12mm; }
            `}</style>

            <div className="slip-shell">
                <div className="slip-toolbar no-print">
                    <button type="button" className="btn-print" onClick={() => window.print()}>
                        <Printer size={16} /> Cetak Slip Gaji
                    </button>
                    <button type="button" className="btn-back" onClick={handleBack}>
                        <ArrowLeft size={16} /> Kembali
                    </button>
                </div>

                <div className="slip-page">
                    <div style={{ borderBottom: '2.5px solid #0f766e', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f766e' }}>
                            {shop?.legal_name || shop?.app_name || 'Berkah Teknik AC'}
                        </div>
                        {shop?.address && <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>{shop.address}</div>}
                        <div style={{ marginTop: '0.75rem', fontSize: '1rem', fontWeight: 800, letterSpacing: '0.04em', color: '#0f766e' }}>
                            SLIP GAJI KARYAWAN
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Periode: {periodLabel}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1.5rem', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
                        <div><span style={{ color: '#64748b' }}>Nama Karyawan</span><div style={{ fontWeight: 700 }}>{employee?.name || '-'}</div></div>
                        <div><span style={{ color: '#64748b' }}>Jabatan</span><div style={{ fontWeight: 700 }}>{employee?.position?.name || '-'}</div></div>
                        <div><span style={{ color: '#64748b' }}>No HP</span><div style={{ fontWeight: 600 }}>{employee?.phone || '-'}</div></div>
                        <div><span style={{ color: '#64748b' }}>Status</span><div style={{ fontWeight: 700 }}>{salary.status === 'paid' ? 'DIBAYAR' : 'DRAFT'}</div></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pendapatan</div>
                            {row('Pendapatan', salary.pendapatan)}
                            {row('Tunjangan Transport', salary.tunjangan_transport)}
                            {row('Intensif Jasa', salary.intensif_jasa)}
                            {row('Intensif Sparepart', salary.intensif_sparepart)}
                            {row(
                                'Total Pendapatan',
                                Number(salary.pendapatan || 0)
                                + Number(salary.tunjangan_transport || 0)
                                + Number(salary.intensif_jasa || 0)
                                + Number(salary.intensif_sparepart || 0),
                                true,
                            )}
                        </div>

                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Potongan</div>
                            {row('Potongan', salary.potongan)}
                            <div style={{ marginTop: '1.5rem', padding: '0.75rem', borderRadius: '8px', background: '#f0fdfa', border: '1px solid #99f6e4' }}>
                                <div style={{ fontSize: '0.72rem', color: '#0f766e', fontWeight: 700 }}>GAJI BERSIH</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f766e' }}>{fmt(salary.net_salary)}</div>
                            </div>
                        </div>
                    </div>

                    {salary.notes && (
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1.5rem' }}>
                            <strong>Catatan:</strong> {salary.notes}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem' }}>
                        <div>
                            <div style={{ color: '#475569', fontWeight: 600, marginBottom: '3rem' }}>Karyawan</div>
                            <div style={{ borderTop: '1px solid #94a3b8', width: '70%', margin: '0 auto', paddingTop: '0.35rem', color: '#64748b' }}>
                                {employee?.name || '________________'}
                            </div>
                        </div>
                        <div>
                            <div style={{ color: '#475569', fontWeight: 600, marginBottom: '3rem' }}>Pimpinan</div>
                            <div style={{ borderTop: '1px solid #94a3b8', width: '70%', margin: '0 auto', paddingTop: '0.35rem', color: '#64748b' }}>
                                ________________
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.65rem', color: '#94a3b8', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem' }}>
                        Dicetak pada: {new Date().toLocaleString('id-ID')}
                    </div>
                </div>
            </div>
        </>
    );
}
