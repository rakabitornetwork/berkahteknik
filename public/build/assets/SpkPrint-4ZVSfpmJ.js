import{c as e,d as t,n,o as r,t as i}from"./app-DzJgbOiu.js";import{t as a}from"./printer-DXifX-i2.js";import{n as o,r as s,t as c}from"./printPriceVisibility-DQev9SzJ.js";var l=t(e(),1),u=i(),d=e=>`Rp ${Number(e||0).toLocaleString(`id-ID`)}`,f=e=>e?new Date(e).toLocaleString(`id-ID`,{day:`numeric`,month:`short`,year:`numeric`,hour:`2-digit`,minute:`2-digit`}):`—`,p={antri:`Antri`,dikerjakan:`Dikerjakan`,selesai:`Selesai`},m=`/images/brand/logo.svg`,h=.62;function g(e){let t=e.spare_parts?.length||0,n=[e.description,e.work_instructions,e.diagnosis,e.mechanic_notes,e.warranty_notes,e.warranty_terms].filter(Boolean).join(` `).length,r=t+Math.ceil(n/160);return r>=16||t>=10?`tight`:r>=8||t>=6?`compact`:`comfortable`}function _(e,t,n){if(!e||!t)return;t.style.zoom=`1`;let r=e.clientHeight,i=t.scrollHeight,a=i<=r+1?1:Math.max(h,r/i);t.style.zoom=String(a),n(a)}function v({service:e,shop:t}){let i=e.spare_parts??[],d=i.reduce((e,t)=>e+t.pivot.quantity*t.pivot.unit_price,0)+Number(e.service_fee||0),f=(0,l.useMemo)(()=>g(e),[e]),[p,m]=(0,l.useState)(()=>c()),h=(0,l.useRef)(null),v=(0,l.useRef)(null),[b,x]=(0,l.useState)(1);return(0,l.useEffect)(()=>{o(p)},[p]),(0,l.useLayoutEffect)(()=>{let e=!1,t=()=>{e||_(h.current,v.current,x)};return t(),document.fonts?.ready?.then(t),()=>{e=!0}},[e,f,p]),(0,l.useEffect)(()=>{if(new URLSearchParams(window.location.search).get(`print`)===`1`){let e=setTimeout(()=>window.print(),400);return()=>clearTimeout(e)}},[]),(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(n,{title:`SPK ${e.spk_number}`}),(0,u.jsx)(`style`,{children:`
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
                .spk-hint {
                    width: 100%;
                    text-align: center;
                    font-size: 0.72rem;
                    color: #475569;
                    padding: 0 1rem 0.75rem;
                    line-height: 1.35;
                }
                .spk-a4-sheet {
                    width: 210mm;
                    height: 297mm;
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
                    .spk-a4-sheet {
                        width: 100% !important;
                        height: 287mm;
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
                    size: A4;
                    margin: 5mm 6mm !important;
                }
            `}),(0,u.jsxs)(`div`,{className:`spk-print-shell`,children:[(0,u.jsxs)(`div`,{className:`spk-toolbar no-print`,children:[(0,u.jsx)(s,{checked:p,onChange:m,label:`Sembunyikan harga & jumlah`}),(0,u.jsxs)(`button`,{type:`button`,className:`btn-print`,onClick:()=>window.print(),children:[(0,u.jsx)(a,{size:16}),` Cetak SPK`]}),(0,u.jsx)(`button`,{type:`button`,className:`btn-back`,onClick:()=>{let t=()=>r.visit(`/admin/services/${e.id}`);if(window.opener&&!window.opener.closed){window.close(),setTimeout(()=>{window.closed||t()},150);return}if(window.history.length>1){window.history.back();return}t()},children:`Kembali`})]}),(0,u.jsxs)(`p`,{className:`spk-hint no-print`,children:[`Kertas A4 (210 × 297 mm) · 1 lembar`,b<.999?` · disesuaikan otomatis (${Math.round(b*100)}%)`:``,`. Pilih A4, skala 100%, tanpa header/footer browser.`]}),(0,u.jsx)(`div`,{className:`spk-a4-sheet print-page`,ref:h,children:(0,u.jsx)(y,{innerRef:v,density:f,service:e,shop:t,parts:i,grandTotal:d,hidePrices:p,onLogoLoad:()=>_(h.current,v.current,x)})})]})]})}function y({innerRef:e,density:t,service:n,shop:r,parts:i,grandTotal:a,hidePrices:o,onLogoLoad:s}){let c=r?.legal_name||r?.app_name||`Berkah Teknik AC`,l=[r?.phone&&`Telp ${r.phone}`,r?.whatsapp&&`WA ${r.whatsapp}`].filter(Boolean),h=n.vehicle,g=[h?.brand,h?.model].filter(Boolean).join(` `)||`—`,_=[n.description&&{title:`Keluhan pelanggan`,body:n.description},n.work_instructions&&{title:`Instruksi kerja`,body:n.work_instructions,warn:!0},n.diagnosis&&{title:`Diagnosa teknisi`,body:n.diagnosis},n.mechanic_notes&&{title:`Catatan mekanik`,body:n.mechanic_notes}].filter(Boolean);return(0,u.jsxs)(`article`,{className:`spk-inner spk-page`,ref:e,"data-density":t,children:[(0,u.jsxs)(`header`,{className:`spk-head`,children:[(0,u.jsxs)(`div`,{className:`spk-brand`,children:[(0,u.jsx)(`img`,{src:r?.logo_url||m,alt:c,className:`spk-logo`,onLoad:s,onError:e=>{e.currentTarget.src.endsWith(m)||(e.currentTarget.src=m)}}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`div`,{className:`spk-shop`,children:c}),r?.tagline&&(0,u.jsx)(`div`,{className:`spk-tag`,children:r.tagline}),r?.address&&(0,u.jsx)(`div`,{className:`spk-meta-line`,children:r.address}),l.length>0&&(0,u.jsx)(`div`,{className:`spk-meta-line`,children:l.join(` · `)})]})]}),(0,u.jsxs)(`div`,{className:`spk-doc`,children:[(0,u.jsx)(`div`,{className:`spk-kicker`,children:`Bengkel AC Mobil`}),(0,u.jsx)(`div`,{className:`spk-title`,children:`SPK`}),(0,u.jsx)(`div`,{className:`spk-number`,children:n.spk_number}),(0,u.jsx)(`div`,{className:`spk-date`,children:f(n.spk_issued_at||n.created_at)})]})]}),(0,u.jsx)(`div`,{className:`spk-rule`}),(0,u.jsxs)(`div`,{className:`spk-facts`,children:[(0,u.jsxs)(`div`,{className:`spk-fact`,children:[(0,u.jsx)(`span`,{className:`spk-fact-label`,children:`Pelanggan`}),(0,u.jsx)(`strong`,{children:h?.customer?.name||`—`})]}),(0,u.jsxs)(`div`,{className:`spk-fact`,children:[(0,u.jsx)(`span`,{className:`spk-fact-label`,children:`Kendaraan`}),(0,u.jsxs)(`strong`,{children:[g,h?.year?` · ${h.year}`:``]})]}),(0,u.jsxs)(`div`,{className:`spk-fact`,children:[(0,u.jsx)(`span`,{className:`spk-fact-label`,children:`Plat`}),(0,u.jsx)(`strong`,{children:h?.license_plate||`—`})]}),(0,u.jsxs)(`div`,{className:`spk-fact`,children:[(0,u.jsx)(`span`,{className:`spk-fact-label`,children:`Mekanik`}),(0,u.jsx)(`strong`,{children:n.technician?.name||`Belum ditugaskan`})]}),(0,u.jsxs)(`div`,{className:`spk-fact`,children:[(0,u.jsx)(`span`,{className:`spk-fact-label`,children:`Status`}),(0,u.jsx)(`span`,{className:`status-pill`,children:p[n.status]||n.status})]})]}),(0,u.jsxs)(`div`,{className:`spk-body`,children:[(_.length>0||n.service_name)&&(0,u.jsxs)(`div`,{className:_.length>1?`spk-grid-2`:void 0,children:[(0,u.jsxs)(`div`,{className:`spk-block`,children:[(0,u.jsx)(`div`,{className:`spk-block-title`,children:`Jenis jasa`}),(0,u.jsx)(`p`,{children:(0,u.jsx)(`strong`,{children:n.service_name||`—`})}),h?.customer?.phone&&(0,u.jsxs)(`p`,{style:{marginTop:`0.6mm`,color:`#64748b`},children:[`HP: `,h.customer.phone]}),(n.is_bring_own_part===1||n.is_bring_own_part===!0)&&(0,u.jsx)(`span`,{className:`spk-chip`,children:`* Pelanggan membawa spare part sendiri`})]}),_.map(e=>(0,u.jsxs)(`div`,{className:`spk-block${e.warn?` is-warn`:``}`,children:[(0,u.jsx)(`div`,{className:`spk-block-title`,children:e.title}),(0,u.jsx)(`p`,{children:e.body})]},e.title))]}),(0,u.jsxs)(`div`,{children:[(0,u.jsxs)(`table`,{className:`spk-table`,children:[(0,u.jsx)(`thead`,{children:(0,u.jsxs)(`tr`,{children:[(0,u.jsx)(`th`,{className:`col-no`,children:`No`}),(0,u.jsx)(`th`,{children:`Spare part`}),(0,u.jsx)(`th`,{className:`col-qty`,children:`Qty`}),!o&&(0,u.jsx)(`th`,{className:`col-num`,children:`Harga`}),!o&&(0,u.jsx)(`th`,{className:`col-num`,children:`Jumlah`})]})}),(0,u.jsx)(`tbody`,{children:i.length>0?i.map((e,t)=>(0,u.jsxs)(`tr`,{children:[(0,u.jsx)(`td`,{className:`col-no`,children:t+1}),(0,u.jsx)(`td`,{style:{fontWeight:700},children:e.name}),(0,u.jsxs)(`td`,{className:`col-qty`,children:[e.pivot.quantity,e.unit?` ${e.unit}`:``]}),!o&&(0,u.jsx)(`td`,{className:`col-num`,children:d(e.pivot.unit_price)}),!o&&(0,u.jsx)(`td`,{className:`col-num`,style:{fontWeight:700},children:d(e.pivot.quantity*e.pivot.unit_price)})]},e.id||t)):(0,u.jsx)(`tr`,{children:(0,u.jsx)(`td`,{colSpan:o?3:5,className:`muted-row`,children:`Tidak ada spare part dari bengkel`})})})]}),(0,u.jsxs)(`div`,{className:`spk-total`,style:{marginTop:`1.4mm`},children:[(0,u.jsxs)(`span`,{children:[`Biaya jasa `,d(n.service_fee)]}),(0,u.jsxs)(`strong`,{children:[`Estimasi `,d(a)]})]})]}),(0,u.jsxs)(`div`,{className:`spk-grid-2`,children:[(0,u.jsxs)(`div`,{className:`spk-block`,children:[(0,u.jsx)(`div`,{className:`spk-block-title`,children:`Garansi`}),(0,u.jsxs)(`p`,{children:[(0,u.jsxs)(`strong`,{children:[n.effective_warranty_months||0,` bulan`]}),n.warranty_expires_at?` · hingga ${new Date(n.warranty_expires_at).toLocaleDateString(`id-ID`)}`:``]}),n.warranty_notes&&(0,u.jsx)(`p`,{style:{marginTop:`0.5mm`},children:n.warranty_notes})]}),(0,u.jsxs)(`div`,{className:`spk-block`,children:[(0,u.jsx)(`div`,{className:`spk-block-title`,children:`Jadwal`}),(0,u.jsxs)(`p`,{children:[`Mulai: `,f(n.started_at)]}),(0,u.jsxs)(`p`,{children:[`Selesai: `,f(n.completed_at)]})]})]})]}),(0,u.jsxs)(`div`,{className:`spk-signs`,children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`div`,{className:`spk-sign-role`,children:`Admin / Kasir`}),(0,u.jsx)(`div`,{className:`spk-sign-space`}),(0,u.jsx)(`div`,{className:`spk-sign-name`,children:r?.owner_name||`________________`}),(0,u.jsx)(`div`,{className:`spk-sign-hint`,children:`Tanda tangan`})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`div`,{className:`spk-sign-role`,children:`Mekanik`}),(0,u.jsx)(`div`,{className:`spk-sign-space`}),(0,u.jsx)(`div`,{className:`spk-sign-name`,children:n.technician?.name||`________________`}),(0,u.jsx)(`div`,{className:`spk-sign-hint`,children:`Penanggung jawab`})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`div`,{className:`spk-sign-role`,children:`Pelanggan`}),(0,u.jsx)(`div`,{className:`spk-sign-space`}),(0,u.jsx)(`div`,{className:`spk-sign-name`,children:h?.customer?.name||`________________`}),(0,u.jsx)(`div`,{className:`spk-sign-hint`,children:`Opsional`})]})]}),(0,u.jsxs)(`footer`,{className:`spk-foot`,children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`strong`,{children:`Simpan lembar ini sebagai bukti penugasan.`}),` `,`Cantumkan nomor SPK saat menangani komplain.`]}),(0,u.jsxs)(`div`,{children:[`Dicetak `,new Date().toLocaleString(`id-ID`,{dateStyle:`short`,timeStyle:`short`})]})]})]})}export{v as default};