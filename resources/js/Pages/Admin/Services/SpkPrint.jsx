import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

const fmt = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;
const fmtDate = (d) => d ? new Date(d).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }) : '-';
const statusLabel = { antri: 'Antri', dikerjakan: 'Dikerjakan', selesai: 'Selesai' };

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={sectionTitleStyle}>{title}</h3>
            {children}
        </div>
    );
}

const sectionTitleStyle = {
    fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
    color: '#1e40af', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.35rem',
};

function Field({ label, value, bold, block }) {
    return (
        <div style={block ? { marginBottom: '0.75rem' } : undefined}>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: bold ? 700 : 400 }}>{value || '-'}</div>
        </div>
    );
}

function Box({ label, children, highlight }) {
    return (
        <div style={{
            marginTop: '0.75rem', padding: '0.75rem',
            background: highlight ? '#fef9c3' : '#f8fafc',
            border: `1px solid ${highlight ? '#eab308' : '#e2e8f0'}`,
            borderRadius: '6px',
            color: highlight ? '#422006' : '#1e293b',
        }}>
            <div style={{ fontSize: '0.65rem', color: highlight ? '#92400e' : '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.35rem' }}>{label}</div>
            <div style={{ fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{children}</div>
        </div>
    );
}

function SigBox({ title, subtitle }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 600, marginBottom: '3rem' }}>{title}</div>
            <div style={{ borderTop: '1px solid #333', paddingTop: '0.35rem' }}>{subtitle || '(........................)'}</div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.25rem' }}>Tanda Tangan & Tanggal</div>
        </div>
    );
}

