import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Printer, ArrowLeft } from 'lucide-react';

const fmt = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <h3 style={sectionTitleStyle}>{title}</h3>
            {children}
        </div>
    );
}

const sectionTitleStyle = {
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#0f766e', // Teal color matching the branding
    marginBottom: '0.5rem',
    borderBottom: '1px solid #cbd5e1',
    paddingBottom: '0.25rem',
};

function Field({ label, value, bold }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.75rem' }}>
            <span style={{ color: '#64748b' }}>{label}</span>
            <span style={{ fontWeight: bold ? 700 : 500, color: '#1e293b' }}>{value || '-'}</span>
        </div>
    );
}

export default function InvoicePrint({ service, shop }) {
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

    const thStyle = { padding: '0.4rem 0.5rem', textAlign: 'left', borderBottom: '1.5px solid #cbd5e1', fontSize: '0.75rem', fontWeight: 600, color: '#475569' };
    const tdStyle = { padding: '0.4rem 0.5rem', fontSize: '0.75rem', borderBottom: '1px solid #f1f5f9', color: '#1e293b' };

    return (
        <>
            <Head title={`Invoice Servis ${service.spk_number}`} />
            <style>{`
                .invoice-print-shell {
                    min-height: 100vh;
                    background: #f8fafc;
                    font-family: 'Inter', system-ui, sans-serif;
                }
                .invoice-print-toolbar {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    max-width: 210mm;
                    margin: 0 auto;
                }
                .invoice-print-toolbar button {
                    font-size: 0.8rem;
                    padding: 0.45rem 1.1rem;
                    border-radius: 8px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-weight: 500;
                }
                .invoice-print-toolbar .btn-print {
                    border: none;
                    background: #0f766e;
                    color: white;
                }
                .invoice-print-toolbar .btn-back {
                    background: white;
                    border: 1px solid #cbd5e1;
                    color: #334155;
                }
                .invoice-print-body {
                    padding: 0 1rem 1.5rem;
                    max-width: calc(210mm + 2rem);
                    margin: 0 auto;
                }
                .invoice-page {
                    max-width: 210mm;
                    margin: 0 auto;
                    background: white;
                    padding: 2rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 10px 30px rgba(0,0,0,0.03);
                    position: relative;
                }
                .invoice-paid-watermark {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;
                    z-index: 10;
                    overflow: hidden;
                }
                .watermark-text {
                    transform: rotate(-25deg);
                    fontSize: 4.5rem;
                    font-weight: 900;
                    letter-spacing: 0.2em;
                    color: rgba(22, 163, 74, 0.13);
                    border: 4px solid rgba(22, 163, 74, 0.25);
                    border-radius: 12px;
                    padding: 0.2em 0.5em;
                    user-select: none;
                    white-space: nowrap;
                }
                @media print {
                    .no-print { display: none !important; }
                    .invoice-print-shell { background: white !important; min-height: auto !important; }
                    html, body { background: white !important; margin: 0 !important; }
                    .invoice-page { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; padding: 0 !important; }
                }
                @page { margin: 10mm; }
            `}</style>

            <div className="invoice-print-shell">
                <div className="invoice-print-toolbar no-print">
                    <button type="button" className="btn-print" onClick={() => window.print()}>
                        <Printer size={16} /> Cetak Invoice
                    </button>
                    <button type="button" className="btn-back" onClick={handleBack}>
                        <ArrowLeft size={16} /> Kembali
                    </button>
                </div>

                <div className="invoice-print-body">
                    <div className="invoice-page">
                        {service.payment_status === 'lunas' && (
                            <div className="invoice-paid-watermark" aria-hidden>
                                <span className="watermark-text" style={{ fontSize: '4rem' }}>LUNAS</span>
                            </div>
                        )}

                        {/* Invoice Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2.5px solid #0f766e', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
                            <div>
                                <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f766e', letterSpacing: '-0.01em' }}>
                                    {shop?.legal_name || shop?.app_name || 'Berkah Teknik AC'}
                                </h1>
                                {shop?.tagline && <p style={{ margin: '0.15rem 0 0', fontSize: '0.7rem', color: '#64748b' }}>{shop.tagline}</p>}
                                {shop?.address && <p style={{ margin: '0.35rem 0 0', fontSize: '0.68rem', color: '#64748b', maxWidth: '300px', lineHeight: 1.4 }}>{shop.address}</p>}
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.65rem', color: '#64748b' }}>
                                    {[shop?.phone && `Telp: ${shop.phone}`, shop?.whatsapp && `WA: ${shop.whatsapp}`].filter(Boolean).join(' · ')}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>INVOICE SERVIS</div>
                                <div style={{ fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 700, color: '#0f766e', background: '#f0fdfa', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'inline-block', marginTop: '0.25rem' }}>
                                    {service.spk_number}
                                </div>
                                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.35rem' }}>
                                    ID Servis: #{String(service.id).padStart(4, '0')}
                                </div>
                            </div>
                        </div>

                        {/* Customer & Vehicle Information */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                            <Section title="Informasi Pelanggan">
                                <Field label="Nama Pelanggan" value={service.vehicle?.customer?.name} />
                                <Field label="No. HP" value={service.vehicle?.customer?.phone} />
                                <Field label="Kendaraan" value={`${service.vehicle?.brand} ${service.vehicle?.model}`} />
                                <Field label="Plat Nomor" value={service.vehicle?.license_plate} bold />
                            </Section>

                            <Section title="Detail Transaksi">
                                <Field label="Tanggal Masuk" value={fmtDate(service.created_at)} />
                                <Field label="Tanggal Selesai" value={fmtDate(service.completed_at)} />
                                <Field label="Mekanik" value={service.technician?.name} />
                                <Field label="Status Pembayaran" value={service.payment_status === 'lunas' ? 'LUNAS' : 'BELUM LUNAS'} bold />
                            </Section>
                        </div>

                        {/* Service Type Description */}
                        <div style={{ marginBottom: '1rem' }}>
                            <Section title="Pekerjaan / Keluhan">
                                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f766e', marginBottom: '0.25rem' }}>
                                        Jenis Servis: {service.service_name}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.4 }}>
                                        <strong>Keluhan Awal:</strong> {service.description}
                                    </div>
                                    {service.diagnosis && (
                                        <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.4, marginTop: '0.35rem' }}>
                                            <strong>Diagnosa Mekanik:</strong> {service.diagnosis}
                                        </div>
                                    )}
                                </div>
                            </Section>
                        </div>

                        {/* Billing Details Table */}
                        <Section title="Rincian Suku Cadang & Biaya Jasa">
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0.75rem' }}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Nama Suku Cadang</th>
                                        <th style={{ ...thStyle, textAlign: 'center', width: '3rem' }}>Qty</th>
                                        <th style={{ ...thStyle, textAlign: 'right', width: '7rem' }}>Harga</th>
                                        <th style={{ ...thStyle, textAlign: 'right', width: '8rem' }}>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {service.spare_parts?.length > 0 ? service.spare_parts.map((p, i) => (
                                        <tr key={i}>
                                            <td style={tdStyle}>{p.name}</td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>{p.pivot.quantity} {p.unit}</td>
                                            <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(p.pivot.unit_price)}</td>
                                            <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>{fmt(p.pivot.quantity * p.pivot.unit_price)}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} style={{ ...tdStyle, color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '0.75rem' }}>
                                                Tidak ada penggantian suku cadang
                                            </td>
                                        </tr>
                                    )}
                                    <tr style={{ background: '#f8fafc' }}>
                                        <td colSpan={3} style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, borderTop: '1.5px solid #cbd5e1', color: '#475569' }}>BIAYA JASA SERVIS</td>
                                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, borderTop: '1.5px solid #cbd5e1', color: '#475569' }}>{fmt(service.service_fee)}</td>
                                    </tr>
                                    <tr style={{ background: '#f0fdfa' }}>
                                        <td colSpan={3} style={{ ...tdStyle, textAlign: 'right', fontWeight: 800, fontSize: '0.85rem', color: '#0f766e', borderTop: '2px solid #0f766e' }}>TOTAL TAGIHAN</td>
                                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 800, fontSize: '0.85rem', color: '#0f766e', borderTop: '2px solid #0f766e' }}>{fmt(grandTotal)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Section>

                        {/* Warranty Details */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'start' }}>
                            <div>
                                <Section title="Ketentuan Garansi Servis">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.72rem', color: '#475569', lineHeight: 1.45 }}>
                                        <div><strong>Masa Garansi:</strong> {service.effective_warranty_months} Bulan</div>
                                        {service.status === 'selesai' && service.warranty_expires_at && (
                                            <div><strong>Berlaku Sampai:</strong> {fmtDate(service.warranty_expires_at)}</div>
                                        )}
                                        {service.warranty_notes && (
                                            <div><strong>Catatan Garansi:</strong> {service.warranty_notes}</div>
                                        )}
                                        {shop?.warranty_policy && (
                                            <div style={{ marginTop: '0.35rem', fontSize: '0.65rem', color: '#64748b', background: '#f8fafc', padding: '0.5rem', borderRadius: '4px', border: '1px dashed #cbd5e1', whiteSpace: 'pre-line' }}>
                                                {shop.warranty_policy}
                                            </div>
                                        )}
                                    </div>
                                </Section>
                            </div>

                            {/* Signatures */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center', fontSize: '0.7rem', marginTop: '0.75rem' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#475569', marginBottom: '2.5rem' }}>Pelanggan</div>
                                    <div style={{ borderTop: '1px solid #94a3b8', width: '80%', margin: '0 auto', paddingTop: '0.25rem', color: '#64748b' }}>
                                        {service.vehicle?.customer?.name}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#475569', marginBottom: '2.5rem' }}>Hormat Kami,</div>
                                    <div style={{ borderTop: '1px solid #94a3b8', width: '80%', margin: '0 auto', paddingTop: '0.25rem', color: '#64748b' }}>
                                        Kasir / Admin
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer text */}
                        <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem', textAlign: 'center', fontSize: '0.65rem', color: '#94a3b8' }}>
                            {shop?.receipt_footer || 'Terima kasih atas kepercayaan Anda mempercayakan servis AC kendaraan Anda di Berkah Teknik.'}
                            <br />
                            <span style={{ fontSize: '0.6rem' }}>Dicetak pada: {new Date().toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
