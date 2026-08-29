import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';

const MIN_SCALE = 0.62;

function fitToCopy(copy, inner, setScale) {
    if (!copy || !inner) return;
    inner.style.zoom = '1';
    const styles = getComputedStyle(copy);
    const padY = (parseFloat(styles.paddingTop) || 0) + (parseFloat(styles.paddingBottom) || 0);
    const avail = copy.clientHeight - padY;
    const needed = inner.scrollHeight;
    const next = needed <= avail + 1 ? 1 : Math.max(MIN_SCALE, avail / needed);
    inner.style.zoom = String(next);
    setScale(next);
}

const months = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

function terbilang(value) {
    const angka = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
    const toWords = (x) => {
        const n = Math.floor(Math.abs(Number(x) || 0));
        if (n < 12) return angka[n];
        if (n < 20) return `${toWords(n - 10)} belas`;
        if (n < 100) return `${toWords(Math.floor(n / 10))} puluh${n % 10 ? ` ${toWords(n % 10)}` : ''}`;
        if (n < 200) return `seratus${n % 100 ? ` ${toWords(n % 100)}` : ''}`;
        if (n < 1000) return `${toWords(Math.floor(n / 100))} ratus${n % 100 ? ` ${toWords(n % 100)}` : ''}`;
        if (n < 2000) return `seribu${n % 1000 ? ` ${toWords(n % 1000)}` : ''}`;
        if (n < 1_000_000) return `${toWords(Math.floor(n / 1000))} ribu${n % 1000 ? ` ${toWords(n % 1000)}` : ''}`;
        if (n < 1_000_000_000) return `${toWords(Math.floor(n / 1_000_000))} juta${n % 1_000_000 ? ` ${toWords(n % 1_000_000)}` : ''}`;
        if (n < 1_000_000_000_000) return `${toWords(Math.floor(n / 1_000_000_000))} miliar${n % 1_000_000_000 ? ` ${toWords(n % 1_000_000_000)}` : ''}`;
        return `${toWords(Math.floor(n / 1_000_000_000_000))} triliun${n % 1_000_000_000_000 ? ` ${toWords(n % 1_000_000_000_000)}` : ''}`;
    };
    const words = toWords(value);
    if (!words) return 'Nol rupiah';
    return `${words.charAt(0).toUpperCase()}${words.slice(1)} rupiah`;
}

function MoneyCell({ amount, bold = false, empty = false }) {
    if (empty) return <td className="num muted">—</td>;
    return <td className={`num${bold ? ' bold' : ''}`}>{fmt(amount)}</td>;
}

