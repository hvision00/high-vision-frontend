import { component$, useStyles$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

interface Partner {
  id: string;
  name: string;
  logo: string;
  alt: string;
}

interface OptimizedPartnerSliderProps {
  partners: Partner[];
  speed?: 'slow' | 'normal' | 'fast';
  pauseOnHover?: boolean;
  className?: string;
}

export const OptimizedPartnerSlider = component$<OptimizedPartnerSliderProps>(
  (props) => {
    const { partners, speed = 'normal', pauseOnHover = true, className = '' } = props;
    
    const sliderRef = useSignal<HTMLDivElement>();
    const isAnimating = useSignal(true);
    
    // Styles usando useStyles$
    useStyles$(`
      .infinite-slider {
        display: flex;
        width: fit-content;
        animation-fill-mode: both;
        backface-visibility: hidden;
        transform: translateZ(0);
        will-change: transform;
      }
      
      .slider-slow { animation: slide 60s linear infinite; }
      .slider-normal { animation: slide 30s linear infinite; }
      .slider-fast { animation: slide 15s linear infinite; }
      
      .slider-paused { animation-play-state: paused; }
      
      @keyframes slide {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }


      .partner-item {
          min-width: 120px;
          height: 40px;
        }
      
      .gradient-overlay {
        position: absolute;
        top: 0;
        height: 100%;
        width: 96px;
        pointer-events: none;
        z-index: 10;
      }
      
      .gradient-left {
        left: 0;
        background: linear-gradient(to right, white, transparent);
      }
      
      .gradient-right {
        right: 0;
        background: linear-gradient(to left, white, transparent);
      }
      
      @media (max-width: 768px) {
        .partner-item {
          min-width: 120px;
          height: 60px;
        }
      }
    `);
    
    // Gestisce la pausa al hover
    useVisibleTask$(({ track }) => {
      track(() => sliderRef.value);
      
      const slider = sliderRef.value;
      if (!slider || !pauseOnHover) return;
      
      const handleMouseEnter = () => {
        isAnimating.value = false;
        slider.style.animationPlayState = 'paused';
      };
      
      const handleMouseLeave = () => {
        isAnimating.value = true;
        slider.style.animationPlayState = 'running';
      };
      
      slider.addEventListener('mouseenter', handleMouseEnter);
      slider.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        slider.removeEventListener('mouseenter', handleMouseEnter);
        slider.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
    
    // Duplica i partner per l'effetto infinito
    const duplicatedPartners = [...partners, ...partners];
    const speedClass = `slider-${speed}`;
    
    return (
      <section class={`relative w-full container mx-auto overflow-hidden py-[96px] ${className}`}>
        <div class="max-w-7xl mx-auto ">
          
          <div class="relative">
            {/* Gradienti */}
            <div class="gradient-overlay gradient-left"></div>
            <div class="gradient-overlay gradient-right"></div>
            
            {/* Slider */}
            <div 
              ref={sliderRef}
              class={`infinite-slider ${speedClass} gap-8`}
            >
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  class="partner-item flex-shrink-0 flex items-center justify-center w-48 h-24"
                >
                  <img
                    src={partner.logo}
                    alt={partner.alt}
                    class="partner-logo max-w-full max-h-full object-contain"
                    loading="lazy"
                    width="192"
                    height="96"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
);