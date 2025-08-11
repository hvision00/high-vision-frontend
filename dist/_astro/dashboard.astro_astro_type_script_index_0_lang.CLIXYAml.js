const c="/api";function i(){const n=new Date().toLocaleString("it-IT",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}),e=document.getElementById("current-time");e&&(e.textContent=n)}async function u(){try{const t=await fetch(`${c}/admin/dashboard/stats`,{credentials:"include"});if(!t.ok)throw new Error(`HTTP ${t.status}: ${t.statusText}`);const n=await t.json();if(n.success&&n.data){const e=n.data;document.getElementById("total-products").textContent=e.products.total.toString(),document.getElementById("active-products").textContent=e.products.active.toString(),document.getElementById("total-contacts").textContent=e.contacts.total.toString(),document.getElementById("today-contacts").textContent=e.contacts.today.toString();const o=e.products.total>0?Math.round(e.products.active/e.products.total*100):0;document.getElementById("active-percentage").textContent=`${o}%`,g(e.topProducts),m(e.recentProducts),v(e.contacts.byStatus),console.log("✅ Dashboard loaded successfully")}}catch(t){console.error("❌ Error loading dashboard:",t);const n=t instanceof Error?t.message:"Unknown error";d(`Errore nel caricamento della dashboard: ${n}`)}}function g(t){const n=document.getElementById("top-products-list");if(!t||t.length===0){n.innerHTML='<p class="text-gray-500 text-center py-4">Nessun prodotto trovato</p>';return}n.innerHTML=t.map((e,o)=>`
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              ${o+1}
            </div>
            <div>
              <p class="font-medium text-gray-900">${e.name}</p>
              <p class="text-sm text-gray-500">${e.category_name||"Categoria non specificata"}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-gray-900">${e.views||0}</p>
            <p class="text-xs text-gray-500">visualizzazioni</p>
          </div>
        </div>
      `).join("")}function m(t){const n=document.getElementById("recent-activity");if(!t||t.length===0){n.innerHTML='<p class="text-gray-500 text-center py-4">Nessuna attività recente</p>';return}n.innerHTML=t.map(e=>{const o=new Date(e.created_at).toLocaleDateString("it-IT"),r=e.status==="active"?"green":e.status==="draft"?"yellow":"gray";return`
          <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div class="w-3 h-3 bg-${r}-500 rounded-full"></div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">${e.name}</p>
              <p class="text-sm text-gray-500">${e.category_name||"Categoria non specificata"} • ${o}</p>
            </div>
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${r}-100 text-${r}-800">
              ${e.status}
            </span>
          </div>
        `}).join("")}function v(t){const n=document.getElementById("contact-status-chart");if(!t||t.length===0){n.innerHTML='<p class="text-gray-500 text-center py-4 col-span-full">Nessun dato disponibile</p>';return}const e={new:"blue",contacted:"yellow",qualified:"green",proposal:"purple",converted:"emerald",lost:"red",archived:"gray"},o={new:"Nuovi",contacted:"Contattati",qualified:"Qualificati",proposal:"Proposta",converted:"Convertiti",lost:"Persi",archived:"Archiviati"};n.innerHTML=t.map(r=>{const s=e[r.status]||"gray",l=o[r.status]||r.status;return`
          <div class="text-center p-4 bg-${s}-50 rounded-xl border border-${s}-200">
            <div class="text-2xl font-bold text-${s}-600">${r.count}</div>
            <div class="text-sm text-${s}-700 font-medium">${l}</div>
          </div>
        `}).join("")}function d(t){const n=document.getElementById("dashboard-content");n&&(n.innerHTML=`
          <div class="text-center py-12">
            <div class="text-red-500 text-xl mb-4">⚠️ Errore</div>
            <p class="text-gray-600">${t}</p>
            <button onclick="location.reload()" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Riprova
            </button>
          </div>
        `,n.classList.remove("hidden"))}async function p(){try{(await fetch(`${c}/auth/logout`,{method:"POST",credentials:"include"})).ok?(console.log("✅ Logout successful"),window.location.href="/admin/login"):(console.error("❌ Logout failed"),alert("Errore durante il logout"))}catch(t){console.error("❌ Logout error:",t);const n=t instanceof Error?t.message:"Unknown error";alert(`Errore durante il logout: ${n}`)}}function a(){["body > nav","body > header nav","nav:not(.admin-nav)","[data-navbar]",".navbar:not(.admin-nav)"].forEach(n=>{document.querySelectorAll(n).forEach(o=>{o.classList.contains("admin-nav")||o.remove()})})}function y(){const t=setInterval(a,1e3);window.addEventListener("pageshow",a),window.addEventListener("popstate",a),window.addEventListener("hashchange",a),window.addEventListener("beforeunload",()=>clearInterval(t)),new MutationObserver(()=>{a()}).observe(document.body,{childList:!0,subtree:!0})}document.addEventListener("DOMContentLoaded",async()=>{a(),setTimeout(a,100),setTimeout(a,500),setTimeout(a,1e3),y(),i(),setInterval(i,6e4),document.getElementById("logout-btn").addEventListener("click",()=>{confirm("Sei sicuro di voler uscire?")&&p()});try{await u(),document.getElementById("loading-state").classList.add("hidden"),document.getElementById("dashboard-content").classList.remove("hidden")}catch(t){console.error("Dashboard initialization failed:",t),document.getElementById("loading-state").classList.add("hidden"),d("Impossibile caricare la dashboard")}});
