// FAQPage.tsx - Componente pagina FAQ
import { component$, useSignal } from '@builder.io/qwik';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export const FAQPage = component$(() => {
  const activeFAQ = useSignal<number | null>(null);
  const activeCategory = useSignal('tutte');

  const faqs: FAQ[] = [
    // Prodotti e Servizi
    {
      question: "Come posso richiedere informazioni sui prodotti?",
      answer: "Puoi contattarci tramite il modulo di contatto presente in ogni pagina prodotto, oppure chiamare direttamente il nostro numero di assistenza +39 351 354 7849. I nostri referenti sono sempre disponibili per fornire dettagli tecnici e commerciali su tutti i nostri prodotti.",
      category: "prodotti"
    },
    {
      question: "Offrite servizi di personalizzazione?",
      answer: "Sì, offriamo servizi di personalizzazione completi per diverse tipologie di prodotti e servizi. Possiamo applicare loghi, scritte e design personalizzati utilizzando diverse tecniche come ricamo, serigrafia, stampa digitale e laser.",
      category: "prodotti"
    },
    {
      question: "Quali certificazioni hanno i vostri DPI?",
      answer: "Tutti i nostri Dispositivi di Protezione Individuale sono certificati secondo le normative europee CE e rispettano gli standard di sicurezza più rigorosi. Ogni prodotto viene fornito con relativa documentazione tecnica e certificati di conformità.",
      category: "prodotti"
    },

    // Ordini e Consegne
    {
      question: "Quali sono i tempi di consegna?",
      answer: "I tempi di consegna variano in base al prodotto, alla disponibilità e alla vostra esigenza. Generalmente per i prodotti standard i tempi sono di 5-10 giorni lavorativi (a meno che non abbiate una certa urgenza), mentre per soluzioni personalizzate possono essere necessarie 2-4 settimane.",
      category: "ordini"
    },
    {
      question: "È possibile richiedere preventivi personalizzati?",
      answer: "Certamente! Ogni nostro prodotto può essere personalizzato in base alle specifiche esigenze del cliente. Puoi richiedere un preventivo gratuito compilando il nostro modulo di contatto o chiamandoci direttamente. Analizzeremo insieme le tue necessità per proporti la soluzione migliore.",
      category: "ordini"
    },
    {
      question: "Quali sono le modalità di pagamento accettate?",
      answer: "Accettiamo diverse modalità di pagamento: bonifico bancario e RIBA. Per ordini di importo elevato possiamo concordare condizioni personalizzate.",
      category: "ordini"
    },
    {
      question: "Offrite sconti per ordini di grandi quantità?",
      answer: "Sì, prevediamo sconti progressivi per ordini di grandi quantità. Le condizioni variano in base al prodotto e al volume dell'ordine. Contattaci per ricevere un preventivo personalizzato con le migliori condizioni per la tua azienda.",
      category: "ordini"
    },

    // Formazione
    {
      question: "Quali tipi di servizi di formazione offrite?",
      answer: "Offriamo una gamma completa di corsi di formazione obbligatori. Per ottenere disponibilità e prezzi contattaci attraverso il modulo nella pagina contatti, oppure chiamaci direttamente.",
      category: "formazione"
    },
    {
      question: "I corsi di formazione rilasciano certificazioni valide?",
      answer: "Tutti i nostri corsi rilasciano attestati e certificazioni riconosciute a livello nazionale e conformi alle normative vigenti. Per i corsi di sicurezza, le certificazioni sono valide ai fini degli obblighi formativi aziendali previsti dal D.Lgs 81/08.",
      category: "formazione"
    },
    {
      question: "È possibile organizzare corsi presso la nostra sede?",
      answer: "Assolutamente sì! Organizziamo corsi di formazione direttamente presso la vostra sede aziendale, con una partecipazione minima di 6 partepcipanti. Questo permette di personalizzare il contenuto in base alle vostre specifiche esigenze operative e di formare tutto il team contemporaneamente, ottimizzando tempi e costi.",
      category: "formazione"
    },

    // Assistenza
    {
      question: "Come funziona l'assistenza post-vendita?",
      answer: "Forniamo assistenza completa post-vendita che include supporto tecnico, manutenzione, riparazioni e aggiornamenti. Il nostro team è disponibile per interventi on-site quando necessario. Offriamo anche contratti di manutenzione programmata per garantire sempre la massima efficienza.",
      category: "assistenza"
    },
    {
      question: "Cosa succede se ho un problema con un prodotto acquistato?",
      answer: "In caso di problemi con un prodotto acquistato, il nostro team di assistenza è a tua disposizione per aiutarti. Ti basta contattarci con una descrizione del problema e una prova d’acquisto: ti guideremo passo dopo passo nella risoluzione, con soluzioni rapide ed efficaci.",
      category: "assistenza"
    },
    {
      question: "Come posso contattare l'assistenza tecnica?",
      answer: "Puoi contattare la nostra assistenza tecnica dal lunedì al venerdì dalle 8:30 alle 12:00 e dalle 13:30 alle 18:00 chiamando il +39 351 354 7849 o inviando una email a amministrazione@hvision.it. Per urgenze, è disponibile anche il servizio WhatsApp. Garantiamo risposta entro 24 ore lavorative.",
      category: "assistenza"
    }
  ];

  const categories = [
    { key: 'tutte', label: 'Tutte le domande'},
    { key: 'prodotti', label: 'Prodotti e Servizi'},
    { key: 'ordini', label: 'Ordini e Consegne'},
    { key: 'formazione', label: 'Formazione'},
    { key: 'assistenza', label: 'Assistenza'}
  ];

  const filteredFAQs = activeCategory.value === 'tutte' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory.value);

  return (
    <div class="min-h-screen bg-white">
      {/* Header */}
      <header class="relative bg-white py-24 px-4">
        <div class="max-w-4xl mx-auto text-center">
         
          <h1 class="text-2xl md:text-4xl lg:text-6xl text-brand max-w-4xl font-telegraf mb-6">
            Domande frequenti
          </h1>
          
          <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Trova rapidamente le risposte alle domande più comuni sui nostri prodotti e servizi
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main class="pb-24 px-4">
        <div class="max-w-4xl mx-auto">
          
          {/* Categories Filter */}
          <section class="mb-12">
            <h2 class="text-lg font-semibold text-gray-900 mb-6 text-center">
              Filtra per categoria
            </h2>
            
            <div class="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick$={() => {
                    activeCategory.value = category.key;
                    activeFAQ.value = null; // Chiudi tutte le FAQ aperte quando cambi categoria
                  }}
                  class={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory.value === category.key
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </section>

          {/* FAQ Count */}
          <div class="text-center mb-8">
            <p class="text-gray-600">
              {filteredFAQs.length} {filteredFAQs.length === 1 ? 'domanda' : 'domande'} 
              {activeCategory.value !== 'tutte' && ` nella categoria "${categories.find(c => c.key === activeCategory.value)?.label}"`}
            </p>
          </div>

          {/* FAQ List */}
          <section class="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div 
                key={index} 
                class="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <button
                  onClick$={() => {
                    activeFAQ.value = activeFAQ.value === index ? null : index;
                  }}
                  class="w-full p-6 text-left flex justify-between items-start hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <h3 class="text-base md:text-lg font-semibold text-gray-900 pr-4 group-hover:text-blue-600 transition-colors duration-200">
                    {faq.question}
                  </h3>
                  <div class="flex-shrink-0 ml-4">
                    <svg 
                      class={`w-5 h-5 text-gray-500 transition-all duration-200 ${
                        activeFAQ.value === index ? 'rotate-180 text-blue-600' : 'group-hover:text-blue-600'
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {activeFAQ.value === index && (
                  <div class="px-6 pb-6 animate-in slide-in-from-top duration-200">
                    <div class="border-t border-gray-100 pt-4">
                      <p class="text-gray-700 text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* No results */}
          {filteredFAQs.length === 0 && (
            <div class="text-center py-12">
              <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Nessuna domanda trovata
              </h3>
              <p class="text-gray-600">
                Prova a selezionare una categoria diversa o contattaci direttamente
              </p>
            </div>
          )}

          {/* Contact CTA */}
          <section class="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 text-center">
            <div class="max-w-2xl mx-auto">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              
              <h3 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                Non hai trovato quello che cercavi?
              </h3>
              
              <p class="text-gray-600 mb-8 text-lg">
                Il nostro team è sempre disponibile per rispondere alle tue domande specifiche
              </p>
              
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contatti"
                  class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Contattaci
                </a>
                
                <a 
                  href="tel:+393513547849"
                  class="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Chiama ora
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
});