import{c as e,d as t,n,o as r,t as i}from"./app-BRyhfRXd.js";import{t as a}from"./arrow-left-TFqYiRED.js";import{t as o}from"./printer-C4kfleXc.js";import{n as s,r as c,t as l}from"./printPriceVisibility-CssKXNd_.js";var u=t(e(),1),d=i(),f=e=>`Rp ${Number(e).toLocaleString(`id-ID`)}`,p=e=>e?new Date(e).toLocaleDateString(`id-ID`,{day:`numeric`,month:`long`,year:`numeric`}):`-`;function m({title:e,children:t}){return(0,d.jsxs)(`div`,{style:{marginBottom:`1rem`},children:[(0,d.jsx)(`h3`,{style:h,children:e}),t]})}var h={fontSize:`0.7rem`,fontWeight:700,textTransform:`uppercase`,letterSpacing:`0.05em`,color:`#0f766e`,marginBottom:`0.5rem`,borderBottom:`1px solid #cbd5e1`,paddingBottom:`0.25rem`};function g({label:e,value:t,bold:n}){return(0,d.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,padding:`0.25rem 0`,borderBottom:`1px solid #f1f5f9`,fontSize:`0.75rem`},children:[(0,d.jsx)(`span`,{style:{color:`#64748b`},children:e}),(0,d.jsx)(`span`,{style:{fontWeight:n?700:500,color:`#1e293b`},children:t||`-`})]})}var _={cash:`Tunai`,transfer:`Transfer Bank`,qris:`QRIS`};function v({service:e,shop:t}){let[i,h]=(0,u.useState)(()=>l()),v=e.spare_parts?.reduce((e,t)=>e+t.pivot.quantity*t.pivot.unit_price,0)||0,y=v+Number(e.service_fee||0),b=e.payments||[],x=b.reduce((e,t)=>e+Number(t.amount||0),0),S=Math.max(0,x-y),C=b[b.length-1],w=_[C?.payment_method]||C?.payment_method||`Tunai`;(0,u.useEffect)(()=>{s(i)},[i]),(0,u.useEffect)(()=>{if(new URLSearchParams(window.location.search).get(`print`)===`1`){let e=setTimeout(()=>window.print(),400);return()=>clearTimeout(e)}},[]);let T=()=>{let t=()=>r.visit(`/admin/services/${e.id}`);if(window.opener&&!window.opener.closed){window.close(),setTimeout(()=>{window.closed||t()},150);return}if(window.history.length>1){window.history.back();return}t()},E={padding:`0.4rem 0.5rem`,textAlign:`left`,borderBottom:`1.5px solid #cbd5e1`,fontSize:`0.75rem`,fontWeight:600,color:`#475569`},D={padding:`0.4rem 0.5rem`,fontSize:`0.75rem`,borderBottom:`1px solid #f1f5f9`,color:`#1e293b`};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(n,{title:`Invoice Servis ${e.spk_number}`}),(0,d.jsx)(`style`,{children:`
                .invoice-print-shell {
                    min-height: 100vh;
                    background: #f8fafc;
                    font-family: 'Inter', system-ui, sans-serif;
                }
                .invoice-print-toolbar {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    max-width: 210mm;
                    margin: 0 auto;
                }
                .invoice-print-toolbar button {
                    font-size: 0.8rem;
                    padding: 0.45rem 1.1rem;
                    border-radius: 8px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-weight: 500;
                }
                .invoice-print-toolbar .btn-print {
                    border: none;
                    background: #0f766e;
                    color: white;
                }
                .invoice-print-toolbar .btn-back {
                    background: white;
                    border: 1px solid #cbd5e1;
                    color: #334155;
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
                .invoice-print-body {
                    padding: 0 1rem 1.5rem;
                    max-width: calc(210mm + 2rem);
                    margin: 0 auto;
                }
                .invoice-page {
                    max-width: 210mm;
                    margin: 0 auto;
                    background: white;
                    padding: 2rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 10px 30px rgba(0,0,0,0.03);
                    position: relative;
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
                .watermark-text {
                    transform: rotate(-25deg);
                    fontSize: 4.5rem;
                    font-weight: 900;
                    letter-spacing: 0.2em;
                    color: rgba(22, 163, 74, 0.13);
                    border: 4px solid rgba(22, 163, 74, 0.25);
                    border-radius: 12px;
                    padding: 0.2em 0.5em;
                    user-select: none;
                    white-space: nowrap;
                }
                @media print {
                    .no-print { display: none !important; }
                    .invoice-print-shell { background: white !important; min-height: auto !important; }
                    html, body { background: white !important; margin: 0 !important; }
                    .invoice-page { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; padding: 0 !important; }
                }
                @page { margin: 10mm; }
            `}),(0,d.jsxs)(`div`,{className:`invoice-print-shell`,children:[(0,d.jsxs)(`div`,{className:`invoice-print-toolbar no-print`,children:[(0,d.jsx)(c,{checked:i,onChange:h}),(0,d.jsxs)(`button`,{type:`button`,className:`btn-print`,onClick:()=>window.print(),children:[(0,d.jsx)(o,{size:16}),` Cetak Invoice`]}),(0,d.jsxs)(`button`,{type:`button`,className:`btn-back`,onClick:T,children:[(0,d.jsx)(a,{size:16}),` Kembali`]})]}),(0,d.jsx)(`div`,{className:`invoice-print-body`,children:(0,d.jsxs)(`div`,{className:`invoice-page`,children:[e.payment_status===`lunas`&&(0,d.jsx)(`div`,{className:`invoice-paid-watermark`,"aria-hidden":!0,children:(0,d.jsx)(`span`,{className:`watermark-text`,style:{fontSize:`4rem`},children:`LUNAS`})}),(0,d.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,borderBottom:`2.5px solid #0f766e`,paddingBottom:`0.85rem`,marginBottom:`1.25rem`},children:[(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`h1`,{style:{margin:0,fontSize:`1.2rem`,fontWeight:800,color:`#0f766e`,letterSpacing:`-0.01em`},children:t?.legal_name||t?.app_name||`Berkah Teknik AC`}),t?.tagline&&(0,d.jsx)(`p`,{style:{margin:`0.15rem 0 0`,fontSize:`0.7rem`,color:`#64748b`},children:t.tagline}),t?.address&&(0,d.jsx)(`p`,{style:{margin:`0.35rem 0 0`,fontSize:`0.68rem`,color:`#64748b`,maxWidth:`300px`,lineHeight:1.4},children:t.address}),(0,d.jsx)(`p`,{style:{margin:`0.2rem 0 0`,fontSize:`0.65rem`,color:`#64748b`},children:[t?.phone&&`Telp: ${t.phone}`,t?.whatsapp&&`WA: ${t.whatsapp}`].filter(Boolean).join(` · `)})]}),(0,d.jsxs)(`div`,{style:{textAlign:`right`},children:[(0,d.jsx)(`div`,{style:{fontSize:`1.1rem`,fontWeight:800,color:`#0f766e`,textTransform:`uppercase`,letterSpacing:`0.05em`},children:`INVOICE SERVIS`}),(0,d.jsx)(`div`,{style:{fontFamily:`monospace`,fontSize:`0.95rem`,fontWeight:700,color:`#0f766e`,background:`#f0fdfa`,padding:`0.25rem 0.5rem`,borderRadius:`4px`,display:`inline-block`,marginTop:`0.25rem`},children:e.spk_number}),(0,d.jsxs)(`div`,{style:{fontSize:`0.68rem`,color:`#64748b`,marginTop:`0.35rem`},children:[`ID Servis: #`,String(e.id).padStart(4,`0`)]})]})]}),(0,d.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`1.5rem`,marginBottom:`1rem`},children:[(0,d.jsxs)(m,{title:`Informasi Pelanggan`,children:[(0,d.jsx)(g,{label:`Nama Pelanggan`,value:e.vehicle?.customer?.name}),(0,d.jsx)(g,{label:`No. HP`,value:e.vehicle?.customer?.phone}),(0,d.jsx)(g,{label:`Kendaraan`,value:`${e.vehicle?.brand} ${e.vehicle?.model}`}),(0,d.jsx)(g,{label:`Plat Nomor`,value:e.vehicle?.license_plate,bold:!0}),(0,d.jsx)(g,{label:`Warna`,value:e.vehicle?.color_name||e.vehicle?.color||`-`})]}),(0,d.jsxs)(m,{title:`Detail Transaksi`,children:[(0,d.jsx)(g,{label:`Tanggal Masuk`,value:p(e.created_at)}),(0,d.jsx)(g,{label:`Tanggal Selesai`,value:p(e.completed_at)}),(0,d.jsx)(g,{label:`Mekanik`,value:e.technician?.name}),(0,d.jsx)(g,{label:`Status Pembayaran`,value:e.payment_status===`lunas`?`LUNAS`:`BELUM LUNAS`,bold:!0})]})]}),(0,d.jsx)(`div`,{style:{marginBottom:`1rem`},children:(0,d.jsx)(m,{title:`Pekerjaan / Keluhan`,children:(0,d.jsxs)(`div`,{style:{background:`#f8fafc`,padding:`0.75rem`,borderRadius:`6px`,border:`1px solid #e2e8f0`},children:[(0,d.jsxs)(`div`,{style:{fontSize:`0.8rem`,fontWeight:700,color:`#0f766e`,marginBottom:`0.25rem`},children:[`Jenis Servis: `,e.service_name]}),(0,d.jsxs)(`div`,{style:{fontSize:`0.75rem`,color:`#475569`,lineHeight:1.4},children:[(0,d.jsx)(`strong`,{children:`Keluhan Awal:`}),` `,e.description]}),e.diagnosis&&(0,d.jsxs)(`div`,{style:{fontSize:`0.75rem`,color:`#475569`,lineHeight:1.4,marginTop:`0.35rem`},children:[(0,d.jsx)(`strong`,{children:`Diagnosa Mekanik:`}),` `,e.diagnosis]})]})})}),(0,d.jsx)(m,{title:`Item Sparepart`,children:(0,d.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,marginBottom:`0.75rem`},children:[(0,d.jsx)(`thead`,{children:(0,d.jsxs)(`tr`,{children:[(0,d.jsx)(`th`,{style:E,children:`Nama Sparepart`}),(0,d.jsx)(`th`,{style:{...E,textAlign:`center`,width:`3rem`},children:`Qty`}),!i&&(0,d.jsx)(`th`,{style:{...E,textAlign:`right`,width:`7rem`},children:`Harga`}),!i&&(0,d.jsx)(`th`,{style:{...E,textAlign:`right`,width:`7.5rem`},children:`Subtotal`})]})}),(0,d.jsx)(`tbody`,{children:e.spare_parts?.length>0?e.spare_parts.map((e,t)=>(0,d.jsxs)(`tr`,{children:[(0,d.jsx)(`td`,{style:D,children:e.name}),(0,d.jsxs)(`td`,{style:{...D,textAlign:`center`},children:[e.pivot.quantity,` `,e.unit]}),!i&&(0,d.jsx)(`td`,{style:{...D,textAlign:`right`},children:f(e.pivot.unit_price)}),!i&&(0,d.jsx)(`td`,{style:{...D,textAlign:`right`,fontWeight:600},children:f(e.pivot.quantity*e.pivot.unit_price)})]},t)):(0,d.jsx)(`tr`,{children:(0,d.jsx)(`td`,{colSpan:i?2:4,style:{...D,color:`#94a3b8`,fontStyle:`italic`,textAlign:`center`,padding:`0.75rem`},children:`Tidak ada penggantian sparepart`})})})]})}),(0,d.jsx)(m,{title:`Item Pengerjaan`,children:(0,d.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,marginBottom:`0.75rem`},children:[(0,d.jsx)(`thead`,{children:(0,d.jsxs)(`tr`,{children:[(0,d.jsx)(`th`,{style:E,children:`Nama Pengerjaan`}),(0,d.jsx)(`th`,{style:{...E,textAlign:`center`,width:`3rem`},children:`Qty`}),(0,d.jsx)(`th`,{style:{...E,textAlign:`center`,width:`3.5rem`},children:`Satuan`})]})}),(0,d.jsx)(`tbody`,{children:e.work_items?.length>0?e.work_items.map((e,t)=>(0,d.jsxs)(`tr`,{children:[(0,d.jsx)(`td`,{style:D,children:e.name}),(0,d.jsx)(`td`,{style:{...D,textAlign:`center`},children:e.quantity}),(0,d.jsx)(`td`,{style:{...D,textAlign:`center`,fontFamily:`monospace`,fontWeight:700},children:e.unit||`JOB`})]},e.id||t)):(0,d.jsx)(`tr`,{children:(0,d.jsx)(`td`,{colSpan:3,style:{...D,color:`#94a3b8`,fontStyle:`italic`,textAlign:`center`,padding:`0.75rem`},children:`Tidak ada item pengerjaan`})})})]})}),(0,d.jsxs)(m,{title:`Jasa`,children:[(0,d.jsxs)(`div`,{style:{background:`#f8fafc`,padding:`0.65rem 0.75rem`,borderRadius:`6px`,border:`1px solid #e2e8f0`,marginBottom:`0.75rem`},children:[(0,d.jsx)(`div`,{style:{fontSize:`0.75rem`,color:`#64748b`,marginBottom:`0.15rem`},children:`Jenis Jasa`}),(0,d.jsx)(`div`,{style:{fontSize:`0.85rem`,fontWeight:700,color:`#0f766e`},children:e.service_name||`-`})]}),(0,d.jsx)(`table`,{style:{width:`100%`,borderCollapse:`collapse`},children:(0,d.jsxs)(`tbody`,{children:[!i&&(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)(`tr`,{children:[(0,d.jsx)(`td`,{style:{...D,textAlign:`right`,color:`#64748b`},children:`Subtotal Sparepart`}),(0,d.jsx)(`td`,{style:{...D,textAlign:`right`,width:`8rem`},children:f(v)})]}),(0,d.jsxs)(`tr`,{children:[(0,d.jsx)(`td`,{style:{...D,textAlign:`right`,color:`#64748b`},children:`Biaya Jasa`}),(0,d.jsx)(`td`,{style:{...D,textAlign:`right`},children:f(e.service_fee)})]})]}),(0,d.jsxs)(`tr`,{style:{background:`#f0fdfa`},children:[(0,d.jsx)(`td`,{style:{...D,textAlign:`right`,fontWeight:800,fontSize:`0.85rem`,color:`#0f766e`,borderTop:`2px solid #0f766e`},children:`TOTAL`}),(0,d.jsx)(`td`,{style:{...D,textAlign:`right`,fontWeight:800,fontSize:`0.85rem`,color:`#0f766e`,borderTop:`2px solid #0f766e`,width:`8rem`},children:f(y)})]}),x>0&&(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)(`tr`,{children:[(0,d.jsx)(`td`,{style:{...D,textAlign:`right`,color:`#475569`},children:w}),(0,d.jsx)(`td`,{style:{...D,textAlign:`right`},children:f(x)})]}),(0,d.jsxs)(`tr`,{children:[(0,d.jsx)(`td`,{style:{...D,textAlign:`right`,color:`#475569`},children:`Kembali`}),(0,d.jsx)(`td`,{style:{...D,textAlign:`right`},children:f(S)})]})]})]})})]}),(0,d.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1.5fr 1fr`,gap:`1.5rem`,marginBottom:`1.5rem`,alignItems:`start`},children:[(0,d.jsx)(`div`,{children:(0,d.jsx)(m,{title:`Ketentuan Garansi Servis`,children:(0,d.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.35rem`,fontSize:`0.72rem`,color:`#475569`,lineHeight:1.45},children:[(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`strong`,{children:`Masa Garansi:`}),` `,e.effective_warranty_months,` Bulan`]}),e.status===`selesai`&&e.warranty_expires_at&&(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`strong`,{children:`Berlaku Sampai:`}),` `,p(e.warranty_expires_at)]}),e.warranty_notes&&(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`strong`,{children:`Catatan Garansi:`}),` `,e.warranty_notes]}),t?.warranty_policy&&(0,d.jsx)(`div`,{style:{marginTop:`0.35rem`,fontSize:`0.65rem`,color:`#64748b`,background:`#f8fafc`,padding:`0.5rem`,borderRadius:`4px`,border:`1px dashed #cbd5e1`,whiteSpace:`pre-line`},children:t.warranty_policy})]})})}),(0,d.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`1rem`,textAlign:`center`,fontSize:`0.7rem`,marginTop:`0.75rem`},children:[(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`div`,{style:{fontWeight:600,color:`#475569`,marginBottom:`2.5rem`},children:`Pelanggan`}),(0,d.jsx)(`div`,{style:{borderTop:`1px solid #94a3b8`,width:`80%`,margin:`0 auto`,paddingTop:`0.25rem`,color:`#64748b`},children:e.vehicle?.customer?.name})]}),(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`div`,{style:{fontWeight:600,color:`#475569`,marginBottom:`2.5rem`},children:`Hormat Kami,`}),(0,d.jsx)(`div`,{style:{borderTop:`1px solid #94a3b8`,width:`80%`,margin:`0 auto`,paddingTop:`0.25rem`,color:`#64748b`},children:`Kasir / Admin`})]})]})]}),(0,d.jsxs)(`div`,{style:{borderTop:`1px dashed #cbd5e1`,paddingTop:`0.5rem`,textAlign:`center`,fontSize:`0.65rem`,color:`#94a3b8`},children:[t?.receipt_footer||`Terima kasih atas kepercayaan Anda mempercayakan servis AC kendaraan Anda di Berkah Teknik.`,(0,d.jsx)(`br`,{}),(0,d.jsxs)(`span`,{style:{fontSize:`0.6rem`},children:[`Dicetak pada: `,new Date().toLocaleString(`id-ID`)]})]})]})})]})]})}export{v as default};