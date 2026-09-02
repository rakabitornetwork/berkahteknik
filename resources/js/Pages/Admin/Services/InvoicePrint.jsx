import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import PrintHidePricesToggle from '../../../Components/PrintHidePricesToggle';
import { readHidePrintPrices, writeHidePrintPrices } from '../../../lib/printPriceVisibility';

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;
const fmtWhen = (d) => (d
    ? new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—');
const fmtDate = (d) => (d
    ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—');
const paymentLabels = { cash: 'Tunai', transfer: 'Transfer Bank', qris: 'QRIS' };
const DEFAULT_LOGO = '/images/brand/logo.svg';
const MIN_SCALE = 0.62;

function pickDensity(service) {
    const parts = service.spare_parts?.length || 0;
    const works = service.work_items?.length || 0;
    const text = [
        service.description,
        service.work_instructions,
        service.diagnosis,
        service.mechanic_notes,
        service.warranty_notes,
        service.warranty_terms,
    ].filter(Boolean).join(' ').length;
    const score = parts + works + Math.ceil(text / 160);
    if (score >= 16 || parts + works >= 10) return 'tight';
    if (score >= 8 || parts + works >= 6) return 'compact';
    return 'comfortable';
}

function fitToSheet(sheet, inner, setScale) {
    if (!sheet || !inner) return;
    inner.style.zoom = '1';
    const avail = sheet.clientHeight;
    const needed = inner.scrollHeight;
    const next = needed <= avail + 1 ? 1 : Math.max(MIN_SCALE, avail / needed);
    inner.style.zoom = String(next);
    setScale(next);
}

export default function InvoicePrint({ service, shop }) {
    const parts = service.spare_parts ?? [];
    const workItems = service.work_items ?? [];
    const partsTotal = parts.reduce((sum, p) => sum + (p.pivot.quantity * p.pivot.unit_price), 0);
    const grandTotal = partsTotal + Number(service.service_fee || 0);
    const payments = service.payments || [];
    const paidTotal = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const changeAmount = Math.max(0, paidTotal - grandTotal);
    const balanceDue = Math.max(0, grandTotal - paidTotal);
    const lastPayment = payments[payments.length - 1];
    const paymentLabel = paymentLabels[lastPayment?.payment_method] || lastPayment?.payment_method || 'Tunai';
    const isPaid = service.payment_status === 'lunas';
    const density = useMemo(() => pickDensity(service), [service]);
    const [hidePrices, setHidePrices] = useState(() => readHidePrintPrices());

    const sheetRef = useRef(null);
    const innerRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        writeHidePrintPrices(hidePrices);
    }, [hidePrices]);

    useLayoutEffect(() => {
        let cancelled = false;
        const run = () => {
            if (!cancelled) fitToSheet(sheetRef.current, innerRef.current, setScale);
        };
        run();
        document.fonts?.ready?.then(run);
        return () => { cancelled = true; };
    }, [service, density, hidePrices]);

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

    return (
        <>
            <Head title={`Invoice Servis ${service.spk_number}`} />
            <style>{`
                .invoice-print-shell {
                    min-height: 100vh;
                    background: #e8eef3;
                    font-family: 'Nunito Sans', Inter, system-ui, sans-serif;
                    color: #0f172a;
                    color-scheme: light;
                }
                .invoice-toolbar {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    gap: 0.65rem 0.85rem;
                    padding: 0.85rem 1rem 0.35rem;
                }
                .invoice-toolbar button {
                    font-size: 0.8rem;
                    padding: 0.42rem 1rem;
                    border-radius: 8px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-weight: 600;
                }
                .btn-print { border: none; background: #0f766e; color: #fff; }
                .btn-back { background: #fff; border: 1px solid #cbd5e1; color: #334155; }
                .print-hide-prices-toggle {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.8rem;
                    color: #334155;
                    background: #fff;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 0.42rem 0.8rem;
                    cursor: pointer;
                    user-select: none;
                }
                .invoice-hint {
                    width: 100%;
                    text-align: center;
                    font-size: 0.72rem;
                    color: #475569;
                    padding: 0 1rem 0.75rem;
                    line-height: 1.35;
                }
                .invoice-a4-sheet {
                    width: 210mm;
                    height: 297mm;
                    margin: 0 auto 1.25rem;
                    background: #fff;
                    box-sizing: border-box;
                    padding: 5mm 6mm;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(15,23,42,.06), 0 14px 36px rgba(15,23,42,.08);
                }
                .invoice-inner {
                    --ink: #0f172a;
                    --muted: #64748b;
                    --line: #cbd5e1;
                    --teal: #0f766e;
                    --teal-deep: #115e59;
                    --paper: #f4faf9;
                    --row-pad: 1mm;
                    --fs: 8pt;
                    --sig-h: 18mm;
                    display: flex;
                    flex-direction: column;
                    min-height: 100%;
                    color: var(--ink);
                    font-size: var(--fs);
                    line-height: 1.28;
                    border: 1px solid #94a3b8;
                    background: #fff;
                    transform-origin: top left;
                    position: relative;
                }
                .invoice-inner[data-density="compact"] {
                    --row-pad: 0.7mm;
                    --fs: 7.4pt;
                    --sig-h: 14mm;
                }
                .invoice-inner[data-density="tight"] {
                    --row-pad: 0.45mm;
                    --fs: 6.8pt;
                    --sig-h: 11mm;
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
                .invoice-paid-watermark span {
                    transform: rotate(-25deg);
                    font-size: 42pt;
                    font-weight: 900;
                    letter-spacing: 0.2em;
                    color: rgba(22, 163, 74, 0.13);
                    border: 3pt solid rgba(22, 163, 74, 0.25);
                    border-radius: 8pt;
                    padding: 0.12em 0.4em;
                    user-select: none;
                    white-space: nowrap;
                }

                .invoice-head {
                    display: flex;
                    justify-content: space-between;
                    gap: 4mm;
                    align-items: flex-start;
                    padding: 3mm 3.4mm 2.2mm;
                    background: linear-gradient(180deg, #f7fbfb 0%, #fff 100%);
                }
                .invoice-brand { display: flex; gap: 2.4mm; min-width: 0; }
                .invoice-logo { width: 14mm; height: 14mm; object-fit: contain; flex-shrink: 0; }
                .invoice-shop {
                    font-family: Outfit, 'Nunito Sans', sans-serif;
                    font-weight: 700;
                    font-size: 12pt;
                    color: var(--teal);
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                }
                .invoice-tag, .invoice-meta-line { font-size: 6.8pt; color: var(--muted); margin-top: 0.4mm; line-height: 1.3; }
                .invoice-doc { text-align: right; flex-shrink: 0; }
                .invoice-kicker {
                    font-size: 6.4pt;
                    font-weight: 800;
                    letter-spacing: 0.16em;
                    color: var(--teal);
                    text-transform: uppercase;
                }
                .invoice-title {
                    font-family: Outfit, 'Nunito Sans', sans-serif;
                    font-weight: 700;
                    font-size: 13pt;
                    letter-spacing: 0.04em;
                    line-height: 1;
                    margin-top: 0.5mm;
                }
                .invoice-number {
                    display: inline-block;
                    margin-top: 1.2mm;
                    font-family: ui-monospace, Consolas, monospace;
                    font-size: 8.5pt;
                    font-weight: 700;
                    color: var(--teal-deep);
                    background: #ecfdf8;
                    border: 1px solid #99f6e4;
                    padding: 0.5mm 1.8mm;
                }
                .invoice-date { font-size: 7pt; color: var(--muted); margin-top: 0.8mm; }
                .invoice-rule { height: 2.2pt; background: var(--teal); box-shadow: inset 0 0.7pt 0 #5eead4; }

                .invoice-facts {
                    display: grid;
                    grid-template-columns: 1.2fr 1.15fr 0.75fr 0.9fr 0.7fr;
                    background: var(--paper);
                    border-bottom: 1px solid var(--line);
                }
                .invoice-fact {
                    padding: 1.5mm 2.6mm;
                    border-right: 1px solid #d9e8e5;
                    min-width: 0;
                }
                .invoice-fact:last-child { border-right: none; }
                .invoice-fact-label {
                    display: block;
                    font-size: 6.1pt;
                    font-weight: 800;
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                    color: var(--muted);
                    margin-bottom: 0.4mm;
                }
                .invoice-fact strong {
                    display: block;
                    font-size: 7.8pt;
                    font-weight: 800;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .status-pill {
                    display: inline-flex;
                    align-items: center;
                    font-size: 6.8pt;
                    font-weight: 800;
                    letter-spacing: 0.06em;
                    padding: 0.7mm 1.6mm;
                    color: #fff;
                    white-space: nowrap;
                }
                .status-paid { background: var(--teal); }
                .status-due { background: #b45309; }

                .invoice-body { padding: 2.2mm 3.2mm 2.4mm; display: flex; flex-direction: column; gap: 2.2mm; flex: 1; }
                .invoice-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2.2mm; }
                .invoice-block {
                    border: 1px solid #d1e7e3;
                    background: var(--paper);
                    padding: 1.5mm 2mm;
                    min-width: 0;
                }
                .invoice-block.is-warn { background: #fffbeb; border-color: #f3e8c2; }
                .invoice-block-title {
                    font-size: 6.4pt;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: var(--teal-deep);
                    margin-bottom: 0.6mm;
                }
                .invoice-block p {
                    margin: 0;
                    font-size: 7.4pt;
                    color: var(--ink);
                    line-height: 1.35;
                    white-space: pre-wrap;
                }
                .invoice-chip {
                    display: inline-block;
                    margin-top: 0.8mm;
                    font-size: 6.6pt;
                    font-weight: 800;
                    color: #0369a1;
                }

                .invoice-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: var(--fs);
                }
                .invoice-table th {
                    background: var(--teal);
                    color: #fff;
                    font-size: 6.5pt;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: var(--row-pad) 1.6mm;
                    text-align: left;
                }
                .invoice-table td {
                    padding: var(--row-pad) 1.6mm;
                    border-bottom: 1px solid #e8eef2;
                    vertical-align: top;
                }
                .invoice-table tbody tr:last-child td { border-bottom: 1px solid #94a3b8; }
                .col-no { width: 7mm; text-align: center; color: var(--muted); font-variant-numeric: tabular-nums; }
                .col-qty { width: 14mm; text-align: center; font-variant-numeric: tabular-nums; }
                .col-unit { width: 16mm; text-align: center; font-variant-numeric: tabular-nums; }
                .col-num { width: 26mm; text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
                .muted-row { color: #94a3b8; font-style: italic; }
                .invoice-section-label {
                    font-size: 6.4pt;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: var(--teal-deep);
                    margin: 0 0 0.8mm;
                }

                .invoice-totals {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0.5mm;
                    margin-top: 1.4mm;
                    font-size: 7.6pt;
                    color: #475569;
                }
                .invoice-total-row {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 4mm;
                    min-width: 72mm;
                }
                .invoice-total-row span:last-child {
                    min-width: 28mm;
                    text-align: right;
                    font-variant-numeric: tabular-nums;
                }
                .invoice-total-row.is-grand {
                    margin-top: 0.4mm;
                }
                .invoice-total-row.is-grand strong {
                    background: var(--teal);
                    color: #fff;
                    padding: 1.1mm 2mm;
                    font-family: Outfit, 'Nunito Sans', sans-serif;
                    font-size: 8.5pt;
                    letter-spacing: 0.03em;
                    min-width: 28mm;
                    text-align: right;
                    font-variant-numeric: tabular-nums;
                }
                .invoice-total-row.is-due span:last-child {
                    font-weight: 800;
                    color: #b45309;
                }

                .invoice-signs {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 4mm;
                    margin-top: auto;
                    padding: 2mm 3.2mm 0;
                    text-align: center;
                }
                .invoice-sign-role { font-size: 6.8pt; font-weight: 800; color: #475569; letter-spacing: 0.04em; text-transform: uppercase; }
                .invoice-sign-space { height: var(--sig-h); }
                .invoice-sign-name {
                    border-top: 1px solid #334155;
                    margin: 0 auto;
                    width: 82%;
                    padding-top: 0.7mm;
                    font-size: 7pt;
                    font-weight: 700;
                }
                .invoice-sign-hint { font-size: 6pt; color: var(--muted); margin-top: 0.3mm; }

                .invoice-foot {
                    margin: 1.6mm 3.2mm 2mm;
                    padding-top: 1.2mm;
                    border-top: 1px solid var(--line);
                    display: flex;
                    justify-content: space-between;
                    gap: 3mm;
                    font-size: 6.4pt;
                    color: var(--muted);
                }
                .invoice-foot strong { color: var(--ink); }

                @media print {
                    .no-print { display: none !important; }
                    .invoice-print-shell { background: #fff !important; min-height: 0 !important; }
                    html, body { background: #fff !important; margin: 0 !important; }
                    html, body, .invoice-print-shell {
                        overflow: hidden !important;
                        height: auto !important;
                    }
                    .invoice-a4-sheet {
                        width: 100% !important;
                        height: 287mm;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                        overflow: hidden !important;
                        page-break-after: avoid;
                        break-after: avoid;
                    }
                    .invoice-inner, .invoice-table th, .invoice-total-row.is-grand strong, .invoice-number, .invoice-rule, .status-pill, .invoice-paid-watermark span {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .invoice-inner {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                    .invoice-paid-watermark span {
                        color: rgba(22, 163, 74, 0.28) !important;
                        border-color: rgba(22, 163, 74, 0.4) !important;
                    }
                }
                @page {
                    size: A4;
                    margin: 5mm 6mm !important;
                }
            `}</style>

            <div className="invoice-print-shell">
                <div className="invoice-toolbar no-print">
                    <PrintHidePricesToggle
                        checked={hidePrices}
                        onChange={setHidePrices}
                        label="Sembunyikan harga & jumlah"
                    />
                    <button type="button" className="btn-print" onClick={() => window.print()}>
                        <Printer size={16} /> Cetak Invoice
                    </button>
                    <button type="button" className="btn-back" onClick={handleBack}>Kembali</button>
                </div>
                <p className="invoice-hint no-print">
                    Kertas A4 (210 × 297 mm) · 1 lembar
                    {scale < 0.999 ? ` · disesuaikan otomatis (${Math.round(scale * 100)}%)` : ''}.
                    Pilih A4, skala 100%, tanpa header/footer browser.
                </p>

                <div className="invoice-a4-sheet print-page" ref={sheetRef}>
                    <InvoiceSheet
                        innerRef={innerRef}
                        density={density}
                        service={service}
                        shop={shop}
                        parts={parts}
                        workItems={workItems}
                        partsTotal={partsTotal}
                        grandTotal={grandTotal}
                        paidTotal={paidTotal}
                        changeAmount={changeAmount}
                        balanceDue={balanceDue}
                        paymentLabel={paymentLabel}
                        isPaid={isPaid}
                        hidePrices={hidePrices}
                        onLogoLoad={() => fitToSheet(sheetRef.current, innerRef.current, setScale)}
                    />
                </div>
            </div>
        </>
    );
}

