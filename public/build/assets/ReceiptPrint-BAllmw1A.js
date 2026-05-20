import{b as p,j as e,H as d,d as m}from"./app-C_5OOcYq.js";import{T as l,P as h,R as x}from"./ThermalPrintButton-DI-AgNu0.js";import{P as b}from"./printer-D1m5DAzs.js";import"./useThermalPrinter-DnAYa2Yt.js";import"./createLucideIcon-DDDN5LHM.js";const a=t=>`Rp ${Number(t).toLocaleString("id-ID")}`;function N({sale:t,shop:i}){p.useEffect(()=>{if(new URLSearchParams(window.location.search).get("print")==="1"){const n=setTimeout(()=>window.print(),400);return()=>clearTimeout(n)}},[]);const o={cash:"Tunai",transfer:"Transfer Bank",qris:"QRIS"}[t.payment_method]||t.payment_method,s=t.items??[],r=()=>{const n=()=>m.visit(`/admin/sales/${t.id}`);if(window.opener&&!window.opener.closed){window.close(),setTimeout(()=>{window.closed||n()},150);return}if(window.history.length>1){window.history.back();return}n()};return e.jsxs(e.Fragment,{children:[e.jsx(d,{title:`Nota ${t.receipt_number}`}),e.jsx("style",{children:`
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
            `}),e.jsxs("div",{className:"receipt-print-shell",children:[e.jsxs("div",{className:"receipt-print-toolbar no-print",children:[e.jsx(l,{sale:t,shop:i,className:"btn-thermal",style:{fontSize:"0.8125rem",padding:"0.45rem 1.1rem",borderRadius:"8px"}}),e.jsxs("button",{type:"button",className:"btn-print",onClick:()=>window.print(),children:[e.jsx(b,{size:16})," Cetak Browser"]}),e.jsx("button",{type:"button",className:"btn-back",onClick:r,children:"Kembali"})]}),e.jsx(u,{sale:t,shop:i,items:s,paymentLabel:o})]})]})}function u({sale:t,shop:i,items:o,paymentLabel:s}){return e.jsx("div",{className:"receipt-print-body",children:e.jsxs("div",{className:"print-page receipt-sheet receipt-premium",style:{position:"relative",margin:"0 auto",background:"white",color:"#111"},children:[t.payment_status==="lunas"&&e.jsx(h,{}),e.jsx(x,{shop:i,dark:!0,receiptNumber:t.receipt_number,transactionDate:t.created_at,customerName:t.customer_name}),e.jsxs("table",{className:"receipt-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{textAlign:"left"},children:"Barang"}),e.jsx("th",{style:{textAlign:"center",width:"4rem"},children:"Qty"}),e.jsx("th",{style:{textAlign:"right",width:"7rem"},children:"Harga"}),e.jsx("th",{style:{textAlign:"right",width:"7.5rem"},children:"Subtotal"})]})}),e.jsx("tbody",{children:o.length>0?o.map(r=>{var n,c;return e.jsxs("tr",{children:[e.jsxs("td",{children:[e.jsx("div",{style:{fontWeight:600,color:"#0f172a"},children:((n=r.spare_part)==null?void 0:n.name)??"-"}),((c=r.spare_part)==null?void 0:c.code)&&e.jsx("div",{className:"item-code",children:r.spare_part.code})]}),e.jsx("td",{style:{textAlign:"center"},children:r.quantity}),e.jsx("td",{style:{textAlign:"right"},children:a(r.unit_price)}),e.jsx("td",{style:{textAlign:"right",fontWeight:600},children:a(r.unit_price*r.quantity)})]},r.id)}):e.jsx("tr",{children:e.jsx("td",{colSpan:4,style:{color:"#94a3b8",fontStyle:"italic",padding:"0.5rem 0"},children:"Tidak ada item"})})})]}),e.jsx("div",{className:"receipt-totals",children:e.jsx(g,{sale:t,paymentLabel:s})}),e.jsx("div",{className:"receipt-footer",children:(i==null?void 0:i.receipt_footer)||"Terima kasih atas pembelian Anda."})]})})}function g({sale:t,paymentLabel:i}){return e.jsxs("div",{className:"receipt-totals-box",children:[e.jsxs("div",{className:"receipt-totals-row is-grand",children:[e.jsx("span",{children:"TOTAL"}),e.jsx("span",{children:a(t.total_amount)})]}),t.amount_paid>0&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"receipt-totals-row",children:[e.jsx("span",{children:i}),e.jsx("span",{children:a(t.amount_paid)})]}),e.jsxs("div",{className:"receipt-totals-row",children:[e.jsx("span",{children:"Kembali"}),e.jsx("span",{children:a(t.change_amount)})]})]})]})}export{N as default};
