import{c as e,d as t,n,o as r,t as i}from"./app-uR0D16nR.js";import{t as a}from"./arrow-left-os4rP_o9.js";import{t as o}from"./printer-Csk6RUpD.js";var s=t(e(),1),c=i(),l=.62;function u(e,t,n){if(!e||!t)return;t.style.zoom=`1`;let r=getComputedStyle(e),i=(parseFloat(r.paddingTop)||0)+(parseFloat(r.paddingBottom)||0),a=e.clientHeight-i,o=t.scrollHeight,s=o<=a+1?1:Math.max(l,a/o);t.style.zoom=String(s),n(s)}var d=[``,`Januari`,`Februari`,`Maret`,`April`,`Mei`,`Juni`,`Juli`,`Agustus`,`September`,`Oktober`,`November`,`Desember`],f=e=>`Rp ${Number(e||0).toLocaleString(`id-ID`)}`;function p(e){let t=[``,`satu`,`dua`,`tiga`,`empat`,`lima`,`enam`,`tujuh`,`delapan`,`sembilan`,`sepuluh`,`sebelas`],n=e=>{let r=Math.floor(Math.abs(Number(e)||0));return r<12?t[r]:r<20?`${n(r-10)} belas`:r<100?`${n(Math.floor(r/10))} puluh${r%10?` ${n(r%10)}`:``}`:r<200?`seratus${r%100?` ${n(r%100)}`:``}`:r<1e3?`${n(Math.floor(r/100))} ratus${r%100?` ${n(r%100)}`:``}`:r<2e3?`seribu${r%1e3?` ${n(r%1e3)}`:``}`:r<1e6?`${n(Math.floor(r/1e3))} ribu${r%1e3?` ${n(r%1e3)}`:``}`:r<1e9?`${n(Math.floor(r/1e6))} juta${r%1e6?` ${n(r%1e6)}`:``}`:r<0xe8d4a51000?`${n(Math.floor(r/1e9))} miliar${r%1e9?` ${n(r%1e9)}`:``}`:`${n(Math.floor(r/0xe8d4a51000))} triliun${r%0xe8d4a51000?` ${n(r%0xe8d4a51000)}`:``}`},r=n(e);return r?`${r.charAt(0).toUpperCase()}${r.slice(1)} rupiah`:`Nol rupiah`}function m({amount:e,bold:t=!1,empty:n=!1}){return n?(0,c.jsx)(`td`,{className:`num muted`,children:`—`}):(0,c.jsx)(`td`,{className:`num${t?` bold`:``}`,children:f(e)})}function h({copyRef:e,innerRef:t,salary:n,shop:r,employee:i,periodLabel:a,printedAt:o,onLogoLoad:s}){let l=Number(n.pendapatan||0),u=Number(n.tunjangan_transport||0),d=Number(n.intensif_jasa||0),h=Number(n.intensif_sparepart||0),g=Number(n.bonus_reward||0),_=Number(n.potongan||0),v=Number(n.potongan_absensi||0),y=Number(n.potongan_piutang||0),b=l+u+d+h+g,x=_+v+y,S=Number(n.net_salary||0),C=r?.legal_name||r?.app_name||`Berkah Teknik AC`,w=[r?.phone&&`Telp ${r.phone}`,r?.whatsapp&&`WA ${r.whatsapp}`].filter(Boolean),T=n.paid_at?new Date(n.paid_at).toLocaleDateString(`id-ID`,{day:`numeric`,month:`short`,year:`numeric`}):null,E=i?.position?.name||{mechanic:`Mekanik`,cashier:`Kasir`,admin:`Admin`,purchasing:`Purchasing`}[i?.role]||i?.role||`—`;return(0,c.jsx)(`article`,{className:`slip-copy`,ref:e,children:(0,c.jsxs)(`div`,{className:`slip-inner`,ref:t,children:[(0,c.jsxs)(`div`,{className:`slip-main`,children:[(0,c.jsxs)(`header`,{className:`slip-head`,children:[(0,c.jsxs)(`div`,{className:`slip-brand`,children:[r?.logo_url&&(0,c.jsx)(`img`,{src:r.logo_url,alt:``,className:`slip-logo`,onLoad:s}),(0,c.jsxs)(`div`,{className:`slip-brand-text`,children:[(0,c.jsx)(`div`,{className:`shop-name`,children:C}),r?.address&&(0,c.jsx)(`div`,{className:`shop-meta`,children:r.address}),w.length>0&&(0,c.jsx)(`div`,{className:`shop-meta`,children:w.join(` · `)})]})]}),(0,c.jsxs)(`div`,{className:`slip-doc`,children:[(0,c.jsx)(`div`,{className:`doc-title`,children:`SLIP GAJI`}),(0,c.jsx)(`div`,{className:`doc-period`,children:a})]})]}),(0,c.jsx)(`table`,{className:`meta-table`,children:(0,c.jsxs)(`tbody`,{children:[(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`th`,{children:`Nama`}),(0,c.jsx)(`td`,{className:`bold`,children:i?.name||`—`}),(0,c.jsx)(`th`,{children:`Jabatan`}),(0,c.jsx)(`td`,{children:E})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`th`,{children:`No. HP`}),(0,c.jsx)(`td`,{children:i?.phone||`—`}),(0,c.jsx)(`th`,{children:`Status`}),(0,c.jsxs)(`td`,{className:`bold`,children:[n.status===`paid`?`DIBAYAR`:`DRAFT`,T?` · ${T}`:``]})]})]})}),(0,c.jsxs)(`table`,{className:`pay-table`,children:[(0,c.jsx)(`thead`,{children:(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`th`,{colSpan:2,children:`Pendapatan`}),(0,c.jsx)(`th`,{colSpan:2,children:`Potongan`})]})}),(0,c.jsxs)(`tbody`,{children:[(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`Pendapatan pokok`}),(0,c.jsx)(m,{amount:l}),(0,c.jsx)(`td`,{children:`Potongan lainnya`}),(0,c.jsx)(m,{amount:_})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`Tunjangan transport`}),(0,c.jsx)(m,{amount:u}),(0,c.jsx)(`td`,{children:`Potongan absensi`}),(0,c.jsx)(m,{amount:v})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`Intensif jasa`}),(0,c.jsx)(m,{amount:d}),(0,c.jsx)(`td`,{children:`Potongan piutang`}),(0,c.jsx)(m,{amount:y})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`Intensif sparepart`}),(0,c.jsx)(m,{amount:h}),(0,c.jsx)(`td`,{className:`muted`}),(0,c.jsx)(m,{empty:!0})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`Bonus / Reward`}),(0,c.jsx)(m,{amount:g}),(0,c.jsx)(`td`,{className:`muted`}),(0,c.jsx)(m,{empty:!0})]}),(0,c.jsxs)(`tr`,{className:`total-row`,children:[(0,c.jsx)(`td`,{children:`Total pendapatan`}),(0,c.jsx)(m,{amount:b,bold:!0}),(0,c.jsx)(`td`,{children:`Total potongan`}),(0,c.jsx)(m,{amount:x,bold:!0})]})]})]}),(0,c.jsxs)(`div`,{className:`net-bar`,children:[(0,c.jsx)(`span`,{children:`Gaji bersih`}),(0,c.jsx)(`strong`,{children:f(S)})]}),(0,c.jsxs)(`div`,{className:`terbilang`,children:[`Terbilang: `,(0,c.jsx)(`em`,{children:p(S)})]}),n.notes&&(0,c.jsxs)(`div`,{className:`notes`,children:[(0,c.jsx)(`span`,{children:`Catatan:`}),` `,n.notes]})]}),(0,c.jsxs)(`div`,{className:`slip-signoff`,children:[(0,c.jsxs)(`div`,{className:`signs`,children:[(0,c.jsxs)(`div`,{className:`sign`,children:[(0,c.jsx)(`div`,{className:`sign-role`,children:`Karyawan`}),(0,c.jsx)(`div`,{className:`sign-space`}),(0,c.jsx)(`div`,{className:`sign-name`,children:i?.name||`________________`})]}),(0,c.jsxs)(`div`,{className:`sign`,children:[(0,c.jsx)(`div`,{className:`sign-role`,children:`Pimpinan`}),(0,c.jsx)(`div`,{className:`sign-space`}),(0,c.jsx)(`div`,{className:`sign-name`,children:r?.owner_name||`________________`})]})]}),(0,c.jsxs)(`footer`,{className:`slip-foot`,children:[`Dicetak `,o]})]})]})})}function g({salary:e,shop:t}){let i=e.employee,l=`${d[e.period_month]||e.period_month} ${e.period_year}`,f=new Date().toLocaleString(`id-ID`,{dateStyle:`short`,timeStyle:`short`}),p=(0,s.useRef)(null),m=(0,s.useRef)(null),[g,_]=(0,s.useState)(1),v=()=>u(p.current,m.current,_);return(0,s.useLayoutEffect)(()=>{let e=!1,t=()=>{e||v()};return t(),document.fonts?.ready?.then(t),()=>{e=!0}},[e]),(0,s.useEffect)(()=>{if(new URLSearchParams(window.location.search).get(`print`)===`1`){let e=setTimeout(()=>window.print(),400);return()=>clearTimeout(e)}},[]),(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Slip Gaji ${i?.name||``} - ${l}`}),(0,c.jsx)(`style`,{children:`
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
            `}),(0,c.jsxs)(`div`,{className:`slip-print-shell`,children:[(0,c.jsxs)(`div`,{className:`slip-toolbar no-print`,children:[(0,c.jsxs)(`button`,{type:`button`,className:`btn-print`,onClick:()=>window.print(),children:[(0,c.jsx)(o,{size:16}),` Cetak Slip Gaji`]}),(0,c.jsxs)(`button`,{type:`button`,className:`btn-back`,onClick:()=>{if(window.history.length>1){window.history.back();return}r.visit(`/admin/karyawan/gaji`)},children:[(0,c.jsx)(a,{size:16}),` Kembali`]})]}),(0,c.jsxs)(`p`,{className:`slip-hint no-print`,children:[`Kertas A4 (210 × 297 mm) · 1 slip di setengah atas, setengah bawah kosong`,g<.999?` · disesuaikan otomatis (${Math.round(g*100)}%)`:``,`. Pilih A4, skala 100%, tanpa header/footer. Untuk slip berikutnya: balik kertas 180° lalu cetak lagi.`]}),(0,c.jsxs)(`div`,{className:`slip-sheet print-page`,children:[(0,c.jsx)(h,{copyRef:p,innerRef:m,salary:e,shop:t,employee:i,periodLabel:l,printedAt:f,onLogoLoad:v}),(0,c.jsx)(`div`,{className:`slip-cut`,children:`Potong di sini`}),(0,c.jsx)(`div`,{className:`slip-blank`,children:(0,c.jsxs)(`div`,{className:`slip-blank-hint no-print`,children:[`Kosong — untuk slip gaji berikutnya.`,(0,c.jsx)(`br`,{}),`Balik kertas 180° lalu cetak slip lain di area ini.`]})})]})]})]})}export{g as default};