import{b as c,j as s}from"./app-CIqR5tLT.js";import{c as r}from"./createLucideIcon-DnszF2Gj.js";/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]],h=r("moon",d);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],g=r("sun",k),i="berkahteknik_theme";function p(){return typeof window>"u"?"dark":localStorage.getItem(i)==="light"?"light":"dark"}function l(t){const e=document.documentElement,a=t==="light"?"light":"dark";e.classList.remove("light","dark"),e.classList.add(a),e.style.colorScheme=a}function u(t){const e=t==="light"?"light":"dark";return localStorage.setItem(i,e),l(e),e}function f(t){return u(t==="dark"?"light":"dark")}function T({className:t=""}){const[e,a]=c.useState("dark");c.useEffect(()=>{const n=p();a(n),l(n)},[]);const m=()=>{const n=f(e);a(n)},o=e==="light";return s.jsx("button",{type:"button",onClick:m,className:`theme-toggle-btn ${t}`.trim(),title:o?"Aktifkan mode gelap":"Aktifkan mode cerah","aria-label":o?"Aktifkan mode gelap":"Aktifkan mode cerah",children:s.jsxs("span",{className:"theme-icon-wrap",children:[s.jsx(g,{className:"theme-icon",size:18,style:{opacity:o?1:0,transform:o?"rotate(0deg) scale(1)":"rotate(90deg) scale(0)"}}),s.jsx(h,{className:"theme-icon",size:18,style:{opacity:o?0:1,transform:o?"rotate(-90deg) scale(0)":"rotate(0deg) scale(1)"}})]})})}export{T};
