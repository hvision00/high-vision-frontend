// frontend/src/components/Catalogo/CleanCatalog.tsx
import { component$, useSignal, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import { apiClient } from '../../lib/api';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  productInterest: string;
}

export const CleanCatalog = component$(() => {
  // ===== STATI PRINCIPALI =====
  const categories = useSignal<any[]>([]);
  const subcategories = useSignal<any[]>([]);
  const products = useSignal<any[]>([]);
  const loading = useSignal(true);
  const error = useSignal('');
  
  const navigationState = useStore({
    activeView: 'categories' as 'categories' | 'subcategories' | 'products',
    selectedCategory: null as any,
    selectedSubcategory: null as any,
    selectedProduct: null as any
  });

  // ===== STATI MODALI =====
  const showProductModal = useSignal(false);
  const showContactModal = useSignal(false);
  const contactFormLoading = useSignal(false);
  const contactFormSuccess = useSignal(false);
  const contactFormError = useSignal('');

  // ===== FORM DI CONTATTO =====
  const contactForm = useStore<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    productInterest: ''
  });

  // ===== CARICAMENTO CATEGORIE =====
  useVisibleTask$(async () => {
    try {
      const response = await apiClient.getCategories();
      
      if (response.success && response.data) {
        // Filtro solo le 4 categorie principali
        const mainCategoryIds = [
          'immagine',                        // Immagine & Comunicazione
          'sicurezza',                       // Sicurezza & Protezione
          'e6nbi7xju9xa5rnz5p9sjwgl',       // Formazione & Consulenza
          'sxrgfywyk7ac25hch1r4ppzl'        // Industria & Attrezzature
        ];
        
        const filteredCategories = response.data.filter((cat: any) => 
          mainCategoryIds.includes(cat.id)
        );
        
        categories.value = filteredCategories;
        console.log('✅ Categorie principali filtrate:', filteredCategories.length, filteredCategories.map(c => c.name));
      } else {
        error.value = response.error || 'Errore nel caricamento categorie';
      }
    } catch (err) {
      console.error('❌ Errore caricamento categorie:', err);
      error.value = err instanceof Error ? err.message : 'Errore sconosciuto';
    } finally {
      loading.value = false;
    }
  });

  // ===== FUNZIONI DI NAVIGAZIONE =====
  const selectCategory = $(async (category: any) => {
    navigationState.selectedCategory = category;
    navigationState.activeView = 'subcategories';
    
    loading.value = true;
    try {
      const response = await apiClient.getSubcategories(category.id);
      
      if (response.success && response.data) {
        subcategories.value = response.data;
      } else {
        error.value = response.error || 'Errore nel caricamento sottocategorie';
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Errore sconosciuto';
    } finally {
      loading.value = false;
    }
  });

  const selectSubcategory = $(async (subcategory: any) => {
    navigationState.selectedSubcategory = subcategory;
    navigationState.activeView = 'products';
    
    loading.value = true;
    try {
      const response = await apiClient.getProducts(subcategory.id);
      
      if (response.success && response.data) {
        const productsData = response.data.data || response.data;
        products.value = productsData;
      } else {
        error.value = response.error || 'Errore nel caricamento prodotti';
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Errore sconosciuto';
    } finally {
      loading.value = false;
    }
  });

  const backToCategories = $(() => {
    navigationState.activeView = 'categories';
    navigationState.selectedCategory = null;
    navigationState.selectedSubcategory = null;
    error.value = '';
  });

  const backToSubcategories = $(() => {
    navigationState.activeView = 'subcategories';
    navigationState.selectedSubcategory = null;
    error.value = '';
  });

  // ===== FUNZIONI MODALI =====
  const openProductModal = $((product: any) => {
    navigationState.selectedProduct = product;
    showProductModal.value = true;
  });

  const closeProductModal = $(() => {
    showProductModal.value = false;
    navigationState.selectedProduct = null;
  });

  const openContactModal = $((product: any) => {
    contactForm.productInterest = product.name;
    navigationState.selectedProduct = product;
    showContactModal.value = true;
    contactFormSuccess.value = false;
    contactFormError.value = '';
  });

  const closeContactModal = $(() => {
    showContactModal.value = false;
    contactFormSuccess.value = false;
    contactFormError.value = '';
    Object.keys(contactForm).forEach(key => {
      (contactForm as any)[key] = '';
    });
  });

  // ===== SUBMIT FORM CONTATTO =====
  const submitContactForm = $(async () => {
    contactFormLoading.value = true;
    contactFormError.value = '';

    try {
      if (!contactForm.name.trim() || !contactForm.email.trim()) {
        throw new Error('Nome ed email sono obbligatori');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
        throw new Error('Email non valida');
      }

      const contactData = {
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        phone: contactForm.phone?.trim() || undefined,
        company: contactForm.company?.trim() || undefined,
        message: contactForm.message.trim(),
        product_interest: contactForm.productInterest?.trim() || undefined,
        gdpr_consent: true,
        marketing_consent: false,
        source: 'catalog'
      };

      const response = await apiClient.submitContact(contactData);
      
      if (response.success) {
        contactFormSuccess.value = true;
      } else {
        throw new Error(response.error || 'Errore nell\'invio del form');
      }
      
    } catch (error) {
      contactFormError.value = error instanceof Error ? error.message : 'Errore sconosciuto';
    } finally {
      contactFormLoading.value = false;
    }
  });

  // ===== HELPER PER IMMAGINI =====
  const getCategoryImage = (category: any) => {
    const imageMap: Record<string, string> = {
      'immagine': '/images/hero-immagine.jpg',
      'industria': '/images/hero-industria.jpg',
      'formazione': '/images/hero-formazione.jpg',
      'sicurezza': '/images/hero-sicurezza.jpg'
    };
    
    return category.image_url || imageMap[category.slug] || imageMap[category.id] || '/images/hero-industria.jpg';
  };

  const getProductImage = (product: any) => {
    if (product.image) return product.image;
    if (product.image_url) return product.image_url;
    
    const categorySlug = navigationState.selectedCategory?.slug || navigationState.selectedCategory?.id;
    const imageMap: Record<string, string> = {
      'immagine': '/images/prodotti/immagine/sviluppo-web.jpg',
      'sicurezza': '/images/prodotti/sicurezza/antinfortunistica.jpg', 
      'industria': '/images/prodotti/industria/scaffalature-industriali.jpg',
      'formazione': '/images/prodotti/formazione/corsi-di-sicurezza.jpg'
    };
    
    return imageMap[categorySlug] || '/images/product-slide-1.jpg';
  };

  return (
    <div class="w-full">
      
      {/* ===== HEADER COMPATTO CON NAVIGAZIONE INTEGRATA ===== */}
      <section class="relative bg-gradient-to-r from-brand to-brand-dark text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          
          {/* Header principale o navigazione */}
          {!navigationState.selectedCategory && !navigationState.selectedSubcategory ? (
            // Header iniziale
            <div class="text-center">
              <h1 class="text-2xl md:text-4xl font-telegraf font-light mb-3">
                Catalogo Servizi Professionali
              </h1>
                                        <p class="text-white/90 max-w-2xl mx-auto mb-6">
                Quattro aree specializzate per supportare il tuo business
              </p>
              
              {/* Trust indicators compatti */}
              <div class="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-green-400"></div>
                  <span class="text-white/90">Risposta 24h</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span class="text-white/90">Consulenza inclusa</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span class="text-white/90">Supporto completo</span>
                </div>
              </div>
            </div>
          ) : (
            // Navigazione integrata
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              
              {/* Breadcrumb compatto */}
              <div class="flex items-center gap-2 text-white/90">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                <span class="font-medium">Catalogo</span>
                {navigationState.selectedCategory && (
                  <>
                    <svg class="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>{navigationState.selectedCategory.name}</span>
                  </>
                )}
                {navigationState.selectedSubcategory && (
                  <>
                    <svg class="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>{navigationState.selectedSubcategory.name}</span>
                  </>
                )}
              </div>

              {/* Navigation actions */}
              <div class="flex items-center gap-3">
                {navigationState.selectedSubcategory && (
                  <button 
                    onClick$={backToSubcategories}
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Sottocategorie
                  </button>
                )}
                <button 
                  onClick$={backToCategories}
                  class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/20 text-white hover:bg-white/30 rounded-lg transition-colors duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                  </svg>
                  Tutte le Categorie
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">

      {/* ===== LOADING STATE ===== */}
      {loading.value && (
        <div class="py-6 md:py-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[0,1,2,3].map((i) => (
              <div key={i} class="space-y-4">
                <div class="h-[220px] rounded-lg bg-gray-200/70 animate-pulse"/>
                <div class="h-4 w-24 rounded bg-gray-200/70 animate-pulse"/>
                <div class="h-6 w-2/3 rounded bg-gray-200/70 animate-pulse"/>
                <div class="h-4 w-full rounded bg-gray-200/70 animate-pulse"/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== ERROR STATE ===== */}
      {error.value && (
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <p class="text-red-800">{error.value}</p>
        </div>
      )}

      {/* ===== VISTA CATEGORIE ===== */}
      {!loading.value && !error.value && navigationState.activeView === 'categories' && (
        <>
          {/* Section Header */}
          <div class="text-center mb-12 md:mb-16">
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-telegraf text-gray-900 mb-4">
              Scegli la tua area di interesse
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Quattro aree specializzate per supportare ogni aspetto del tuo business
            </p>
          </div>

          {/* Griglia categorie - Stesso stile del ProductShowcase */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {categories.value.map((category, index) => (
              <article 
                key={category.id}
                class="group cursor-pointer"
                onClick$={() => selectCategory(category)}
              >
                {/* Contenitore immagine - Stesso design ProductShowcase */}
                <div 
                  class="relative rounded-lg overflow-hidden mb-6 aspect-[592/350]"
                  style={{
                    backgroundImage: `url('${getCategoryImage(category)}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Overlay per migliorare la leggibilità */}
                  <div class="absolute inset-0 bg-black/30"></div>
                  
                  {/* Pulsante ESPLORA - Stesso stile ProductShowcase */}
                  <div class="absolute bottom-8 left-8 z-10">
                    <div class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium text-sm tracking-wide transition-colors duration-200">
                      <span class="flex items-center gap-2">
                        ESPLORA
                        <span class="text-xl font-light">+</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Categoria sopra il titolo - Stesso stile ProductShowcase */}
                <p class="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">
                  Categoria
                </p>

                {/* Titolo categoria - Stesso stile ProductShowcase */}
                <h2 class="text-2xl font-normal mb-3">
                  {category.name}
                </h2>

                {/* Descrizione - Stesso stile ProductShowcase */}
                <p class="text-gray-600 text-base">
                  {category.description || `Scopri tutte le soluzioni professionali nell'area ${category.name.toLowerCase()}, pensate per supportare e far crescere il tuo business.`}
                </p>
              </article>
            ))}
          </div>

          {/* Trust Section */}
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded p-8 md:p-12 text-center mb-16">
            <h3 class="text-xl md:text-2xl font-telegraf text-gray-900 mb-6">
              Perché scegliere i nostri servizi
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h4 class="font-medium text-gray-900 mb-2">Risposta Rapida</h4>
                <p class="text-sm text-gray-600">Rispondiamo a tutte le richieste entro 24 ore lavorative</p>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h4 class="font-medium text-gray-900 mb-2">Qualità Garantita</h4>
                <p class="text-sm text-gray-600">Ogni servizio è certificato e segue standard professionali</p>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <h4 class="font-medium text-gray-900 mb-2">Supporto Completo</h4>
                <p class="text-sm text-gray-600">Ti seguiamo dalla consulenza all'implementazione</p>
              </div>
            </div>
          </div>

          {/* Sezione Contatto */}
          <div class="bg-white border border-gray-200 rounded p-8 md:p-12 text-center">
            <div class="max-w-3xl mx-auto">
              <h3 class="text-2xl md:text-3xl font-telegraf text-gray-900 mb-4">
                Non hai trovato quello che cercavi?
              </h3>
              <p class="text-lg text-gray-600 mb-8">
                Contattaci direttamente per una consulenza personalizzata. Il nostro team è pronto ad aiutarti a trovare la soluzione perfetta per le tue esigenze.
              </p>
              
              {/* Opzioni di Contatto */}
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* WhatsApp */}
                <a 
                  href="https://wa.me/393123456789?text=Ciao,%20vorrei%20informazioni%20sui%20vostri%20servizi"
                  target="_blank"
                  class="group bg-green-50 hover:bg-green-100 border border-green-200 rounded p-6 transition-all duration-200 hover:shadow-md"
                >
                  <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690"/>
                    </svg>
                  </div>
                  <h4 class="font-medium text-gray-900 mb-2">WhatsApp</h4>
                  <p class="text-sm text-gray-600 mb-3">Scrivici su WhatsApp per una risposta immediata</p>
                  <div class="text-green-600 font-medium text-sm">
                    Chatta ora →
                  </div>
                </a>

                {/* Email */}
                <a 
                  href="mailto:info@highvision.it?subject=Richiesta informazioni catalogo&body=Ciao,%0D%0AVorrei ricevere maggiori informazioni sui vostri servizi.%0D%0A%0D%0AGrazie"
                  class="group bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded p-6 transition-all duration-200 hover:shadow-md"
                >
                  <div class="w-12 h-12 bg-brand rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <h4 class="font-medium text-gray-900 mb-2">Email</h4>
                  <p class="text-sm text-gray-600 mb-3">Inviaci una email dettagliata con le tue richieste</p>
                  <div class="text-brand font-medium text-sm">
                    Scrivi ora →
                  </div>
                </a>

                {/* Chiamata */}
                <a 
                  href="tel:+393123456789"
                  class="group bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded p-6 transition-all duration-200 hover:shadow-md"
                >
                  <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <h4 class="font-medium text-gray-900 mb-2">Chiamaci</h4>
                  <p class="text-sm text-gray-600 mb-3">Parla direttamente con un nostro consulente</p>
                  <div class="text-orange-600 font-medium text-sm">
                    Chiama ora →
                  </div>
                </a>
              </div>

              {/* Orari */}
              <div class="mt-8 pt-6 border-t border-gray-200">
                <p class="text-sm text-gray-500">
                  <span class="font-medium">Orari di disponibilità:</span> Lunedì - Venerdì 9:00 - 18:00 | Sabato 9:00 - 13:00
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== VISTA SOTTOCATEGORIE ===== */}
      {!loading.value && !error.value && navigationState.activeView === 'subcategories' && (
        <>
          {/* Section Header */}
          <div class="text-center mb-12 md:mb-16">
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-telegraf text-gray-900 mb-4">
              {navigationState.selectedCategory?.name}
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Esplora le sottocategorie disponibili e trova la soluzione più adatta alle tue esigenze
            </p>
          </div>

          {subcategories.value.length === 0 ? (
            <div class="text-center py-20">
              <div class="max-w-md mx-auto">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <h3 class="text-xl font-medium text-gray-900 mb-2">Nessuna sottocategoria disponibile</h3>
                <p class="text-gray-600 mb-6">Al momento non ci sono sottocategorie in questa sezione.</p>
                                  <button 
                    onClick$={backToCategories} 
                    class="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded hover:bg-brand-dark transition-colors duration-200"
                  >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  Torna alle categorie
                </button>
              </div>
            </div>
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subcategories.value.map((subcategory, index) => (
              <article 
                key={subcategory.id}
                class="group cursor-pointer"
                onClick$={() => selectSubcategory(subcategory)}
              >
                <div class="bg-white rounded p-8 shadow-sm hover:shadow-lg transition-shadow duration-200 border border-gray-100 h-full flex flex-col">
                  
                  {/* Icon */}
                  <div class="w-16 h-16 bg-brand/10 rounded flex items-center justify-center mb-6">
                    <svg class="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>

                  {/* Content */}
                  <div class="flex-1">
                    <h3 class="text-xl font-medium text-gray-900 mb-4">
                      {subcategory.name}
                    </h3>
                    <p class="text-gray-600 leading-relaxed mb-6">
                      {subcategory.description || `Scopri tutti i prodotti e servizi disponibili nella categoria ${subcategory.name}.`}
                    </p>
                  </div>

                  {/* CTA */}
                  <div class="flex items-center text-brand font-medium">
                    <span>Vedi prodotti</span>
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </div>
                </div>
              </article>
            ))}
            </div>
          )}
        </>
      )}

      {/* ===== VISTA PRODOTTI ===== */}
      {!loading.value && !error.value && navigationState.activeView === 'products' && (
        <>
          {/* Section Header */}
          <div class="text-center mb-12 md:mb-16">
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-telegraf text-gray-900 mb-4">
              {navigationState.selectedSubcategory?.name}
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Scopri tutti i prodotti e servizi disponibili in questa categoria
            </p>
          </div>

          {/* Trust Bar */}
          <div class="bg-gradient-to-r from-brand/5 to-blue-50 rounded p-6 mb-12">
            <div class="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-sm">
              <div class="flex items-center gap-2 text-gray-700">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="font-medium">Qualità certificata</span>
              </div>
              <div class="hidden md:block w-px h-6 bg-gray-300"></div>
              <div class="flex items-center gap-2 text-gray-700">
                <div class="w-3 h-3 bg-brand rounded-full"></div>
                <span class="font-medium">Supporto dedicato</span>
              </div>
              <div class="hidden md:block w-px h-6 bg-gray-300"></div>
              <div class="flex items-center gap-2 text-gray-700">
                <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span class="font-medium">Consulenza inclusa</span>
              </div>
            </div>
          </div>

          {products.value.length === 0 ? (
            <div class="text-center py-20">
              <div class="max-w-md mx-auto">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                  </svg>
                </div>
                <h3 class="text-xl font-medium text-gray-900 mb-2">Nessun prodotto disponibile</h3>
                <p class="text-gray-600 mb-6">Al momento non ci sono prodotti in questa sottocategoria.</p>
                <button 
                  onClick$={backToSubcategories} 
                  class="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded hover:bg-brand-dark transition-colors duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  Torna alle sottocategorie
                </button>
              </div>
            </div>
          ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.value.map((product, index) => (
              <article 
                key={product.id}
                class="bg-white rounded overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 border border-gray-100"
              >
                {/* Immagine prodotto */}
                <div class="relative h-56 overflow-hidden">
                  <div 
                    class="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${getProductImage(product)}')`,
                    }}
                  ></div>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Price Badge */}
                  {product.price && (
                    <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      {product.price}
                    </div>
                  )}
                </div>

                {/* Contenuto prodotto */}
                <div class="p-6">
                  {/* Title */}
                  <h3 class="text-xl font-medium text-gray-900 mb-3">
                    {product.name}
                  </h3>
                  
                  {/* Description */}
                  <p class="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {product.description || 'Soluzione professionale studiata per le esigenze del tuo business.'}
                  </p>
                  
                  {/* Referente */}
                  {product.referenti && (
                    <div class="mb-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded">
                      <div class="text-xs text-brand uppercase tracking-wider mb-1 font-medium">Referente Specializzato</div>
                      <div class="text-sm text-gray-700 font-medium">{product.referenti}</div>
                    </div>
                  )}
                  
                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div class="mb-6">
                      <div class="flex flex-wrap gap-2">
                        {product.features.slice(0, 3).map((feature: string, idx: number) => (
                          <span key={idx} class="text-xs bg-brand/10 text-brand px-3 py-1 rounded-full font-medium">
                            {feature}
                          </span>
                        ))}
                        {product.features.length > 3 && (
                          <span class="text-xs text-gray-500 px-2 py-1">
                            +{product.features.length - 3} altro
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div class="flex gap-3">
                    <button 
                      onClick$={() => openProductModal(product)}
                      class="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded text-sm font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Dettagli
                    </button>
                    <button 
                      onClick$={() => openContactModal(product)}
                      class="flex-1 bg-brand text-white py-3 px-4 rounded text-sm font-medium hover:bg-brand-dark transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                      Contattaci
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}
        </>
      )}

      {/* 🎨 ===== PREMIUM MODAL DETTAGLIO PRODOTTO ===== */}
      {showProductModal.value && navigationState.selectedProduct && (
        <div class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform animate-in slide-in-from-bottom-4 duration-500 border border-gray-100 flex flex-col">
            
            {/* ✨ Header Premium - FISSO */}
            <div class="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 flex-shrink-0">
              
              <div class="relative flex items-start justify-between text-white">
                <div class="flex-1 pr-8">
                  {/* Badge categoria */}
                  <div class="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white/90 mb-4">
                    <div class="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    PRODOTTO PREMIUM
                  </div>
                  
                  <h3 class="text-3xl font-bold mb-3 leading-tight">{navigationState.selectedProduct.name}</h3>
                  
                  {navigationState.selectedProduct.price && (
                    <div class="flex items-center space-x-2 mb-2">
                      <div class="text-blue-100 text-xl font-bold">
                        {navigationState.selectedProduct.price}
                      </div>
                      <div class="px-2 py-1 bg-green-500/20 rounded-lg text-green-100 text-xs font-medium">
                        PREVENTIVO GRATUITO
                      </div>
                    </div>
                  )}
                  
                  <p class="text-blue-100/80 text-sm leading-relaxed">
                    Scopri tutti i dettagli di questo prodotto professionale
                  </p>
                </div>
                
                <button 
                  onClick$={closeProductModal}
                  class="text-white/70 hover:text-white transition-all duration-200 p-3 hover:bg-white/10 rounded-lg hover:scale-110 hover:rotate-90"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Contenuto scrollabile */}
            <div class="p-6 overflow-y-auto flex-1 min-h-0">
              
            {/* 🖼️ Immagine Pulita */}
            <div class="relative rounded-xl overflow-hidden mb-6 shadow-lg bg-gradient-to-br from-gray-100 to-gray-200" style="height: 18rem;">
              {/* Immagine reale */}
              <img 
                src={navigationState.selectedProduct.image}
                alt={navigationState.selectedProduct.name}
                class="w-full h-full object-cover"
                loading="lazy"
                onError$={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              
              {/* Badge floating */}
              <div class="absolute top-4 left-4 z-20">
                <div class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="text-xs font-medium text-gray-800">DISPONIBILE</span>
                  </div>
                </div>
              </div>
            </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 📝 Colonna Descrizione */}
                <div class="lg:col-span-2 space-y-6">
                  
                  {/* Descrizione */}
                  <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div class="flex items-center mb-4">
                      <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h4 class="text-base font-semibold text-gray-900">Descrizione</h4>
                    </div>
                    <p class="text-gray-700 leading-relaxed text-sm">
                      {navigationState.selectedProduct.description}
                    </p>
                  </div>

                  {/* Caratteristiche */}
                  {navigationState.selectedProduct.features && (
                    <div class="bg-green-50 p-6 rounded-xl border border-green-100">
                      <div class="flex items-center mb-4">
                        <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 class="text-base font-semibold text-gray-900">Caratteristiche</h4>
                      </div>
                      <div class="space-y-2">
                        {navigationState.selectedProduct.features.map((feature: string, idx: number) => (
                          <div key={idx} class="flex items-center bg-white p-3 rounded-lg border border-green-100">
                            <div class="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                            <span class="text-gray-800 font-medium text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 👥 Sidebar Informazioni */}
                <div class="space-y-4">
                  
                  {/* Referenti */}
                  {navigationState.selectedProduct.referenti && (
                    <div class="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <div class="flex items-center mb-3">
                        <div class="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
                          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h4 class="text-base font-semibold text-gray-900">Referenti</h4>
                      </div>
                      <p class="text-blue-800 font-medium text-sm">
                        {navigationState.selectedProduct.referenti}
                      </p>
                    </div>
                  )}

                  {/* Prezzo */}
                  {navigationState.selectedProduct.price && (
                    <div class="bg-green-50 p-4 rounded-xl border border-green-200">
                      <div class="flex items-center mb-3">
                        <div class="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center mr-2">
                          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <h4 class="text-base font-semibold text-gray-900">Prezzo</h4>
                      </div>
                      <div class="text-lg font-bold text-green-700 mb-1">
                        {navigationState.selectedProduct.price}
                      </div>
                      <div class="text-green-600 text-sm">+ IVA se dovuta</div>
                    </div>
                  )}

                  {/* Servizi */}
                  <div class="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <div class="flex items-center mb-3">
                      <div class="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center mr-2">
                        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h4 class="text-base font-semibold text-gray-900">Servizi Inclusi</h4>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center text-sm text-gray-700">
                        <svg class="w-3 h-3 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Consulenza gratuita
                      </div>
                      <div class="flex items-center text-sm text-gray-700">
                        <svg class="w-3 h-3 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Preventivo in 24h
                      </div>
                      <div class="flex items-center text-sm text-gray-700">
                        <svg class="w-3 h-3 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Supporto post-vendita
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Footer - FISSO */}
            <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex-shrink-0">
              <div class="flex gap-3 justify-end">
                <button 
                  onClick$={closeProductModal}
                  class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Chiudi
                </button>
                <button 
                  onClick$={() => openContactModal(navigationState.selectedProduct!)}
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Richiedi Informazioni
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 💬 ===== MODAL CONTATTO PROFESSIONALE ===== */}
      {showContactModal.value && (
        <div class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div class="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform animate-in slide-in-from-bottom-4 duration-500 border border-gray-100">
            
            {/* Header Professionale */}
            <div class="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div class="flex items-start justify-between text-white">
                <div class="flex-1 pr-4">
                  <h3 class="text-xl font-semibold mb-2">Richiedi Preventivo</h3>
                  <div class="bg-white/15 rounded-lg p-3 mb-2">
                    <div class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span class="text-blue-100 font-medium text-sm">{contactForm.productInterest}</span>
                    </div>
                  </div>
                  <p class="text-blue-100 text-sm">
                    Risposta garantita entro 24 ore
                  </p>
                </div>
                
                <button 
                  onClick$={closeContactModal}
                  class="text-white/70 hover:text-white transition-all duration-200 p-3 hover:bg-white/10 rounded-lg hover:scale-110 hover:rotate-90"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <div class="p-6">
              
              {contactFormSuccess.value ? (
                <div class="text-center py-8">
                  <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 class="text-xl font-bold text-gray-900 mb-2">Richiesta Inviata!</h4>
                  <p class="text-gray-600 text-sm mb-4">
                    Ti contatteremo entro 24 ore con un preventivo personalizzato.
                  </p>
                  <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="flex items-center justify-center space-x-4 text-xs text-blue-700">
                      <span>✓ Risposta garantita</span>
                      <span>✓ Preventivo gratuito</span>
                      <span>✓ Consulenza inclusa</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div class="space-y-4">
                  
                  {contactFormError.value && (
                    <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p class="text-red-700 text-sm">{contactFormError.value}</p>
                    </div>
                  )}

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                      <input 
                        type="text"
                        value={contactForm.name}
                        onInput$={(e) => contactForm.name = (e.target as HTMLInputElement).value}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Il tuo nome"
                        required
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input 
                        type="email"
                        value={contactForm.email}
                        onInput$={(e) => contactForm.email = (e.target as HTMLInputElement).value}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="email@esempio.com"
                        required
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Telefono</label>
                      <input 
                        type="tel"
                        value={contactForm.phone}
                        onInput$={(e) => contactForm.phone = (e.target as HTMLInputElement).value}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+39 123 456 7890"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Azienda</label>
                      <input 
                        type="text"
                        value={contactForm.company}
                        onInput$={(e) => contactForm.company = (e.target as HTMLInputElement).value}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nome azienda"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Messaggio</label>
                    <textarea 
                      value={contactForm.message}
                      onInput$={(e) => contactForm.message = (e.target as HTMLTextAreaElement).value}
                      rows={3}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Descrivi le tue esigenze..."
                    ></textarea>
                  </div>

                  <div class="bg-blue-50 p-3 rounded-lg">
                    <div class="flex items-start space-x-2">
                      <svg class="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <div class="text-xs text-blue-700">
                        <p class="font-medium">Privacy garantita</p>
                        <p>I tuoi dati sono protetti e non verranno condivisi con terzi.</p>
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-3 pt-2">
                    <button 
                      onClick$={closeContactModal}
                      class="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      disabled={contactFormLoading.value}
                    >
                      Annulla
                    </button>
                    <button 
                      onClick$={submitContactForm}
                      class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      disabled={contactFormLoading.value}
                    >
                      {contactFormLoading.value ? 'Invio...' : 'Invia Richiesta'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      
      </main>
    </div>
  );
});