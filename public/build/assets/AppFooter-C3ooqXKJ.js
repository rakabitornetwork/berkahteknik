import{e as o,j as e}from"./app-DnSqvOSs.js";import{c as t}from"./createLucideIcon-5_BrP7ks.js";/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s=[["path",{d:"M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z",key:"484a7f"}],["path",{d:"M12 12v.01",key:"u5ubse"}]],c=t("fan",s);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],d=t("mail",p);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],m=t("map-pin",h);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]],g=t("message-circle",x);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]],y=t("phone",f);function _({variant:l="default",collapsed:r=!1,className:n=""}){const a=o().props.shop||{},i=a.short_name||a.app_name||"AC Berkah";return l==="portal"?e.jsxs("div",{className:`company-branding company-branding--portal ${n}`.trim(),style:{display:"flex",alignItems:"center",gap:"0.75rem"},children:[a.logo_url?e.jsx("img",{src:a.logo_url,alt:i,style:{width:36,height:36,borderRadius:10,objectFit:"contain"}}):e.jsx("div",{style:{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:"0.9rem"},children:"AC"}),e.jsx("span",{style:{fontWeight:700,fontSize:"1.1rem",color:"var(--color-text-main)"},children:i})]}):e.jsxs("div",{className:`company-branding ${n}`.trim(),style:{display:"flex",alignItems:"center",gap:"0.75rem",overflow:"hidden"},children:[a.logo_url?e.jsx("img",{src:a.logo_url,alt:i,style:{width:28,height:28,borderRadius:6,objectFit:"contain",flexShrink:0}}):e.jsx("span",{style:{color:"#fbbf24",flexShrink:0,display:"flex",alignItems:"center"},children:e.jsx(c,{size:22,strokeWidth:2.5})}),!r&&e.jsx("span",{style:{fontWeight:700,fontSize:"1rem",color:"var(--color-sidebar-active-text)",whiteSpace:"nowrap"},children:i})]})}function v({variant:l="portal"}){const r=o().props.shop||{},n=new Date().getFullYear(),a=r.footer_text||`© ${n} ${r.legal_name||r.app_name||"Berkah Teknik AC"}`;return l==="admin"?e.jsx("footer",{className:"app-footer app-footer--admin",style:{borderTop:"1px solid var(--color-border)",padding:"0.75rem 1rem",fontSize:"0.75rem",color:"var(--color-text-muted)",textAlign:"center"},children:a}):e.jsx("footer",{className:"app-footer",style:{borderTop:"1px solid var(--color-border)",padding:"1.5rem",color:"var(--color-text-muted)",fontSize:"0.8rem"},children:e.jsxs("div",{style:{maxWidth:960,margin:"0 auto",display:"flex",flexDirection:"column",gap:"0.75rem",alignItems:"center",textAlign:"center"},children:[e.jsx("div",{style:{fontWeight:600,color:"var(--color-text-main)"},children:r.legal_name||r.app_name}),r.tagline&&e.jsx("p",{style:{margin:0},children:r.tagline}),e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"1rem",justifyContent:"center"},children:[r.address&&e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[e.jsx(m,{size:14}),r.maps_url?e.jsx("a",{href:r.maps_url,target:"_blank",rel:"noreferrer",style:{color:"inherit"},children:r.address}):r.address]}),r.phone&&e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[e.jsx(y,{size:14})," ",r.phone]}),r.whatsapp_url&&e.jsxs("a",{href:r.whatsapp_url,target:"_blank",rel:"noreferrer",style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",color:"inherit"},children:[e.jsx(g,{size:14})," WhatsApp"]}),r.email&&e.jsxs("a",{href:`mailto:${r.email}`,style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",color:"inherit"},children:[e.jsx(d,{size:14})," ",r.email]})]}),e.jsx("p",{style:{margin:0},children:a})]})})}export{v as A,_ as C,d as M,y as P,m as a,g as b};
