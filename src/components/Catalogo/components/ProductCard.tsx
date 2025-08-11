// src/components/Catalogo/components/ProductCard.tsx
import { component$ } from '@builder.io/qwik';
import type { ProductCardProps } from '../types/catalog.types';

/**
 * Componente per la visualizzazione di una singola card prodotto
 * Design pulito e minimale con focus su usabilità e coerenza visiva
 */
export const ProductCard = component$<ProductCardProps>(({ product, onShowDetail, onContact }) => {
  return (
    <div class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
      {/* Container Immagine */}
      <div class="relative h-64 overflow-hidden bg-gray-50">
        <img 
          src={product.image}
          alt={product.name}
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Featured Badge - Design pulito senza gradient */}
        {product.featured && (
          <div class="absolute top-4 right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-4 h-4 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )}

        {/* Overlay scuro al hover per migliorare leggibilità */}
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>

      {/* Contenuto Card */}
      <div class="p-6">
        {/* Header con Nome e Prezzo */}
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight pr-2">
            {product.name}
          </h3>
          {product.price && (
            <div class="flex-shrink-0">
              <span class="text-lg font-bold text-blue-600">
                {product.price}
              </span>
            </div>
          )}
        </div>
        
        {/* Descrizione */}
        <p class="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
          {product.description}
        </p>

        {/* Features - Design pulito con badge minimali */}
        {product.features && product.features.length > 0 && (
          <div class="mb-6">
            <div class="flex flex-wrap gap-2">
              {product.features.slice(0, 3).map((feature, idx) => (
                <span 
                  key={idx}
                  class="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-100"
                >
                  {feature}
                </span>
              ))}
              {product.features.length > 3 && (
                <span class="text-xs text-gray-500 px-3 py-1 bg-gray-100 rounded-full font-medium">
                  +{product.features.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Sezione Referenti - Design pulito e leggibile */}
        <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div class="flex items-center mb-2">
            <svg class="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div class="text-xs text-gray-500 font-medium uppercase tracking-wide">Referenti Specializzati</div>
          </div>
          <div class="text-sm text-gray-800 font-semibold">{product.referenti}</div>
        </div>

        {/* Azioni - Pulsanti puliti e intuitivi */}
        <div class="flex gap-3">
          <button 
            onClick$={() => onShowDetail(product)}
            class="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-transform"
          >
            Dettagli
          </button>
          <button 
            onClick$={() => onContact(product)}
            class="flex-1 border-2 border-blue-600 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm font-semibold hover:shadow-md transform hover:-translate-y-0.5 transition-transform"
          >
            Contatta
          </button>
        </div>
      </div>
    </div>
  );
});

/**
 * Variante compatta della ProductCard per elenchi più densi
 * Utilizzabile in future implementazioni se necessario
 */
export const ProductCardCompact = component$<ProductCardProps>(({ product, onShowDetail, onContact }) => {
  return (
    <div class="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200">
      <div class="flex">
        {/* Immagine più piccola a sinistra */}
        <div class="relative w-24 h-24 flex-shrink-0 bg-gray-50">
          <img 
            src={product.image}
            alt={product.name}
            class="w-full h-full object-cover"
            loading="lazy"
          />
          
          {product.badge === 'Bestseller' && (
            <div class="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-2 py-0.5 rounded text-xs font-semibold">
              {product.badge}
            </div>
          )}
        </div>
        
        {/* Contenuto a destra */}
        <div class="flex-1 p-4">
          <div class="flex items-start justify-between mb-2">
            <h4 class="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
              {product.name}
            </h4>
            {product.price && (
              <span class="text-sm font-bold text-blue-600 ml-2">
                {product.price}
              </span>
            )}
          </div>
          
          <p class="text-xs text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div class="flex gap-2">
            <button 
              onClick$={() => onShowDetail(product)}
              class="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
            >
              Dettagli
            </button>
            <button 
              onClick$={() => onContact(product)}
              class="flex-1 border border-blue-600 text-blue-600 px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-50 transition-colors"
            >
              Contatta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});