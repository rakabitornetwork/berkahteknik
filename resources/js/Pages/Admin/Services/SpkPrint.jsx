import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Printer } from 'lucide-react';

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;
const fmtWhen = (d) => (d
    ? new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—');
const statusLabel = { antri: 'Antri', dikerjakan: 'Dikerjakan', selesai: 'Selesai' };
const DEFAULT_LOGO = '/images/brand/logo.svg';
const MIN_SCALE = 0.62;

function pickDensity(service) {
    const parts = service.spare_parts?.length || 0;
    const text = [
        service.description,
        service.work_instructions,
        service.diagnosis,
        service.mechanic_notes,
        service.warranty_notes,
        service.warranty_terms,
    ].filter(Boolean).join(' ').length;
    const score = parts + Math.ceil(text / 160);
    if (score >= 16 || parts >= 10) return 'tight';
    if (score >= 8 || parts >= 6) return 'compact';
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

export default function SpkPrint({ service, shop }) {
    const parts = service.spare_parts ?? [];
    const partsTotal = parts.reduce((sum, p) => sum + (p.pivot.quantity * p.pivot.unit_price), 0);
    const grandTotal = partsTotal + Number(service.service_fee || 0);
    const density = useMemo(() => pickDensity(service), [service]);

    const sheetRef = useRef(null);
    const innerRef = useRef(null);
    const [scale, setScale] = useState(1);

    useLayoutEffect(() => {
        let cancelled = false;
        const run = () => {
            if (!cancelled) fitToSheet(sheetRef.current, innerRef.current, setScale);
        };
        run();
        document.fonts?.ready?.then(run);
        return () => { cancelled = true; };
    }, [service, density]);

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
            <Head title={`SPK ${service.spk_number}`} />
            <style>{`
                .spk-print-shell {
                    min-height: 100vh;
                    background: #e8eef3;
                    font-family: 'Nunito Sans', Inter, system-ui, sans-serif;
                    color: #0f172a;
                    color-scheme: light;
                }
                .spk-toolbar {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    gap: 0.65rem 0.85rem;
                    padding: 0.85rem 1rem 0.35rem;
                }
                .spk-toolbar button {
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
                .spk-hint {
                    width: 100%;
                    text-align: center;
                    font-size: 0.72rem;
                    color: #475569;
                    padding: 0 1rem 0.75rem;
                    line-height: 1.35;
                }
                .spk-f4-sheet {
                    width: 210mm;
                    height: 330mm;
                    margin: 0 auto 1.25rem;
                    background: #fff;
                    box-sizing: border-box;
                    padding: 5mm 6mm;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(15,23,42,.06), 0 14px 36px rgba(15,23,42,.08);
                }
                .spk-inner {
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
                }
                .spk-inner[data-density="compact"] {
                    --row-pad: 0.7mm;
                    --fs: 7.4pt;
                    --sig-h: 14mm;
                }
                .spk-inner[data-density="tight"] {
                    --row-pad: 0.45mm;
                    --fs: 6.8pt;
                    --sig-h: 11mm;
                }

                .spk-head {
                    display: flex;
                    justify-content: space-between;
                    gap: 4mm;
                    align-items: flex-start;
                    padding: 3mm 3.4mm 2.2mm;
                    background: linear-gradient(180deg, #f7fbfb 0%, #fff 100%);
                }
                .spk-brand { display: flex; gap: 2.4mm; min-width: 0; }
                .spk-logo { width: 14mm; height: 14mm; object-fit: contain; flex-shrink: 0; }
                .spk-shop {
                    font-family: Outfit, 'Nunito Sans', sans-serif;
                    font-weight: 700;
                    font-size: 12pt;
                    color: var(--teal);
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                }
                .spk-tag, .spk-meta-line { font-size: 6.8pt; color: var(--muted); margin-top: 0.4mm; line-height: 1.3; }
                .spk-doc { text-align: right; flex-shrink: 0; }
                .spk-kicker {
                    font-size: 6.4pt;
                    font-weight: 800;
                    letter-spacing: 0.16em;
                    color: var(--teal);
                    text-transform: uppercase;
                }
                .spk-title {
                    font-family: Outfit, 'Nunito Sans', sans-serif;
                    font-weight: 700;
                    font-size: 13pt;
                    letter-spacing: 0.04em;
                    line-height: 1;
                    margin-top: 0.5mm;
                }
                .spk-number {
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
                .spk-date { font-size: 7pt; color: var(--muted); margin-top: 0.8mm; }
                .spk-rule { height: 2.2pt; background: var(--teal); box-shadow: inset 0 0.7pt 0 #5eead4; }

                .spk-facts {
                    display: grid;
                    grid-template-columns: 1.2fr 1.15fr 0.75fr 0.9fr 0.7fr;
                    background: var(--paper);
                    border-bottom: 1px solid var(--line);
                }
                .spk-fact {
                    padding: 1.5mm 2.6mm;
                    border-right: 1px solid #d9e8e5;
                    min-width: 0;
                }
                .spk-fact:last-child { border-right: none; }
                .spk-fact-label {
                    display: block;
                    font-size: 6.1pt;
                    font-weight: 800;
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                    color: var(--muted);
                    margin-bottom: 0.4mm;
                }
                .spk-fact strong {
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
                    background: var(--teal);
                    color: #fff;
                    white-space: nowrap;
                }

                .spk-body { padding: 2.2mm 3.2mm 2.4mm; display: flex; flex-direction: column; gap: 2.2mm; flex: 1; }
                .spk-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2.2mm; }
                .spk-block {
                    border: 1px solid #d1e7e3;
                    background: var(--paper);
                    padding: 1.5mm 2mm;
                    min-width: 0;
                }
                .spk-block.is-warn { background: #fffbeb; border-color: #f3e8c2; }
                .spk-block-title {
                    font-size: 6.4pt;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: var(--teal-deep);
                    margin-bottom: 0.6mm;
                }
                .spk-block p {
                    margin: 0;
                    font-size: 7.4pt;
                    color: var(--ink);
                    line-height: 1.35;
                    white-space: pre-wrap;
                }
                .spk-chip {
                    display: inline-block;
                    margin-top: 0.8mm;
                    font-size: 6.6pt;
                    font-weight: 800;
                    color: #0369a1;
                }

                .spk-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: var(--fs);
                }
                .spk-table th {
                    background: var(--teal);
                    color: #fff;
                    font-size: 6.5pt;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: var(--row-pad) 1.6mm;
                    text-align: left;
                }
                .spk-table td {
                    padding: var(--row-pad) 1.6mm;
                    border-bottom: 1px solid #e8eef2;
                    vertical-align: top;
                }
                .spk-table tbody tr:last-child td { border-bottom: 1px solid #94a3b8; }
                .col-no { width: 7mm; text-align: center; color: var(--muted); font-variant-numeric: tabular-nums; }
                .col-qty { width: 14mm; text-align: center; font-variant-numeric: tabular-nums; }
                .col-num { width: 26mm; text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
                .muted-row { color: #94a3b8; font-style: italic; }

                .spk-total {
                    display: flex;
                    justify-content: flex-end;
                    gap: 4mm;
                    align-items: center;
                    font-size: 7.6pt;
                    color: #475569;
                }
                .spk-total strong {
                    background: var(--teal);
                    color: #fff;
                    padding: 1.1mm 2mm;
                    font-family: Outfit, 'Nunito Sans', sans-serif;
                    font-size: 8.5pt;
                    letter-spacing: 0.03em;
                }

                .spk-signs {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 4mm;
                    margin-top: auto;
                    padding: 2mm 3.2mm 0;
                    text-align: center;
                }
                .spk-sign-role { font-size: 6.8pt; font-weight: 800; color: #475569; letter-spacing: 0.04em; text-transform: uppercase; }
                .spk-sign-space { height: var(--sig-h); }
                .spk-sign-name {
                    border-top: 1px solid #334155;
                    margin: 0 auto;
                    width: 82%;
                    padding-top: 0.7mm;
                    font-size: 7pt;
                    font-weight: 700;
                }
                .spk-sign-hint { font-size: 6pt; color: var(--muted); margin-top: 0.3mm; }

                .spk-foot {
                    margin: 1.6mm 3.2mm 2mm;
                    padding-top: 1.2mm;
                    border-top: 1px solid var(--line);
                    display: flex;
                    justify-content: space-between;
                    gap: 3mm;
                    font-size: 6.4pt;
                    color: var(--muted);
                }
                .spk-foot strong { color: var(--ink); }

                @media print {
                    .no-print { display: none !important; }
                    .spk-print-shell { background: #fff !important; min-height: 0 !important; }
                    html, body { background: #fff !important; margin: 0 !important; }
                    html, body, .spk-print-shell {
                        overflow: hidden !important;
                        height: auto !important;
                    }
                    .spk-f4-sheet {
                        width: 100% !important;
                        height: 320mm;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                        overflow: hidden !important;
                        page-break-after: avoid;
                        break-after: avoid;
                    }
                    .spk-inner, .spk-table th, .spk-total strong, .spk-number, .spk-rule, .status-pill {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .spk-inner {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                }
                @page {
                    size: 210mm 330mm;
                    margin: 5mm 6mm !important;
                }
            `}</style>

            <div className="spk-print-shell">
                <div className="spk-toolbar no-print">
                    <button type="button" className="btn-print" onClick={() => window.print()}>
                        <Printer size={16} /> Cetak SPK
                    </button>
                    <button type="button" className="btn-back" onClick={handleBack}>Kembali</button>
                </div>
                <p className="spk-hint no-print">
                    Kertas F4 (210 × 330 mm) · 1 lembar
                    {scale < 0.999 ? ` · disesuaikan otomatis (${Math.round(scale * 100)}%)` : ''}.
                    Pilih F4/Folio, skala 100%, tanpa header/footer browser.
                </p>

                <div className="spk-f4-sheet print-page" ref={sheetRef}>
                    <SpkSheet
                        innerRef={innerRef}
                        density={density}
                        service={service}
                        shop={shop}
                        parts={parts}
                        grandTotal={grandTotal}
                        onLogoLoad={() => fitToSheet(sheetRef.current, innerRef.current, setScale)}
                    />
                </div>
            </div>
        </>
    );
}

function SpkSheet({ innerRef, density, service, shop, parts, grandTotal, onLogoLoad }) {
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
        <article className="spk-inner spk-page" ref={innerRef} data-density={density}>
            <header className="spk-head">
                <div className="spk-brand">
                    <img
                        src={shop?.logo_url || DEFAULT_LOGO}
                        alt={shopName}
                        className="spk-logo"
                        onLoad={onLogoLoad}
                        onError={(e) => {
                            if (e.currentTarget.src.endsWith(DEFAULT_LOGO)) return;
                            e.currentTarget.src = DEFAULT_LOGO;
                        }}
                    />
                    <div>
                        <div className="spk-shop">{shopName}</div>
                        {shop?.tagline && <div className="spk-tag">{shop.tagline}</div>}
                        {shop?.address && <div className="spk-meta-line">{shop.address}</div>}
                        {contacts.length > 0 && <div className="spk-meta-line">{contacts.join(' · ')}</div>}
                    </div>
                </div>
                <div className="spk-doc">
                    <div className="spk-kicker">Bengkel AC Mobil</div>
                    <div className="spk-title">SPK</div>
                    <div className="spk-number">{service.spk_number}</div>
                    <div className="spk-date">{fmtWhen(service.spk_issued_at || service.created_at)}</div>
                </div>
            </header>
            <div className="spk-rule" />

            <div className="spk-facts">
                <div className="spk-fact">
                    <span className="spk-fact-label">Pelanggan</span>
                    <strong>{vehicle?.customer?.name || '—'}</strong>
                </div>
                <div className="spk-fact">
                    <span className="spk-fact-label">Kendaraan</span>
                    <strong>{vehicleLabel}{vehicle?.year ? ` · ${vehicle.year}` : ''}</strong>
                </div>
                <div className="spk-fact">
                    <span className="spk-fact-label">Plat</span>
                    <strong>{vehicle?.license_plate || '—'}</strong>
                </div>
                <div className="spk-fact">
                    <span className="spk-fact-label">Mekanik</span>
                    <strong>{service.technician?.name || 'Belum ditugaskan'}</strong>
                </div>
                <div className="spk-fact">
                    <span className="spk-fact-label">Status</span>
                    <span className="status-pill">{statusLabel[service.status] || service.status}</span>
                </div>
            </div>

            <div className="spk-body">
                {(notes.length > 0 || service.service_name) && (
                    <div className={notes.length > 1 ? 'spk-grid-2' : undefined}>
                        <div className="spk-block">
                            <div className="spk-block-title">Jenis jasa</div>
                            <p><strong>{service.service_name || '—'}</strong></p>
                            {vehicle?.customer?.phone && (
                                <p style={{ marginTop: '0.6mm', color: '#64748b' }}>HP: {vehicle.customer.phone}</p>
                            )}
                            {(service.is_bring_own_part === 1 || service.is_bring_own_part === true) && (
                                <span className="spk-chip">* Pelanggan membawa spare part sendiri</span>
                            )}
                        </div>
                        {notes.map((note) => (
                            <div key={note.title} className={`spk-block${note.warn ? ' is-warn' : ''}`}>
                                <div className="spk-block-title">{note.title}</div>
                                <p>{note.body}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div>
                    <table className="spk-table">
                        <thead>
                            <tr>
                                <th className="col-no">No</th>
                                <th>Spare part</th>
                                <th className="col-qty">Qty</th>
                                <th className="col-num">Harga</th>
                                <th className="col-num">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parts.length > 0 ? parts.map((p, i) => (
                                <tr key={p.id || i}>
                                    <td className="col-no">{i + 1}</td>
                                    <td style={{ fontWeight: 700 }}>{p.name}</td>
                                    <td className="col-qty">{p.pivot.quantity}{p.unit ? ` ${p.unit}` : ''}</td>
                                    <td className="col-num">{fmt(p.pivot.unit_price)}</td>
                                    <td className="col-num" style={{ fontWeight: 700 }}>{fmt(p.pivot.quantity * p.pivot.unit_price)}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} className="muted-row">Tidak ada spare part dari bengkel</td></tr>
                            )}
                        </tbody>
                    </table>
                    <div className="spk-total" style={{ marginTop: '1.4mm' }}>
                        <span>Biaya jasa {fmt(service.service_fee)}</span>
                        <strong>Estimasi {fmt(grandTotal)}</strong>
                    </div>
                </div>

                <div className="spk-grid-2">
                    <div className="spk-block">
                        <div className="spk-block-title">Garansi</div>
                        <p>
                            <strong>{service.effective_warranty_months || 0} bulan</strong>
                            {service.warranty_expires_at ? ` · hingga ${new Date(service.warranty_expires_at).toLocaleDateString('id-ID')}` : ''}
                        </p>
                        {service.warranty_notes && <p style={{ marginTop: '0.5mm' }}>{service.warranty_notes}</p>}
                    </div>
                    <div className="spk-block">
                        <div className="spk-block-title">Jadwal</div>
                        <p>Mulai: {fmtWhen(service.started_at)}</p>
                        <p>Selesai: {fmtWhen(service.completed_at)}</p>
                    </div>
                </div>
            </div>

            <div className="spk-signs">
                <div>
                    <div className="spk-sign-role">Admin / Kasir</div>
                    <div className="spk-sign-space" />
                    <div className="spk-sign-name">{shop?.owner_name || '________________'}</div>
                    <div className="spk-sign-hint">Tanda tangan</div>
                </div>
                <div>
                    <div className="spk-sign-role">Mekanik</div>
                    <div className="spk-sign-space" />
                    <div className="spk-sign-name">{service.technician?.name || '________________'}</div>
                    <div className="spk-sign-hint">Penanggung jawab</div>
                </div>
                <div>
                    <div className="spk-sign-role">Pelanggan</div>
                    <div className="spk-sign-space" />
                    <div className="spk-sign-name">{vehicle?.customer?.name || '________________'}</div>
                    <div className="spk-sign-hint">Opsional</div>
                </div>
            </div>

            <footer className="spk-foot">
                <div>
                    <strong>Simpan lembar ini sebagai bukti penugasan.</strong>
                    {' '}Cantumkan nomor SPK saat menangani komplain.
                </div>
                <div>Dicetak {new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</div>
            </footer>
        </article>
    );
}
