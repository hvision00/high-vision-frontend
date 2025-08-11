import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';

interface Product {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  image: string;
  button: string;
  verified: boolean;
  category: string;  
  slug: string;      
}

const products: Product[] = [
  {
    id: 1,
    title: 'Abbigliamento personalizzato',
    subtitle: 'Abiti da lavoro con identità visiva coordinata',
    price: 'Stampa e fornitura',
    image: '/images/prodotti/immagine/abbigliamento-personalizzato-evidenza.jpg',
    button: 'SCOPRI +',
    verified: true,
    category: 'immagine',
    slug: 'abbigliamento-personalizzato'
  },
  {
    id: 2,
    title: 'Sviluppo web',
    subtitle: 'Realizzazione di interfaccie web funzionali e personalizzati',
    price: 'Siti aziendali su misura',
    image: '/images/prodotti/immagine/sviluppo-web-evidenza.jpg',
    button: 'SCOPRI +',
    verified: true,
    category: 'immagine',
    slug: 'sviluppo-web'
  },
  {
    id: 3,
    title: 'Corsi di sicurezza',
    subtitle: 'Formazione obbligatoria su salute e sicurezza in azienda',
    price: 'Per lavoratori e RSPP',
    image: '/images/prodotti/formazione/corsi-di-sicurezza-evidenza.jpg',
    button: 'SCOPRI +',
    verified: true,
    category: 'formazione',
    slug: 'corsi-di-sicurezza'
  },
  {
    id: 4,
    title: 'Scaffalature industriali',
    subtitle: 'Soluzioni robuste e modulari per ambienti produttivi',
    price: 'Sistemi certificati',
    image: '/images/prodotti/industria/scaffalature-industriali-evidenza.jpg',
    button: 'SCOPRI +',
    verified: true,
    category: 'industria',
    slug: 'scaffalature-industriali'
  },
  {
    id: 5,
    title: 'Cartellonistica di sicurezza',
    subtitle: 'Soluzioni complete per la sicurezza sul posto di lavoro',
    price: 'Conforme alle normative',
    image: '/images/prodotti/sicurezza/cartellonistica-di-sicurezza-evidenza.jpg',
    button: 'SCOPRI +',
    verified: true,
    category: 'sicurezza',
    slug: 'cartellonistica-di-sicurezza'
  },
  {
    id: 6,
    title: 'Videoconferenza streaming',
    subtitle: 'Formazione professionale certificata per aziende',
    price: 'Formazione in streaming',
    image: '/images/prodotti/formazione/videoconferenza-streaming-evidenza.jpg',
    button: 'SCOPRI +',
    verified: true,
    category: 'formazione',
    slug: 'videoconferenza-streaming'
  },
  {
    id: 7,
    title: 'Protezione antincendio',
    subtitle: 'Commercio e manutenzione di prodotti per la prevenzione incendi aziendale',
    price: 'Fornitura e manutenzione',
    image: '/images/prodotti/sicurezza/protezione-antincendio-evidenza.jpg',
    button: 'SCOPRI +',
    verified: true,
    category: 'sicurezza',
    slug: 'protezione-antincendio'
  },
  {
    id: 8,
    title: 'Gadget personalizzati',
    subtitle: 'Oggetti brandizzati per promuovere la tua azienda',
    price: 'Gadget brandizzati',
    image: '/images/prodotti/immagine/gadget-personalizzati-evidenza.jpg',
    button: 'SCOPRI +',
    verified: true,
    category: 'immagine',
    slug: 'gadget-personalizzati'
  },
];

