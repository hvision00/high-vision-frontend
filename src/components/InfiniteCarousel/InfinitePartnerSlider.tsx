import { component$, useStyles$ } from '@builder.io/qwik';

interface Partner {
  id: string;
  name: string;
  logo: string;
  alt: string;
}

interface InfinitePartnerSliderProps {
  partners: Partner[];
  speed?: 'slow' | 'normal' | 'fast';
  pauseOnHover?: boolean;
  className?: string;
}

export const InfinitePartnerSlider = component$<InfinitePartnerSliderProps>(
  (props) => {
    const { partners, speed = 'normal', pauseOnHover = true, className = '' } = props;
    
    // Usa useStyles$ per includere i CSS
    useStyles$(`
      @keyframes slide {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      
      .slider-slow { animation: slide 60s linear infinite; }
      .slider-normal { animation: slide 30s linear infinite; }
      .slider-fast { animation: slide 15s linear infinite; }
      
      .slider-pause:hover { animation-play-state: paused; }
      
      .partner-item {
        backface-visibility: hidden;
        transform: translateZ(0);
        will-change: transform;
      }
    `);
    
    // Duplica i partner per l'effetto infinito
    const duplicatedPartners = [...partners, ...partners];
    
    // Definisce le classi per la velocità
    const speedClass = `slider-${speed}`;
    const pauseClass = pauseOnHover ? 'slider-pause' : '';
    
    return (
      <div class={`relative w-full overflow-hidden bg-white py-12 ${className}`}>
        <div class="relative">
          {/* Gradiente sinistro */}
          <div class="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          
          {/* Gradiente destro */}
          <div class="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          
          {/* Contenitore dello slider */}
          <div 
            class={`flex items-center gap-8 ${speedClass} ${pauseClass}`}
            style={`width: ${partners.length * 200}px`}
          >
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                class="partner-item flex-shrink-0 flex items-center justify-center w-48 h-24 grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.alt}
                  class="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);