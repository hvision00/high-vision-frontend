import { component$, useSignal } from '@builder.io/qwik';

interface ContactInfo {
  title: string;
  value: string;
  description?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default component$(() => {
  const activeFAQ = useSignal<number | null>(null);

  const contactInfo: ContactInfo[] = [
    {
      title: "TELEFONO",
      value: "+39 351 354 7849",
      description: "Lun-Ven 08:30-12:00 / 13:30-18:00"
    },
    {
      title: "EMAIL",
      value: "amministrazione@hvision.it",
      description: "Risposta entro 24h"
    },
    {
      title: "WHATSAPP",
      value: "+39 351 354 7849",
      description: "Chat rapida"
    },
    {
      title: "INDIRIZZO",
      value: "Via Palù 49 - 31020 San Vendemiano (TV)",
      description: "Sede operativa"
    }
  ];

  const faqs: FAQ[] = [
    {
      question: "Come posso richiedere informazioni sui prodotti?",
      answer: "Puoi contattarci tramite il modulo di contatto presente in ogni pagina prodotto, oppure chiamare direttamente il nostro numero di assistenza. I nostri referenti sono sempre disponibili per fornire dettagli tecnici e commerciali."
    },
    {
      question: "Quali sono i tempi di consegna?",
      answer: "I tempi di consegna variano in base al prodotto, alla disponibilità e alla vostra esigenza. Generalmente per i prodotti standard i tempi sono di 5-10 giorni lavorativi (a meno che non abbiate una certa urgenza), mentre per soluzioni personalizzate possono essere necessarie 2-4 settimane."
    },
    {
      question: "Quali tipi di servizi di formazione offrite?",
      answer: "Offriamo una gamma completa di corsi di formazione obbligatori. Per ottenere disponibilità e prezzi contattaci attraverso il modulo nella pagina contatti, oppure chiamaci direttamente."
    },
    {
      question: "Come funziona l'assistenza post-vendita?",
      answer: "Forniamo assistenza completa post-vendita che include supporto tecnico, manutenzione ordinaria e straordinaria, e aggiornamenti. Il nostro team è disponibile per interventi on-site quando necessario."
    },
    {
      question: "È possibile richiedere preventivi personalizzati?",
      answer: "Certamente. Ogni nostro prodotto può essere personalizzato in base alle specifiche esigenze del cliente. Compila il modulo oppure contatta i nostri referenti per discutere le tue necessità e ricevere un preventivo dettagliato."
    }
  ];

  return (
    <div class="min-h-screen bg-neutral-800">
      {/* Header */}
      <header class="relative w-full p-8">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick$={() => window.history.back()}
            class="flex items-center gap-2 text-white hover:text-gray-300 transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="text-sm font-medium uppercase tracking-wider">Indietro</span>
          </button>
          
          <div class="text-white text-base">
            Siamo qui per aiutarti
          </div>
        </div>
      </header>

      {/* Contenuto principale */}
      <main class="max-w-4xl mx-auto px-8 pb-16">
        {/* Titolo principale */}
        <section class="mb-16">
          <div class="mb-12">
            <h3 class="text-gray-400 text-sm font-medium tracking-wider uppercase mb-4">
              ASSISTENZA
            </h3>
            <h1 class="text-white text-4xl font-light leading-tight mb-8">
              Come possiamo aiutarti
            </h1>
          </div>
        </section>

        {/* Informazioni di contatto */}
        <section class="mb-24">
          <h2 class="text-gray-400 text-sm font-medium tracking-wider uppercase mb-8">
            CONTATTI
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactInfo.map((contact, index) => (
              <div key={index} class="bg-neutral-700 rounded-lg p-6">
                <h4 class="text-gray-400 text-sm font-medium tracking-wider uppercase mb-3">
                  {contact.title}
                </h4>
                <p class="text-white text-lg font-medium mb-2">
                  {contact.value}
                </p>
                {contact.description && (
                  <p class="text-gray-400 text-sm">
                    {contact.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section class="mb-24">
          <h2 class="text-gray-400 text-sm font-medium tracking-wider uppercase mb-8">
            DOMANDE FREQUENTI
          </h2>
          
          <div class="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} class="bg-neutral-700 rounded-lg overflow-hidden">
                <button
                  onClick$={() => {
                    activeFAQ.value = activeFAQ.value === index ? null : index;
                  }}
                  class="w-full p-6 text-left flex justify-between items-center hover:bg-neutral-600 transition-colors duration-200"
                >
                  <h4 class="text-white text-base font-medium pr-4">
                    {faq.question}
                  </h4>
                  <svg 
                    class={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      activeFAQ.value === index ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {activeFAQ.value === index && (
                  <div class="px-6 pb-6">
                    <p class="text-gray-300 text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Orari di assistenza */}
        <section class="mb-24">
          <h2 class="text-gray-400 text-sm font-medium tracking-wider uppercase mb-8">
            ORARI DI ASSISTENZA
          </h2>
          
          <div class="bg-neutral-700 rounded-lg p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 class="text-white text-base font-medium mb-2">
                  Assistenza telefonica
                </h4>
                <p class="text-gray-300 text-sm">
                  Lunedì - Venerdì: 08:30 - 12:00 / 13:30 - 18:00<br />
                  Sabato: 9:00 - 13:00<br />
                  Domenica: Chiuso
                </p>
              </div>
              <div>
                <h4 class="text-white text-base font-medium mb-2">
                  Assistenza email
                </h4>
                <p class="text-gray-300 text-sm">
                  Risposta garantita<br />
                  entro 24 ore lavorative
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Logo e CTA finale */}
        <section class="text-center py-16">
          <div class="mb-12">
            <img src="/images/logo.png" class="mx-auto w-60 h-auto" alt="Logo" />
          </div>
          
          <a href="/contatti" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md font-medium text-sm tracking-wide transition-colors duration-200 flex items-center justify-center gap-2 mx-auto">
            CONTATTACI SUBITO
            <span class="text-xl font-light">+</span>
          </a>
        </section>
      </main>
    </div>
  );
});