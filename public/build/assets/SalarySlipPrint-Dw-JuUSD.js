import{c as e,d as t,n,o as r,t as i}from"./app-JkMmO_Pe.js";import{t as a}from"./arrow-left-6T2rf3Hy.js";import{t as o}from"./printer-s2mXRwfI.js";var s=t(e(),1),c=i(),l=[``,`Januari`,`Februari`,`Maret`,`April`,`Mei`,`Juni`,`Juli`,`Agustus`,`September`,`Oktober`,`November`,`Desember`],u=e=>`Rp ${Number(e||0).toLocaleString(`id-ID`)}`;function d(e){let t=[``,`satu`,`dua`,`tiga`,`empat`,`lima`,`enam`,`tujuh`,`delapan`,`sembilan`,`sepuluh`,`sebelas`],n=e=>{let r=Math.floor(Math.abs(Number(e)||0));return r<12?t[r]:r<20?`${n(r-10)} belas`:r<100?`${n(Math.floor(r/10))} puluh${r%10?` ${n(r%10)}`:``}`:r<200?`seratus${r%100?` ${n(r%100)}`:``}`:r<1e3?`${n(Math.floor(r/100))} ratus${r%100?` ${n(r%100)}`:``}`:r<2e3?`seribu${r%1e3?` ${n(r%1e3)}`:``}`:r<1e6?`${n(Math.floor(r/1e3))} ribu${r%1e3?` ${n(r%1e3)}`:``}`:r<1e9?`${n(Math.floor(r/1e6))} juta${r%1e6?` ${n(r%1e6)}`:``}`:r<0xe8d4a51000?`${n(Math.floor(r/1e9))} miliar${r%1e9?` ${n(r%1e9)}`:``}`:`${n(Math.floor(r/0xe8d4a51000))} triliun${r%0xe8d4a51000?` ${n(r%0xe8d4a51000)}`:``}`},r=n(e);return r?`${r.charAt(0).toUpperCase()}${r.slice(1)} rupiah`:`Nol rupiah`}function f({amount:e,bold:t=!1,empty:n=!1}){return n?(0,c.jsx)(`td`,{className:`num muted`,children:`—`}):(0,c.jsx)(`td`,{className:`num${t?` bold`:``}`,children:u(e)})}function p({salary:e,shop:t,employee:n,periodLabel:r,printedAt:i,copy:a}){let o=Number(e.pendapatan||0),s=Number(e.tunjangan_transport||0),l=Number(e.intensif_jasa||0),p=Number(e.intensif_sparepart||0),m=Number(e.potongan||0),h=o+s+l+p,g=Number(e.net_salary||0),_=t?.legal_name||t?.app_name||`Berkah Teknik AC`,v=[t?.phone&&`Telp ${t.phone}`,t?.whatsapp&&`WA ${t.whatsapp}`].filter(Boolean),y=e.paid_at?new Date(e.paid_at).toLocaleDateString(`id-ID`,{day:`numeric`,month:`short`,year:`numeric`}):null,b=n?.position?.name||{mechanic:`Mekanik`,cashier:`Kasir`,admin:`Admin`,purchasing:`Purchasing`}[n?.role]||n?.role||`—`;return(0,c.jsxs)(`article`,{className:`slip-copy`,children:[(0,c.jsxs)(`header`,{className:`slip-head`,children:[(0,c.jsxs)(`div`,{className:`slip-brand`,children:[t?.logo_url&&(0,c.jsx)(`img`,{src:t.logo_url,alt:``,className:`slip-logo`}),(0,c.jsxs)(`div`,{className:`slip-brand-text`,children:[(0,c.jsx)(`div`,{className:`shop-name`,children:_}),t?.address&&(0,c.jsx)(`div`,{className:`shop-meta`,children:t.address}),v.length>0&&(0,c.jsx)(`div`,{className:`shop-meta`,children:v.join(` · `)})]})]}),(0,c.jsxs)(`div`,{className:`slip-doc`,children:[(0,c.jsx)(`div`,{className:`doc-title`,children:`SLIP GAJI`}),(0,c.jsx)(`div`,{className:`doc-period`,children:r}),(0,c.jsx)(`div`,{className:`copy-badge copy-${a.key}`,children:a.label})]})]}),(0,c.jsx)(`table`,{className:`meta-table`,children:(0,c.jsxs)(`tbody`,{children:[(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`th`,{children:`Nama`}),(0,c.jsx)(`td`,{className:`bold`,children:n?.name||`—`}),(0,c.jsx)(`th`,{children:`Jabatan`}),(0,c.jsx)(`td`,{children:b})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`th`,{children:`No. HP`}),(0,c.jsx)(`td`,{children:n?.phone||`—`}),(0,c.jsx)(`th`,{children:`Status`}),(0,c.jsxs)(`td`,{className:`bold`,children:[e.status===`paid`?`DIBAYAR`:`DRAFT`,y?` · ${y}`:``]})]})]})}),(0,c.jsxs)(`table`,{className:`pay-table`,children:[(0,c.jsx)(`thead`,{children:(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`th`,{colSpan:2,children:`Pendapatan`}),(0,c.jsx)(`th`,{colSpan:2,children:`Potongan`})]})}),(0,c.jsxs)(`tbody`,{children:[(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`Pendapatan pokok`}),(0,c.jsx)(f,{amount:o}),(0,c.jsx)(`td`,{children:`Potongan`}),(0,c.jsx)(f,{amount:m})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`Tunjangan transport`}),(0,c.jsx)(f,{amount:s}),(0,c.jsx)(`td`,{className:`muted`}),(0,c.jsx)(f,{empty:!0})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`Intensif jasa`}),(0,c.jsx)(f,{amount:l}),(0,c.jsx)(`td`,{className:`muted`}),(0,c.jsx)(f,{empty:!0})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`Intensif sparepart`}),(0,c.jsx)(f,{amount:p}),(0,c.jsx)(`td`,{className:`muted`}),(0,c.jsx)(f,{empty:!0})]}),(0,c.jsxs)(`tr`,{className:`total-row`,children:[(0,c.jsx)(`td`,{children:`Total pendapatan`}),(0,c.jsx)(f,{amount:h,bold:!0}),(0,c.jsx)(`td`,{children:`Total potongan`}),(0,c.jsx)(f,{amount:m,bold:!0})]})]})]}),(0,c.jsxs)(`div`,{className:`net-bar`,children:[(0,c.jsx)(`span`,{children:`Gaji bersih`}),(0,c.jsx)(`strong`,{children:u(g)})]}),(0,c.jsxs)(`div`,{className:`terbilang`,children:[`Terbilang: `,(0,c.jsx)(`em`,{children:d(g)})]}),e.notes&&(0,c.jsxs)(`div`,{className:`notes`,children:[(0,c.jsx)(`span`,{children:`Catatan:`}),` `,e.notes]}),(0,c.jsxs)(`div`,{className:`signs`,children:[(0,c.jsxs)(`div`,{className:`sign`,children:[(0,c.jsx)(`div`,{className:`sign-role`,children:`Karyawan`}),(0,c.jsx)(`div`,{className:`sign-space`}),(0,c.jsx)(`div`,{className:`sign-name`,children:n?.name||`________________`})]}),(0,c.jsxs)(`div`,{className:`sign`,children:[(0,c.jsx)(`div`,{className:`sign-role`,children:`Pimpinan`}),(0,c.jsx)(`div`,{className:`sign-space`}),(0,c.jsx)(`div`,{className:`sign-name`,children:t?.owner_name||`________________`})]})]}),(0,c.jsxs)(`footer`,{className:`slip-foot`,children:[`Dicetak `,i,` · `,a.hint]})]})}function m({salary:e,shop:t}){let i=e.employee,u=`${l[e.period_month]||e.period_month} ${e.period_year}`,d=new Date().toLocaleString(`id-ID`,{dateStyle:`short`,timeStyle:`short`});(0,s.useEffect)(()=>{if(new URLSearchParams(window.location.search).get(`print`)===`1`){let e=setTimeout(()=>window.print(),400);return()=>clearTimeout(e)}},[]);let f=()=>{if(window.history.length>1){window.history.back();return}r.visit(`/admin/karyawan/gaji`)},m=[{key:`asli`,label:`ASLI · Karyawan`,hint:`Salinan karyawan`},{key:`arsip`,label:`ARSIP · Perusahaan`,hint:`Salinan arsip`}];return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Slip Gaji ${i?.name||``} - ${u}`}),(0,c.jsx)(`style`,{children:`
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
                    height: 330mm;
                    margin: 0 auto 1.25rem;
                    background: #fff;
                    box-sizing: border-box;
                    padding: 5mm 6mm;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 1px 3px rgba(15,23,42,.06), 0 14px 36px rgba(15,23,42,.08);
                }
                .slip-copy {
                    flex: 1 1 0;
                    min-height: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    font-size: 8.5pt;
                    line-height: 1.25;
                    border: 1px solid #cbd5e1;
                    padding: 3.2mm 3.6mm 2.6mm;
                }
                .slip-cut {
                    flex: 0 0 8mm;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.45rem;
                    color: #64748b;
                    font-size: 7.5pt;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }
                .slip-cut::before,
                .slip-cut::after {
                    content: '';
                    flex: 1;
                    border-top: 1px dashed #94a3b8;
                }
                .slip-head {
                    display: flex;
                    justify-content: space-between;
                    gap: 4mm;
                    align-items: flex-start;
                    border-bottom: 1.6pt solid #0f766e;
                    padding-bottom: 1.8mm;
                    margin-bottom: 2mm;
                }
                .slip-brand { display: flex; gap: 2.2mm; min-width: 0; }
                .slip-logo { width: 9.5mm; height: 9.5mm; object-fit: contain; flex-shrink: 0; }
                .shop-name { font-weight: 800; font-size: 10.5pt; color: #0f766e; line-height: 1.15; letter-spacing: -0.01em; }
                .shop-meta { font-size: 7pt; color: #64748b; line-height: 1.3; margin-top: 0.3mm; }
                .slip-doc { text-align: right; flex-shrink: 0; }
                .doc-title { font-weight: 800; font-size: 11pt; letter-spacing: 0.08em; color: #0f766e; }
                .doc-period { font-size: 8pt; font-weight: 700; color: #0f172a; margin-top: 0.4mm; }
                .copy-badge {
                    display: inline-block;
                    margin-top: 1.1mm;
                    font-size: 6.8pt;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    padding: 0.3mm 1.6mm;
                    border: 1px solid #0f766e;
                    color: #0f766e;
                }
                .copy-arsip { border-color: #b45309; color: #b45309; }
                .meta-table, .pay-table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }
                .meta-table { margin-bottom: 2mm; font-size: 8pt; }
                .meta-table th {
                    width: 16%;
                    text-align: left;
                    font-weight: 700;
                    color: #64748b;
                    padding: 0.7mm 1.4mm 0.7mm 0;
                    border-bottom: 1px solid #e2e8f0;
                    white-space: nowrap;
                }
                .meta-table td {
                    width: 34%;
                    padding: 0.7mm 1.5mm 0.7mm 0;
                    border-bottom: 1px solid #e2e8f0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .pay-table { font-size: 8pt; border: 1px solid #94a3b8; }
                .pay-table th {
                    background: #0f766e;
                    color: #fff;
                    font-size: 7.2pt;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 1mm 2mm;
                    text-align: left;
                    border-right: 1px solid #0d9488;
                }
                .pay-table th:nth-child(2) { background: #b45309; border-right: none; }
                .pay-table td {
                    padding: 0.85mm 2mm;
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
                    margin-top: 2mm;
                    background: #0f766e;
                    color: #fff;
                    padding: 1.4mm 2.4mm;
                    font-size: 8pt;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .net-bar strong { font-size: 11pt; letter-spacing: 0; }
                .terbilang {
                    font-size: 7.2pt;
                    color: #334155;
                    padding: 1mm 0 0;
                    line-height: 1.3;
                }
                .terbilang em { font-style: italic; font-weight: 700; }
                .notes {
                    margin-top: 1.4mm;
                    font-size: 7.2pt;
                    color: #475569;
                    border: 1px dashed #cbd5e1;
                    padding: 1mm 1.6mm;
                    max-height: 9mm;
                    overflow: hidden;
                }
                .notes span { font-weight: 800; color: #0f172a; }
                .signs {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8mm;
                    margin-top: auto;
                    padding-top: 3mm;
                    text-align: center;
                    min-height: 28mm;
                }
                .sign {
                    display: flex;
                    flex-direction: column;
                    min-height: 28mm;
                }
                .sign-role { font-size: 7.5pt; font-weight: 700; color: #475569; }
                .sign-space { flex: 1 1 auto; min-height: 14mm; }
                .sign-name {
                    border-top: 1px solid #334155;
                    margin: 0 auto;
                    width: 78%;
                    padding-top: 0.8mm;
                    font-size: 7.5pt;
                    font-weight: 700;
                }
                .slip-foot {
                    margin-top: 1.6mm;
                    padding-top: 1mm;
                    border-top: 1px dotted #cbd5e1;
                    font-size: 6.5pt;
                    color: #94a3b8;
                    text-align: right;
                }
                @media print {
                    .no-print { display: none !important; }
                    .slip-print-shell { background: #fff !important; min-height: 0 !important; }
                    html, body { background: #fff !important; margin: 0 !important; }
                    .slip-sheet {
                        width: 100% !important;
                        height: 320mm;
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
                    .pay-table th, .net-bar {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
                @page {
                    size: 210mm 330mm;
                    margin: 5mm 6mm !important;
                }
            `}),(0,c.jsxs)(`div`,{className:`slip-print-shell`,children:[(0,c.jsxs)(`div`,{className:`slip-toolbar no-print`,children:[(0,c.jsxs)(`button`,{type:`button`,className:`btn-print`,onClick:()=>window.print(),children:[(0,c.jsx)(o,{size:16}),` Cetak Slip Gaji`]}),(0,c.jsxs)(`button`,{type:`button`,className:`btn-back`,onClick:f,children:[(0,c.jsx)(a,{size:16}),` Kembali`]})]}),(0,c.jsx)(`p`,{className:`slip-hint no-print`,children:`Kertas F4 (210 × 330 mm) · 2 slip / lembar · pilih ukuran F4/Folio, skala 100%, tanpa header/footer browser. Potong di garis putus tengah.`}),(0,c.jsxs)(`div`,{className:`slip-sheet print-page`,children:[(0,c.jsx)(p,{salary:e,shop:t,employee:i,periodLabel:u,printedAt:d,copy:m[0]}),(0,c.jsx)(`div`,{className:`slip-cut`,children:`Potong di sini · F4 dibagi 2`}),(0,c.jsx)(p,{salary:e,shop:t,employee:i,periodLabel:u,printedAt:d,copy:m[1]})]})]})]})}export{m as default};