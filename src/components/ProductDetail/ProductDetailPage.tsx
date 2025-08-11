import { component$, useSignal } from '@builder.io/qwik';

interface ProductData {
  title: string;
  type: string;
  description: string;
  categories: string[];
  referenti: string;
  images: string[];
}

interface Props {
  category: 'industria' | 'immagine' | 'sicurezza' | 'formazione';
  productIndex?: number;
  isCategoryPage?: boolean;
}

// Dati specifici per le pagine delle categorie principali
const mainCategoryData: Record<string, ProductData> = {
  immagine: {
    title: "Immagine e Comunicazione Aziendale",
    type: "Soluzioni Complete per l'Identità Aziendale",
    description: "Ci occupiamo di costruire e gestire l’identità visiva delle aziende attraverso un approccio integrato che unisce branding, comunicazione e sviluppo digitale. Realizziamo soluzioni coordinate che includono abbigliamento personalizzato, gadget promozionali e interfacce web progettate su misura, per garantire coerenza tra immagine fisica e presenza online. Ogni progetto è seguito internamente, dalla definizione del concept alla produzione finale, con attenzione alla funzionalità e all’allineamento con i valori aziendali. Il nostro obiettivo è offrire strumenti visivi immediatamente utilizzabili, senza complicazioni, assicurando continuità tra reparti, canali e materiali.",
    categories: ["Branding", "Sviluppo web", "Comunicazione Visiva", "Abbigliamento Aziendale", "Gadget Promozionali", "Marketing", "Identità Visiva", "Personalizzazione"],
    referenti: "Mirco Vitagliano, Nicholas Bellotto",
    images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
  },
  sicurezza: {
    title: "Sicurezza e Protezione sul Lavoro",
    type: "Soluzioni Complete per la Sicurezza Aziendale",
    description: "Affianchiamo le aziende nella gestione operativa della sicurezza sul lavoro, offrendo soluzioni complete che integrano fornitura di DPI certificati, sistemi antinfortunistici e supporto tecnico-specialistico. Ci occupiamo non solo della fornitura, ma anche dell’organizzazione e aggiornamento dei presìdi, con particolare attenzione alla conformità normativa e alla sostenibilità dei costi. Lavoriamo per garantire ambienti di lavoro sicuri, strutturati e pienamente in regola, adattando ogni intervento alle reali esigenze operative dell’impresa. Il nostro obiettivo è rendere la sicurezza un processo continuo, efficiente e ben gestito, non un adempimento isolato.",
    categories: ["DPI Certificati", "Sistemi Antinfortunistica", "Protezione antincendio", "Valutazione Rischi", "Consulenza Sicurezza", "Normative", "Prevenzione"],
    referenti: "Nicholas Bellotto, Mattia Muzzin",
    images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
  },
  formazione: {
    title: "Formazione obbligatoria",
    type: "Percorsi Formativi Innovativi per la Crescita Aziendale",
    description: "La nostra area Formazione si occupa della progettazione e dell’erogazione della formazione obbligatoria per i dipendenti, adottando metodologie innovative e strumenti digitali per garantire efficacia e coinvolgimento. Non ci limitiamo a fornire i corsi: gestiamo in modo integrato l’intero processo formativo, inclusi monitoraggio delle scadenze, invio di alert automatici, aggiornamenti normativi e reportistica. Dalla sicurezza sul lavoro ai percorsi di aggiornamento professionale, ogni intervento è tracciabile, personalizzabile e pienamente conforme agli standard richiesti. Il risultato è una gestione formativa efficiente, continua e priva di imprevisti per l’azienda.",
    categories: ["Formazione Certificata", "E-learning", "Videoconferenze in streaming", "Aggiornamento Professionale", "Metodologie Innovative", "Certificazioni"],
    referenti: "Giorgia Vitagliano, Mirco Vitagliano",
    images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
  },
  industria: {
    title: "Soluzioni Industriali Professionali",
    type: "Eccellenza Tecnica per il Settore Industriale",
    description: "Supportiamo le aziende nella gestione tecnica delle dotazioni industriali, fornendo scaffalature, abbigliamento tecnico e attrezzature specializzate adatte a ogni contesto operativo. Ogni fornitura è selezionata in base alle reali esigenze di impiego, alle normative vigenti e agli obiettivi di performance aziendale. Seguiamo direttamente tutte le fasi: dalla consulenza iniziale alla messa in opera, fino alla manutenzione e all’aggiornamento dei materiali. Collaboriamo con produttori certificati e garantiamo soluzioni che uniscono resistenza, sicurezza e continuità operativa, riducendo i carichi gestionali per l’azienda.",
    categories: ["Protezione Industriale", "Abbigliamento Tecnico", "Attrezzature Specializzate", "Conformità Normative", "Manutenzione", "Consulenza Tecnica", "Ottimizzazione Processi"],
    referenti: "Mattia Muzzin, Nicholas Bellotto",
    images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
  }
};

