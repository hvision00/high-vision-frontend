// src/components/Catalogo/views/CategoriesView.tsx
import { component$ } from '@builder.io/qwik';
import type { CategoryViewProps } from '../types/catalog.types';
import { CategoryCard, ContactSection } from '../components/CategoryCard';

/**
 * Vista principale delle categorie del catalogo
 * Layout coerente con ProductShowcaseQwik per mantenere la continuità visiva
 */
export const CategoriesView = component$<CategoryViewProps>(({ categories, onSelectCategory }) => {
  return (
    <div class="w-full">
      {/* Contenuto principale - Stesso max-width di ProductShowcaseQwik */}
      <section class="w-full max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header della sezione */}
        <div class="text-center mb-16">
          <h2 class="text-2xl md:text-4xl lg:text-6xl text-brand max-w-4xl mx-auto leading-relaxed font-telegraf">
            Esplora le nostre soluzioni professionali
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto pt-4">
            Scopri la gamma completa dei nostri servizi organizzati per aree di competenza. 
            Ogni categoria offre soluzioni specializzate per le tue esigenze aziendali.
          </p>
        </div>

        {/* Griglia categorie - Layout identico a ProductShowcaseQwik */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 transition-all duration-300 ease-in-out">
          {categories.map((category, index) => (
            <div 
              key={category.id}
              class="animate-fadeIn"
              style={`animation-delay: ${index * 150}ms`}
            >
              <CategoryCard 
                category={category}
                onSelect={onSelectCategory}
              />
            </div>
          ))}
        </div>

        {/* Stats sezione - Informazioni aggiuntive coerenti */}
        <div class="mt-20 mb-16">
          <div class="bg-gray-50 rounded-2xl p-8 lg:p-12 border border-gray-100">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              
              {/* Prodotti totali */}
              <div class="space-y-2">
                <div class="text-3xl font-bold text-blue-600">
                  {categories.reduce((total, cat) => 
                    total + cat.subcategories.reduce((subTotal, sub) => 
                      subTotal + sub.products.length, 0), 0
                  )}+
                </div>
                <div class="text-sm font-medium uppercase tracking-wider text-gray-500">
                  Prodotti Disponibili
                </div>
                <div class="text-gray-600 text-sm">
                  Soluzioni professionali certificate
                </div>
              </div>

              {/* Categorie */}
              <div class="space-y-2">
                <div class="text-3xl font-bold text-blue-600">
                  {categories.length}
                </div>
                <div class="text-sm font-medium uppercase tracking-wider text-gray-500">
                  Aree di Competenza
                </div>
                <div class="text-gray-600 text-sm">
                  Specializzazioni settoriali
                </div>
              </div>

              {/* Anni esperienza */}
              <div class="space-y-2">
                <div class="text-3xl font-bold text-blue-600">
                  15+
                </div>
                <div class="text-sm font-medium uppercase tracking-wider text-gray-500">
                  Anni di Esperienza
                </div>
                <div class="text-gray-600 text-sm">
                  Nel settore professionale
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Sezione vantaggi - Coerente con il design */}
        <div class="mb-20">
          <div class="text-center mb-12">
            <h3 class="text-2xl font-normal text-gray-900 mb-4">
              Perché scegliere le nostre soluzioni
            </h3>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Qualità, professionalità e innovazione per supportare la crescita del tuo business
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Qualità certificata */}
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center group hover:shadow-lg transition-all duration-300">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">Qualità Certificata</h4>
              <p class="text-sm text-gray-600">Prodotti conformi alle normative più stringenti</p>
            </div>

            {/* Consulenza specializzata */}
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center group hover:shadow-lg transition-all duration-300">
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">Consulenza Specializzata</h4>
              <p class="text-sm text-gray-600">Team di esperti qualificati al tuo servizio</p>
            </div>

            {/* Assistenza continua */}
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center group hover:shadow-lg transition-all duration-300">
              <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">Assistenza Continua</h4>
              <p class="text-sm text-gray-600">Supporto post-vendita e manutenzione</p>
            </div>

            {/* Soluzioni personalizzate */}
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center group hover:shadow-lg transition-all duration-300">
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 011 1v1z" />
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">Soluzioni Personalizzate</h4>
              <p class="text-sm text-gray-600">Progetti su misura per ogni esigenza</p>
            </div>

          </div>
        </div>

      </section>

      {/* Sezione contatti moderna - Utilizzando il componente che abbiamo creato */}
      <ContactSection />

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
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
});