import { component$, $ } from '@builder.io/qwik';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  icon?: string;
  url: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Immagine',
    description: 'Comunicazione visiva e branding',
    image: '/images/offerte/immagine.jpg',
    url: '/prodotti/immagine',
  },
  {
    id: 2,
    name: 'Sicurezza',
    description: 'Sistemi di protezione avanzati',
    image: '/images/offerte/sicurezza.jpg',
    url: '/prodotti/sicurezza',
  },
  {
    id: 3,
    name: 'Formazione',
    description: 'Percorsi formativi specializzati',
    image: '/images/offerte/formazione.jpg',
    url: '/prodotti/formazione',
  },
  {
    id: 4,
    name: 'Industria',
    description: 'Soluzioni per il settore industriale',
    image: '/images/offerte/industria.jpg',
    url: '/prodotti/industria',
  },
];

export default component$(() => {
  const navigateTo = $((url: string) => {
    window.location.href = url;
  });

  return (
    <div class="relative">
      {/* Container principale */}
      <div class="relative">
        {/* Griglia Categorie */}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div 
              key={category.id}
              class="relative h-96 rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick$={() => navigateTo(category.url)}
            >
              {/* Immagine di sfondo */}
              <div 
                class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={`background-image: url('${category.image}')`}
              >
                {/* Fallback per immagini mancanti */}
                <div class="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400"></div>
              </div>
              
              {/* Gradiente nero dal basso */}
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {/* Overlay blu al hover */}
              <div class="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-all duration-300"></div>
              
              {/* Contenuto: Nome e Descrizione */}
              <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 class="font-semibold text-xl mb-1 group-hover:text-blue-200 transition-colors">
                  {category.name}
                </h3>
                <p class="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">
                  {category.description}
                </p>
                
                {/* Icona freccia che appare al hover */}
                <div class="mt-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <svg 
                    class="w-6 h-6 text-blue-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
              
              {/* Badge con icona categoria */}
              <div class="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {category.id === 1 && (
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {category.id === 2 && (
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
                {category.id === 3 && (
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
                {category.id === 4 && (
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});