// Dati delle sottocategorie - AGGIORNATI CON I DATI ESATTI DEL PRODUCT SHOWCASE
const categoryData: Record<string, ProductData[]> = {
  immagine: [
    {
      title: "Abbigliamento personalizzato",
      type: "Abbigliamento personalizzato",
      description: "Forniamo abbigliamento personalizzato per aziende e organizzazioni che desiderano uniformare la propria immagine con capi funzionali, durevoli e riconoscibili. Gestiamo internamente l’intero processo: dalla scelta dei materiali alla personalizzazione grafica, fino alla produzione e consegna. Ogni capo è progettato per rispondere a esigenze operative reali, garantendo comfort, resistenza e coerenza con l’identità aziendale. Lavoriamo a stretto contatto con il cliente per assicurare forniture puntuali, coordinate e pronte all’uso.",
      categories: ["Workwear", "Divise", "Casual", "Sportivo", "Promozionale", "Accessori", "Personalizzazione"],
      referenti: "Mirco Vitagliano, Giorgia Vitagliano",
      images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
    },
    {
      title: "Gadget personalizzati",
      type: "Gadget promozionali",
      description: "Offriamo un servizio completo per la realizzazione di gadget personalizzati, utili in contesti promozionali, fieristici o come dotazioni aziendali interne. Selezioniamo prodotti funzionali e duraturi, personalizzabili su misura in base al target e agli obiettivi di comunicazione. Ci occupiamo della consulenza iniziale, del design, della produzione e della consegna, garantendo coerenza con l’immagine aziendale e tempi certi. Ogni oggetto è pensato per essere immediatamente utile, non solo visibile.",
      categories: ["Tecnologici", "Ufficio", "Outdoor", "Eco-friendly", "Premium"],
      referenti: "Giorgia Vitagliano",
      images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
    },
    {
      title: "Sviluppo web",
      type: "Realizzazione interfacce web",
      description: "Progettiamo e sviluppiamo interfacce web su misura, pensate per garantire usabilità, performance e coerenza con l’identità aziendale. Ci occupiamo della realizzazione di siti, portali o applicativi digitali con un approccio modulare, scalabile e integrabile nei flussi aziendali esistenti. Il nostro team unisce competenze in design, sviluppo e user experience per offrire soluzioni stabili, aggiornabili e pronte all’uso. Ogni progetto è strutturato per evolversi insieme alle esigenze del cliente.",
      categories: ["Frontend", "Backend", "UI/UX Design", "Responsive", "E-commerce", "CMS", "Ottimizzazione"],
      referenti: "Mirco Vitagliano",
      images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
    }
  ],
  industria: [
    {
      title: "Scaffalature industriali",
      type: "Soluzioni di stoccaggio",
      description: "Progettiamo e forniamo scaffalature industriali robuste e modulari, studiate per ottimizzare gli spazi di stoccaggio in ambienti produttivi. Ogni soluzione è personalizzata in base alle caratteristiche operative e strutturali del sito, garantendo efficienza, sicurezza e durabilità nel tempo.",
      categories: ["Scaffalature metalliche", "Sistemi modulari", "Stoccaggio industriale", "Ottimizzazione spazi"],
      referenti: "Giuseppe Rossi, Laura Verde",
      images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
    },
    {
      title: "Abbigliamento tecnico",
      type: "Indumenti certificati",
      description: "Forniamo abbigliamento tecnico certificato per ambienti industriali, progettato per garantire protezione, visibilità e resistenza. Ogni capo è conforme alle normative di sicurezza e costruito con materiali performanti, adatti a condizioni di lavoro impegnative e settori ad alta esposizione.",
      categories: ["Abbigliamento certificato", "Tessuti tecnici", "Sicurezza industriale", "Conformità normative"],
      referenti: "Marco Azzurro, Silvia Gialla",
      images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
    },
    {
      title: "Attrezzature specializzate industriali",
      type: "Strumenti professionali",
      description: "Offriamo attrezzature industriali specializzate selezionate per affidabilità, precisione e continuità operativa. Il nostro servizio comprende la consulenza tecnica, la fornitura e l’assistenza su strumentazioni professionali per attività produttive e manutentive in ambito industriale.",      
      categories: ["Strumenti di precisione", "Controllo qualità", "Movimentazione", "Sicurezza operativa"],
      referenti: "Andrea Nero, Francesca Bianca",
      images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
    }
  ],
  sicurezza: [
    {
      title: "Protezione antincendio",
      type: "Sistemi antincendio",
      description: "Forniamo sistemi antincendio certificati e ci occupiamo della loro installazione, manutenzione e verifica periodica. Offriamo soluzioni complete per la prevenzione incendi in ambito aziendale, garantendo conformità normativa, continuità operativa e massima affidabilità in caso di emergenza.",      
      categories: ["Estintori", "Impianti fissi", "Rilevazione incendi", "Manutenzione", "Certificazioni"],
      referenti: "Antonio Blu, Maria Rosa",
      images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
    },
    {
      title: "Antinfortunistica",
      type: "Soluzioni per la sicurezza",
      description: "Offriamo soluzioni antinfortunistiche integrate per ambienti di lavoro complessi, combinando DPI certificati, dispositivi collettivi e supporto tecnico. Ogni fornitura è costruita a partire da un’analisi dei rischi, con l’obiettivo di garantire protezione concreta e adempimenti sempre sotto controllo.",
      categories: ["DPI", "Sicurezza collettiva", "Anticaduta", "Gestione emergenze", "Formazione"],
      referenti: "Luca Viola, Anna Arancio",
      images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
    },
    {
      title: "Cartellonistica di sicurezza",
      type: "Segnaletica di sicurezza",
      description: "Forniamo cartellonistica di sicurezza conforme alle normative vigenti, pensata per assicurare visibilità, durabilità e resistenza in ogni contesto operativo. Offriamo una gamma completa di segnali per obblighi, divieti, emergenze e prevenzione degli infortuni.",      
      categories: ["Cartelli di sicurezza", "Pittogrammi", "Segnaletica", "Materiali resistenti", "Normative"],
      referenti: "Antonio Blu, Maria Rosa, Luca Viola",
      images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
    }
  ],
  formazione: [
    {
      title: "Corsi di sicurezza",
      type: "Formazione certificata",
      description: "Gestiamo l’intero ciclo della formazione obbligatoria: dalla programmazione corsi al monitoraggio delle scadenze, fino all’archiviazione delle certificazioni. Ogni percorso è conforme al D.Lgs. 81/08 ed è tracciabile tramite alert automatici, report e aggiornamenti formativi ricorrenti.",
      categories: ["Formazione obbligatoria", "Certificazioni", "Sicurezza sul lavoro", "Aggiornamenti normativi"],
      referenti: "Roberto Marrone, Giulia Celeste",
      images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
    },
    {
      title: "Videoconferenza streaming",
      type: "Formazione a distanza",
      description: "Offriamo corsi in videoconferenza certificata, in diretta con formatori abilitati. Una soluzione flessibile per garantire la partecipazione anche da remoto, mantenendo tracciabilità, interazione e piena conformità normativa nei casi in cui la presenza non è possibile.",
      categories: ["Formazione online", "Streaming professionale", "Certificazioni remote", "Piattaforme digitali"],
      referenti: "Franco Grigio, Elena Turchese",
      images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
    },
    {
      title: "E-learning aziendale",
      type: "Piattaforme educative",
      description: "Forniamo piattaforme e-learning per la formazione obbligatoria fruibile in autonomia, ideali per gestire grandi volumi di personale. Ogni corso è accessibile online, sempre aggiornato e corredato da sistemi di tracciamento, test automatici e avvisi di scadenza personalizzati.",      categories: ["LMS personalizzate", "Contenuti interattivi", "Apprendimento autonomo", "Tracking avanzato"],
      referenti: "Davide Indaco, Martina Corallo",
      images: ["1920 x 1080", "1920 x 1080", "1920 x 1080", "1920 x 1080"]
    }
  ]
};

