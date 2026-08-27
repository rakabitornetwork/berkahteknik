import{c as e,d as t,n,o as r,t as i}from"./app-scGp7GE9.js";import{t as a}from"./printer-BmMQWGUq.js";import{n as o,r as s,t as c}from"./printPriceVisibility-B1zB6zk6.js";import{a as l,i as u,n as d,o as f,r as p,t as m}from"./ThermalPrintButton-CqexLpSw.js";var h=t(e(),1),g=i(),_=e=>`Rp ${Number(e).toLocaleString(`id-ID`)}`;function v({sale:e,shop:t}){let[i,l]=(0,h.useState)(()=>c());(0,h.useEffect)(()=>{o(i)},[i]),(0,h.useEffect)(()=>{if(new URLSearchParams(window.location.search).get(`print`)===`1`){let e=setTimeout(()=>window.print(),400);return()=>clearTimeout(e)}},[]);let u={cash:`Tunai`,transfer:`Transfer Bank`,qris:`QRIS`}[e.payment_method]||e.payment_method,d=e.items??[];return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(n,{title:`Nota ${e.receipt_number}`}),(0,g.jsx)(`style`,{children:`
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
                .receipt-print-toolbar .btn-print { border: none; background: #2563eb; color: #fff; }
                .receipt-print-toolbar .btn-back { background: #fff; border: 1px solid #cbd5e1; color: #334155; }
                .receipt-print-toolbar .btn-thermal { background: #0f766e; border: none; color: #fff; }
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
                    flex: 0 0 calc(50% - 4mm);
                    height: calc(50% - 4mm);
                    min-height: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    font-size: 8.5pt;
                    line-height: 1.25;
                    color: #0f172a;
                    background: #fff;
                    border: 1px solid #cbd5e1;
                    padding: 3.2mm 3.6mm 2.6mm;
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
                .receipt-copy .receipt-header {
                    margin-bottom: 2mm !important;
                    padding-bottom: 1.6mm !important;
                }
                .receipt-copy .receipt-header-grid {
                    gap: 1.5mm 4mm !important;
                }
                .receipt-copy .receipt-header h1 {
                    font-size: 10.5pt !important;
                    line-height: 1.15 !important;
                }
                .receipt-copy .receipt-header img {
                    max-height: 9mm !important;
                    max-width: 9mm !important;
                }
                .receipt-copy .receipt-header p {
                    margin-top: 0.35mm !important;
                    font-size: 7pt !important;
                    line-height: 1.3 !important;
                }
                .receipt-copy .receipt-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 8pt;
                    margin-bottom: 1.6mm;
                    flex: 1 1 auto;
                    min-height: 0;
                }
                .receipt-copy .receipt-table thead tr { border-bottom: 1px solid #94a3b8; }
                .receipt-copy .receipt-table th {
                    padding: 0.7mm 1.4mm;
                    font-size: 7pt;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    color: #475569;
                }
                .receipt-copy .receipt-table td {
                    padding: 0.7mm 1.4mm;
                    border-bottom: 1px solid #e2e8f0;
                    vertical-align: top;
                    font-size: 8pt;
                }
                .receipt-copy .receipt-table .item-code {
                    font-size: 6.8pt;
                    color: #94a3b8;
                    margin-top: 0.2mm;
                }
                .receipt-copy .receipt-totals {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 1.4mm;
                    flex-shrink: 0;
                }
                .receipt-copy .receipt-totals-box { width: min(62mm, 48%); }
                .receipt-copy .receipt-totals-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.35mm 0;
                    font-size: 8pt;
                    color: #475569;
                }
                .receipt-copy .receipt-totals-row.is-grand {
                    padding-top: 1mm;
                    margin-top: 0.4mm;
                    border-top: 1px solid #0f766e;
                    font-size: 9.5pt;
                    font-weight: 800;
                    color: #0f172a;
                }
                .receipt-copy .receipt-warranty {
                    margin: 0;
                    padding: 1.2mm 1.6mm;
                    border: 1px dashed #cbd5e1;
                    border-radius: 0;
                    background: #f8fafc;
                    text-align: left;
                    max-height: 18mm;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .receipt-copy .receipt-warranty-title {
                    font-size: 7pt;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 0.3mm;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .receipt-copy .receipt-warranty-meta {
                    font-size: 7pt;
                    color: #334155;
                    margin-bottom: 0.3mm;
                }
                .receipt-copy .receipt-warranty-body {
                    font-size: 6.6pt;
                    color: #64748b;
                    line-height: 1.3;
                    white-space: pre-line;
                }
                .receipt-copy .receipt-footer {
                    text-align: center;
                    margin-top: 1.4mm;
                    padding-top: 1mm;
                    border-top: 1px dotted #cbd5e1;
                    font-size: 6.8pt;
                    color: #64748b;
                    line-height: 1.3;
                    white-space: pre-line;
                    flex-shrink: 0;
                }
                .receipt-copy .receipt-paid-watermark span {
                    font-size: 2.1rem !important;
                    letter-spacing: 0.12em !important;
                    border-width: 2px !important;
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
            `}),(0,g.jsxs)(`div`,{className:`receipt-print-shell`,children:[(0,g.jsxs)(`div`,{className:`receipt-print-toolbar no-print`,children:[(0,g.jsx)(m,{sale:e,shop:t,hidePrices:i,className:`btn-thermal`,style:{fontSize:`0.8rem`,padding:`0.42rem 1rem`,borderRadius:`8px`}}),(0,g.jsx)(s,{checked:i,onChange:l}),(0,g.jsxs)(`button`,{type:`button`,className:`btn-print`,onClick:()=>window.print(),children:[(0,g.jsx)(a,{size:16}),` Cetak Nota`]}),(0,g.jsx)(`button`,{type:`button`,className:`btn-back`,onClick:()=>{let t=()=>r.visit(`/admin/sales/${e.id}`);if(window.opener&&!window.opener.closed){window.close(),setTimeout(()=>{window.closed||t()},150);return}if(window.history.length>1){window.history.back();return}t()},children:`Kembali`})]}),(0,g.jsx)(`p`,{className:`receipt-hint no-print`,children:`Kertas F4 (210 × 330 mm) · 1 nota di setengah atas, setengah bawah kosong. Pilih F4/Folio, skala 100%, tanpa header/footer. Untuk nota berikutnya: balik kertas 180° lalu cetak lagi.`}),(0,g.jsxs)(`div`,{className:`receipt-f4-sheet print-page`,children:[(0,g.jsx)(y,{sale:e,shop:t,items:d,paymentLabel:u,hidePrices:i}),(0,g.jsx)(`div`,{className:`receipt-cut`,children:`Potong di sini`}),(0,g.jsx)(`div`,{className:`receipt-blank`,children:(0,g.jsxs)(`div`,{className:`receipt-blank-hint no-print`,children:[`Kosong — untuk nota berikutnya.`,(0,g.jsx)(`br`,{}),`Balik kertas 180° lalu cetak nota lain di area ini.`]})})]})]})]})}function y({sale:e,shop:t,items:n,paymentLabel:r,hidePrices:i}){return(0,g.jsxs)(`article`,{className:`receipt-copy receipt-premium receipt-sheet`,children:[e.payment_status===`lunas`&&(0,g.jsx)(l,{}),(0,g.jsx)(f,{shop:t,dark:!0,receiptNumber:e.receipt_number,transactionDate:e.created_at,customerName:e.customer_name}),(0,g.jsxs)(`table`,{className:`receipt-table`,children:[(0,g.jsx)(`thead`,{children:(0,g.jsxs)(`tr`,{children:[(0,g.jsx)(`th`,{style:{textAlign:`left`},children:`Barang`}),(0,g.jsx)(`th`,{style:{textAlign:`center`,width:`3.4rem`},children:`Qty`}),!i&&(0,g.jsx)(`th`,{style:{textAlign:`right`,width:`6.2rem`},children:`Harga`}),!i&&(0,g.jsx)(`th`,{style:{textAlign:`right`,width:`6.8rem`},children:`Subtotal`})]})}),(0,g.jsx)(`tbody`,{children:n.length>0?n.map(e=>(0,g.jsxs)(`tr`,{children:[(0,g.jsxs)(`td`,{children:[(0,g.jsx)(`div`,{style:{fontWeight:700,color:`#0f172a`},children:e.spare_part?.name??`-`}),(e.spare_part?.code||!i&&Number(e.discount_percent)>0)&&(0,g.jsxs)(`div`,{className:`item-code`,children:[e.spare_part?.code,!i&&Number(e.discount_percent)>0?` · pot ${Number(e.discount_percent)}%`:``]})]}),(0,g.jsx)(`td`,{style:{textAlign:`center`},children:e.quantity}),!i&&(0,g.jsx)(`td`,{style:{textAlign:`right`},children:_(e.unit_price)}),!i&&(0,g.jsx)(`td`,{style:{textAlign:`right`,fontWeight:700},children:_(p(e))})]},e.id)):(0,g.jsx)(`tr`,{children:(0,g.jsx)(`td`,{colSpan:i?2:4,style:{color:`#94a3b8`,fontStyle:`italic`},children:`Tidak ada item`})})})]}),(0,g.jsx)(`div`,{className:`receipt-totals`,children:(0,g.jsx)(d,{sale:e,formatCurrency:_,paymentLabel:r,hideBreakdown:i})}),(0,g.jsx)(u,{shop:t}),(0,g.jsx)(`div`,{className:`receipt-footer`,children:t?.receipt_footer||`Terima kasih atas pembelian Anda.`})]})}export{v as default};