export default component$(() => {
  const currentIndex = useSignal(0);
  const progress = useSignal(0);
  const isPaused = useSignal(false);
  const isDragging = useSignal(false);
  const startX = useSignal(0);
  const currentX = useSignal(0);
  const containerRef = useSignal<HTMLDivElement>();
  const viewportWidth = useSignal(375); // Default mobile width
  
  const slideCount = products.length;
  const autoplayDuration = 5000; // 5 secondi per slide
  
  // 🎯 FUNZIONE PER GENERARE URL PRODOTTO
  const getProductUrl = (product: Product) => {
    return `/prodotti/${product.category}/${product.slug}`;
  };
  
  // Funzione per passare alla slide successiva
  const nextSlide = $(() => {
    currentIndex.value = (currentIndex.value + 1) % slideCount;
    progress.value = 0;
  });
  
  // Funzione per passare alla slide precedente
  const prevSlide = $(() => {
    currentIndex.value = (currentIndex.value - 1 + slideCount) % slideCount;
    progress.value = 0;
  });
  
  // Funzione per andare a una slide specifica
  const goToSlide = $((index: number) => {
    currentIndex.value = index;
    progress.value = 0;
  });
  
  // Gestione touch/swipe per mobile con animazione fluida
  const handleTouchStart = $((e: TouchEvent) => {
    if (!e.touches || !e.touches[0]) return; // Controllo aggiunto
    
    isDragging.value = true;
    startX.value = e.touches[0].clientX;
    currentX.value = startX.value;
    isPaused.value = true; // Pausa durante il drag
  });
  
  const handleTouchMove = $((e: TouchEvent) => {
    if (!isDragging.value) return;
    if (!e.touches || !e.touches[0]) return; // Controllo aggiunto
    
    currentX.value = e.touches[0].clientX;
  });
  
  const handleTouchEnd = $(() => {
    if (!isDragging.value) return;
    isDragging.value = false;
    isPaused.value = false; // Riprendi dopo il drag
    
    const diff = startX.value - currentX.value;
    const threshold = 50; // Minimo movimento per trigger swipe
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  });
  
  // Track viewport width per calcoli responsive
  useVisibleTask$(({ cleanup }) => {
    const updateViewportWidth = () => {
      if (typeof window !== 'undefined') {
        viewportWidth.value = window.innerWidth;
      }
    };
    
    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);
    
    cleanup(() => {
      window.removeEventListener('resize', updateViewportWidth);
    });
  });
  
  // Autoplay con progress bar fluida
  useVisibleTask$(({ track, cleanup }) => {
    track(() => isPaused.value);
    track(() => currentIndex.value);
    
    if (isPaused.value) return;
    
    let startTime = Date.now() - (progress.value / 100) * autoplayDuration;
    let animationFrame: number;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / autoplayDuration) * 100;
      
      if (newProgress >= 100) {
        nextSlide();
        startTime = Date.now();
      } else {
        progress.value = newProgress;
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    cleanup(() => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    });
  });
  
  // Calcola la posizione di traslazione per l'animazione
  const getTranslateX = () => {
    const isMobile = viewportWidth.value < 768;
    const isTablet = viewportWidth.value >= 768 && viewportWidth.value < 1280; // md a xl
    const isDesktop = viewportWidth.value >= 1280; // xl e oltre
    
    if (isMobile) {
      // Mobile: calcolo semplificato per centrare la card
      const containerPadding = 32; // px-4 = 16px per lato = 32px totale
      const availableWidth = viewportWidth.value - containerPadding;
      const cardWidth = Math.min(availableWidth - 32, 320); // Larghezza card mobile ottimale
      const gap = 24; // gap-6
      
      // Offset per centrare la card attiva
      const centerOffset = (availableWidth - cardWidth) / 2;
      return centerOffset - (currentIndex.value * (cardWidth + gap));
    } else if (isTablet) {
      // Tablet/schermi intermedi: centra una singola card
      const cardWidth = 384; // max-w-sm = 24rem = 384px
      const gap = 24; // gap-6
      const containerWidth = Math.min(viewportWidth.value - 64, 1280); // container max-width
      
      // Centra la card attiva nel viewport
      const centerOffset = (containerWidth - cardWidth) / 2;
      return centerOffset - (currentIndex.value * (cardWidth + gap));
    } else {
      // Desktop XL: mantieni la logica originale con 3 card
      const cardWidth = 384; // max-w-sm = 24rem = 384px
      const gap = 24; // gap-6 = 1.5rem = 24px
      const totalCards = products.length;
      const adjustedIndex = (currentIndex.value + totalCards) % totalCards;
      return -((adjustedIndex + totalCards) * (cardWidth + gap)) + (cardWidth + gap);
    }
  };
  
  return (
    <section class="w-full bg-white overflow-hidden pb-24">
      <div class="container mx-auto px-4">
        {/* Header */}
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-4xl lg:text-6xl text-brand max-w-4xl mx-auto leading-relaxed font-telegraf">
          Offerte strutturate, <br />impatto misurabile.
          </h2>
        </div>
        
        {/* Slider Container */}
        <div 
          ref={containerRef}
          class="relative max-w-7xl mx-auto"
          onMouseEnter$={() => isPaused.value = true}
          onMouseLeave$={() => isPaused.value = false}
          onTouchStart$={handleTouchStart}
          onTouchMove$={handleTouchMove}
          onTouchEnd$={handleTouchEnd}
        >
          {/* Navigation Arrows - Desktop XL Only */}
          <button
            onClick$={prevSlide}
            class="hidden xl:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:shadow-xl transition-all group"
            aria-label="Slide precedente"
          >
            <svg class="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick$={nextSlide}
            class="hidden xl:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:shadow-xl transition-all group"
            aria-label="Slide successiva"
          >
            <svg class="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Products Carousel */}
          <div class="xl:overflow-visible overflow-hidden mx-auto py-8">
            <div 
              class="flex gap-6 transition-transform duration-700 ease-out xl:justify-start"
              style={{
                transform: `translateX(${getTranslateX()}px)`,
              }}
            >
              {/* Duplichiamo l'array per creare l'effetto infinito */}
              {[...products, ...products, ...products].map((product, i) => {
                const realIndex = i % slideCount;
                const isActive = realIndex === currentIndex.value;
                
                return (
                  <div
                    key={`${product.id}-${i}`}
                    class={`
                      relative rounded-2xl shadow-lg flex flex-col flex-shrink-0
                      transition-all duration-700 ease-out h-[28rem]
                      w-full max-w-[calc(100vw-4rem)] md:max-w-sm
                      ${isActive ? 'shadow-2xl xl:scale-105' : 'shadow-lg xl:scale-100 xl:opacity-90'}
                    `}
                    style={{
                      overflow: 'hidden',
                      borderRadius: '1rem',
                      // Su mobile, usa una larghezza fissa calcolata dinamicamente
                      ...(viewportWidth.value < 768 && {
                        width: `${Math.min(viewportWidth.value - 64, 320)}px`
                      }),
                      // Su tablet, usa larghezza standard
                      ...(viewportWidth.value >= 768 && viewportWidth.value < 1280 && {
                        width: '384px' // max-w-sm fisso per tablet
                      })
                    }}
                  >
                    {/* Background Image */}
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      class="absolute inset-0 w-full h-full object-cover" 
                      loading="lazy"
                    />
                    
                    {/* Gradient Overlay con Blur */}
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-black/0 to-transparent"></div>
                    
                    {/* Blur graduale dal basso */}
                    <div class="absolute inset-0">
                      <div class="absolute inset-x-0 bottom-0 h-2/4 bg-gradient-to-t from-black/80 via-black/40 to-transparent" 
                           >
                      </div>
                    </div>
                    
                    {/* Product Content */}
                    <div class="relative flex flex-col gap-3 p-6 h-full justify-end z-10">
                      <div class="space-y-3">
                        <div class="flex items-center gap-2">
                          <h3 class="font-semibold text-xl text-gray-200">{product.title}</h3>
                          {product.verified && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="12" fill="#2563eb" />
                              <path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          )}
                        </div>
                        <p class="text-gray-400 text-sm leading-relaxed">{product.subtitle}</p>
                        <div class="flex items-end justify-between pt-2">
                          <span class="text-sm text-gray-500">{product.price}</span>
                          
                          {/* 🎯 SOSTITUISCI IL BUTTON CON UN LINK */}
                          <a 
                            href={getProductUrl(product)}
                            class="bg-blue-600 text-white rounded-lg px-5 py-2.5 text-sm font-regular shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 inline-block text-center"
                          >
                            {product.button}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Progress Indicators */}
        <div class="flex items-center justify-center mt-12">
          <div class="inline-flex items-center gap-3 bg-gray-100 px-6 py-3 rounded-full">
            {products.map((_, i) => (
              <button
                key={i}
                onClick$={() => goToSlide(i)}
                class="relative group"
                aria-label={`Vai alla slide ${i + 1}`}
              >
                <div class={`
                  relative overflow-hidden rounded-full transition-all duration-500 ease-out
                  ${i === currentIndex.value ? 'w-20 h-3 bg-gray-200' : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'}
                `}>
                  {i === currentIndex.value && (
                    <div
                      class="absolute inset-0 bg-blue-600 rounded-full origin-left"
                      style={{
                        transform: `scaleX(${progress.value / 100})`,
                        transition: 'transform 0.1s linear',
                      }}
                    />
                  )}
                </div>
                {/* Tooltip */}
                <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  Slide {i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Play/Pause Button */}
        <div class="flex justify-center mt-6">
          <button
            onClick$={() => isPaused.value = !isPaused.value}
            class="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            aria-label={isPaused.value ? 'Riprendi autoplay' : 'Pausa autoplay'}
          >
            {isPaused.value ? (
              <>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                </svg>
                Riprendi
              </>
            ) : (
              <>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                Pausa
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
});