export default component$<Props>(({ category, productIndex = 0, isCategoryPage = false }) => {
  const currentProductIndex = useSignal(productIndex);
  
  // Se è una pagina di categoria, usa i dati della categoria principale
  // Altrimenti usa i dati delle sottocategorie come prima
  const currentProduct = isCategoryPage 
    ? mainCategoryData[category]
    : (categoryData[category] || [])[currentProductIndex.value];

  if (!currentProduct) {
    return <div>Prodotto non trovato</div>;
  }

  // Titoli in alto a destra per categoria (STESSO LAYOUT ORIGINALE)
  const categoryTitles = {
    industria: "Soluzioni professionali per l'industria",
    immagine: "Personalizzazione e comunicazione aziendale",
    sicurezza: "Protezione e prevenzione sul lavoro",
    formazione: "Sviluppo delle competenze professionali"
  };

  const products = categoryData[category] || [];

  // 🎯 Funzione per mappare titoli prodotti a slug URL - AGGIORNATA CON I TITOLI CORRETTI
  const getServiceSlug = (title: string): string => {
    const mapping: Record<string, string> = {
      // Immagine
      'Abbigliamento personalizzato': 'abbigliamento-personalizzato',
      'Gadget personalizzati': 'gadget-personalizzati',
      'Sviluppo web': 'sviluppo-web',
      // Industria
      'Scaffalature industriali': 'scaffalature-industriali',
      'Abbigliamento tecnico': 'abbigliamento-tecnico',
      'Attrezzature specializzate industriali': 'attrezzature-specializzate-industriali',
      // Sicurezza
      'Protezione antincendio': 'protezione-antincendio',
      'Antinfortunistica': 'antinfortunistica',
      'Cartellonistica di sicurezza': 'cartellonistica-di-sicurezza',
      // Formazione
      'Corsi di sicurezza': 'corsi-di-sicurezza',
      'Videoconferenza streaming': 'videoconferenza-streaming',
      'E-learning aziendale': 'e-learning-aziendale'
    };
    
    return mapping[title] || 'generale';
  };

  return (
    <div class="min-h-screen bg-neutral-800">
      {/* Header con pulsante indietro e titolo - STESSO LAYOUT ORIGINALE */}
      <header class="relative w-full p-8">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          {/* Pulsante indietro */}
          <button
            onClick$={() => window.history.back()}
            class="flex items-center gap-2 text-white hover:text-gray-300 transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="text-sm font-medium uppercase tracking-wider">Indietro</span>
          </button>
          
          {/* Titolo a destra */}
          <div class="text-white text-base hidden md:block">
            {categoryTitles[category as keyof typeof categoryTitles]}
          </div>
        </div>
      </header>

      {/* Contenuto principale - STESSO LAYOUT ORIGINALE */}
      <main class="max-w-4xl mx-auto px-8 pb-16">
        {/* Sezione informazioni prodotto - STESSO LAYOUT ORIGINALE */}
        <section>
          {/* Categoria e titolo - STESSO LAYOUT ORIGINALE */}
          <div class="mb-12">
            <h3 class="text-gray-400 text-sm font-medium tracking-wider uppercase mb-4">
              {category.toUpperCase()}
            </h3>
            <h1 class="text-white text-4xl font-light leading-tight mb-8">
              {currentProduct.title}
            </h1>
          </div>

          {/* Grid informazioni - STESSO LAYOUT ORIGINALE */}
          <div class="gap-8">
            {/* Tipologia - STESSO LAYOUT ORIGINALE */}
            <div class="pb-8">
              <h4 class="text-gray-400 text-sm font-medium tracking-wider uppercase mb-3">
                TIPOLOGIA
              </h4>
              <p class="text-white text-base">
                {currentProduct.type}
              </p>
            </div>

            {/* Categorie - STESSO LAYOUT ORIGINALE */}
            <div class="pb-8">
              <h4 class="text-gray-400 text-sm font-medium tracking-wider uppercase mb-3">
                CATEGORIE
              </h4>
              <ul class="space-y-2">
                {currentProduct.categories.map((cat, i) => (
                  <li key={i} class="text-white text-base flex items-center">
                    <span class="w-2 h-2 bg-white rounded-full mr-3"></span>
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Referenti - STESSO LAYOUT ORIGINALE */}
            <div class="pb-8">
              <h4 class="text-gray-400 text-sm font-medium tracking-wider uppercase mb-3">
                REFERENTI
              </h4>
              <p class="text-white text-base">
                {currentProduct.referenti}
              </p>
            </div>
          </div>
        </section>

        {/* Descrizione - STESSO LAYOUT ORIGINALE */}
        <div class="mb-12">
          <h4 class="text-gray-400 text-sm font-medium tracking-wider uppercase mb-3">
            DESCRIZIONE
          </h4>
          <p class="text-white text-lg leading-relaxed mb-8">
            {currentProduct.description}
          </p>
          
          {/* Pulsante Richiedi Info - STESSO LAYOUT ORIGINALE */}
          <div class="flex justify-start">
            <a 
              href={`/richiedi-informazioni?servizio=${getServiceSlug(currentProduct.title)}`}
              class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md font-medium text-sm tracking-wide transition-colors duration-200 flex items-center justify-center gap-2 inline-flex"
            >
              RICHIEDI INFORMAZIONI
              <span class="text-xl font-light">+</span>
            </a>
          </div>
        </div>

        {/* Galleria immagini - STESSO LAYOUT ORIGINALE */}
        <section class="mb-24">
          <div class="space-y-8">
            {currentProduct.images.map((img, i) => (
              <div key={i} class="bg-gray-400 rounded-lg aspect-video flex items-center justify-center">
                <span class="text-white text-2xl">{img}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Logo e CTA - STESSO LAYOUT ORIGINALE */}
        <section class="text-center py-16">
          <div class="mb-12">
            <img src="/images/logo.png" class="mx-auto w-60 h-auto" alt="" />
          </div>
          
          {/* Pulsante centrale - STESSO LAYOUT ORIGINALE */}
          <a 
            href={`/richiedi-informazioni?servizio=${getServiceSlug(currentProduct.title)}`}
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md font-medium text-sm tracking-wide transition-colors duration-200 flex items-center justify-center gap-2 mx-auto inline-flex"
          >
            RICHIEDI INFORMAZIONI
            <span class="text-xl font-light">+</span>
          </a>
        </section>
      </main>
    </div>
  );
});