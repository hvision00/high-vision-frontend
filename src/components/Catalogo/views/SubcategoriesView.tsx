// src/components/Catalogo/views/SubcategoriesView.tsx
import { component$ } from '@builder.io/qwik';
import type { SubcategoryViewProps } from '../types/catalog.types';

/**
 * Vista delle sottocategorie per una categoria specifica
 * Design coerente con tutte le altre viste del catalogo
 */
export const SubcategoriesView = component$<SubcategoryViewProps>(({ 
  category, 
  onSelectSubcategory, 
  onBackToCategories 
}) => {
  return (
    <div class="w-full">
      {/* Contenuto principale - Stesso max-width consistente */}
      <section class="w-full max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Pulsante Back + Header */}
        <div class="mb-12">
          {/* Pulsante back - Stile pulito e coerente */}
          <button 
            onClick$={onBackToCategories}
            class="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
          >
            <svg class="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="font-medium">Torna alle categorie</span>
          </button>
          
          {/* Header della categoria - Typography coerente */}
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12 border border-blue-100">
            <div class="max-w-4xl">
              <div class="text-sm font-medium uppercase tracking-wider text-blue-600 mb-3">
                CATEGORIA
              </div>
              <h1 class="text-2xl md:text-4xl font-normal text-gray-900 mb-4 leading-tight">
                {category.name}
              </h1>
              <p class="text-lg text-gray-600 leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Griglia sottocategorie - Layout consistente */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {category.subcategories.map((subcategory, index) => (
            <div 
              key={subcategory.id}
              class="animate-fadeIn"
              style={`animation-delay: ${index * 100}ms`}
            >
              <div 
                onClick$={() => onSelectSubcategory(subcategory.id)}
                class="group bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
              >
                {/* Icon header */}
                <div class="mb-6">
                  <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div class="w-8 h-8 bg-blue-600 rounded-lg opacity-80"></div>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {subcategory.name}
                  </h3>
                  <p class="text-gray-600 leading-relaxed mb-6 text-sm">
                    {subcategory.description}
                  </p>
                </div>

                {/* Info prodotti */}
                <div class="border-t border-gray-100 pt-6">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span class="text-sm font-medium text-gray-600">
                        {subcategory.products.length} {subcategory.products.length === 1 ? 'prodotto' : 'prodotti'}
                      </span>
                    </div>
                    <svg class="w-6 h-6 text-blue-600 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>

                  {/* Preview prodotti - Solo nomi */}
                  <div class="mt-4 space-y-1">
                    {subcategory.products.slice(0, 2).map((product, idx) => (
                      <div key={idx} class="text-xs text-gray-500 flex items-center">
                        <div class="w-1 h-1 bg-gray-300 rounded-full mr-2"></div>
                        {product.name}
                      </div>
                    ))}
                    {subcategory.products.length > 2 && (
                      <div class="text-xs text-blue-600 font-medium">
                        +{subcategory.products.length - 2} altri prodotti
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sezione info categoria - Stats e dettagli */}
        <div class="bg-gray-50 rounded-2xl p-8 lg:p-12 border border-gray-100 mb-20">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Stats della categoria */}
            <div>
              <h3 class="text-2xl font-normal text-gray-900 mb-6">
                {category.name} in numeri
              </h3>
              
              <div class="grid grid-cols-2 gap-6">
                <div class="text-center p-4">
                  <div class="text-3xl font-bold text-blue-600 mb-2">
                    {category.subcategories.length}
                  </div>
                  <div class="text-sm font-medium uppercase tracking-wider text-gray-500">
                    Specializzazioni
                  </div>
                </div>
                
                <div class="text-center p-4">
                  <div class="text-3xl font-bold text-blue-600 mb-2">
                    {category.subcategories.reduce((total, sub) => total + sub.products.length, 0)}
                  </div>
                  <div class="text-sm font-medium uppercase tracking-wider text-gray-500">
                    Prodotti Totali
                  </div>
                </div>
              </div>

              {/* Vantaggi specifici categoria */}
              <div class="mt-8 space-y-3">
                <h4 class="font-semibold text-gray-900 mb-4">Vantaggi di questa categoria:</h4>
                
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-gray-600">Prodotti certificati e conformi alle normative</span>
                </div>
                
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-gray-600">Referenti specializzati per ogni sottocategoria</span>
                </div>
                
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-gray-600">Consulenza personalizzata e supporto continuo</span>
                </div>
              </div>
            </div>

            {/* CTA per contatti specifici */}
            <div class="bg-white rounded-xl p-8 border border-gray-200">
              <h4 class="text-xl font-semibold text-gray-900 mb-4">
                Hai domande specifiche su {category.name}?
              </h4>
              <p class="text-gray-600 mb-6 text-sm">
                Il nostro team di esperti è pronto a supportarti nella scelta dei prodotti più adatti alle tue esigenze.
              </p>
              
              {/* Contatti rapidi */}
              <div class="space-y-3 mb-6">
                <a 
                  href="tel:+390212345678"
                  class="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Chiamaci: +39 02 1234 5678
                </a>
                
                <a 
                  href="mailto:info@tuaazienda.it"
                  class="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email: info@tuaazienda.it
                </a>
              </div>

              <a 
                href="/contatti"
                class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
              >
                Richiedi Consulenza Gratuita
              </a>
            </div>

          </div>
        </div>

      </section>

      {/* Animazioni CSS */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
});