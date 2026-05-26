import{b as A,j as e,H as _,d as z}from"./app-BjzXVvl3.js";import{P as B}from"./printer-0P6XSCBg.js";import{A as N}from"./arrow-left-DCbJ3WTY.js";import"./createLucideIcon-BoQCIFuC.js";const s=t=>`Rp ${Number(t).toLocaleString("id-ID")}`,m=t=>t?new Date(t).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}):"-";function l({title:t,children:i}){return e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsx("h3",{style:I,children:t}),i]})}const I={fontSize:"0.7rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",color:"#0f766e",marginBottom:"0.5rem",borderBottom:"1px solid #cbd5e1",paddingBottom:"0.25rem"};function a({label:t,value:i,bold:c}){return e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"0.25rem 0",borderBottom:"1px solid #f1f5f9",fontSize:"0.75rem"},children:[e.jsx("span",{style:{color:"#64748b"},children:t}),e.jsx("span",{style:{fontWeight:c?700:500,color:"#1e293b"},children:i||"-"})]})}function H({service:t,shop:i}){var g,x,p,h,f,b,u,y,j,w,S,v;const k=(((g=t.spare_parts)==null?void 0:g.reduce((n,d)=>n+d.pivot.quantity*d.pivot.unit_price,0))||0)+Number(t.service_fee||0);A.useEffect(()=>{if(new URLSearchParams(window.location.search).get("print")==="1"){const n=setTimeout(()=>window.print(),400);return()=>clearTimeout(n)}},[]);const T=()=>{const n=()=>z.visit(`/admin/services/${t.id}`);if(window.opener&&!window.opener.closed){window.close(),setTimeout(()=>{window.closed||n()},150);return}if(window.history.length>1){window.history.back();return}n()},o={padding:"0.4rem 0.5rem",textAlign:"left",borderBottom:"1.5px solid #cbd5e1",fontSize:"0.75rem",fontWeight:600,color:"#475569"},r={padding:"0.4rem 0.5rem",fontSize:"0.75rem",borderBottom:"1px solid #f1f5f9",color:"#1e293b"};return e.jsxs(e.Fragment,{children:[e.jsx(_,{title:`Invoice Servis ${t.spk_number}`}),e.jsx("style",{children:`
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
            `}),e.jsxs("div",{className:"invoice-print-shell",children:[e.jsxs("div",{className:"invoice-print-toolbar no-print",children:[e.jsxs("button",{type:"button",className:"btn-print",onClick:()=>window.print(),children:[e.jsx(B,{size:16})," Cetak Invoice"]}),e.jsxs("button",{type:"button",className:"btn-back",onClick:T,children:[e.jsx(N,{size:16})," Kembali"]})]}),e.jsx("div",{className:"invoice-print-body",children:e.jsxs("div",{className:"invoice-page",children:[t.payment_status==="lunas"&&e.jsx("div",{className:"invoice-paid-watermark","aria-hidden":!0,children:e.jsx("span",{className:"watermark-text",style:{fontSize:"4rem"},children:"LUNAS"})}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:"2.5px solid #0f766e",paddingBottom:"0.85rem",marginBottom:"1.25rem"},children:[e.jsxs("div",{children:[e.jsx("h1",{style:{margin:0,fontSize:"1.2rem",fontWeight:800,color:"#0f766e",letterSpacing:"-0.01em"},children:(i==null?void 0:i.legal_name)||(i==null?void 0:i.app_name)||"Berkah Teknik AC"}),(i==null?void 0:i.tagline)&&e.jsx("p",{style:{margin:"0.15rem 0 0",fontSize:"0.7rem",color:"#64748b"},children:i.tagline}),(i==null?void 0:i.address)&&e.jsx("p",{style:{margin:"0.35rem 0 0",fontSize:"0.68rem",color:"#64748b",maxWidth:"300px",lineHeight:1.4},children:i.address}),e.jsx("p",{style:{margin:"0.2rem 0 0",fontSize:"0.65rem",color:"#64748b"},children:[(i==null?void 0:i.phone)&&`Telp: ${i.phone}`,(i==null?void 0:i.whatsapp)&&`WA: ${i.whatsapp}`].filter(Boolean).join(" · ")})]}),e.jsxs("div",{style:{textAlign:"right"},children:[e.jsx("div",{style:{fontSize:"1.1rem",fontWeight:800,color:"#0f766e",textTransform:"uppercase",letterSpacing:"0.05em"},children:"INVOICE SERVIS"}),e.jsx("div",{style:{fontFamily:"monospace",fontSize:"0.95rem",fontWeight:700,color:"#0f766e",background:"#f0fdfa",padding:"0.25rem 0.5rem",borderRadius:"4px",display:"inline-block",marginTop:"0.25rem"},children:t.spk_number}),e.jsxs("div",{style:{fontSize:"0.68rem",color:"#64748b",marginTop:"0.35rem"},children:["ID Servis: #",String(t.id).padStart(4,"0")]})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem",marginBottom:"1rem"},children:[e.jsxs(l,{title:"Informasi Pelanggan",children:[e.jsx(a,{label:"Nama Pelanggan",value:(p=(x=t.vehicle)==null?void 0:x.customer)==null?void 0:p.name}),e.jsx(a,{label:"No. HP",value:(f=(h=t.vehicle)==null?void 0:h.customer)==null?void 0:f.phone}),e.jsx(a,{label:"Kendaraan",value:`${(b=t.vehicle)==null?void 0:b.brand} ${(u=t.vehicle)==null?void 0:u.model}`}),e.jsx(a,{label:"Plat Nomor",value:(y=t.vehicle)==null?void 0:y.license_plate,bold:!0})]}),e.jsxs(l,{title:"Detail Transaksi",children:[e.jsx(a,{label:"Tanggal Masuk",value:m(t.created_at)}),e.jsx(a,{label:"Tanggal Selesai",value:m(t.completed_at)}),e.jsx(a,{label:"Mekanik",value:(j=t.technician)==null?void 0:j.name}),e.jsx(a,{label:"Status Pembayaran",value:t.payment_status==="lunas"?"LUNAS":"BELUM LUNAS",bold:!0})]})]}),e.jsx("div",{style:{marginBottom:"1rem"},children:e.jsx(l,{title:"Pekerjaan / Keluhan",children:e.jsxs("div",{style:{background:"#f8fafc",padding:"0.75rem",borderRadius:"6px",border:"1px solid #e2e8f0"},children:[e.jsxs("div",{style:{fontSize:"0.8rem",fontWeight:700,color:"#0f766e",marginBottom:"0.25rem"},children:["Jenis Servis: ",t.service_name]}),e.jsxs("div",{style:{fontSize:"0.75rem",color:"#475569",lineHeight:1.4},children:[e.jsx("strong",{children:"Keluhan Awal:"})," ",t.description]}),t.diagnosis&&e.jsxs("div",{style:{fontSize:"0.75rem",color:"#475569",lineHeight:1.4,marginTop:"0.35rem"},children:[e.jsx("strong",{children:"Diagnosa Mekanik:"})," ",t.diagnosis]})]})})}),e.jsx(l,{title:"Rincian Suku Cadang & Biaya Jasa",children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",marginBottom:"0.75rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:o,children:"Nama Suku Cadang"}),e.jsx("th",{style:{...o,textAlign:"center",width:"3rem"},children:"Qty"}),e.jsx("th",{style:{...o,textAlign:"right",width:"7rem"},children:"Harga"}),e.jsx("th",{style:{...o,textAlign:"right",width:"8rem"},children:"Subtotal"})]})}),e.jsxs("tbody",{children:[((w=t.spare_parts)==null?void 0:w.length)>0?t.spare_parts.map((n,d)=>e.jsxs("tr",{children:[e.jsx("td",{style:r,children:n.name}),e.jsxs("td",{style:{...r,textAlign:"center"},children:[n.pivot.quantity," ",n.unit]}),e.jsx("td",{style:{...r,textAlign:"right"},children:s(n.pivot.unit_price)}),e.jsx("td",{style:{...r,textAlign:"right",fontWeight:600},children:s(n.pivot.quantity*n.pivot.unit_price)})]},d)):e.jsx("tr",{children:e.jsx("td",{colSpan:4,style:{...r,color:"#94a3b8",fontStyle:"italic",textAlign:"center",padding:"0.75rem"},children:"Tidak ada penggantian suku cadang"})}),e.jsxs("tr",{style:{background:"#f8fafc"},children:[e.jsx("td",{colSpan:3,style:{...r,textAlign:"right",fontWeight:600,borderTop:"1.5px solid #cbd5e1",color:"#475569"},children:"BIAYA JASA SERVIS"}),e.jsx("td",{style:{...r,textAlign:"right",fontWeight:600,borderTop:"1.5px solid #cbd5e1",color:"#475569"},children:s(t.service_fee)})]}),e.jsxs("tr",{style:{background:"#f0fdfa"},children:[e.jsx("td",{colSpan:3,style:{...r,textAlign:"right",fontWeight:800,fontSize:"0.85rem",color:"#0f766e",borderTop:"2px solid #0f766e"},children:"TOTAL TAGIHAN"}),e.jsx("td",{style:{...r,textAlign:"right",fontWeight:800,fontSize:"0.85rem",color:"#0f766e",borderTop:"2px solid #0f766e"},children:s(k)})]})]})]})}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:"1.5rem",marginBottom:"1.5rem",alignItems:"start"},children:[e.jsx("div",{children:e.jsx(l,{title:"Ketentuan Garansi Servis",children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.35rem",fontSize:"0.72rem",color:"#475569",lineHeight:1.45},children:[e.jsxs("div",{children:[e.jsx("strong",{children:"Masa Garansi:"})," ",t.effective_warranty_months," Bulan"]}),t.status==="selesai"&&t.warranty_expires_at&&e.jsxs("div",{children:[e.jsx("strong",{children:"Berlaku Sampai:"})," ",m(t.warranty_expires_at)]}),t.warranty_notes&&e.jsxs("div",{children:[e.jsx("strong",{children:"Catatan Garansi:"})," ",t.warranty_notes]}),(i==null?void 0:i.warranty_policy)&&e.jsx("div",{style:{marginTop:"0.35rem",fontSize:"0.65rem",color:"#64748b",background:"#f8fafc",padding:"0.5rem",borderRadius:"4px",border:"1px dashed #cbd5e1",whiteSpace:"pre-line"},children:i.warranty_policy})]})})}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",textAlign:"center",fontSize:"0.7rem",marginTop:"0.75rem"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:600,color:"#475569",marginBottom:"2.5rem"},children:"Pelanggan"}),e.jsx("div",{style:{borderTop:"1px solid #94a3b8",width:"80%",margin:"0 auto",paddingTop:"0.25rem",color:"#64748b"},children:(v=(S=t.vehicle)==null?void 0:S.customer)==null?void 0:v.name})]}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:600,color:"#475569",marginBottom:"2.5rem"},children:"Hormat Kami,"}),e.jsx("div",{style:{borderTop:"1px solid #94a3b8",width:"80%",margin:"0 auto",paddingTop:"0.25rem",color:"#64748b"},children:"Kasir / Admin"})]})]})]}),e.jsxs("div",{style:{borderTop:"1px dashed #cbd5e1",paddingTop:"0.5rem",textAlign:"center",fontSize:"0.65rem",color:"#94a3b8"},children:[(i==null?void 0:i.receipt_footer)||"Terima kasih atas kepercayaan Anda mempercayakan servis AC kendaraan Anda di Berkah Teknik.",e.jsx("br",{}),e.jsxs("span",{style:{fontSize:"0.6rem"},children:["Dicetak pada: ",new Date().toLocaleString("id-ID")]})]})]})})]})]})}export{H as default};
