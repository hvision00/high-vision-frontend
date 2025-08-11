// src/components/Catalogo/components/CategoryCard.tsx
import { component$ } from '@builder.io/qwik';
import type { CategoryCardProps } from '../types/catalog.types';

/**
 * Componente per la visualizzazione di una singola card categoria
 * Design identico a ProductShowcaseQwik per coerenza visiva
 */
export const CategoryCard = component$<CategoryCardProps>(({ category, onSelect }) => {
  // Calcola il numero totale di prodotti nella categoria
  const totalProducts = category.subcategories.reduce((total, sub) => total + sub.products.length, 0);

  return (
    <article 
      class="group cursor-pointer"
      onClick$={() => onSelect(category.id)}
    >
      {/* Contenitore immagine - Stesso design di ProductShowcaseQwik */}
      <div 
        class="relative rounded-lg overflow-hidden mb-6 aspect-[592/350] transition-transform duration-300"
        style={{
          backgroundImage: category.image ? `url('${category.image}')` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Fallback se non c'è immagine */}
        {!category.image && (
          <div class="absolute inset-0 bg-gray-300 flex items-center justify-center">
            <span class="text-white text-2xl font-normal">592 x 350</span>
          </div>
        )}
        
        {/* Overlay per migliorare la leggibilità - Stesso stile */}
        <div class="absolute inset-0 bg-black/30 bg-black/30 transition-colors duration-300"></div>
        
        {/* Badge conteggio prodotti - Top right */}
        <div class="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800 shadow-lg">
          {totalProducts} prodotti
        </div>
        
        {/* Pulsante ESPLORA - Stesso design del pulsante APPROFONDISCI */}
        <div class="absolute bottom-8 left-8 z-10">
          <div class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-bold text-sm tracking-wide transition-colors duration-200 group-hover:shadow-lg">
            <span class="flex items-center gap-2">
              APPROFONDISCI
              <span class="text-xl font-medium">+</span>
            </span>
          </div>
        </div>
      </div>

      {/* Categoria label sopra il titolo - Stesso stile */}
      <p class="text-xs font-bold uppercase text-gray-500 mb-2">
        CATEGORIA
      </p>

      {/* Titolo categoria - Stesso stile */}
      <h2 class="text-2xl font-normal mb-3">
        {category.name}
      </h2>

      {/* Descrizione - Stesso stile */}
      <p class="text-gray-600 text-base">
        {category.description}
      </p>
    </article>
  );
});

/**
 * Sezione contatti moderna e piacevole
 * Sostituisce la vecchia sezione con sfondo scuro
 */
export const ContactSection = component$(() => {
  return (
    <section class="w-full bg-gradient-to-br from-blue-50 via-white to-gray-50 border-t border-gray-100 mt-20">
      <div class="max-w-7xl mx-auto px-6 py-20">
        {/* Header della sezione */}
        <div class="text-center mb-16">
          <h3 class="text-3xl font-normal text-gray-900 mb-4">
            Hai bisogno di assistenza?
          </h3>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Il nostro team di esperti è sempre disponibile per guidarti nella scelta delle soluzioni più adatte alle tue esigenze
          </p>
        </div>

        {/* Griglia contatti - Design moderno e pulito */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Telefono */}
          <a 
            href="tel:+390212345678"
            class="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-blue-200"
          >
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h4 class="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                Chiamaci
              </h4>
              <div class="text-blue-600 font-semibold text-lg mb-2">+39 02 1234 5678</div>
              <div class="text-gray-500 text-sm">Lun-Ven 9:00-18:00</div>
              <div class="text-gray-500 text-sm">Assistenza immediata</div>
            </div>
          </a>

          {/* Email */}
          <a 
            href="mailto:info@tuaazienda.it"
            class="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-green-200"
          >
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors duration-300">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 class="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                Scrivici
              </h4>
              <div class="text-green-600 font-semibold text-lg mb-2">info@tuaazienda.it</div>
              <div class="text-gray-500 text-sm">Risposta entro 2 ore</div>
              <div class="text-gray-500 text-sm">Consulenza specializzata</div>
            </div>
          </a>

          {/* WhatsApp */}
          <a 
            href="https://wa.me/393456789012"
            target="_blank"
            class="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-emerald-200"
          >
            <div class="text-center">
              <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-200 transition-colors duration-300">
                <svg class="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.003 2.744.898 5.3 2.427 7.255L.058 23.52l8.593-2.255A11.79 11.79 0 0012.05 24c6.555 0 11.89-5.335 11.893-11.893A11.819 11.819 0 0020.905 3.803" />
                </svg>
              </div>
              <h4 class="text-xl font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                WhatsApp
              </h4>
              <div class="text-emerald-600 font-semibold text-lg mb-2">+39 345 678 9012</div>
              <div class="text-gray-500 text-sm">Chat immediata</div>
              <div class="text-gray-500 text-sm">Supporto 24/7</div>
            </div>
          </a>
        </div>

        {/* Call to action aggiuntiva */}
        <div class="text-center mt-16">
          <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h4 class="text-xl font-semibold text-gray-900 mb-4">
              Richiedi una consulenza personalizzata
            </h4>
            <p class="text-gray-600 mb-6">
              I nostri esperti analizzeranno le tue esigenze e ti proporranno le soluzioni più adatte al tuo business
            </p>
            <a 
              href="/contatti"
              class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Richiedi Consulenza Gratuita
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});