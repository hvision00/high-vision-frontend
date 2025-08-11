// src/components/Catalogo/views/ProductsView.tsx
import { component$ } from '@builder.io/qwik';
import type { ProductViewProps } from '../types/catalog.types';
import { ProductCard } from '../components/ProductCard';

/**
 * Vista dei prodotti per una sottocategoria specifica
 * Design coerente con tutte le altre viste del catalogo
 */
export const ProductsView = component$<ProductViewProps>(({ 
  category, 
  subcategory, 
  onShowProductDetail, 
  onOpenContactModal, 
  onBackToSubcategories,
  onBackToCategories 
}) => {
  return (
    <div class="w-full">
      {/* Contenuto principale - Stesso max-width consistente */}
      <section class="w-full max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Navigazione breadcrumb + Header */}
        <div class="mb-12">
          {/* Double back navigation - Design pulito */}
          <div class="flex items-center space-x-4 mb-8">
            <button 
              onClick$={onBackToSubcategories}
              class="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
            >
              <svg class="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span class="font-medium">Torna a {category.name}</span>
            </button>
            
            <span class="text-gray-400">|</span>
            
            <button 
              onClick$={onBackToCategories}
              class="text-gray-500 hover:text-blue-600 transition-colors text-sm"
            >
              Tutte le categorie
            </button>
          </div>
          
          {/* Header della sottocategoria - Typography coerente */}
          <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 lg:p-12 border border-gray-200">
            <div class="max-w-4xl">
              {/* Breadcrumb path */}
              <div class="text-sm font-medium uppercase tracking-wider text-blue-600 mb-3 flex items-center space-x-2">
                <span class="text-gray-500">{category.name}</span>
                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <span class="text-blue-600">{subcategory.name}</span>
              </div>
              
              <h1 class="text-2xl md:text-4xl font-normal text-gray-900 mb-4 leading-tight">
                {subcategory.name}
              </h1>
              <p class="text-lg text-gray-600 leading-relaxed">
                {subcategory.description}
              </p>
            </div>
          </div>
        </div>

        {/* Filtri e sorting - Opzionale per future implementazioni */}
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">
              {subcategory.products.length} {subcategory.products.length === 1 ? 'prodotto trovato' : 'prodotti trovati'}
            </span>
          </div>
          
          {/* Quick actions */}
          <div class="flex items-center space-x-3">
            <button 
              onClick$={() => onOpenContactModal()}
              class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Hai domande? Contattaci
            </button>
          </div>
        </div>

        {/* Griglia prodotti - Utilizzo delle ProductCard create */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {subcategory.products.map((product, index) => (
            <div 
              key={product.id}
              class="animate-fadeIn"
              style={`animation-delay: ${index * 100}ms`}
            >
              <ProductCard 
                product={product}
                onShowDetail={onShowProductDetail}
                onContact={onOpenContactModal}
              />
            </div>
          ))}
        </div>

        {/* Sezione informativa prodotti - Coerente con altre viste */}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Info sui prodotti della sottocategoria */}
          <div class="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">
              Informazioni sui prodotti {subcategory.name}
            </h3>
            
            {/* Stats prodotti */}
            <div class="grid grid-cols-2 gap-6 mb-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600 mb-1">
                  {subcategory.products.length}
                </div>
                <div class="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Prodotti Disponibili
                </div>
              </div>
              
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600 mb-1">
                  {subcategory.products.filter(p => p.featured).length}
                </div>
                <div class="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Prodotti in Evidenza
                </div>
              </div>
            </div>

            {/* Caratteristiche comuni */}
            <div class="space-y-3">
              <h4 class="font-semibold text-gray-900">Caratteristiche comuni:</h4>
              
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-gray-600">Qualità certificata e conformità normative</span>
              </div>
              
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-gray-600">Supporto tecnico specializzato incluso</span>
              </div>
              
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-gray-600">Personalizzazione e consulenza disponibile</span>
              </div>
              
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-gray-600">Garanzia di qualità su tutti i prodotti</span>
              </div>
            </div>
          </div>

          {/* Referenti specializzati */}
          <div class="bg-blue-50 rounded-2xl p-8 border border-blue-100">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">
              I tuoi referenti specializzati
            </h3>
            
            <div class="space-y-4 mb-6">
              {/* Estrai referenti unici dai prodotti */}
              {Array.from(new Set(
                subcategory.products.map(p => p.referenti).join(', ').split(', ')
              )).slice(0, 4).map((referente, index) => (
                <div key={index} class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900">{referente}</div>
                    <div class="text-sm text-blue-600">Esperto {subcategory.name}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to action */}
            <div class="bg-white rounded-xl p-6 border border-blue-200">
              <h4 class="font-semibold text-gray-900 mb-2">
                Hai bisogno di consulenza specializzata?
              </h4>
              <p class="text-sm text-gray-600 mb-4">
                I nostri esperti sono pronti ad aiutarti nella scelta del prodotto più adatto.
              </p>
              <button 
                onClick$={() => onOpenContactModal()}
                class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
              >
                Parla con un Esperto
              </button>
            </div>
          </div>

        </div>

        {/* Sezione cross-selling - Altri prodotti categoria */}
        <div class="bg-gray-50 rounded-2xl p-8 lg:p-12 border border-gray-100">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-normal text-gray-900 mb-4">
              Scopri anche le altre specializzazioni
            </h3>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Esplora tutte le soluzioni che abbiamo preparato per la categoria {category.name}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.subcategories
              .filter(sub => sub.id !== subcategory.id)
              .map((otherSub) => (
                <div 
                  key={otherSub.id}
                  onClick$={() => onBackToSubcategories()}
                  class="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 group"
                >
                  <div class="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                    <div class="w-6 h-6 bg-gray-400 rounded group-hover:bg-blue-600 transition-colors"></div>
                  </div>
                  <h4 class="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {otherSub.name}
                  </h4>
                  <p class="text-xs text-gray-600 mb-3">
                    {otherSub.products.length} prodotti disponibili
                  </p>
                  <div class="text-blue-600 text-xs font-medium group-hover:underline">
                    Esplora →
                  </div>
                </div>
              ))}
          </div>
        </div>

      </section>

      {/* Animazioni CSS identiche */}
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