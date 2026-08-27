import{c as e,d as t,n,o as r,t as i}from"./app-npef35X1.js";import{t as a}from"./printer-DGgnYzTd.js";import{n as o,r as s,t as c}from"./printPriceVisibility-Xd3vNyOa.js";import{a as l,i as u,n as d,r as f,t as p}from"./ThermalPrintButton-B9nogDtp.js";var m=t(e(),1),h=i(),g=e=>`Rp ${Number(e||0).toLocaleString(`id-ID`)}`;function _({sale:e,shop:t}){let[i,l]=(0,m.useState)(()=>c());(0,m.useEffect)(()=>{o(i)},[i]),(0,m.useEffect)(()=>{if(new URLSearchParams(window.location.search).get(`print`)===`1`){let e=setTimeout(()=>window.print(),400);return()=>clearTimeout(e)}},[]);let u={cash:`Tunai`,transfer:`Transfer Bank`,qris:`QRIS`}[e.payment_method]||e.payment_method,d=e.items??[];return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(n,{title:`Nota ${e.receipt_number}`}),(0,h.jsx)(`style`,{children:`
                .receipt-print-shell {
                    min-height: 100vh;
                    background: #e8eef3;
                    font-family: 'Nunito Sans', Inter, system-ui, sans-serif;
                    color: #0f172a;
                    color-scheme: light;
                }
                .receipt-print-toolbar {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    gap: 0.65rem 0.85rem;
                    padding: 0.85rem 1rem 0.35rem;
                }
                .receipt-print-toolbar button {
                    font-size: 0.8rem;
                    padding: 0.42rem 1rem;
                    border-radius: 8px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-weight: 600;
                }
                .receipt-print-toolbar .btn-print { border: none; background: #0f766e; color: #fff; }
                .receipt-print-toolbar .btn-back { background: #fff; border: 1px solid #cbd5e1; color: #334155; }
                .receipt-print-toolbar .btn-thermal { background: #134e4a; border: none; color: #fff; }
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
                .receipt-hint {
                    width: 100%;
                    text-align: center;
                    font-size: 0.72rem;
                    color: #475569;
                    padding: 0 1rem 0.75rem;
                    line-height: 1.35;
                }
                .receipt-f4-sheet {
                    width: 210mm;
                    height: 330mm;
                    margin: 0 auto 1.25rem;
                    background: #fff;
                    box-sizing: border-box;
                    padding: 5mm 6mm;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 1px 3px rgba(15,23,42,.06), 0 14px 36px rgba(15,23,42,.08);
                }
                .receipt-copy {
                    --ink: #0f172a;
                    --muted: #64748b;
                    --line: #cbd5e1;
                    --teal: #0f766e;
                    --teal-deep: #115e59;
                    --paper: #f4faf9;
                    flex: 0 0 calc(50% - 4mm);
                    height: calc(50% - 4mm);
                    min-height: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    font-size: 8pt;
                    line-height: 1.28;
                    color: var(--ink);
                    background: #fff;
                    border: 1px solid #94a3b8;
                    padding: 0;
                }
                .receipt-cut {
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
                .receipt-cut::before,
                .receipt-cut::after {
                    content: '';
                    flex: 1;
                    border-top: 1px dashed #cbd5e1;
                }
                .receipt-blank { flex: 1 1 0; min-height: 0; }
                .receipt-blank-hint {
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

                .nota-head {
                    display: flex;
                    justify-content: space-between;
                    gap: 4mm;
                    align-items: flex-start;
                    padding: 3mm 3.4mm 2.2mm;
                    background: linear-gradient(180deg, #f7fbfb 0%, #fff 100%);
                }
                .nota-brand { display: flex; gap: 2.4mm; min-width: 0; }
                .nota-logo { width: 11mm; height: 11mm; object-fit: contain; flex-shrink: 0; }
                .nota-shop {
                    font-family: Outfit, 'Nunito Sans', sans-serif;
                    font-weight: 700;
                    font-size: 11.5pt;
                    color: var(--teal);
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                }
                .nota-tag { font-size: 7pt; color: var(--muted); margin-top: 0.4mm; }
                .nota-meta-line { font-size: 6.8pt; color: var(--muted); line-height: 1.3; margin-top: 0.5mm; }
                .nota-doc { text-align: right; flex-shrink: 0; }
                .nota-kicker {
                    font-size: 6.4pt;
                    font-weight: 800;
                    letter-spacing: 0.16em;
                    color: var(--teal);
                    text-transform: uppercase;
                }
                .nota-title {
                    font-family: Outfit, 'Nunito Sans', sans-serif;
                    font-weight: 700;
                    font-size: 13pt;
                    letter-spacing: 0.04em;
                    color: var(--ink);
                    line-height: 1;
                    margin-top: 0.6mm;
                }
                .nota-number {
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
                .nota-date { font-size: 7pt; color: var(--muted); margin-top: 0.8mm; }
                .nota-rule {
                    height: 2.2pt;
                    background: var(--teal);
                    box-shadow: inset 0 0.7pt 0 #5eead4;
                }

                .nota-facts {
                    display: grid;
                    grid-template-columns: 1.4fr 0.9fr 0.8fr;
                    gap: 0;
                    border-bottom: 1px solid var(--line);
                    background: var(--paper);
                }
                .nota-fact {
                    padding: 1.6mm 3.2mm;
                    border-right: 1px solid #d9e8e5;
                    min-width: 0;
                }
                .nota-fact:last-child { border-right: none; }
                .nota-fact-label {
                    display: block;
                    font-size: 6.2pt;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: var(--muted);
                    margin-bottom: 0.5mm;
                }
                .nota-fact strong {
                    display: block;
                    font-size: 8pt;
                    font-weight: 800;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .status-pill {
                    display: inline-flex;
                    align-items: center;
                    width: auto;
                    max-width: 100%;
                    font-size: 7pt;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    line-height: 1;
                    padding: 0.9mm 1.8mm;
                    white-space: nowrap;
                }
                .status-paid {
                    background: var(--teal);
                    color: #fff;
                }
                .status-due {
                    background: #b45309;
                    color: #fff;
                }

                .nota-body { padding: 2mm 3.2mm 2.4mm; display: flex; flex-direction: column; flex: 1; min-height: 0; }

                .receipt-copy .receipt-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 7.8pt;
                    margin: 0 0 2mm;
                }
                .receipt-copy .receipt-table thead th {
                    background: var(--teal);
                    color: #fff;
                    font-size: 6.6pt;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    padding: 1.1mm 1.6mm;
                    border: none;
                }
                .receipt-copy .receipt-table tbody td {
                    padding: 1mm 1.6mm;
                    border-bottom: 1px solid #e8eef2;
                    vertical-align: top;
                }
                .receipt-copy .receipt-table tbody tr:last-child td { border-bottom: 1px solid #94a3b8; }
                .receipt-copy .receipt-table .item-code {
                    font-size: 6.5pt;
                    color: #94a3b8;
                    margin-top: 0.15mm;
                }
                .receipt-copy .col-no { width: 7mm; text-align: center; color: var(--muted); font-variant-numeric: tabular-nums; }
                .receipt-copy .col-qty { width: 11mm; text-align: center; font-variant-numeric: tabular-nums; }
                .receipt-copy .col-num { width: 28mm; text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }

                .nota-bottom {
                    display: grid;
                    grid-template-columns: 1fr 58mm;
                    gap: 3mm;
                    align-items: stretch;
                    flex-shrink: 0;
                    margin-top: auto;
                }
                .receipt-copy .receipt-warranty {
                    margin: 0;
                    padding: 1.5mm 2mm;
                    border: 1px solid #d1e7e3;
                    border-radius: 0;
                    background: var(--paper);
                    text-align: left;
                    max-height: 22mm;
                    overflow: hidden;
                }
                .receipt-copy .receipt-warranty-title {
                    font-size: 6.5pt;
                    font-weight: 800;
                    color: var(--teal-deep);
                    margin-bottom: 0.4mm;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }
                .receipt-copy .receipt-warranty-meta {
                    font-size: 7pt;
                    color: var(--ink);
                    font-weight: 700;
                    margin-bottom: 0.4mm;
                }
                .receipt-copy .receipt-warranty-body {
                    font-size: 6.4pt;
                    color: var(--muted);
                    line-height: 1.32;
                    white-space: pre-line;
                }
                .receipt-copy .receipt-totals { display: block; margin: 0; }
                .receipt-copy .receipt-totals-box { width: 100%; }
                .receipt-copy .receipt-totals-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.45mm 0;
                    font-size: 7.6pt;
                    color: #475569;
                    font-variant-numeric: tabular-nums;
                }
                .receipt-copy .receipt-totals-row.is-grand {
                    margin-top: 0.8mm;
                    padding: 1.3mm 1.8mm;
                    background: var(--teal);
                    color: #fff;
                    border: none;
                    font-family: Outfit, 'Nunito Sans', sans-serif;
                    font-size: 9pt;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                }

                .nota-foot {
                    margin-top: 1.8mm;
                    padding-top: 1.2mm;
                    border-top: 1px solid var(--line);
                    display: flex;
                    justify-content: space-between;
                    gap: 3mm;
                    font-size: 6.5pt;
                    color: var(--muted);
                    line-height: 1.3;
                    flex-shrink: 0;
                }
                .nota-foot strong { color: var(--ink); font-weight: 700; }

                .receipt-copy .receipt-paid-watermark span {
                    font-size: 2.45rem !important;
                    font-weight: 700 !important;
                    letter-spacing: 0.2em !important;
                    color: rgba(15, 118, 110, 0.12) !important;
                    border: 1.5px solid rgba(15, 118, 110, 0.22) !important;
                    border-radius: 0 !important;
                    padding: 0.1em 0.3em !important;
                }

                @media print {
                    .no-print { display: none !important; }
                    .receipt-print-shell { background: #fff !important; min-height: 0 !important; }
                    html, body { background: #fff !important; margin: 0 !important; }
                    .receipt-f4-sheet {
                        width: 100% !important;
                        height: 320mm;
                        max-width: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                    }
                    .receipt-copy {
                        border: 1px solid #64748b;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                    .nota-head, .nota-facts, .receipt-copy .receipt-table thead th,
                    .receipt-copy .receipt-totals-row.is-grand, .nota-number, .nota-rule,
                    .status-pill {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .receipt-blank, .receipt-blank-hint {
                        border: none !important;
                        color: transparent !important;
                    }
                    .receipt-cut { color: transparent !important; }
                }
                @page {
                    size: 210mm 330mm;
                    margin: 5mm 6mm !important;
                }
            `}),(0,h.jsxs)(`div`,{className:`receipt-print-shell`,children:[(0,h.jsxs)(`div`,{className:`receipt-print-toolbar no-print`,children:[(0,h.jsx)(p,{sale:e,shop:t,hidePrices:i,className:`btn-thermal`,style:{fontSize:`0.8rem`,padding:`0.42rem 1rem`,borderRadius:`8px`}}),(0,h.jsx)(s,{checked:i,onChange:l}),(0,h.jsxs)(`button`,{type:`button`,className:`btn-print`,onClick:()=>window.print(),children:[(0,h.jsx)(a,{size:16}),` Cetak Nota`]}),(0,h.jsx)(`button`,{type:`button`,className:`btn-back`,onClick:()=>{let t=()=>r.visit(`/admin/sales/${e.id}`);if(window.opener&&!window.opener.closed){window.close(),setTimeout(()=>{window.closed||t()},150);return}if(window.history.length>1){window.history.back();return}t()},children:`Kembali`})]}),(0,h.jsx)(`p`,{className:`receipt-hint no-print`,children:`Kertas F4 (210 × 330 mm) · 1 nota di setengah atas, setengah bawah kosong. Pilih F4/Folio, skala 100%, tanpa header/footer. Untuk nota berikutnya: balik kertas 180° lalu cetak lagi.`}),(0,h.jsxs)(`div`,{className:`receipt-f4-sheet print-page`,children:[(0,h.jsx)(v,{sale:e,shop:t,items:d,paymentLabel:u,hidePrices:i}),(0,h.jsx)(`div`,{className:`receipt-cut`,children:`Potong di sini`}),(0,h.jsx)(`div`,{className:`receipt-blank`,children:(0,h.jsxs)(`div`,{className:`receipt-blank-hint no-print`,children:[`Kosong — untuk nota berikutnya.`,(0,h.jsx)(`br`,{}),`Balik kertas 180° lalu cetak nota lain di area ini.`]})})]})]})]})}function v({sale:e,shop:t,items:n,paymentLabel:r,hidePrices:i}){let a=t?.legal_name||t?.app_name||`Berkah Teknik AC`,o=[t?.phone&&`Telp ${t.phone}`,t?.whatsapp&&`WA ${t.whatsapp}`].filter(Boolean),s=e.payment_status===`lunas`,c=e.created_at?new Date(e.created_at).toLocaleString(`id-ID`,{day:`numeric`,month:`short`,year:`numeric`,hour:`2-digit`,minute:`2-digit`}):`—`,p=i?3:5;return(0,h.jsxs)(`article`,{className:`receipt-copy receipt-premium receipt-sheet`,children:[s&&(0,h.jsx)(l,{}),(0,h.jsxs)(`header`,{className:`nota-head`,children:[(0,h.jsxs)(`div`,{className:`nota-brand`,children:[t?.logo_url&&(0,h.jsx)(`img`,{src:t.logo_url,alt:``,className:`nota-logo`}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{className:`nota-shop`,children:a}),t?.tagline&&(0,h.jsx)(`div`,{className:`nota-tag`,children:t.tagline}),t?.address&&(0,h.jsx)(`div`,{className:`nota-meta-line`,children:t.address}),o.length>0&&(0,h.jsx)(`div`,{className:`nota-meta-line`,children:o.join(` · `)})]})]}),(0,h.jsxs)(`div`,{className:`nota-doc`,children:[(0,h.jsx)(`div`,{className:`nota-kicker`,children:`Penjualan Sparepart`}),(0,h.jsx)(`div`,{className:`nota-title`,children:`NOTA`}),(0,h.jsx)(`div`,{className:`nota-number`,children:e.receipt_number}),(0,h.jsx)(`div`,{className:`nota-date`,children:c})]})]}),(0,h.jsx)(`div`,{className:`nota-rule`}),(0,h.jsxs)(`div`,{className:`nota-facts`,children:[(0,h.jsxs)(`div`,{className:`nota-fact`,children:[(0,h.jsx)(`span`,{className:`nota-fact-label`,children:`Pelanggan`}),(0,h.jsx)(`strong`,{children:e.customer_name||`Pelanggan Umum`})]}),(0,h.jsxs)(`div`,{className:`nota-fact`,children:[(0,h.jsx)(`span`,{className:`nota-fact-label`,children:`Pembayaran`}),(0,h.jsx)(`strong`,{children:r||`—`})]}),(0,h.jsxs)(`div`,{className:`nota-fact`,children:[(0,h.jsx)(`span`,{className:`nota-fact-label`,children:`Status`}),(0,h.jsx)(`span`,{className:`status-pill ${s?`status-paid`:`status-due`}`,children:s?`LUNAS`:`BELUM LUNAS`})]})]}),(0,h.jsxs)(`div`,{className:`nota-body`,children:[(0,h.jsxs)(`table`,{className:`receipt-table`,children:[(0,h.jsx)(`thead`,{children:(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`th`,{className:`col-no`,children:`No`}),(0,h.jsx)(`th`,{style:{textAlign:`left`},children:`Uraian`}),(0,h.jsx)(`th`,{className:`col-qty`,children:`Qty`}),!i&&(0,h.jsx)(`th`,{className:`col-num`,children:`Harga`}),!i&&(0,h.jsx)(`th`,{className:`col-num`,children:`Jumlah`})]})}),(0,h.jsx)(`tbody`,{children:n.length>0?n.map((e,t)=>(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`td`,{className:`col-no`,children:t+1}),(0,h.jsxs)(`td`,{children:[(0,h.jsx)(`div`,{style:{fontWeight:700},children:e.spare_part?.name??`-`}),(e.spare_part?.code||!i&&Number(e.discount_percent)>0)&&(0,h.jsxs)(`div`,{className:`item-code`,children:[e.spare_part?.code,!i&&Number(e.discount_percent)>0?` · pot ${Number(e.discount_percent)}%`:``]})]}),(0,h.jsx)(`td`,{className:`col-qty`,children:e.quantity}),!i&&(0,h.jsx)(`td`,{className:`col-num`,children:g(e.unit_price)}),!i&&(0,h.jsx)(`td`,{className:`col-num`,style:{fontWeight:700},children:g(f(e))})]},e.id||t)):(0,h.jsx)(`tr`,{children:(0,h.jsx)(`td`,{colSpan:p,style:{color:`#94a3b8`,fontStyle:`italic`},children:`Tidak ada item`})})})]}),(0,h.jsxs)(`div`,{className:`nota-bottom`,children:[(0,h.jsx)(u,{shop:t}),(0,h.jsx)(`div`,{className:`receipt-totals`,children:(0,h.jsx)(d,{sale:e,formatCurrency:g,paymentLabel:r,hideBreakdown:i})})]}),(0,h.jsxs)(`footer`,{className:`nota-foot`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`strong`,{children:t?.receipt_footer||`Terima kasih atas kepercayaan Anda.`}),` `,`Klaim garansi wajib membawa nota ini.`]}),(0,h.jsxs)(`div`,{children:[`Dicetak `,new Date().toLocaleString(`id-ID`,{dateStyle:`short`,timeStyle:`short`})]})]})]})]})}export{_ as default};