function InvoiceSheet({
    innerRef,
    density,
    service,
    shop,
    parts,
    workItems,
    partsTotal,
    grandTotal,
    paidTotal,
    changeAmount,
    balanceDue,
    paymentLabel,
    isPaid,
    hidePrices,
    onLogoLoad,
}) {
    const shopName = shop?.legal_name || shop?.app_name || 'Berkah Teknik AC';
    const contacts = [shop?.phone && `Telp ${shop.phone}`, shop?.whatsapp && `WA ${shop.whatsapp}`].filter(Boolean);
    const vehicle = service.vehicle;
    const vehicleLabel = [vehicle?.brand, vehicle?.model].filter(Boolean).join(' ') || '—';
    const notes = [
        service.description && { title: 'Keluhan pelanggan', body: service.description },
        service.work_instructions && { title: 'Instruksi kerja', body: service.work_instructions, warn: true },
        service.diagnosis && { title: 'Diagnosa teknisi', body: service.diagnosis },
        service.mechanic_notes && { title: 'Catatan mekanik', body: service.mechanic_notes },
    ].filter(Boolean);

    return (
        <article className="invoice-inner invoice-page" ref={innerRef} data-density={density}>
            {isPaid && (
                <div className="invoice-paid-watermark" aria-hidden>
                    <span>LUNAS</span>
                </div>
            )}

            <header className="invoice-head">
                <div className="invoice-brand">
                    <img
                        src={shop?.logo_url || DEFAULT_LOGO}
                        alt={shopName}
                        className="invoice-logo"
                        onLoad={onLogoLoad}
                        onError={(e) => {
                            if (e.currentTarget.src.endsWith(DEFAULT_LOGO)) return;
                            e.currentTarget.src = DEFAULT_LOGO;
                        }}
                    />
                    <div>
                        <div className="invoice-shop">{shopName}</div>
                        {shop?.tagline && <div className="invoice-tag">{shop.tagline}</div>}
                        {shop?.address && <div className="invoice-meta-line">{shop.address}</div>}
                        {contacts.length > 0 && <div className="invoice-meta-line">{contacts.join(' · ')}</div>}
                    </div>
                </div>
                <div className="invoice-doc">
                    <div className="invoice-kicker">Bengkel AC Mobil</div>
                    <div className="invoice-title">INVOICE</div>
                    <div className="invoice-number">{service.spk_number}</div>
                    <div className="invoice-date">{fmtWhen(service.completed_at || service.spk_issued_at || service.created_at)}</div>
                </div>
            </header>
            <div className="invoice-rule" />

            <div className="invoice-facts">
                <div className="invoice-fact">
                    <span className="invoice-fact-label">Pelanggan</span>
                    <strong>{vehicle?.customer?.name || '—'}</strong>
                </div>
                <div className="invoice-fact">
                    <span className="invoice-fact-label">Kendaraan</span>
                    <strong>{vehicleLabel}{vehicle?.year ? ` · ${vehicle.year}` : ''}</strong>
                </div>
                <div className="invoice-fact">
                    <span className="invoice-fact-label">Plat</span>
                    <strong>{vehicle?.license_plate || '—'}</strong>
                </div>
                <div className="invoice-fact">
                    <span className="invoice-fact-label">Mekanik</span>
                    <strong>{service.technician?.name || 'Belum ditugaskan'}</strong>
                </div>
                <div className="invoice-fact">
                    <span className="invoice-fact-label">Pembayaran</span>
                    <span className={`status-pill ${isPaid ? 'status-paid' : 'status-due'}`}>
                        {isPaid ? 'Lunas' : 'Belum lunas'}
                    </span>
                </div>
            </div>

            <div className="invoice-body">
                {(notes.length > 0 || service.service_name) && (
                    <div className={notes.length > 1 ? 'invoice-grid-2' : undefined}>
                        <div className="invoice-block">
                            <div className="invoice-block-title">Jenis jasa</div>
                            <p><strong>{service.service_name || '—'}</strong></p>
                            {vehicle?.customer?.phone && (
                                <p style={{ marginTop: '0.6mm', color: '#64748b' }}>HP: {vehicle.customer.phone}</p>
                            )}
                            {(service.is_bring_own_part === 1 || service.is_bring_own_part === true) && (
                                <span className="invoice-chip">* Pelanggan membawa spare part sendiri</span>
                            )}
                        </div>
                        {notes.map((note) => (
                            <div key={note.title} className={`invoice-block${note.warn ? ' is-warn' : ''}`}>
                                <div className="invoice-block-title">{note.title}</div>
                                <p>{note.body}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div>
                    <div className="invoice-section-label">Spare part</div>
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th className="col-no">No</th>
                                <th>Spare part</th>
                                <th className="col-qty">Qty</th>
                                {!hidePrices && <th className="col-num">Harga</th>}
                                {!hidePrices && <th className="col-num">Jumlah</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {parts.length > 0 ? parts.map((p, i) => (
                                <tr key={p.id || i}>
                                    <td className="col-no">{i + 1}</td>
                                    <td style={{ fontWeight: 700 }}>{p.name}</td>
                                    <td className="col-qty">{p.pivot.quantity}{p.unit ? ` ${p.unit}` : ''}</td>
                                    {!hidePrices && <td className="col-num">{fmt(p.pivot.unit_price)}</td>}
                                    {!hidePrices && <td className="col-num" style={{ fontWeight: 700 }}>{fmt(p.pivot.quantity * p.pivot.unit_price)}</td>}
                                </tr>
                            )) : (
                                <tr><td colSpan={hidePrices ? 3 : 5} className="muted-row">Tidak ada spare part dari bengkel</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div>
                    <div className="invoice-section-label">Item pengerjaan</div>
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th className="col-no">No</th>
                                <th>Nama pengerjaan</th>
                                <th className="col-qty">Qty</th>
                                <th className="col-unit">Satuan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workItems.length > 0 ? workItems.map((item, i) => (
                                <tr key={item.id || i}>
                                    <td className="col-no">{i + 1}</td>
                                    <td style={{ fontWeight: 700 }}>{item.name}</td>
                                    <td className="col-qty">{item.quantity}</td>
                                    <td className="col-unit">{item.unit || 'JOB'}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} className="muted-row">Tidak ada item pengerjaan</td></tr>
                            )}
                        </tbody>
                    </table>

                    <div className="invoice-totals">
                        {!hidePrices && (
                            <>
                                <div className="invoice-total-row">
                                    <span>Subtotal sparepart</span>
                                    <span>{fmt(partsTotal)}</span>
                                </div>
                                <div className="invoice-total-row">
                                    <span>Biaya jasa</span>
                                    <span>{fmt(service.service_fee)}</span>
                                </div>
                            </>
                        )}
                        <div className="invoice-total-row is-grand">
                            <span>Total</span>
                            <strong>{fmt(grandTotal)}</strong>
                        </div>
                        {paidTotal > 0 && (
                            <>
                                <div className="invoice-total-row">
                                    <span>{paymentLabel}</span>
                                    <span>{fmt(paidTotal)}</span>
                                </div>
                                <div className="invoice-total-row">
                                    <span>Kembali</span>
                                    <span>{fmt(changeAmount)}</span>
                                </div>
                            </>
                        )}
                        {!isPaid && (
                            <div className="invoice-total-row is-due">
                                <span>Sisa tagihan</span>
                                <span>{fmt(balanceDue)}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="invoice-grid-2">
                    <div className="invoice-block">
                        <div className="invoice-block-title">Garansi</div>
                        <p>
                            <strong>{service.effective_warranty_months || 0} bulan</strong>
                            {service.warranty_expires_at ? ` · hingga ${fmtDate(service.warranty_expires_at)}` : ''}
                        </p>
                        {service.warranty_notes && <p style={{ marginTop: '0.5mm' }}>{service.warranty_notes}</p>}
                        {shop?.warranty_policy && (
                            <p style={{ marginTop: '0.6mm', color: '#64748b', fontSize: '6.6pt' }}>{shop.warranty_policy}</p>
                        )}
                    </div>
                    <div className="invoice-block">
                        <div className="invoice-block-title">Jadwal</div>
                        <p>Masuk: {fmtWhen(service.created_at)}</p>
                        <p>Selesai: {fmtWhen(service.completed_at)}</p>
                    </div>
                </div>
            </div>

            <div className="invoice-signs">
                <div>
                    <div className="invoice-sign-role">Admin / Kasir</div>
                    <div className="invoice-sign-space" />
                    <div className="invoice-sign-name">{shop?.owner_name || '________________'}</div>
                    <div className="invoice-sign-hint">Tanda tangan</div>
                </div>
                <div>
                    <div className="invoice-sign-role">Mekanik</div>
                    <div className="invoice-sign-space" />
                    <div className="invoice-sign-name">{service.technician?.name || '________________'}</div>
                    <div className="invoice-sign-hint">Penanggung jawab</div>
                </div>
                <div>
                    <div className="invoice-sign-role">Pelanggan</div>
                    <div className="invoice-sign-space" />
                    <div className="invoice-sign-name">{vehicle?.customer?.name || '________________'}</div>
                    <div className="invoice-sign-hint">Penerima invoice</div>
                </div>
            </div>

            <footer className="invoice-foot">
                <div>
                    <strong>{shop?.receipt_footer || 'Terima kasih atas kepercayaan Anda.'}</strong>
                    {' '}Simpan lembar ini sebagai bukti transaksi.
                </div>
                <div>Dicetak {new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</div>
            </footer>
        </article>
    );
}