function SlipCopy({ copyRef, innerRef, salary, shop, employee, periodLabel, printedAt, onLogoLoad }) {
    const pendapatan = Number(salary.pendapatan || 0);
    const tunjangan = Number(salary.tunjangan_transport || 0);
    const intensifJasa = Number(salary.intensif_jasa || 0);
    const intensifSparepart = Number(salary.intensif_sparepart || 0);
    const potongan = Number(salary.potongan || 0);
    const totalPendapatan = pendapatan + tunjangan + intensifJasa + intensifSparepart;
    const net = Number(salary.net_salary || 0);
    const shopName = shop?.legal_name || shop?.app_name || 'Berkah Teknik AC';
    const contacts = [shop?.phone && `Telp ${shop.phone}`, shop?.whatsapp && `WA ${shop.whatsapp}`].filter(Boolean);
    const paidAt = salary.paid_at
        ? new Date(salary.paid_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;
    const jabatan = employee?.position?.name
        || ({ mechanic: 'Mekanik', cashier: 'Kasir', admin: 'Admin', purchasing: 'Purchasing' }[employee?.role] || employee?.role || '—');

    return (
        <article className="slip-copy" ref={copyRef}>
            <div className="slip-inner" ref={innerRef}>
                <div className="slip-main">
                <header className="slip-head">
                    <div className="slip-brand">
                        {shop?.logo_url && (
                            <img src={shop.logo_url} alt="" className="slip-logo" onLoad={onLogoLoad} />
                        )}
                        <div className="slip-brand-text">
                            <div className="shop-name">{shopName}</div>
                            {shop?.address && <div className="shop-meta">{shop.address}</div>}
                            {contacts.length > 0 && <div className="shop-meta">{contacts.join(' · ')}</div>}
                        </div>
                    </div>
                    <div className="slip-doc">
                        <div className="doc-title">SLIP GAJI</div>
                        <div className="doc-period">{periodLabel}</div>
                    </div>
                </header>

                <table className="meta-table">
                    <tbody>
                        <tr>
                            <th>Nama</th>
                            <td className="bold">{employee?.name || '—'}</td>
                            <th>Jabatan</th>
                            <td>{jabatan}</td>
                        </tr>
                        <tr>
                            <th>No. HP</th>
                            <td>{employee?.phone || '—'}</td>
                            <th>Status</th>
                            <td className="bold">
                                {salary.status === 'paid' ? 'DIBAYAR' : 'DRAFT'}
                                {paidAt ? ` · ${paidAt}` : ''}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table className="pay-table">
                    <thead>
                        <tr>
                            <th colSpan={2}>Pendapatan</th>
                            <th colSpan={2}>Potongan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Pendapatan pokok</td>
                            <MoneyCell amount={pendapatan} />
                            <td>Potongan</td>
                            <MoneyCell amount={potongan} />
                        </tr>
                        <tr>
                            <td>Tunjangan transport</td>
                            <MoneyCell amount={tunjangan} />
                            <td className="muted" />
                            <MoneyCell empty />
                        </tr>
                        <tr>
                            <td>Intensif jasa</td>
                            <MoneyCell amount={intensifJasa} />
                            <td className="muted" />
                            <MoneyCell empty />
                        </tr>
                        <tr>
                            <td>Intensif sparepart</td>
                            <MoneyCell amount={intensifSparepart} />
                            <td className="muted" />
                            <MoneyCell empty />
                        </tr>
                        <tr className="total-row">
                            <td>Total pendapatan</td>
                            <MoneyCell amount={totalPendapatan} bold />
                            <td>Total potongan</td>
                            <MoneyCell amount={potongan} bold />
                        </tr>
                    </tbody>
                </table>

                <div className="net-bar">
                    <span>Gaji bersih</span>
                    <strong>{fmt(net)}</strong>
                </div>
                <div className="terbilang">
                    Terbilang: <em>{terbilang(net)}</em>
                </div>

                {salary.notes && (
                    <div className="notes">
                        <span>Catatan:</span> {salary.notes}
                    </div>
                )}
            </div>

            <div className="slip-signoff">
                <div className="signs">
                    <div className="sign">
                        <div className="sign-role">Karyawan</div>
                        <div className="sign-space" />
                        <div className="sign-name">{employee?.name || '________________'}</div>
                    </div>
                    <div className="sign">
                        <div className="sign-role">Pimpinan</div>
                        <div className="sign-space" />
                        <div className="sign-name">{shop?.owner_name || '________________'}</div>
                    </div>
                </div>

                <footer className="slip-foot">
                    Dicetak {printedAt}
                </footer>
            </div>
            </div>
        </article>
    );
}

export default function SalarySlipPrint({ salary, shop }) {
    const employee = salary.employee;
    const periodLabel = `${months[salary.period_month] || salary.period_month} ${salary.period_year}`;
    const printedAt = new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
    const copyRef = useRef(null);
    const innerRef = useRef(null);
    const [scale, setScale] = useState(1);

    const refit = () => fitToCopy(copyRef.current, innerRef.current, setScale);

    useLayoutEffect(() => {
        let cancelled = false;
        const run = () => {
            if (!cancelled) refit();
        };
        run();
        document.fonts?.ready?.then(run);
        return () => { cancelled = true; };
    }, [salary]);

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

    return (
        <>
            <Head title={`Slip Gaji ${employee?.name || ''} - ${periodLabel}`} />
            <style>{`
                .slip-print-shell {
                    min-height: 100vh;
                    background: #e8eef3;
                    font-family: 'Nunito Sans', Inter, system-ui, sans-serif;
                    color: #0f172a;
                    color-scheme: light;
                }
                .slip-toolbar {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    gap: 0.65rem 0.85rem;
                    padding: 0.85rem 1rem 0.35rem;
                }
                .slip-toolbar button {
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
                .slip-hint {
                    width: 100%;
                    text-align: center;
                    font-size: 0.72rem;
                    color: #475569;
                    padding: 0 1rem 0.75rem;
                    line-height: 1.35;
                }
                .slip-sheet {
                    width: 210mm;
                    height: 297mm;
                    margin: 0 auto 1.25rem;
                    background: #fff;
                    box-sizing: border-box;
                    padding: 6mm;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 1px 3px rgba(15,23,42,.06), 0 14px 36px rgba(15,23,42,.08);
                }
                .slip-copy {
                    box-sizing: border-box;
                    flex: 0 0 calc(50% - 4mm);
                    height: calc(50% - 4mm);
                    min-height: 0;
                    overflow: hidden;
                    font-size: 9.5pt;
                    line-height: 1.35;
                    border: 1px solid #cbd5e1;
                    padding: 5mm;
                }
                .slip-inner {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 2.5mm;
                    min-height: 100%;
                    box-sizing: border-box;
                    transform-origin: top left;
                }
                .slip-main {
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 auto;
                }
                .slip-signoff {
                    display: flex;
                    flex-direction: column;
                    flex: 0 0 auto;
                    min-height: 0;
                }
                .slip-cut {
                    flex: 0 0 8mm;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.45rem;
                    color: #94a3b8;
                    font-size: 7pt;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }
                .slip-cut::before,
                .slip-cut::after {
                    content: '';
                    flex: 1;
                    border-top: 1px dashed #cbd5e1;
                }
                .slip-blank {
                    flex: 1 1 0;
                    min-height: 0;
                }
                .slip-blank-hint {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-size: 0.78rem;
                    color: #94a3b8;
                    border: 1px dashed #cbd5e1;
                    line-height: 1.4;
                    padding: 1rem;
                }
                .slip-head {
                    display: flex;
                    justify-content: space-between;
                    gap: 4mm;
                    align-items: flex-start;
                    border-bottom: 1.6pt solid #0f766e;
                    padding-bottom: 2.4mm;
                    margin-bottom: 2.6mm;
                }
                .slip-brand { display: flex; gap: 2.8mm; min-width: 0; }
                .slip-logo { width: 12mm; height: 12mm; object-fit: contain; flex-shrink: 0; }
                .shop-name { font-weight: 800; font-size: 12pt; color: #0f766e; line-height: 1.2; letter-spacing: -0.01em; }
                .shop-meta { font-size: 8pt; color: #64748b; line-height: 1.4; margin-top: 0.6mm; }
                .slip-doc { text-align: right; flex-shrink: 0; }
                .doc-title { font-weight: 800; font-size: 13pt; letter-spacing: 0.08em; color: #0f766e; }
                .doc-period { font-size: 9.5pt; font-weight: 700; color: #0f172a; margin-top: 0.8mm; }
                .meta-table, .pay-table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }
                .meta-table { margin-bottom: 2.6mm; font-size: 9pt; }
                .meta-table th {
                    width: 16%;
                    text-align: left;
                    font-weight: 700;
                    color: #64748b;
                    padding: 1.3mm 1.6mm 1.3mm 0;
                    border-bottom: 1px solid #e2e8f0;
                    white-space: nowrap;
                }
                .meta-table td {
                    width: 34%;
                    padding: 1.3mm 1.8mm 1.3mm 0;
                    border-bottom: 1px solid #e2e8f0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .pay-table { font-size: 9pt; border: 1px solid #94a3b8; }
                .pay-table th {
                    background: #0f766e;
                    color: #fff;
                    font-size: 8pt;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 1.5mm 2.4mm;
                    text-align: left;
                    border-right: 1px solid #0d9488;
                }
                .pay-table th:nth-child(2) { background: #b45309; border-right: none; }
                .pay-table td {
                    padding: 1.4mm 2.4mm;
                    border-top: 1px solid #e2e8f0;
                    border-right: 1px solid #e2e8f0;
                    vertical-align: middle;
                }
                .pay-table td:nth-child(2),
                .pay-table td:nth-child(4) { border-right: 1px solid #cbd5e1; }
                .pay-table td:nth-child(4) { border-right: none; }
                .pay-table td:nth-child(1),
                .pay-table td:nth-child(3) { width: 28%; }
                .pay-table td.num {
                    width: 22%;
                    text-align: right;
                    font-variant-numeric: tabular-nums;
                    white-space: nowrap;
                }
                .pay-table .total-row td {
                    font-weight: 800;
                    background: #f1f5f9;
                    border-top: 1px solid #94a3b8;
                }
                .bold { font-weight: 800; }
                .muted { color: #94a3b8; }
                .net-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 2.6mm;
                    background: #0f766e;
                    color: #fff;
                    padding: 2mm 3mm;
                    font-size: 9pt;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .net-bar strong { font-size: 13pt; letter-spacing: 0; }
                .terbilang {
                    font-size: 8.5pt;
                    color: #334155;
                    padding: 1.8mm 0 0;
                    line-height: 1.4;
                }
                .terbilang em { font-style: italic; font-weight: 700; }
                .notes {
                    margin-top: 2mm;
                    font-size: 8.5pt;
                    color: #475569;
                    border: 1px dashed #cbd5e1;
                    padding: 1.5mm 2.2mm;
                    white-space: pre-wrap;
                    overflow-wrap: break-word;
                    word-break: break-word;
                    line-height: 1.4;
                }
                .notes span { font-weight: 800; color: #0f172a; }
                .signs {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10mm;
                    margin-top: 0;
                    padding-top: 0;
                    text-align: center;
                }
                .sign {
                    display: flex;
                    flex-direction: column;
                }
                .sign-role { font-size: 8.5pt; font-weight: 700; color: #475569; }
                .sign-space { flex: none; height: 14mm; min-height: 14mm; }
                .sign-name {
                    border-top: 1px solid #334155;
                    margin: 0 auto;
                    width: 78%;
                    padding-top: 1.2mm;
                    font-size: 8.5pt;
                    font-weight: 700;
                }
                .slip-foot {
                    margin-top: 1.8mm;
                    padding-top: 1.2mm;
                    border-top: 1px dotted #cbd5e1;
                    font-size: 7.5pt;
                    color: #94a3b8;
                    text-align: right;
                }
                @media print {
                    .no-print { display: none !important; }
                    .slip-print-shell { background: #fff !important; min-height: 0 !important; }
                    html, body { background: #fff !important; margin: 0 !important; }
                    .slip-sheet {
                        width: 100% !important;
                        height: 285mm;
                        max-width: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                    }
                    .slip-copy {
                        border: 1px solid #64748b;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                    .slip-blank, .slip-blank-hint {
                        border: none !important;
                        color: transparent !important;
                    }
                    .slip-cut {
                        color: transparent !important;
                    }
                    .pay-table th, .net-bar {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
                @page {
                    size: A4;
                    margin: 6mm !important;
                }
            `}</style>

            <div className="slip-print-shell">
                <div className="slip-toolbar no-print">
                    <button type="button" className="btn-print" onClick={() => window.print()}>
                        <Printer size={16} /> Cetak Slip Gaji
                    </button>
                    <button type="button" className="btn-back" onClick={handleBack}>
                        <ArrowLeft size={16} /> Kembali
                    </button>
                </div>
                <p className="slip-hint no-print">
                    Kertas A4 (210 × 297 mm) · 1 slip di setengah atas, setengah bawah kosong
                    {scale < 0.999 ? ` · disesuaikan otomatis (${Math.round(scale * 100)}%)` : ''}.
                    Pilih A4, skala 100%, tanpa header/footer. Untuk slip berikutnya: balik kertas 180° lalu cetak lagi.
                </p>

                <div className="slip-sheet print-page">
                    <SlipCopy
                        copyRef={copyRef}
                        innerRef={innerRef}
                        salary={salary}
                        shop={shop}
                        employee={employee}
                        periodLabel={periodLabel}
                        printedAt={printedAt}
                        onLogoLoad={refit}
                    />
                    <div className="slip-cut">Potong di sini</div>
                    <div className="slip-blank">
                        <div className="slip-blank-hint no-print">
                            Kosong — untuk slip gaji berikutnya.<br />
                            Balik kertas 180° lalu cetak slip lain di area ini.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
