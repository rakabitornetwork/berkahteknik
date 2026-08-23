import{c as e,d as t,n,o as r,t as i}from"./app--0vaNRln.js";import{t as a}from"./printer-DicXyoLr.js";import{n as o,r as s,t as c}from"./printPriceVisibility-CFH8hKwk.js";import{a as l,i as u,n as d,o as f,r as p,t as m}from"./ThermalPrintButton-CTJdsDcm.js";var h=t(e(),1),g=i(),_=e=>`Rp ${Number(e).toLocaleString(`id-ID`)}`;function v({sale:e,shop:t}){let[i,l]=(0,h.useState)(()=>c());(0,h.useEffect)(()=>{o(i)},[i]),(0,h.useEffect)(()=>{if(new URLSearchParams(window.location.search).get(`print`)===`1`){let e=setTimeout(()=>window.print(),400);return()=>clearTimeout(e)}},[]);let u={cash:`Tunai`,transfer:`Transfer Bank`,qris:`QRIS`}[e.payment_method]||e.payment_method,d=e.items??[];return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(n,{title:`Nota ${e.receipt_number}`}),(0,g.jsx)(`style`,{children:`
                .receipt-print-shell {
                    min-height: 100vh;
                    background: #eef2f6;
                    font-family: 'Inter', system-ui, sans-serif;
                    --receipt-width: min(80rem, calc(100vw - 1rem));
                }
                .receipt-print-toolbar {
                    display: flex;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 0.85rem 1rem;
                    max-width: var(--receipt-width);
                    margin: 0 auto;
                }
                .receipt-print-toolbar button {
                    font-size: 0.8125rem;
                    padding: 0.45rem 1.1rem;
                    border-radius: 8px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                }
                .receipt-print-toolbar .btn-print {
                    border: none;
                    background: #2563eb;
                    color: white;
                }
                .receipt-print-toolbar .btn-back {
                    background: white;
                    border: 1px solid #cbd5e1;
                    color: #334155;
                }
                .receipt-print-toolbar .btn-thermal {
                    background: #0f766e;
                    border: none;
                    color: white;
                }
                .print-hide-prices-toggle {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.8rem;
                    color: #334155;
                    background: white;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 0.45rem 0.8rem;
                    cursor: pointer;
                    user-select: none;
                }
                .receipt-print-body {
                    padding: 0 1rem 1.25rem;
                    max-width: var(--receipt-width);
                    margin: 0 auto;
                }
                .receipt-premium.print-page {
                    width: 100%;
                    max-width: 100%;
                    padding: 1.15rem 1.5rem;
                    border-radius: 4px;
                    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.06);
                }
                .receipt-premium .receipt-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.8125rem;
                    margin-bottom: 0.75rem;
                }
                .receipt-premium .receipt-table thead tr {
                    border-bottom: 1px solid #cbd5e1;
                }
                .receipt-premium .receipt-table th {
                    padding: 0.35rem 0.45rem;
                    font-size: 0.65rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #64748b;
                }
                .receipt-premium .receipt-table td {
                    padding: 0.4rem 0.45rem;
                    border-bottom: 1px solid #f1f5f9;
                    vertical-align: top;
                }
                .receipt-premium .receipt-table .item-code {
                    font-size: 0.68rem;
                    color: #94a3b8;
                    margin-top: 0.1rem;
                }
                .receipt-premium .receipt-totals {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 0.65rem;
                }
                .receipt-premium .receipt-totals-box {
                    width: min(280px, 42%);
                }
                .receipt-premium .receipt-totals-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.2rem 0;
                    font-size: 0.8125rem;
                    color: #475569;
                }
                .receipt-premium .receipt-totals-row.is-grand {
                    padding-top: 0.45rem;
                    margin-top: 0.25rem;
                    border-top: 1px solid #cbd5e1;
                    font-size: 1rem;
                    font-weight: 700;
                    color: #0f172a;
                }
                .receipt-premium .receipt-warranty {
                    margin: 0.85rem 0 0;
                    padding: 0.6rem 0.7rem;
                    border: 1px dashed #cbd5e1;
                    border-radius: 4px;
                    background: #f8fafc;
                    text-align: left;
                }
                .receipt-premium .receipt-warranty-title {
                    font-size: 0.72rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 0.25rem;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .receipt-premium .receipt-warranty-meta {
                    font-size: 0.7rem;
                    color: #334155;
                    margin-bottom: 0.3rem;
                }
                .receipt-premium .receipt-warranty-body {
                    font-size: 0.65rem;
                    color: #64748b;
                    line-height: 1.45;
                    white-space: pre-line;
                }
                .receipt-premium .receipt-footer {
                    text-align: center;
                    margin-top: 0.85rem;
                    padding-top: 0.65rem;
                    border-top: 1px solid #f1f5f9;
                    font-size: 0.7rem;
                    color: #64748b;
                    line-height: 1.45;
                    white-space: pre-line;
                }
                @media print {
                    .no-print { display: none !important; }
                    .receipt-print-shell { background: white !important; min-height: auto !important; }
                    html, body { background: white !important; margin: 0 !important; }
                    body, body * { visibility: visible !important; }
                    .receipt-premium.print-page {
                        box-shadow: none !important;
                        margin: 0 !important;
                        max-width: 100% !important;
                        padding: 0 !important;
                        border-radius: 0 !important;
                    }
                }
                @page { margin: 10mm; }
            `}),(0,g.jsxs)(`div`,{className:`receipt-print-shell`,children:[(0,g.jsxs)(`div`,{className:`receipt-print-toolbar no-print`,children:[(0,g.jsx)(m,{sale:e,shop:t,hidePrices:i,className:`btn-thermal`,style:{fontSize:`0.8125rem`,padding:`0.45rem 1.1rem`,borderRadius:`8px`}}),(0,g.jsx)(s,{checked:i,onChange:l}),(0,g.jsxs)(`button`,{type:`button`,className:`btn-print`,onClick:()=>window.print(),children:[(0,g.jsx)(a,{size:16}),` Cetak Browser`]}),(0,g.jsx)(`button`,{type:`button`,className:`btn-back`,onClick:()=>{let t=()=>r.visit(`/admin/sales/${e.id}`);if(window.opener&&!window.opener.closed){window.close(),setTimeout(()=>{window.closed||t()},150);return}if(window.history.length>1){window.history.back();return}t()},children:`Kembali`})]}),(0,g.jsx)(y,{sale:e,shop:t,items:d,paymentLabel:u,hidePrices:i})]})]})}function y({sale:e,shop:t,items:n,paymentLabel:r,hidePrices:i}){return(0,g.jsx)(`div`,{className:`receipt-print-body`,children:(0,g.jsxs)(`div`,{className:`print-page receipt-sheet receipt-premium`,style:{position:`relative`,margin:`0 auto`,background:`white`,color:`#111`},children:[e.payment_status===`lunas`&&(0,g.jsx)(l,{}),(0,g.jsx)(f,{shop:t,dark:!0,receiptNumber:e.receipt_number,transactionDate:e.created_at,customerName:e.customer_name}),(0,g.jsxs)(`table`,{className:`receipt-table`,children:[(0,g.jsx)(`thead`,{children:(0,g.jsxs)(`tr`,{children:[(0,g.jsx)(`th`,{style:{textAlign:`left`},children:`Barang`}),(0,g.jsx)(`th`,{style:{textAlign:`center`,width:`4rem`},children:`Qty`}),!i&&(0,g.jsx)(`th`,{style:{textAlign:`right`,width:`7rem`},children:`Harga`}),!i&&(0,g.jsx)(`th`,{style:{textAlign:`right`,width:`7.5rem`},children:`Subtotal`})]})}),(0,g.jsx)(`tbody`,{children:n.length>0?n.map(e=>(0,g.jsxs)(`tr`,{children:[(0,g.jsxs)(`td`,{children:[(0,g.jsx)(`div`,{style:{fontWeight:600,color:`#0f172a`},children:e.spare_part?.name??`-`}),(e.spare_part?.code||!i&&Number(e.discount_percent)>0)&&(0,g.jsxs)(`div`,{className:`item-code`,children:[e.spare_part?.code,!i&&Number(e.discount_percent)>0?` · pot ${Number(e.discount_percent)}%`:``]})]}),(0,g.jsx)(`td`,{style:{textAlign:`center`},children:e.quantity}),!i&&(0,g.jsx)(`td`,{style:{textAlign:`right`},children:_(e.unit_price)}),!i&&(0,g.jsx)(`td`,{style:{textAlign:`right`,fontWeight:600},children:_(p(e))})]},e.id)):(0,g.jsx)(`tr`,{children:(0,g.jsx)(`td`,{colSpan:i?2:4,style:{color:`#94a3b8`,fontStyle:`italic`,padding:`0.5rem 0`},children:`Tidak ada item`})})})]}),(0,g.jsx)(`div`,{className:`receipt-totals`,children:(0,g.jsx)(d,{sale:e,formatCurrency:_,paymentLabel:r,hideBreakdown:i})}),(0,g.jsx)(u,{shop:t}),(0,g.jsx)(`div`,{className:`receipt-footer`,children:t?.receipt_footer||`Terima kasih atas pembelian Anda.`})]})})}export{v as default};