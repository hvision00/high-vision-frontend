import { component$, useSignal } from '@builder.io/qwik';

interface Product {
  title: string;
  description: string;
  imageSize: string;
  category?: string;
  image?: string;
}

interface Props {
  title: string;
}

export default component$<Props>(({ title }) => {
  const activeCategory = useSignal('tutto');

  const categories: Record<string, Product[]> = {
    tutto: [
      {
        title: "Abbigliamento personalizzato",
        description: "Abiti da lavoro con identità visiva coordinata",
        imageSize: "592 x 350",
        category: "immagine",
        image: "/images/prodotti/immagine/abbigliamento-personalizzato.jpg"
      },
      {
        title: "Sviluppo web", 
        description: "Realizzazione di interfaccie web funzionali e personalizzati",
        imageSize: "592 x 350",
        category: "immagine",
        image: "/images/prodotti/immagine/sviluppo-web.jpg"
      },
      {
        title: "Corsi di sicurezza",
        description: "Formazione obbligatoria su salute e sicurezza in azienda",
        imageSize: "592 x 350",
        category: "formazione",
        image: "/images/prodotti/formazione/corsi-di-sicurezza.jpg"
      },
      {
        title: "Scaffalature industriali",
        description: "Soluzioni robuste e modulari per ambienti produttivi",
        imageSize: "592 x 350",
        category: "sicurezza",
        image: "/images/prodotti/industria/scaffalature-industriali.jpg"
      }
    ],
    immagine: [
      {
        title: "Abbigliamento personalizzato",
        description: "Abiti da lavoro con identità visiva coordinata",
        imageSize: "592 x 350",
        image: "/images/prodotti/immagine/abbigliamento-personalizzato.jpg"
      },
      {
        title: "Gadget personalizzati", 
        description: "Oggetti brandizzati per promuovere la tua azienda",
        imageSize: "592 x 350",
        image: "/images/prodotti/immagine/gadget-personalizzati.jpg"
      },
      {
        title: "Sviluppo web", 
        description: "Realizzazione di interfaccie web funzionali e personalizzati",
        imageSize: "592 x 350",
        image: "/images/prodotti/immagine/sviluppo-web.jpg"
      }
    ],
    industria: [
      {
        title: "Scaffalature industriali",
        description: "Soluzioni robuste e modulari per ambienti produttivi",
        imageSize: "592 x 350",
        image: "/images/prodotti/industria/scaffalature-industriali.jpg"
      },
      {
        title: "Abbigliamento tecnico",
        description: "Indumenti certificati per lavori in ambito industriale",
        imageSize: "592 x 350",
        image: "/images/prodotti/industria/abbigliamento-tecnico.jpg"
      },
      {
        title: "Attrezzature specializzate industriali",
        description: "Strumenti professionali per attività operative complesse",
        imageSize: "592 x 350",
        image: "/images/prodotti/industria/attrezzature-specializzate-industriali.jpg"
      }
    ],
    sicurezza: [
      {
        title: "Protezione antincendio",
        description: "Commercio e manutenzione di prodotti per la prevenzione incendi aziendale",
        imageSize: "592 x 350",
        image: "/images/prodotti/sicurezza/protezione-antincendio.jpg"
      },
      {
        title: "Antinfortunistica",
        description: "Soluzioni complete per la sicurezza sul posto di lavoro",
        imageSize: "592 x 350",
        image: "/images/prodotti/sicurezza/antinfortunistica.jpg"
      },
      {
        title: "Cartellonistica di sicurezza",
        description: "Soluzioni complete per la sicurezza sul posto di lavoro",
        imageSize: "592 x 350",
        image: "/images/prodotti/sicurezza/cartellonistica-di-sicurezza.jpg"
      }
    ],
    formazione: [
      {
        title: "Corsi di sicurezza",
        description: "Formazione professionale certificata per aziende",
        imageSize: "592 x 350",
        image: "/images/prodotti/formazione/corsi-di-sicurezza.jpg"
      },
      {
        title: "Videoconferenza streaming",
        description: "Formazione certificata attraverso piattaforme di streaming",
        imageSize: "592 x 350",
        image: "/images/prodotti/formazione/videoconferenza-streaming.jpg"
      },
      {
        title: "E-learning aziendale",
        description: "Piattaforme digitali per la formazione certificata del personale",
        imageSize: "592 x 350",
        image: "/images/prodotti/formazione/e-learning-aziendale.jpg"
      }
    ]
  };

  const navItems = [
    { label: "Tutto", key: "tutto" },
    { label: "Immagine", key: "immagine" },
    { label: "Industria", key: "industria" },
    { label: "Sicurezza", key: "sicurezza" },
    { label: "Formazione", key: "formazione" }
  ];

  return (
    <section class="w-full max-w-7xl mx-auto px-4 sm:px-6">
      {/* Titolo principale */}
      <h1 class="text-2xl md:text-4xl lg:text-6xl font-telegraf text-brand text-center mb-12 max-w-3xl mx-auto">
        {title}
      </h1>

      {/* Menu di navigazione */}
      <nav class="flex justify-center items-center mb-16">
        <ul class="flex gap-8 flex-wrap">
          {navItems.map((item) => (
            <li key={item.key}>
              <button 
                onClick$={() => activeCategory.value = item.key}
                class={`text-base font-normal transition-all duration-200 pb-2 ${
                  activeCategory.value === item.key
                    ? 'text-gray-900 border-b-2 border-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Titolo categoria */}
      <h2 class="text-sm font-medium uppercase tracking-wider text-gray-600 mb-8 text-center">
        {navItems.find(item => item.key === activeCategory.value)?.label}
      </h2>

      {/* Griglia dei prodotti */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 transition-all duration-300 ease-in-out">
        {categories[activeCategory.value]?.map((product, index) => (
          <article 
            key={`${activeCategory.value}-${index}`} 
            class="group animate-fadeIn"
            style={`animation-delay: ${index * 100}ms`}
          >
            {/* Contenitore immagine */}
            <div 
              class="relative rounded-lg overflow-hidden mb-6 aspect-[592/350]"
              style={{
                backgroundImage: product.image ? `url('${product.image}')` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Fallback se non c'è immagine */}
              {!product.image && (
                <div class="absolute inset-0 bg-gray-300 flex items-center justify-center">
                  <span class="text-white text-2xl font-normal">{product.imageSize}</span>
                </div>
              )}
              
              {/* Overlay per migliorare la leggibilità */}
              {product.image && <div class="absolute inset-0 bg-black/30"></div>}
              
              {/* Pulsante APPROFONDISCI */}
              <div class="absolute bottom-8 left-8 z-10">
                <a 
                  href={`/prodotti/${activeCategory.value === 'tutto' && product.category ? product.category : activeCategory.value}/${product.title.toLowerCase().replace(/\s+/g, '-').replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u')}`}
                  class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium text-sm tracking-wide transition-colors duration-200"
                >
                  <span class="flex items-center gap-2">
                    APPROFONDISCI
                    <span class="text-xl font-light">+</span>
                  </span>
                </a>
              </div>
            </div>

            {/* Categoria sopra il titolo */}
            <p class="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">
              {activeCategory.value === 'tutto' && product.category 
                ? navItems.find(item => item.key === product.category)?.label 
                : navItems.find(item => item.key === activeCategory.value)?.label}
            </p>

            {/* Titolo prodotto */}
            <h2 class="text-2xl font-normal mb-3">
              {product.title}
            </h2>

            {/* Descrizione */}
            <p class="text-gray-600 text-base">
              {product.description}
            </p>
          </article>
        ))}
      </div>

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
    </section>
  );
});