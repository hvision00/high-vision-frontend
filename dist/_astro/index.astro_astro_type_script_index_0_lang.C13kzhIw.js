let p=1,f=10,m={};async function v(s=1,t=10,o={}){const a=document.getElementById("products-loading"),d=document.getElementById("products-table"),g=document.getElementById("products-error"),l=document.getElementById("products-tbody"),c=document.getElementById("pagination");if(!a||!d||!g||!l||!c){console.error("Required elements not found");return}a.classList.remove("hidden"),d.classList.add("hidden"),g.classList.add("hidden"),c.classList.add("hidden");try{const u=new URLSearchParams({page:s.toString(),limit:t.toString(),...o}),i=await fetch(`/api/admin/products?${u}`,{credentials:"include"});if(!i.ok)throw new Error(`HTTP ${i.status}: ${i.statusText}`);const r=await i.json();if(r.success&&r.data){const E=r.data,n=r.pagination;l.innerHTML=E.map(e=>`
            <div class="grid grid-cols-12 gap-4 items-center px-8 py-6 hover:bg-blue-50/50 transition-all duration-200 group">
              <!-- Product Info (4 cols) -->
              <div class="col-span-4 flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <div class="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">${e.name}</h3>
                  <p class="text-sm text-gray-500 mt-1 line-clamp-1">${e.description?e.description.substring(0,60)+"...":"Nessuna descrizione"}</p>
                </div>
              </div>
              
              <!-- Category (2 cols) -->
              <div class="col-span-2">
                <div class="text-sm font-medium text-gray-900">${e.category_name||"N/A"}</div>
                ${e.subcategory_name?`<div class="text-xs text-gray-500 mt-1">${e.subcategory_name}</div>`:""}
              </div>
              
              <!-- Status (1 col) -->
              <div class="col-span-1">
                <div class="inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-medium ${e.status==="active"?"bg-green-100 text-green-700 border border-green-200":e.status==="draft"?"bg-orange-100 text-orange-700 border border-orange-200":"bg-gray-100 text-gray-700 border border-gray-200"}">
                  <div class="w-2 h-2 rounded-full mr-2 ${e.status==="active"?"bg-green-500":e.status==="draft"?"bg-orange-500":"bg-gray-500"}"></div>
                  ${e.status==="active"?"Attivo":e.status==="draft"?"Bozza":"Altro"}
                </div>
              </div>
              
              <!-- Views (1 col) -->
              <div class="col-span-1">
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span class="text-sm font-medium text-gray-600">${e.views||0}</span>
                </div>
              </div>
              
              <!-- Date (2 cols) -->
              <div class="col-span-2">
                <div class="text-sm text-gray-600">${new Date(e.created_at).toLocaleDateString("it-IT",{day:"2-digit",month:"short",year:"numeric"})}</div>
                <div class="text-xs text-gray-400 mt-1">Creato</div>
              </div>
              
              <!-- Actions (2 cols) -->
              <div class="col-span-2 flex justify-end space-x-2">
                <button class="edit-btn flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-md" data-product-id="${e.id}">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span class="hidden sm:block">Modifica</span>
                </button>
                
                <button class="delete-btn flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-md" data-product-id="${e.id}">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span class="hidden sm:block">Elimina</span>
                </button>
              </div>
            </div>
          `).join("");const b=document.getElementById("total-products"),x=document.getElementById("active-products"),w=document.getElementById("draft-products"),B=document.getElementById("total-views");b&&(b.textContent=n.total.toString());const M=E.filter(e=>e.status==="active").length,P=E.filter(e=>e.status==="draft").length,T=E.reduce((e,N)=>e+(N.views||0),0);x&&(x.textContent=M.toString()),w&&(w.textContent=P.toString()),B&&(B.textContent=T.toString());const I=document.getElementById("showing-from"),L=document.getElementById("showing-to"),k=document.getElementById("total-products-pagination"),$=document.getElementById("page-info"),C=document.getElementById("prev-btn"),S=document.getElementById("next-btn");I&&(I.textContent=((n.page-1)*n.limit+1).toString()),L&&(L.textContent=Math.min(n.page*n.limit,n.total).toString()),k&&(k.textContent=n.total.toString()),$&&($.textContent=`Pagina ${n.page} di ${n.pages}`),C&&(C.disabled=n.page<=1),S&&(S.disabled=n.page>=n.pages),a.classList.add("hidden"),d.classList.remove("hidden"),c.classList.remove("hidden"),p=n.page,f=n.limit}else throw new Error("Invalid response format")}catch(u){console.error("Error loading products:",u),a.classList.add("hidden"),g.classList.remove("hidden")}}let h=null;function j(s,t){console.log("🚀 openDeleteModal called with:",{productId:s,productName:t}),h=s;const o=document.getElementById("delete-modal"),a=document.getElementById("delete-product-name");if(console.log("🔍 Modal elements found:",{modal:!!o,productNameEl:!!a}),!o){console.error("❌ Delete modal not found!");return}a&&(a.textContent=`"${t}"`),console.log("👁️ Showing modal..."),o.classList.remove("hidden");const d=o.querySelector(".transform");d&&(d.classList.remove("modal-enter"),d.classList.add("scale-95","opacity-0"),requestAnimationFrame(()=>{d.classList.remove("scale-95","opacity-0"),d.classList.add("modal-enter")}))}function D(){h=null,document.getElementById("delete-modal").classList.add("hidden")}window.closeDeleteModal=D;async function z(s){console.log("🚀 deleteProductById called with ID:",s);try{console.log("📡 Making DELETE request to:",`/api/admin/products/${s}`);const t=await fetch(`/api/admin/products/${s}`,{method:"DELETE",credentials:"include"});console.log("📡 Response status:",t.status,t.statusText);const o=await t.json();console.log("📡 Response data:",o),o.success?(alert("Prodotto eliminato con successo!"),v(p,f,m)):alert(`Errore nell'eliminazione: ${o.error||"Errore sconosciuto"}`)}catch(t){console.error("Error deleting product:",t);const o=t instanceof Error?t.message:"Unknown error";alert(`Errore nell'eliminazione: ${o}`)}}function y(){["body > nav","body > header nav","nav:not(.admin-nav)","[data-navbar]",".navbar:not(.admin-nav)"].forEach(t=>{document.querySelectorAll(t).forEach(a=>{a.classList.contains("admin-nav")||a.remove()})})}function A(){const s=setInterval(y,1e3);window.addEventListener("pageshow",y),window.addEventListener("popstate",y),window.addEventListener("hashchange",y),window.addEventListener("beforeunload",()=>clearInterval(s)),new MutationObserver(()=>y()).observe(document.body,{childList:!0,subtree:!0})}document.addEventListener("DOMContentLoaded",()=>{A(),v(),document.addEventListener("click",l=>{const c=l.target;console.log("🖱️ Click detected on:",c.tagName,c.className);const u=c.closest(".edit-btn"),i=c.closest(".delete-btn");if(console.log("🔍 Found buttons:",{editBtn:!!u,deleteBtn:!!i}),u){const r=u.getAttribute("data-product-id");console.log("🔧 Edit button clicked, productId:",r),r&&(console.log("🔧 Redirecting to edit page for product:",r),window.location.href=`/admin/products/edit?id=${r}`)}if(i){const r=i.getAttribute("data-product-id");if(console.log("🗑️ Delete button clicked, productId:",r),r){console.log("🗑️ Opening delete modal for product:",r);const b=i.closest(".grid")?.querySelector("h3")?.textContent||"Prodotto senza nome";console.log("🗑️ Product name found:",b),j(r,b)}}});const s=document.getElementById("search-btn");s&&s.addEventListener("click",()=>{const l=document.getElementById("search-input"),c=document.getElementById("status-filter"),u=l?.value||"",i=c?.value||"";m={},u&&(m.search=u),i&&(m.status=i),v(1,f,m)});const t=document.getElementById("retry-btn");t&&t.addEventListener("click",()=>{v(p,f,m)});const o=document.getElementById("prev-btn");o&&o.addEventListener("click",()=>{p>1&&v(p-1,f,m)});const a=document.getElementById("next-btn");a&&a.addEventListener("click",()=>{v(p+1,f,m)});const d=document.getElementById("confirm-delete-btn");d&&d.addEventListener("click",async()=>{if(console.log("🔴 Confirm delete button clicked!"),console.log("🔍 productToDelete variable:",h),h){console.log("✅ Product ID found, proceeding with deletion:",h);const l=h;D(),await z(l)}else console.error("❌ No product ID found in productToDelete variable!")});const g=document.getElementById("logout-btn");g&&g.addEventListener("click",async()=>{if(confirm("Sei sicuro di voler uscire?"))try{(await fetch("/api/auth/logout",{method:"POST",credentials:"include"})).ok?window.location.href="/admin/login":alert("Errore durante il logout")}catch(l){console.error("Logout error:",l),alert("Errore durante il logout")}})});
