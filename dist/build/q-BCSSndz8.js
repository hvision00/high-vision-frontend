import{u as _,d as o,k as c,f as p,_ as n,a as d,h as f,q as u,b as v}from"./q-DUKpa2tJ.js";import{_ as m}from"./q-Db5oOSC_.js";const g=`
      .infinite-slider {
        display: flex;
        width: fit-content;
        animation-fill-mode: both;
        backface-visibility: hidden;
        transform: translateZ(0);
        will-change: transform;
      }
      
      .slider-slow { animation: slide 60s linear infinite; }
      .slider-normal { animation: slide 30s linear infinite; }
      .slider-fast { animation: slide 15s linear infinite; }
      
      .slider-paused { animation-play-state: paused; }
      
      @keyframes slide {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }


      .partner-item {
          min-width: 120px;
          height: 40px;
        }
      
      .gradient-overlay {
        position: absolute;
        top: 0;
        height: 100%;
        width: 96px;
        pointer-events: none;
        z-index: 10;
      }
      
      .gradient-left {
        left: 0;
        background: linear-gradient(to right, white, transparent);
      }
      
      .gradient-right {
        right: 0;
        background: linear-gradient(to left, white, transparent);
      }
      
      @media (max-width: 768px) {
        .partner-item {
          min-width: 120px;
          height: 60px;
        }
      }
    `,h=Object.freeze(Object.defineProperty({__proto__:null,s_8xXnJZV7V28:g},Symbol.toStringTag,{value:"Module"})),x=({track:i})=>{const[l,s,a]=_();i(()=>a.value);const e=a.value;if(!e||!(s.pauseOnHover??!0))return;const t=()=>{l.value=!1,e.style.animationPlayState="paused"},r=()=>{l.value=!0,e.style.animationPlayState="running"};return e.addEventListener("mouseenter",t),e.addEventListener("mouseleave",r),()=>{e.removeEventListener("mouseenter",t),e.removeEventListener("mouseleave",r)}},y=Object.freeze(Object.defineProperty({__proto__:null,_hW:v,s_z631F4UaOn0:x},Symbol.toStringTag,{value:"Module"})),S=i=>{const l=o(),s=o(!0);c(u(()=>m(()=>Promise.resolve().then(()=>h),void 0),"s_8xXnJZV7V28")),p(u(()=>m(()=>Promise.resolve().then(()=>y),void 0),"s_z631F4UaOn0",[s,i,l]));const a=[...i.partners,...i.partners],e=`slider-${i.speed??"normal"}`;return n("section",null,{class:f(t=>`relative w-full container mx-auto overflow-hidden py-[96px] ${t.className??""}`,[i])},n("div",null,{class:"max-w-7xl mx-auto "},n("div",null,{class:"relative"},[n("div",null,{class:"gradient-overlay gradient-left"},null,3,null),n("div",null,{class:"gradient-overlay gradient-right"},null,3,null),n("div",{ref:l,class:`infinite-slider ${e} gap-8`},null,a.map((t,r)=>n("div",null,{class:"partner-item flex-shrink-0 flex items-center justify-center w-48 h-24"},n("img",{src:d(t,"logo"),alt:d(t,"alt")},{class:"partner-logo max-w-full max-h-full object-contain",loading:"lazy",width:"192",height:"96"},null,3,null),1,`${t.id}-${r}`)),1,null)],1,null),1,null),1,"ce_0")},P=Object.freeze(Object.defineProperty({__proto__:null,s_FzAhCVPS6vk:S},Symbol.toStringTag,{value:"Module"}));export{P as O,v as _hW,g as s_8xXnJZV7V28,S as s_FzAhCVPS6vk,x as s_z631F4UaOn0};
