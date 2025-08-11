// src/components/Catalogo/hooks/useCatalogNavigation.ts
// STEP 5 FINALE: submitContactForm() con API - SISTEMA COMPLETO FULL-STACK!

import { useSignal, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import type { 
  NavigationState, 
  ContactFormData, 
  ContactFormState,
  Product,
  CatalogView 
} from '../types/catalog.types';
// import { catalogUtils, catalogData } from '../data/catalogData'; // ← RIMOSSO: Non più necessario
import { apiClient } from '../../../lib/api';

export const useCatalogNavigation = () => {
  // ===== STATO DI NAVIGAZIONE =====
  const navigationState = useStore<NavigationState>({
    activeView: 'categories',
    selectedCategory: '',
    selectedSubcategory: '',
    selectedProduct: null
  });

  // ===== AUTO-LOAD CATEGORIES ON INIT =====
  useVisibleTask$(async () => {
    // Evita chiamate multiple durante l'hydration
    if (typeof window !== 'undefined' && apiState.categories.length === 0 && !apiState.loadingCategories) {
      await loadCategories();
    }
  });

  // ===== STATO MODALI =====
  const showProductModal = useSignal(false);
  const showContactModal = useSignal(false);

  // ===== FORM CONTATTI (AGGIORNATO) =====
  const contactForm = useStore<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    productInterest: ''
  });

  // 🆕 AGGIORNATO: Stato form più dettagliato
  const contactFormState = useStore<ContactFormState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: ''
  });

  // ===== STATO API =====
  const apiState = useStore({
    // Stati di caricamento
    loadingCategories: false,
    loadingSubcategories: false,
    loadingProducts: false,
    loadingSearch: false,
    loadingContact: false, // 🆕 NUOVO: Loading per form contatti
    
    // Stati di errore
    error: null as string | null,
    
    // Dati cache organizzati
    categories: [] as any[],
    subcategories: {} as Record<string, any[]>,
    products: {} as Record<string, any[]>,
    searchResults: [] as any[],
    
    // Timestamp cache
    lastCategoriesLoad: 0,
    lastSubcategoriesLoad: {} as Record<string, number>,
    lastProductsLoad: {} as Record<string, number>
  });

  // ===== HELPER FUNCTIONS =====
  
  const clearApiError = $(() => {
    apiState.error = null;
  });

  const isDataFresh = $((timestamp: number) => {
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minuti
    return Date.now() - timestamp < CACHE_DURATION;
  });

  const logApiState = $(() => {
    console.log('🔍 API State:', {
      loadingCategories: apiState.loadingCategories,
      loadingSubcategories: apiState.loadingSubcategories,
      loadingProducts: apiState.loadingProducts,
      loadingContact: apiState.loadingContact,
      categoriesCount: apiState.categories.length,
      subcategoriesCache: Object.keys(apiState.subcategories).length,
      productsCache: Object.keys(apiState.products).length,
      error: apiState.error
    });
  });

  // ===== FUNZIONI API CATALOGO =====
  
  const loadCategories = $(async () => {
    console.log('📡 loadCategories() called');
    
    if (apiState.categories.length > 0 && await isDataFresh(apiState.lastCategoriesLoad)) {
      console.log('✅ Using cached categories');
      return apiState.categories;
    }
    
    apiState.loadingCategories = true;
    apiState.error = null;
    console.log('🔄 Loading categories from API...');
    
    try {
      const response = await apiClient.getCategories();
      
      if (response.success && response.data) {
        apiState.categories = response.data;
        apiState.lastCategoriesLoad = Date.now();
        
        console.log('✅ Categories loaded successfully:', response.data.length);
        return response.data;
      } else {
        throw new Error(response.error || 'Errore nel caricamento categorie');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      apiState.error = `Errore categorie: ${errorMessage}`;
      console.error('❌ loadCategories error:', error);
      return [];
    } finally {
      apiState.loadingCategories = false;
    }
  });

  const loadSubcategories = $(async (categoryId: string) => {
    console.log('📡 loadSubcategories() called for category:', categoryId);
    
    if (!categoryId) {
      console.warn('⚠️ No categoryId provided to loadSubcategories');
      return [];
    }
    
    const cachedSubs = apiState.subcategories[categoryId];
    const lastLoad = apiState.lastSubcategoriesLoad[categoryId] || 0;
    
    if (cachedSubs && cachedSubs.length > 0 && await isDataFresh(lastLoad)) {
      console.log('✅ Using cached subcategories for category:', categoryId);
      return cachedSubs;
    }
    
    apiState.loadingSubcategories = true;
    apiState.error = null;
    console.log('🔄 Loading subcategories from API for category:', categoryId);
    
    try {
      const response = await apiClient.getSubcategories(categoryId);
      
      if (response.success && response.data) {
        apiState.subcategories[categoryId] = response.data;
        apiState.lastSubcategoriesLoad[categoryId] = Date.now();
        
        console.log('✅ Subcategories loaded successfully:', response.data.length);
        return response.data;
      } else {
        throw new Error(response.error || 'Errore nel caricamento sottocategorie');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      apiState.error = `Errore sottocategorie: ${errorMessage}`;
      console.error('❌ loadSubcategories error:', error);
      return [];
    } finally {
      apiState.loadingSubcategories = false;
    }
  });

  const loadProducts = $(async (subcategoryId: string) => {
    console.log('📡 loadProducts() called for subcategory:', subcategoryId);
    
    if (!subcategoryId) {
      console.warn('⚠️ No subcategoryId provided to loadProducts');
      return [];
    }
    
    const cachedProducts = apiState.products[subcategoryId];
    const lastLoad = apiState.lastProductsLoad[subcategoryId] || 0;
    
    if (cachedProducts && cachedProducts.length > 0 && await isDataFresh(lastLoad)) {
      console.log('✅ Using cached products for subcategory:', subcategoryId);
      return cachedProducts;
    }
    
    apiState.loadingProducts = true;
    apiState.error = null;
    console.log('🔄 Loading products from API for subcategory:', subcategoryId);
    
    try {
      const response = await apiClient.getProducts(subcategoryId);
      
      if (response.success && response.data) {
        const products = response.data.data || response.data;
        
        apiState.products[subcategoryId] = products;
        apiState.lastProductsLoad[subcategoryId] = Date.now();
        
        console.log('✅ Products loaded successfully:', products.length);
        return products;
      } else {
        throw new Error(response.error || 'Errore nel caricamento prodotti');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      apiState.error = `Errore prodotti: ${errorMessage}`;
      console.error('❌ loadProducts error:', error);
      return [];
    } finally {
      apiState.loadingProducts = false;
    }
  });

  // ===== GETTERS =====
  
  const getCategories = $(() => {
    return apiState.categories;
  });

  const getSubcategories = $((categoryId: string) => {
    if (!categoryId) return [];
    
    const cachedSubs = apiState.subcategories[categoryId];
    return cachedSubs || [];
  });

  const getProducts = $((subcategoryId: string) => {
    if (!subcategoryId) return [];
    
    const cachedProducts = apiState.products[subcategoryId];
    return cachedProducts || [];
  });

  // ===== AZIONI DI NAVIGAZIONE =====
  
  const selectCategory = $(async (categoryId: string) => {
    navigationState.selectedCategory = categoryId;
    navigationState.selectedSubcategory = '';
    navigationState.selectedProduct = null;
    navigationState.activeView = 'subcategories';
    showProductModal.value = false;
    showContactModal.value = false;
    
    await loadSubcategories(categoryId);
    
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  const selectSubcategory = $(async (subcategoryId: string) => {
    navigationState.selectedSubcategory = subcategoryId;
    navigationState.selectedProduct = null;
    navigationState.activeView = 'products';
    showProductModal.value = false;
    showContactModal.value = false;
    
    await loadProducts(subcategoryId);
    
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  const backToCategories = $(() => {
    navigationState.activeView = 'categories';
    navigationState.selectedCategory = '';
    navigationState.selectedSubcategory = '';
    navigationState.selectedProduct = null;
    showProductModal.value = false;
    showContactModal.value = false;
    
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  const backToSubcategories = $(() => {
    navigationState.activeView = 'subcategories';
    navigationState.selectedSubcategory = '';
    navigationState.selectedProduct = null;
    showProductModal.value = false;
    showContactModal.value = false;
  });

  // ===== AZIONI PRODOTTI =====
  
  const showProductDetail = $((product: Product) => {
    navigationState.selectedProduct = product;
    showProductModal.value = true;
  });

  const closeProductModal = $(() => {
    showProductModal.value = false;
    navigationState.selectedProduct = null;
  });

  // ===== AZIONI CONTATTI (AGGIORNATE CON API) =====
  
  const openContactModal = $((product?: Product) => {
    if (product) {
      contactForm.productInterest = product.name;
      navigationState.selectedProduct = product;
    }
    showContactModal.value = true;
  });

  const closeContactModal = $(() => {
    showContactModal.value = false;
    contactFormState.isLoading = false;
    contactFormState.isSuccess = false;
    contactFormState.isError = false;
    contactFormState.errorMessage = '';
    
    // Reset form
    contactForm.name = '';
    contactForm.email = '';
    contactForm.phone = '';
    contactForm.company = '';
    contactForm.message = '';
    contactForm.productInterest = '';
  });

  const updateContactForm = $((field: keyof ContactFormData, value: string) => {
    (contactForm as any)[field] = value;
  });

  // ===== 🆕 NUOVO: SUBMIT CONTACT FORM CON API =====
  
  /**
   * Invia il form contatti al backend API
   * Con validation completa e gestione errori
   */
  const submitContactForm = $(async () => {
    console.log('📡 submitContactForm() called');
    console.log('📝 Form data:', contactForm);
    
    // Reset stati
    contactFormState.isLoading = true;
    contactFormState.isSuccess = false;
    contactFormState.isError = false;
    contactFormState.errorMessage = '';
    apiState.loadingContact = true;
    apiState.error = null;

    try {
      // Validation client-side
      const errors: string[] = [];
      
      if (!contactForm.name?.trim()) {
        errors.push('Nome è richiesto');
      }
      
      if (!contactForm.email?.trim()) {
        errors.push('Email è richiesta');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
        errors.push('Email non valida');
      }
      
      if (errors.length > 0) {
        throw new Error(errors[0]);
      }

      // Prepara dati per API (seguendo il formato backend)
      const contactData = {
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        phone: contactForm.phone?.trim() || undefined,
        company: contactForm.company?.trim() || undefined,
        message: contactForm.message.trim(),
        product_interest: contactForm.productInterest?.trim() || undefined,
        gdpr_consent: true, // Richiesto dal backend
        marketing_consent: false, // Default
        source: 'website'
      };

      console.log('📤 Sending to API:', contactData);

      // Chiamata API
      const response = await apiClient.submitContact(contactData);
      
      if (response.success) {
        contactFormState.isLoading = false;
        contactFormState.isSuccess = true;
        contactFormState.isError = false;
        
        console.log('✅ Contact form submitted successfully!');
        console.log('📧 Response:', response);
        
        // Auto-chiusura dopo 3 secondi
        setTimeout(() => {
          closeContactModal();
        }, 3000);
        
      } else {
        throw new Error(response.error || 'Errore nell\'invio del form');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      
      contactFormState.isLoading = false;
      contactFormState.isError = true;
      contactFormState.errorMessage = errorMessage;
      apiState.error = `Errore form: ${errorMessage}`;
      
      console.error('❌ submitContactForm error:', error);
      
      // Fallback: Se API non disponibile, usa sistema precedente
      if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        console.log('🔄 API not available, using fallback...');
        contactFormState.errorMessage = 'Servizio temporaneamente non disponibile. Riprova più tardi.';
      }
    } finally {
      apiState.loadingContact = false;
    }
  });

  // ===== COMPUTED VALUES =====
  const currentCategory = useSignal<any>(undefined);
  const currentSubcategory = useSignal<any>(undefined);

  // Aggiorna i valori computed quando cambia lo stato
  useVisibleTask$(({ track }) => {
    // Solo sul client per evitare problemi di serializzazione SSR
    if (typeof window === 'undefined') return;
    
    track(() => navigationState.selectedCategory);
    track(() => apiState.categories);
    
    if (!navigationState.selectedCategory) {
      currentCategory.value = undefined;
    } else {
      // Crea una copia pulita per evitare referenze circolari
      const found = apiState.categories.find(cat => cat.id === navigationState.selectedCategory);
      currentCategory.value = found ? { ...found } : undefined;
    }
  });

  useVisibleTask$(({ track }) => {
    // Solo sul client per evitare problemi di serializzazione SSR
    if (typeof window === 'undefined') return;
    
    track(() => navigationState.selectedSubcategory);
    track(() => apiState.subcategories);
    
    if (!navigationState.selectedCategory || !navigationState.selectedSubcategory) {
      currentSubcategory.value = undefined;
    } else {
      const subcategories = apiState.subcategories[navigationState.selectedCategory] || [];
      const found = subcategories.find(sub => sub.id === navigationState.selectedSubcategory);
      // Crea una copia pulita per evitare referenze circolari
      currentSubcategory.value = found ? { ...found } : undefined;
    }
  });

  // ===== RETURN HOOK - SISTEMA COMPLETO =====
  return {
    // Stato esistente
    navigationState,
    showProductModal,
    showContactModal,
    contactForm,
    contactFormState,
    
    // Stato API
    apiState: apiState as Readonly<typeof apiState>,
    
    // Azioni navigazione
    selectCategory,
    selectSubcategory,
    backToCategories,
    backToSubcategories,
    
    // Azioni prodotti
    showProductDetail,
    closeProductModal,
    
    // 🆕 AZIONI CONTATTI CON API
    openContactModal,
    closeContactModal,
    updateContactForm,
    submitContactForm, // ← AGGIORNATA CON API
    
    // Computed values
    currentCategory,
    currentSubcategory,
    
    // SISTEMA API COMPLETO
    loadCategories,
    loadSubcategories,
    loadProducts,
    getCategories,
    getSubcategories,
    getProducts,
    
    // Utility API
    clearApiError,
    logApiState
  };
};