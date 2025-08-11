const b="/api";let d=[],f=null,u={};async function L(){console.log("🚀 Initializing CRM contacts page...");try{await v(),S(),N()}catch(e){console.error("❌ Error initializing page:",e),w("Errore durante l'inizializzazione della pagina CRM")}}async function v(){console.log("📡 Loading contacts from API...");try{const e=new URLSearchParams;Object.keys(u).forEach(s=>{u[s]&&e.append(s,u[s])});const t=`${b}/contacts${e.toString()?"?"+e.toString():""}`;console.log("🔍 Request URL:",t);const n=await fetch(t,{credentials:"include"});if(!n.ok)throw new Error(`HTTP ${n.status}: ${n.statusText}`);const o=await n.json();if(console.log("✅ API Response:",o),o.success&&o.data)d=o.data,B(),C(),D();else throw new Error(o.error||"Formato dati non valido")}catch(e){console.error("❌ Error loading contacts:",e);const t=e instanceof Error?e.message:"Errore sconosciuto";w(`Errore nel caricamento dei contatti: ${t}`)}finally{z()}}function S(){const e=document.getElementById("search-btn"),t=document.getElementById("search-input"),n=document.getElementById("status-filter");function o(){const r=t?.value.trim()||"",c=n?.value||"";console.log("🔍 Performing search:",{search:r,status:c}),u={},r&&(u.search=r),c&&(u.status=c),v()}e&&e.addEventListener("click",o),t&&t.addEventListener("keypress",r=>{r.key==="Enter"&&o()}),n&&n.addEventListener("change",o);const s=document.getElementById("clear-filters-btn");s&&s.addEventListener("click",()=>{console.log("🧹 Clearing filters"),t&&(t.value=""),n&&(n.value=""),u={},v()});const a=document.getElementById("retry-btn");a&&a.addEventListener("click",()=>{v()});const l=document.getElementById("confirm-status-btn");l&&l.addEventListener("click",I),document.addEventListener("click",r=>{const g=r.target.closest(".manage-btn");if(g){const p=g.getAttribute("data-contact-id"),h=g.getAttribute("data-contact-name"),y=g.getAttribute("data-contact-status");p&&h&&y&&(console.log("🎯 Opening status modal for:",{contactId:p,contactName:h,contactStatus:y}),x(p,h,y))}});const i=document.getElementById("logout-btn");i&&i.addEventListener("click",async()=>{if(confirm("Sei sicuro di voler uscire?"))try{(await fetch("/api/auth/logout",{method:"POST",credentials:"include"})).ok?window.location.href="/admin/login":alert("Errore durante il logout")}catch(r){console.error("Logout error:",r),alert("Errore durante il logout")}})}async function I(){if(!f)return;const e=document.getElementById("new-status"),t=document.getElementById("status-notes");if(!e||!t)return;const n=e.value,o=t.value;if(!n){alert("⚠️ Seleziona un nuovo status");return}try{const a=await(await fetch(`${b}/contacts/${f}`,{method:"PUT",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({status:n,notes:o||void 0})})).json();a.success?(alert("✅ Status aggiornato con successo!"),E(),v()):alert(`❌ Errore: ${a.error}`)}catch(s){console.error("❌ Error updating status:",s),alert("❌ Errore nell'aggiornamento dello status")}}function x(e,t,n){console.log("🎯 Opening status modal for:",{contactId:e,contactName:t,currentStatus:n}),f=e;const o=document.getElementById("status-modal"),s=document.getElementById("status-contact-name");if(!o){console.error("❌ Status modal not found!");return}const a=document.getElementById("new-status"),l=document.getElementById("status-notes");s&&(s.textContent=`"${t}"`),a&&(a.value=n||"new"),l&&(l.value=""),console.log("👁️ Showing status modal..."),o.classList.remove("hidden");const i=o.querySelector(".transform");i&&(i.classList.remove("modal-enter"),i.classList.add("scale-95","opacity-0"),requestAnimationFrame(()=>{i.classList.remove("scale-95","opacity-0"),i.classList.add("modal-enter")}))}function E(){f=null;const e=document.getElementById("status-modal");e&&e.classList.add("hidden")}window.closeStatusModal=E;window.openStatusModal=x;function B(){const e=d.length,t=d.filter(c=>c.status==="converted").length,n=d.filter(c=>c.status==="new").length,o=new Date;o.setDate(1);const s=d.filter(c=>new Date(c.created_at)>=o).length,a=document.getElementById("total-contacts"),l=document.getElementById("converted-contacts"),i=document.getElementById("pending-contacts"),r=document.getElementById("monthly-contacts");a&&(a.textContent=e.toString()),l&&(l.textContent=t.toString()),i&&(i.textContent=n.toString()),r&&(r.textContent=s.toString())}function C(){const e=document.getElementById("contacts-list");if(e){if(d.length===0){e.innerHTML=`
          <div class="text-center py-20">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Nessun contatto trovato</h3>
            <p class="text-gray-600">Nessun cliente corrisponde ai filtri selezionati</p>
          </div>
        `;return}e.innerHTML=d.map(t=>`
        <div class="grid grid-cols-12 gap-6 items-center px-8 py-6 hover:bg-green-50/50 transition-all duration-200 group">
          <!-- Cliente Info (3 cols) -->
          <div class="col-span-3 flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <div class="w-2.5 h-2.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200 truncate">${t.name||"Cliente Anonimo"}</h3>
              <p class="text-xs text-gray-500 mt-1 truncate">${t.product_interest||"Nessun interesse specificato"}</p>
            </div>
          </div>
          
          <!-- Contatto (2 cols) -->
          <div class="col-span-2 min-w-0">
            <div class="text-sm font-medium text-gray-900 truncate">${t.email||"N/A"}</div>
            ${t.phone?`<div class="text-xs text-gray-500 mt-1 truncate">${t.phone}</div>`:'<div class="text-xs text-gray-400 mt-1">Nessun telefono</div>'}
          </div>
          
          <!-- Azienda (2 cols) -->
          <div class="col-span-2 min-w-0">
            <div class="text-sm font-medium text-gray-900 truncate">${t.company||"N/A"}</div>
            ${t.role?`<div class="text-xs text-gray-500 mt-1 truncate">${t.role}</div>`:'<div class="text-xs text-gray-400 mt-1">Nessun ruolo</div>'}
          </div>
          
          <!-- Status (2 cols) -->
          <div class="col-span-2">
            <div class="inline-flex items-center px-2.5 py-1 rounded-2xl text-xs font-medium ${$(t.status)}">
              <div class="w-2 h-2 rounded-full mr-1.5 ${k(t.status)} flex-shrink-0"></div>
              <span class="truncate">${M(t.status)}</span>
            </div>
          </div>
          
          <!-- Data (2 cols) -->
          <div class="col-span-2">
            <div class="text-sm text-gray-600">${A(t.created_at)}</div>
            <div class="text-xs text-gray-400 mt-1">Registrato</div>
          </div>
          
          <!-- Azioni (1 col) -->
          <div class="col-span-1 flex justify-end">
            <button 
              class="manage-btn flex items-center space-x-1.5 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-md text-xs"
              data-contact-id="${t.id}"
              data-contact-name="${t.name||"Cliente Anonimo"}"
              data-contact-status="${t.status}"
            >
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span class="hidden lg:block">Gestisci</span>
            </button>
          </div>
        </div>
      `).join("")}}function $(e){return{new:"bg-blue-100 text-blue-700 border border-blue-200",contacted:"bg-yellow-100 text-yellow-700 border border-yellow-200",qualified:"bg-green-100 text-green-700 border border-green-200",proposal:"bg-purple-100 text-purple-700 border border-purple-200",converted:"bg-emerald-100 text-emerald-700 border border-emerald-200",lost:"bg-red-100 text-red-700 border border-red-200",archived:"bg-gray-100 text-gray-700 border border-gray-200"}[e]||"bg-gray-100 text-gray-700 border border-gray-200"}function k(e){return{new:"bg-blue-500",contacted:"bg-yellow-500",qualified:"bg-green-500",proposal:"bg-purple-500",converted:"bg-emerald-500",lost:"bg-red-500",archived:"bg-gray-500"}[e]||"bg-gray-500"}function M(e){return{new:"Nuovo",contacted:"Contattato",qualified:"Qualificato",proposal:"Proposta",converted:"Convertito",lost:"Perso",archived:"Archiviato"}[e]||e}function A(e){try{return new Date(e).toLocaleDateString("it-IT")}catch{return"Data non valida"}}function z(){const e=document.getElementById("loading-state");e&&e.classList.add("hidden")}function w(e){const t=document.getElementById("error-message"),n=document.getElementById("error-state");t&&(t.textContent=e),n&&n.classList.remove("hidden")}function D(){const e=document.getElementById("stats-section"),t=document.getElementById("contacts-section");e&&e.classList.remove("hidden"),t&&t.classList.remove("hidden")}function m(){["body > nav","body > header nav","nav:not(.admin-nav)","[data-navbar]",".navbar:not(.admin-nav)"].forEach(t=>{document.querySelectorAll(t).forEach(o=>{o.classList.contains("admin-nav")||o.remove()})})}function N(){const e=setInterval(m,1e3);window.addEventListener("pageshow",m),window.addEventListener("popstate",m),window.addEventListener("hashchange",m),window.addEventListener("beforeunload",()=>clearInterval(e)),new MutationObserver(()=>m()).observe(document.body,{childList:!0,subtree:!0})}document.addEventListener("DOMContentLoaded",L);