export default function SpkPrint({ service, shop }) {
    const partsTotal = service.spare_parts?.reduce((sum, p) => sum + (p.pivot.quantity * p.pivot.unit_price), 0) || 0;
    const grandTotal = partsTotal + Number(service.service_fee || 0);

    useEffect(() => {
        if (new URLSearchParams(window.location.search).get('print') === '1') {
            const t = setTimeout(() => window.print(), 400);
            return () => clearTimeout(t);
        }
    }, []);

    const handleBack = () => {
        const goToService = () => router.visit(`/admin/services/${service.id}`);

        if (window.opener && !window.opener.closed) {
            window.close();
            setTimeout(() => {
                if (!window.closed) goToService();
            }, 150);
            return;
        }
        if (window.history.length > 1) {
            window.history.back();
            return;
        }
        goToService();
    };

    const thStyle = { padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #cbd5e1' };
    const tdStyle = { padding: '0.5rem' };

    return (
        <>
            <Head title={`SPK ${service.spk_number}`} />
            <style>{`
                .spk-print-shell { min-height: 100vh; background: #f1f5f9; }
                .spk-print-toolbar {
                    display: flex; justify-content: center; align-items: center; gap: 0.75rem;
                    padding: 1.25rem 1.5rem 1rem; max-width: 210mm; margin: 0 auto;
                }
                .spk-print-toolbar button {
                    font-size: 0.875rem; padding: 0.5rem 1.25rem; border-radius: 8px; cursor: pointer;
                }
                .spk-print-toolbar .btn-print {
                    border: none; background: #2563eb; color: white;
                }
                .spk-print-toolbar .btn-back {
                    background: white; border: 1px solid #cbd5e1; color: #334155;
                }
                .spk-print-body { padding: 0 1.5rem 1.5rem; max-width: calc(210mm + 3rem); margin: 0 auto; }
                @media print {
                    .no-print { display: none !important; }
                    .spk-print-shell { background: white !important; min-height: auto !important; }
                    html, body { background: white !important; margin: 0 !important; }
                    body * { visibility: visible !important; }
                    .spk-page { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; padding: 0 !important; }
                }
                @page { margin: 12mm; }
            `}</style>

            <div className="spk-print-shell">
                <div className="spk-print-toolbar no-print">
                    <button type="button" className="btn-print" onClick={() => window.print()}>Cetak SPK</button>
                    <button type="button" className="btn-back" onClick={handleBack}>Kembali</button>
                </div>

                <div className="spk-print-body">
                    <SpkPageContent service={service} shop={shop} grandTotal={grandTotal} thStyle={thStyle} tdStyle={tdStyle} />
                </div>
            </div>
        </>
    );
}

function SpkPageContent({ service, shop, grandTotal, thStyle, tdStyle }) {
    const shopName = shop?.legal_name || shop?.app_name || 'Berkah Teknik AC';

    return (
        <div className="spk-page" style={{ maxWidth: '210mm', margin: '0 auto', background: 'white', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontFamily: 'system-ui, sans-serif', color: '#111' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #1e40af', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e40af' }}>{shopName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Surat Perintah Kerja (SPK)</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: '#1e40af', background: '#eff6ff', padding: '0.35rem 0.75rem', borderRadius: '6px' }}>{service.spk_number}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Servis #{String(service.id).padStart(4, '0')}</div>
                </div>
            </div>

            <Section title="Data Pelanggan & Kendaraan">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem' }}>
                    <Field label="Nama Pelanggan" value={service.vehicle?.customer?.name} />
                    <Field label="Telepon" value={service.vehicle?.customer?.phone} />
                    <Field label="Kendaraan" value={`${service.vehicle?.brand} ${service.vehicle?.model}`} />
                    <Field label="Plat Nomor" value={service.vehicle?.license_plate} bold />
                    <Field label="Tahun" value={service.vehicle?.year || '-'} />
                    <Field label="Tanggal SPK" value={fmtDate(service.spk_issued_at)} />
                </div>
            </Section>

            <Section title="Rincian Pekerjaan">
                <Field label="Jenis Jasa" value={service.service_name} bold block />
                <Box label="Keluhan Pelanggan">{service.description}</Box>
                {service.work_instructions && <Box label="Instruksi Kerja (dari Admin)" highlight>{service.work_instructions}</Box>}
                {service.diagnosis && <Box label="Diagnosa Teknisi">{service.diagnosis}</Box>}
                {(service.is_bring_own_part === 1 || service.is_bring_own_part === true) && (
                    <p style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: 600, margin: '0.5rem 0 0' }}>* Pelanggan membawa spare part sendiri</p>
                )}
            </Section>

            <Section title="Spare Part yang Digunakan">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ background: '#f1f5f9' }}>
                            <th style={thStyle}>Nama Part</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>Qty</th>
                            <th style={{ ...thStyle, textAlign: 'right' }}>Harga</th>
                            <th style={{ ...thStyle, textAlign: 'right' }}>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {service.spare_parts?.length > 0 ? service.spare_parts.map((p, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={tdStyle}>{p.name}</td>
                                <td style={{ ...tdStyle, textAlign: 'center' }}>{p.pivot.quantity} {p.unit}</td>
                                <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(p.pivot.unit_price)}</td>
                                <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(p.pivot.quantity * p.pivot.unit_price)}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan={4} style={{ ...tdStyle, color: '#94a3b8', fontStyle: 'italic' }}>Tidak ada spare part dari bengkel</td></tr>
                        )}
                    </tbody>
                </table>
                <div style={{ textAlign: 'right', marginTop: '0.75rem', fontSize: '0.85rem' }}>
                    Biaya Jasa: {fmt(service.service_fee)} | <strong>Estimasi Total: {fmt(grandTotal)}</strong>
                </div>
            </Section>

            <Section title="Penugasan Mekanik">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem' }}>
                    <Field label="Mekanik / Teknisi" value={service.technician?.name || '— Belum ditugaskan —'} bold />
                    <Field label="Status Pekerjaan" value={statusLabel[service.status] || service.status} />
                    <Field label="Mulai Dikerjakan" value={fmtDate(service.started_at)} />
                    <Field label="Selesai" value={fmtDate(service.completed_at)} />
                </div>
                {service.mechanic_notes && <Box label="Catatan Mekanik">{service.mechanic_notes}</Box>}
            </Section>

            <Section title="Garansi Servis">
                <Field label="Masa Garansi" value={`${service.effective_warranty_months} bulan`} />
                {service.warranty_expires_at && <Field label="Berlaku Hingga" value={new Date(service.warranty_expires_at).toLocaleDateString('id-ID')} />}
                {service.warranty_notes && <Box label="Catatan Garansi">{service.warranty_notes}</Box>}
                {service.warranty_terms && <Box label="Syarat Khusus">{service.warranty_terms}</Box>}
                {shop?.warranty_policy && <Box label="Kebijakan Umum">{shop.warranty_policy}</Box>}
            </Section>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginTop: '2.5rem', fontSize: '0.8rem' }}>
                <SigBox title="Admin / Kasir" />
                <SigBox title="Mekanik Penanggung Jawab" subtitle={service.technician?.name} />
                <SigBox title="Pelanggan (Opsional)" />
            </div>

            <p style={{ marginTop: '2rem', fontSize: '0.7rem', color: '#64748b', textAlign: 'center', borderTop: '1px dashed #cbd5e1', paddingTop: '1rem' }}>
                Simpan lembar ini sebagai bukti penugasan. Nomor SPK wajib dicantumkan saat menangani komplain pelanggan.
                <br />Dicetak: {new Date().toLocaleString('id-ID')}
            </p>
        </div>
    );
}
