// src/components/RequestInfoForm/RequestInfoForm.tsx
import { component$, useSignal, useStore, $, useVisibleTask$ } from '@builder.io/qwik';

interface RequestInfoFormData {
  // Step 1: Informazioni anagrafiche
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  azienda: string;
  
  // Step 2: Servizi (PRECOMPILATO)
  categoria: string;
  servizio: string;
  budget: string;
  urgenza: string;
  
  // Step 3: Completamento
  messaggio: string;
  privacy: boolean;
  marketing: boolean;
}

interface FormState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
}

export const RequestInfoForm = component$(() => {
  const currentStep = useSignal(1);
  const totalSteps = 3;
  
  const formData = useStore<RequestInfoFormData>({
    // Step 1
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    azienda: '',
    
    // Step 2 - VERRANNO PRECOMPILATI
    categoria: '',
    servizio: '',
    budget: '',
    urgenza: '',
    
    // Step 3
    messaggio: '',
    privacy: false,
    marketing: false
  });

  const formState = useStore<FormState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: ''
  });

  // 🎯 MAPPATURA SERVIZI PER PRECOMPILAZIONE
  const serviceMappings: Record<string, { categoria: string; servizio: string }> = {
    'scaffalature-industriali': { categoria: 'industria', servizio: 'Scaffalature industriali' },
    'protezione-antincendio': { categoria: 'sicurezza', servizio: 'Dispositivi DPI' },
    'abbigliamento-tecnico': { categoria: 'industria', servizio: 'Abbigliamento tecnico' },
    'antinfortunistica': { categoria: 'sicurezza', servizio: 'Antinfortunistica' },
    'cartellonistica-di-sicurezza': { categoria: 'sicurezza', servizio: 'Cartellonistica di sicurezza' },
    'attrezzature-specializzate-industriali': { categoria: 'industria', servizio: 'Attrezzature specializzate industriali' },
    'corsi-sicurezza': { categoria: 'formazione', servizio: 'Corsi di sicurezza' },
    'videoconferenza-streaming': { categoria: 'formazione', servizio: 'Videoconferenza streaming' },
    'e-learning-aziendale': { categoria: 'formazione', servizio: 'E-learning aziendale' },
    'abbigliamento-personalizzato': { categoria: 'immagine', servizio: 'Abbigliamento personalizzato' },
    'gadget-personalizzati': { categoria: 'immagine', servizio: 'Gadget promozionali' },
    'sviluppo-web': { categoria: 'immagine', servizio: 'Sviluppo web' }
  };

  // Dati servizi strutturati
  const categorieServizi = {
    'immagine': {
      label: 'Immagine & Comunicazione',
      servizi: [
        'Abbigliamento personalizzato',
        'Gadget promozionali',
        'Sviluppo web',
        'Altro'
      ]
    },
    'industria': {
      label: 'Industria & Produzione',
      servizi: [
        'Scaffalature industriali',
        'Abbigliamento tecnico',
        'Attrezzature specializzate industriali',
        'Altro'
      ]
    },
    'sicurezza': {
      label: 'Sicurezza sul Lavoro',
      servizi: [
        'Protezione antincendio',
        'Sistemi antinfortunistica',
        'Cartellonistica di sicurezza',
        'Altro'
      ]
    },
    'formazione': {
      label: 'Formazione Professionale',
      servizi: [
        'Corsi di sicurezza',
        'Videoconferenza streaming',
        'E-learning aziendale',
        'Altro'
      ]
    }
  };

  //🎯 PRECOMPILAZIONE AUTOMATICA DA URL
  useVisibleTask$(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const serviceParam = urlParams.get('servizio');
      
      if (serviceParam && serviceMappings[serviceParam]) {
        const mapping = serviceMappings[serviceParam];
        formData.categoria = mapping.categoria;
        formData.servizio = mapping.servizio;
        
        // Messaggio personalizzato basato sul servizio
        const customMessages: Record<string, string> = {
          'abbigliamento-personalizzato': 'Sono interessato al vostro servizio di abbigliamento personalizzato. Vorrei ricevere informazioni su materiali, tipologie disponibili e possibilità di personalizzazione grafica con il nostro brand.',
          'gadget-promozionali': 'Vorrei ricevere informazioni sui vostri gadget promozionali. Mi interessa valutare le soluzioni più adatte alla nostra identità aziendale e conoscere tempi, costi e opzioni di personalizzazione.',
          'sviluppo-web': 'Sono interessato a una soluzione di sviluppo web personalizzata. Vorrei maggiori dettagli sulla progettazione di interfacce e siti coerenti con la nostra immagine aziendale.',
          'scaffalature-industriali': 'Vorrei ricevere informazioni sulle vostre scaffalature industriali. Sto valutando soluzioni modulari e robuste per ottimizzare i nostri spazi di magazzino o produzione.',
          'abbigliamento-tecnico': 'Sono interessato al vostro abbigliamento tecnico per ambienti industriali. Vorrei conoscere i materiali utilizzati, le certificazioni disponibili e le opzioni di personalizzazione.',
          'attrezzature-specializzate-industriali': 'Vorrei ricevere una panoramica sulle vostre attrezzature industriali specializzate. Mi interessa identificare soluzioni adatte al nostro contesto operativo.',
          'protezione-antincendio': 'Sono interessato alle vostre soluzioni per la protezione antincendio. Vorrei informazioni su prodotti, installazione, manutenzione e adeguamento alle normative vigenti.',
          'antinfortunistica': 'Vorrei ricevere una consulenza sulle vostre soluzioni antinfortunistiche. Mi interessa valutare i dispositivi disponibili e capire come implementarli in azienda nel rispetto delle normative.',
          'cartellonistica-di-sicurezza': 'Vorrei ricevere informazioni sulla vostra cartellonistica di sicurezza. Mi interessa conoscere le opzioni disponibili e come adeguare i nostri ambienti di lavoro alla normativa.',
          'corsi-di-sicurezza': 'Sono interessato ai vostri corsi di sicurezza. Vorrei capire come gestite gli aggiornamenti obbligatori, le modalità di erogazione e il monitoraggio delle scadenze.',
          'videoconferenza-streaming': 'Vorrei attivare corsi di sicurezza in modalità streaming. Mi interessa conoscere i corsi disponibili, la gestione della partecipazione e la validità della certificazione.',
          'e-learning-aziendale': 'Vorrei attivare una piattaforma e-learning per la formazione obbligatoria. Mi servono informazioni su tracciamento, gestione scadenze, contenuti disponibili e personalizzazione.',
        };
        
        if (customMessages[serviceParam]) {
          formData.messaggio = customMessages[serviceParam];
        }
      }
    }
  }); 

  // Validation functions
  const validateEmail = $((email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  });

  const validateStep = $((step: number) => {
    switch (step) {
      case 1:
        return formData.nome.trim().length > 0 && 
               formData.cognome.trim().length > 0 && 
               formData.email.trim().length > 0 && 
               validateEmail(formData.email);
      case 2:
        return formData.categoria.length > 0 && formData.servizio.length > 0;
      case 3:
        return formData.messaggio.trim().length > 0 && formData.privacy;
      default:
        return false;
    }
  });

  // Navigation handlers
  const nextStep = $(async () => {
    const isValid = await validateStep(currentStep.value);
    if (isValid && currentStep.value < totalSteps) {
      currentStep.value += 1;
    } else {
      formState.isError = true;
      formState.errorMessage = 'Compila tutti i campi obbligatori prima di continuare.';
    }
  });

  const prevStep = $(() => {
    if (currentStep.value > 1) {
      currentStep.value -= 1;
      formState.isError = false;
    }
  });

  // 🎯 FORMSPREE SUBMIT HANDLER
  const submitToFormspree = $(async () => {
    // Reset stati
    formState.isLoading = true;
    formState.isError = false;
    formState.errorMessage = '';

    // Validazione finale
    const isValid = await validateStep(3);
    if (!isValid) {
      formState.isLoading = false;
      formState.isError = true;
      formState.errorMessage = 'Compila tutti i campi obbligatori e accetta la privacy policy.';
      return;
    }

    try {
      // Preparazione dati per Formspree
      const payload = {
        // Dati anagrafici
        nome: formData.nome,
        cognome: formData.cognome,
        email: formData.email,
        telefono: formData.telefono || 'Non fornito',
        azienda: formData.azienda || 'Non fornita',
        
        // Servizio
        categoria: formData.categoria,
        servizio: formData.servizio,
        budget: formData.budget || 'Non specificato',
        urgenza: formData.urgenza || 'Non specificata',
        
        // Messaggio
        messaggio: formData.messaggio,
        
        // Consensi
        privacy: formData.privacy ? 'Accettata' : 'Non accettata',
        marketing: formData.marketing ? 'Accettato' : 'Non accettato',
        
        // Metadati
        timestamp: new Date().toLocaleString('it-IT'),
        source: 'Richiesta Informazioni - High Vision',
        _subject: `Nuova richiesta: ${formData.servizio} da ${formData.nome} ${formData.cognome}`
      };

      // Invio a Formspree
      const response = await fetch('https://formspree.io/f/xqalebra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        formState.isLoading = false;
        formState.isSuccess = true;
        formState.isError = false;
      } else {
        const errorText = await response.text();
        throw new Error(`Errore ${response.status}: ${errorText}`);
      }
    } catch (error) {
      formState.isLoading = false;
      formState.isError = true;
      formState.errorMessage = 'Si è verificato un errore durante l\'invio. Riprova tra qualche minuto.';
      console.error('Errore invio Formspree:', error);
    }
  });

  const resetForm = $(() => {
    currentStep.value = 1;
    formState.isLoading = false;
    formState.isSuccess = false;
    formState.isError = false;
    formState.errorMessage = '';
    
    // Reset solo i dati utente, mantenendo servizio precompilato
    Object.assign(formData, {
      nome: '',
      cognome: '',
      email: '',
      telefono: '',
      azienda: '',
      budget: '',
      urgenza: '',
      messaggio: '',
      privacy: false,
      marketing: false
    });
  });

  // Se il form è stato inviato con successo
  if (formState.isSuccess) {
    return (
      <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div class="max-w-md mx-auto text-center">
          <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">
              Richiesta inviata!
            </h2>
            
            <p class="text-gray-600 mb-8">
              Grazie per averci contattato. Il nostro team ti risponderà entro 24 ore per fornirti tutte le informazioni richieste.
            </p>
            
            <div class="space-y-3">
              <button 
                onClick$={resetForm}
                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-colors duration-200"
              >
                Invia nuova richiesta
              </button>
              
              <a 
                href="/" 
                class="block w-full text-gray-600 hover:text-gray-900 py-3 px-6 rounded-xl border border-gray-200 hover:border-gray-300 font-medium transition-colors duration-200 text-center"
              >
                Torna alla home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section class="relative py-24 px-4 overflow-hidden">
        {/* Background decorations */}
        <div class="absolute top-20 right-10 w-32 h-32 bg-blue-100 rounded-full opacity-60 animate-pulse"></div>
        <div class="absolute bottom-10 left-10 w-24 h-24 bg-indigo-100 rounded-full opacity-40"></div>
        
        <div class="max-w-4xl mx-auto text-center relative z-10">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-telegraf text-gray-900 mb-6">
            Richiedi
            <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-medium"> informazioni</span>
          </h1>
          
          <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Compila il modulo per ricevere informazioni dettagliate sui nostri prodotti e servizi. 
            Il nostro team ti contatterà entro 24 ore.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section class="pb-24 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-5 gap-16">
            
            {/* Contact Info - STESSO LAYOUT DELLA PAGINA CONTATTI */}
            <div class="lg:col-span-2 space-y-8">
              <div>
                <h2 class="text-2xl font-semibold text-gray-900 mb-6">
                  Come raggiungerci
                </h2>
                
                <div class="space-y-6">
                  {/* Address */}
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900">Indirizzo</h3>
                      <p class="text-gray-600 mt-1">Via Palù 49<br/>31020 San Vendemiano (TV)</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900">Telefono</h3>
                      <p class="text-gray-600 mt-1">+39 0438 778020</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900">Email</h3>
                      <p class="text-gray-600 mt-1">info@highvision.it</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900">Orari</h3>
                      <p class="text-gray-600 mt-1">
                        Lun-Ven: 8:30-12:30<br/>
                        14:00-18:00
                      </p>
                    </div>
                  </div>
                </div>

                {/* 🎯 INFO SUL SERVIZIO PRESELEZIONATO */}
                {formData.servizio && (
                  <div class="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                    <h3 class="font-semibold text-blue-900 mb-2">
                      Servizio selezionato
                    </h3>
                    <p class="text-blue-700 font-medium">
                      {formData.servizio}
                    </p>
                    <p class="text-blue-600 text-sm mt-1">
                      {categorieServizi[formData.categoria as keyof typeof categorieServizi]?.label}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            <div class="lg:col-span-3">
              <div class="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                
                {/* Header con step indicator */}
                <div class="mb-8">
                  <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-semibold text-gray-900">
                      {currentStep.value === 1 && "I tuoi dati"}
                      {currentStep.value === 2 && "Servizio richiesto"}
                      {currentStep.value === 3 && "Completa la richiesta"}
                    </h2>
                    
                    <div class="text-sm text-gray-500 font-medium">
                      Step {currentStep.value} di {totalSteps}
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      class="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(currentStep.value / totalSteps) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div class="space-y-8">
                  {/* STEP 1: Dati anagrafici */}
                  {currentStep.value === 1 && (
                    <div class="space-y-6">
                      <div class="grid md:grid-cols-2 gap-6">
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Nome *
                          </label>
                          <input
                            type="text"
                            value={formData.nome}
                            onInput$={(e) => {
                              formData.nome = (e.target as HTMLInputElement).value;
                              formState.isError = false;
                            }}
                            required
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder="Il tuo nome"
                          />
                        </div>
                        
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Cognome *
                          </label>
                          <input
                            type="text"
                            value={formData.cognome}
                            onInput$={(e) => {
                              formData.cognome = (e.target as HTMLInputElement).value;
                              formState.isError = false;
                            }}
                            required
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder="Il tuo cognome"
                          />
                        </div>
                      </div>

                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-3">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onInput$={(e) => {
                            formData.email = (e.target as HTMLInputElement).value;
                            formState.isError = false;
                          }}
                          required
                          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                          placeholder="la-tua-email@example.com"
                        />
                      </div>

                      <div class="grid md:grid-cols-2 gap-6">
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Telefono
                          </label>
                          <input
                            type="tel"
                            value={formData.telefono}
                            onInput$={(e) => formData.telefono = (e.target as HTMLInputElement).value}
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder="+39 123 456 7890"
                          />
                        </div>
                        
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Azienda
                          </label>
                          <input
                            type="text"
                            value={formData.azienda}
                            onInput$={(e) => formData.azienda = (e.target as HTMLInputElement).value}
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder="Nome azienda"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Servizi */}
                  {currentStep.value === 2 && (
                    <div class="space-y-6">
                      <div class="grid md:grid-cols-2 gap-6">
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Categoria servizio *
                          </label>
                          <select
                            value={formData.categoria}
                            onChange$={(e) => {
                              formData.categoria = (e.target as HTMLSelectElement).value;
                              formData.servizio = ''; // Reset servizio quando cambia categoria
                              formState.isError = false;
                            }}
                            required
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                          >
                            <option value="">Seleziona categoria</option>
                            {Object.entries(categorieServizi).map(([key, categoria]) => (
                              <option key={key} value={key}>
                                {categoria.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Servizio specifico *
                          </label>
                          <select
                            value={formData.servizio}
                            onChange$={(e) => {
                              formData.servizio = (e.target as HTMLSelectElement).value;
                              formState.isError = false;
                            }}
                            required
                            disabled={!formData.categoria}
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">Seleziona servizio</option>
                            {formData.categoria && categorieServizi[formData.categoria as keyof typeof categorieServizi]?.servizi.map((servizio) => (
                              <option key={servizio} value={servizio}>
                                {servizio}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div class="grid md:grid-cols-2 gap-6">
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Budget indicativo
                          </label>
                          <select
                            value={formData.budget}
                            onChange$={(e) => formData.budget = (e.target as HTMLSelectElement).value}
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                          >
                            <option value="">Seleziona budget</option>
                            <option value="< 1.000€">&lt; 1.000€</option>
                            <option value="1.000€ - 5.000€">1.000€ - 5.000€</option>
                            <option value="5.000€ - 10.000€">5.000€ - 10.000€</option>
                            <option value="10.000€ - 25.000€">10.000€ - 25.000€</option>
                            <option value="> 25.000€">&gt; 25.000€</option>
                            <option value="Da definire">Da definire</option>
                          </select>
                        </div>
                        
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Tempistiche
                          </label>
                          <select
                            value={formData.urgenza}
                            onChange$={(e) => formData.urgenza = (e.target as HTMLSelectElement).value}
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                          >
                            <option value="">Seleziona tempistiche</option>
                            <option value="Urgente (entro 1 settimana)">Urgente (entro 1 settimana)</option>
                            <option value="Brevi (entro 1 mese)">Brevi (entro 1 mese)</option>
                            <option value="Medie (1-3 mesi)">Medie (1-3 mesi)</option>
                            <option value="Lunghe (oltre 3 mesi)">Lunghe (oltre 3 mesi)</option>
                            <option value="Flessibili">Flessibili</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Completamento */}
                  {currentStep.value === 3 && (
                    <div class="space-y-6">
                      {/* Messaggio */}
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-3">
                          Raccontaci le tue esigenze *
                        </label>
                        <textarea
                          value={formData.messaggio}
                          onInput$={(e) => {
                            formData.messaggio = (e.target as HTMLTextAreaElement).value;
                            formState.isError = false;
                          }}
                          rows={6}
                          required
                          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                          placeholder="Descrivici nel dettaglio cosa hai in mente, quali sono i tuoi obiettivi e qualsiasi altra informazione che possa aiutarci a capire le tue esigenze..."
                        ></textarea>
                      </div>

                      {/* Privacy e Marketing */}
                      <div class="bg-gray-50 rounded-xl p-6 space-y-4">
                        <div class="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="privacy"
                            checked={formData.privacy}
                            onChange$={(e) => {
                              formData.privacy = (e.target as HTMLInputElement).checked;
                              formState.isError = false;
                            }}
                            required
                            class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <label for="privacy" class="text-sm text-gray-700">
                            <span class="font-semibold">Accetto la Privacy Policy *</span><br/>
                            Dichiaro di aver letto e accettato l'informativa sulla privacy ai sensi del GDPR.
                          </label>
                        </div>
                        
                        <div class="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="marketing"
                            checked={formData.marketing}
                            onChange$={(e) => formData.marketing = (e.target as HTMLInputElement).checked}
                            class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <label for="marketing" class="text-sm text-gray-700">
                            <span class="font-medium">Consenso al marketing</span><br/>
                            Acconsento a ricevere comunicazioni promozionali e newsletter.
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {formState.isError && (
                    <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div class="flex items-center space-x-3">
                        <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        <p class="text-red-600 text-sm font-medium">
                          {formState.errorMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation buttons */}
                  <div class="flex justify-between items-center pt-6">
                    {currentStep.value > 1 ? (
                      <button
                        type="button"
                        onClick$={prevStep}
                        class="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Indietro</span>
                      </button>
                    ) : (
                      <div></div>
                    )}

                    {currentStep.value < totalSteps ? (
                      <button
                        type="button"
                        onClick$={nextStep}
                        class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 group"
                      >
                        <span>Continua</span>
                        <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick$={submitToFormspree}
                        disabled={formState.isLoading}
                        class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 group disabled:cursor-not-allowed min-w-[180px] justify-center"
                      >
                        {formState.isLoading ? (
                          <>
                            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Invio...</span>
                          </>
                        ) : (
                          <>
                            <span>INVIA RICHIESTA</span>
                            <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});