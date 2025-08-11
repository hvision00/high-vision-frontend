import{$ as m,I as o,R as d,d as c,a as f,M as t,H as u,C as h,f as v}from"./core.min.DgFXtQSL.js";import"./qwik-preloader.8fLela9Y.js";const g=`
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
    `,p=({track:i})=>{const[a,r,l]=v();i(()=>l.value);const e=l.value;if(!e||!(r.pauseOnHover??!0))return;const n=()=>{a.value=!1,e.style.animationPlayState="paused"},s=()=>{a.value=!0,e.style.animationPlayState="running"};return e.addEventListener("mouseenter",n),e.addEventListener("mouseleave",s),()=>{e.removeEventListener("mouseenter",n),e.removeEventListener("mouseleave",s)}},x=i=>{const a=d(),r=d(!0);c(o(g,"s_8xXnJZV7V28")),f(o(p,"s_z631F4UaOn0",[r,i,a]));const l=[...i.partners,...i.partners],e=`slider-${i.speed??"normal"}`;return t("section",null,{class:h(n=>`relative w-full container mx-auto overflow-hidden py-[96px] ${n.className??""}`,[i])},t("div",null,{class:"max-w-7xl mx-auto "},t("div",null,{class:"relative"},[t("div",null,{class:"gradient-overlay gradient-left"},null,3,null),t("div",null,{class:"gradient-overlay gradient-right"},null,3,null),t("div",{ref:a,class:`infinite-slider ${e} gap-8`},null,l.map((n,s)=>t("div",null,{class:"partner-item flex-shrink-0 flex items-center justify-center w-48 h-24"},t("img",{src:u(n,"logo"),alt:u(n,"alt")},{class:"partner-logo max-w-full max-h-full object-contain",loading:"lazy",width:"192",height:"96"},null,3,null),1,`${n.id}-${s}`)),1,null)],1,null),1,null),1,"ce_0")},b=m(o(x,"s_FzAhCVPS6vk"));export{b as OptimizedPartnerSlider};
