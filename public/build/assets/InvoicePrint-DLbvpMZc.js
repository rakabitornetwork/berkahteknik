import{c as e,d as t,n,o as r,t as i}from"./app-D6ZvcPBc.js";import{t as a}from"./printer-DpoHcEiJ.js";import{n as o,r as s,t as c}from"./printPriceVisibility-DBF0cGvp.js";var l=t(e(),1),u=i(),d=e=>`Rp ${Number(e||0).toLocaleString(`id-ID`)}`,f=e=>e?new Date(e).toLocaleString(`id-ID`,{day:`numeric`,month:`short`,year:`numeric`,hour:`2-digit`,minute:`2-digit`}):`—`,p=e=>e?new Date(e).toLocaleDateString(`id-ID`,{day:`numeric`,month:`short`,year:`numeric`}):`—`,m={cash:`Tunai`,transfer:`Transfer Bank`,qris:`QRIS`},h=`/images/brand/logo.svg`,g=.62;function _(e){let t=e.spare_parts?.length||0,n=e.work_items?.length||0,r=[e.description,e.work_instructions,e.diagnosis,e.mechanic_notes,e.warranty_notes,e.warranty_terms].filter(Boolean).join(` `).length,i=t+n+Math.ceil(r/160);return i>=16||t+n>=10?`tight`:i>=8||t+n>=6?`compact`:`comfortable`}function v(e,t,n){if(!e||!t)return;t.style.zoom=`1`;let r=e.clientHeight,i=t.scrollHeight,a=i<=r+1?1:Math.max(g,r/i);t.style.zoom=String(a),n(a)}function y({service:e,shop:t}){let i=e.spare_parts??[],d=e.work_items??[],f=i.reduce((e,t)=>e+t.pivot.quantity*t.pivot.unit_price,0),p=f+Number(e.service_fee||0),h=e.payments||[],g=h.reduce((e,t)=>e+Number(t.amount||0),0),y=Math.max(0,g-p),x=Math.max(0,p-g),S=h[h.length-1],C=m[S?.payment_method]||S?.payment_method||`Tunai`,w=e.payment_status===`lunas`,T=(0,l.useMemo)(()=>_(e),[e]),[E,D]=(0,l.useState)(()=>c()),O=(0,l.useRef)(null),k=(0,l.useRef)(null),[A,j]=(0,l.useState)(1);return(0,l.useEffect)(()=>{o(E)},[E]),(0,l.useLayoutEffect)(()=>{let e=!1,t=()=>{e||v(O.current,k.current,j)};return t(),document.fonts?.ready?.then(t),()=>{e=!0}},[e,T,E]),(0,l.useEffect)(()=>{if(new URLSearchParams(window.location.search).get(`print`)===`1`){let e=setTimeout(()=>window.print(),400);return()=>clearTimeout(e)}},[]),(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(n,{title:`Invoice Servis ${e.spk_number}`}),(0,u.jsx)(`style`,{children:`
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
            `}),(0,u.jsxs)(`div`,{className:`invoice-print-shell`,children:[(0,u.jsxs)(`div`,{className:`invoice-toolbar no-print`,children:[(0,u.jsx)(s,{checked:E,onChange:D,label:`Sembunyikan harga & jumlah`}),(0,u.jsxs)(`button`,{type:`button`,className:`btn-print`,onClick:()=>window.print(),children:[(0,u.jsx)(a,{size:16}),` Cetak Invoice`]}),(0,u.jsx)(`button`,{type:`button`,className:`btn-back`,onClick:()=>{let t=()=>r.visit(`/admin/services/${e.id}`);if(window.opener&&!window.opener.closed){window.close(),setTimeout(()=>{window.closed||t()},150);return}if(window.history.length>1){window.history.back();return}t()},children:`Kembali`})]}),(0,u.jsxs)(`p`,{className:`invoice-hint no-print`,children:[`Kertas A4 (210 × 297 mm) · 1 lembar`,A<.999?` · disesuaikan otomatis (${Math.round(A*100)}%)`:``,`. Pilih A4, skala 100%, tanpa header/footer browser.`]}),(0,u.jsx)(`div`,{className:`invoice-a4-sheet print-page`,ref:O,children:(0,u.jsx)(b,{innerRef:k,density:T,service:e,shop:t,parts:i,workItems:d,partsTotal:f,grandTotal:p,paidTotal:g,changeAmount:y,balanceDue:x,paymentLabel:C,isPaid:w,hidePrices:E,onLogoLoad:()=>v(O.current,k.current,j)})})]})]})}function b({innerRef:e,density:t,service:n,shop:r,parts:i,workItems:a,partsTotal:o,grandTotal:s,paidTotal:c,changeAmount:l,balanceDue:m,paymentLabel:g,isPaid:_,hidePrices:v,onLogoLoad:y}){let b=r?.legal_name||r?.app_name||`Berkah Teknik AC`,x=[r?.phone&&`Telp ${r.phone}`,r?.whatsapp&&`WA ${r.whatsapp}`].filter(Boolean),S=n.vehicle,C=[S?.brand,S?.model].filter(Boolean).join(` `)||`—`,w=[n.description&&{title:`Keluhan pelanggan`,body:n.description},n.work_instructions&&{title:`Instruksi kerja`,body:n.work_instructions,warn:!0},n.diagnosis&&{title:`Diagnosa teknisi`,body:n.diagnosis},n.mechanic_notes&&{title:`Catatan mekanik`,body:n.mechanic_notes}].filter(Boolean);return(0,u.jsxs)(`article`,{className:`invoice-inner invoice-page`,ref:e,"data-density":t,children:[_&&(0,u.jsx)(`div`,{className:`invoice-paid-watermark`,"aria-hidden":!0,children:(0,u.jsx)(`span`,{children:`LUNAS`})}),(0,u.jsxs)(`header`,{className:`invoice-head`,children:[(0,u.jsxs)(`div`,{className:`invoice-brand`,children:[(0,u.jsx)(`img`,{src:r?.logo_url||h,alt:b,className:`invoice-logo`,onLoad:y,onError:e=>{e.currentTarget.src.endsWith(h)||(e.currentTarget.src=h)}}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`div`,{className:`invoice-shop`,children:b}),r?.tagline&&(0,u.jsx)(`div`,{className:`invoice-tag`,children:r.tagline}),r?.address&&(0,u.jsx)(`div`,{className:`invoice-meta-line`,children:r.address}),x.length>0&&(0,u.jsx)(`div`,{className:`invoice-meta-line`,children:x.join(` · `)})]})]}),(0,u.jsxs)(`div`,{className:`invoice-doc`,children:[(0,u.jsx)(`div`,{className:`invoice-kicker`,children:`Bengkel AC Mobil`}),(0,u.jsx)(`div`,{className:`invoice-title`,children:`INVOICE`}),(0,u.jsx)(`div`,{className:`invoice-number`,children:n.spk_number}),(0,u.jsx)(`div`,{className:`invoice-date`,children:f(n.completed_at||n.spk_issued_at||n.created_at)})]})]}),(0,u.jsx)(`div`,{className:`invoice-rule`}),(0,u.jsxs)(`div`,{className:`invoice-facts`,children:[(0,u.jsxs)(`div`,{className:`invoice-fact`,children:[(0,u.jsx)(`span`,{className:`invoice-fact-label`,children:`Pelanggan`}),(0,u.jsx)(`strong`,{children:S?.customer?.name||`—`})]}),(0,u.jsxs)(`div`,{className:`invoice-fact`,children:[(0,u.jsx)(`span`,{className:`invoice-fact-label`,children:`Kendaraan`}),(0,u.jsxs)(`strong`,{children:[C,S?.year?` · ${S.year}`:``]})]}),(0,u.jsxs)(`div`,{className:`invoice-fact`,children:[(0,u.jsx)(`span`,{className:`invoice-fact-label`,children:`Plat`}),(0,u.jsx)(`strong`,{children:S?.license_plate||`—`})]}),(0,u.jsxs)(`div`,{className:`invoice-fact`,children:[(0,u.jsx)(`span`,{className:`invoice-fact-label`,children:`Mekanik`}),(0,u.jsx)(`strong`,{children:n.technician?.name||`Belum ditugaskan`})]}),(0,u.jsxs)(`div`,{className:`invoice-fact`,children:[(0,u.jsx)(`span`,{className:`invoice-fact-label`,children:`Pembayaran`}),(0,u.jsx)(`span`,{className:`status-pill ${_?`status-paid`:`status-due`}`,children:_?`Lunas`:`Belum lunas`})]})]}),(0,u.jsxs)(`div`,{className:`invoice-body`,children:[(w.length>0||n.service_name)&&(0,u.jsxs)(`div`,{className:w.length>1?`invoice-grid-2`:void 0,children:[(0,u.jsxs)(`div`,{className:`invoice-block`,children:[(0,u.jsx)(`div`,{className:`invoice-block-title`,children:`Jenis jasa`}),(0,u.jsx)(`p`,{children:(0,u.jsx)(`strong`,{children:n.service_name||`—`})}),S?.customer?.phone&&(0,u.jsxs)(`p`,{style:{marginTop:`0.6mm`,color:`#64748b`},children:[`HP: `,S.customer.phone]}),(n.is_bring_own_part===1||n.is_bring_own_part===!0)&&(0,u.jsx)(`span`,{className:`invoice-chip`,children:`* Pelanggan membawa spare part sendiri`})]}),w.map(e=>(0,u.jsxs)(`div`,{className:`invoice-block${e.warn?` is-warn`:``}`,children:[(0,u.jsx)(`div`,{className:`invoice-block-title`,children:e.title}),(0,u.jsx)(`p`,{children:e.body})]},e.title))]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`div`,{className:`invoice-section-label`,children:`Spare part`}),(0,u.jsxs)(`table`,{className:`invoice-table`,children:[(0,u.jsx)(`thead`,{children:(0,u.jsxs)(`tr`,{children:[(0,u.jsx)(`th`,{className:`col-no`,children:`No`}),(0,u.jsx)(`th`,{children:`Spare part`}),(0,u.jsx)(`th`,{className:`col-qty`,children:`Qty`}),!v&&(0,u.jsx)(`th`,{className:`col-num`,children:`Harga`}),!v&&(0,u.jsx)(`th`,{className:`col-num`,children:`Jumlah`})]})}),(0,u.jsx)(`tbody`,{children:i.length>0?i.map((e,t)=>(0,u.jsxs)(`tr`,{children:[(0,u.jsx)(`td`,{className:`col-no`,children:t+1}),(0,u.jsx)(`td`,{style:{fontWeight:700},children:e.name}),(0,u.jsxs)(`td`,{className:`col-qty`,children:[e.pivot.quantity,e.unit?` ${e.unit}`:``]}),!v&&(0,u.jsx)(`td`,{className:`col-num`,children:d(e.pivot.unit_price)}),!v&&(0,u.jsx)(`td`,{className:`col-num`,style:{fontWeight:700},children:d(e.pivot.quantity*e.pivot.unit_price)})]},e.id||t)):(0,u.jsx)(`tr`,{children:(0,u.jsx)(`td`,{colSpan:v?3:5,className:`muted-row`,children:`Tidak ada spare part dari bengkel`})})})]})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`div`,{className:`invoice-section-label`,children:`Item pengerjaan`}),(0,u.jsxs)(`table`,{className:`invoice-table`,children:[(0,u.jsx)(`thead`,{children:(0,u.jsxs)(`tr`,{children:[(0,u.jsx)(`th`,{className:`col-no`,children:`No`}),(0,u.jsx)(`th`,{children:`Nama pengerjaan`}),(0,u.jsx)(`th`,{className:`col-qty`,children:`Qty`}),(0,u.jsx)(`th`,{className:`col-unit`,children:`Satuan`}),!v&&(0,u.jsx)(`th`,{className:`col-num`,children:`Harga`}),!v&&(0,u.jsx)(`th`,{className:`col-num`,children:`Jumlah`})]})}),(0,u.jsx)(`tbody`,{children:a.length>0?a.map((e,t)=>(0,u.jsxs)(`tr`,{children:[(0,u.jsx)(`td`,{className:`col-no`,children:t+1}),(0,u.jsx)(`td`,{style:{fontWeight:700},children:e.name}),(0,u.jsx)(`td`,{className:`col-qty`,children:e.quantity}),(0,u.jsx)(`td`,{className:`col-unit`,children:e.unit||`JOB`}),!v&&(0,u.jsx)(`td`,{className:`col-num`,children:d(e.unit_price)}),!v&&(0,u.jsx)(`td`,{className:`col-num`,style:{fontWeight:700},children:d(e.quantity*e.unit_price)})]},e.id||t)):(0,u.jsx)(`tr`,{children:(0,u.jsx)(`td`,{colSpan:v?4:6,className:`muted-row`,children:`Tidak ada item pengerjaan`})})})]}),(0,u.jsxs)(`div`,{className:`invoice-totals`,children:[!v&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(`div`,{className:`invoice-total-row`,children:[(0,u.jsx)(`span`,{children:`Subtotal sparepart`}),(0,u.jsx)(`span`,{children:d(o)})]}),(0,u.jsxs)(`div`,{className:`invoice-total-row`,children:[(0,u.jsx)(`span`,{children:`Biaya jasa`}),(0,u.jsx)(`span`,{children:d(n.service_fee)})]})]}),(0,u.jsxs)(`div`,{className:`invoice-total-row is-grand`,children:[(0,u.jsx)(`span`,{children:`Total`}),(0,u.jsx)(`strong`,{children:d(s)})]}),c>0&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(`div`,{className:`invoice-total-row`,children:[(0,u.jsx)(`span`,{children:g}),(0,u.jsx)(`span`,{children:d(c)})]}),(0,u.jsxs)(`div`,{className:`invoice-total-row`,children:[(0,u.jsx)(`span`,{children:`Kembali`}),(0,u.jsx)(`span`,{children:d(l)})]})]}),!_&&(0,u.jsxs)(`div`,{className:`invoice-total-row is-due`,children:[(0,u.jsx)(`span`,{children:`Sisa tagihan`}),(0,u.jsx)(`span`,{children:d(m)})]})]})]}),(0,u.jsxs)(`div`,{className:`invoice-grid-2`,children:[(0,u.jsxs)(`div`,{className:`invoice-block`,children:[(0,u.jsx)(`div`,{className:`invoice-block-title`,children:`Garansi`}),(0,u.jsxs)(`p`,{children:[(0,u.jsxs)(`strong`,{children:[n.effective_warranty_months||0,` bulan`]}),n.warranty_expires_at?` · hingga ${p(n.warranty_expires_at)}`:``]}),n.warranty_notes&&(0,u.jsx)(`p`,{style:{marginTop:`0.5mm`},children:n.warranty_notes}),r?.warranty_policy&&(0,u.jsx)(`p`,{style:{marginTop:`0.6mm`,color:`#64748b`,fontSize:`6.6pt`},children:r.warranty_policy})]}),(0,u.jsxs)(`div`,{className:`invoice-block`,children:[(0,u.jsx)(`div`,{className:`invoice-block-title`,children:`Jadwal`}),(0,u.jsxs)(`p`,{children:[`Masuk: `,f(n.created_at)]}),(0,u.jsxs)(`p`,{children:[`Selesai: `,f(n.completed_at)]})]})]})]}),(0,u.jsxs)(`div`,{className:`invoice-signs`,children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`div`,{className:`invoice-sign-role`,children:`Admin / Kasir`}),(0,u.jsx)(`div`,{className:`invoice-sign-space`}),(0,u.jsx)(`div`,{className:`invoice-sign-name`,children:r?.owner_name||`________________`}),(0,u.jsx)(`div`,{className:`invoice-sign-hint`,children:`Tanda tangan`})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`div`,{className:`invoice-sign-role`,children:`Mekanik`}),(0,u.jsx)(`div`,{className:`invoice-sign-space`}),(0,u.jsx)(`div`,{className:`invoice-sign-name`,children:n.technician?.name||`________________`}),(0,u.jsx)(`div`,{className:`invoice-sign-hint`,children:`Penanggung jawab`})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`div`,{className:`invoice-sign-role`,children:`Pelanggan`}),(0,u.jsx)(`div`,{className:`invoice-sign-space`}),(0,u.jsx)(`div`,{className:`invoice-sign-name`,children:S?.customer?.name||`________________`}),(0,u.jsx)(`div`,{className:`invoice-sign-hint`,children:`Penerima invoice`})]})]}),(0,u.jsxs)(`footer`,{className:`invoice-foot`,children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`strong`,{children:r?.receipt_footer||`Terima kasih atas kepercayaan Anda.`}),` `,`Simpan lembar ini sebagai bukti transaksi.`]}),(0,u.jsxs)(`div`,{children:[`Dicetak `,new Date().toLocaleString(`id-ID`,{dateStyle:`short`,timeStyle:`short`})]})]})]})}export{y as default};