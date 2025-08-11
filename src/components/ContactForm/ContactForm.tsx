// ContactForm.tsx - Form a 3 step con design mantenuto
import { component$, useSignal, useStore, $ } from '@builder.io/qwik';

interface ContactFormData {
  // Step 1: Informazioni anagrafiche
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  azienda: string;
  
  // Step 2: Servizi
  categoria: string;
  servizio: string;
  budget: string;
  urgenza: string;
  
  // Step 3: Completamento
  messaggio: string;
  privacy: boolean;
  marketing: boolean;
}

interface ContactFormState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
}

export const ContactForm = component$(() => {
  const currentStep = useSignal(1);
  const totalSteps = 3;
  
  const formData = useStore<ContactFormData>({
    // Step 1
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    azienda: '',
    
    // Step 2
    categoria: '',
    servizio: '',
    budget: '',
    urgenza: '',
    
    // Step 3
    messaggio: '',
    privacy: false,
    marketing: false
  });

  const formState = useSignal<ContactFormState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: ''
  });

  // Dati servizi basati sulla knowledge base
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
        'Antinfortunistica',
        'Cartellonistica di sicurezza',
        'Protezione antincendio',
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

  // Validation
  const validateEmail = $((email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  });

  const validateStep = $((step: number) => {
    switch (step) {
      case 1:
        return formData.nome && formData.cognome && formData.email;
      case 2:
        return formData.categoria && formData.servizio;
      case 3:
        return formData.privacy;
      default:
        return false;
    }
  });

  const nextStep = $(async () => {
    if (await validateStep(currentStep.value)) {
      if (currentStep.value === 1 && !await validateEmail(formData.email)) {
        formState.value = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          errorMessage: 'Inserisci un indirizzo email valido.'
        };
        return;
      }
      
      formState.value = {
        isLoading: false,
        isSuccess: false,
        isError: false,
        errorMessage: ''
      };
      
      currentStep.value++;
    } else {
      formState.value = {
        isLoading: false,
        isSuccess: false,
        isError: true,
        errorMessage: 'Compila tutti i campi obbligatori.'
      };
    }
  });

  const prevStep = $(() => {
    if (currentStep.value > 1) {
      currentStep.value--;
      formState.value = {
        isLoading: false,
        isSuccess: false,
        isError: false,
        errorMessage: ''
      };
    }
  });

  const handleSubmit = $(async () => {
    if (!await validateStep(3)) {
      formState.value = {
        isLoading: false,
        isSuccess: false,
        isError: true,
        errorMessage: 'Accetta la privacy policy per continuare.'
      };
      return;
    }

    formState.value = {
      isLoading: true,
      isSuccess: false,
      isError: false,
      errorMessage: ''
    };

    try {
      const response = await fetch('https://formspree.io/f/xqalebra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Dati anagrafici
          nome: formData.nome,
          cognome: formData.cognome,
          email: formData.email,
          telefono: formData.telefono,
          azienda: formData.azienda,
          
          // Servizi
          categoria: formData.categoria,
          servizio: formData.servizio,
          budget: formData.budget,
          urgenza: formData.urgenza,
          
          // Completamento
          messaggio: formData.messaggio,
          marketing: formData.marketing,
          
          _subject: `Nuovo contatto: ${formData.nome} ${formData.cognome} - ${formData.categoria}`,
        })
      });

      if (response.ok) {
        formState.value = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          errorMessage: ''
        };
        
        // Reset form dopo successo
        setTimeout(() => {
          Object.assign(formData, {
            nome: '', cognome: '', email: '', telefono: '', azienda: '',
            categoria: '', servizio: '', budget: '', urgenza: '',
            messaggio: '', privacy: false, marketing: false
          });
          currentStep.value = 1;
          formState.value = {
            isLoading: false, isSuccess: false, isError: false, errorMessage: ''
          };
        }, 3000);
      } else {
        throw new Error('Errore nell\'invio del form');
      }
    } catch (error) {
      formState.value = {
        isLoading: false,
        isSuccess: false,
        isError: true,
        errorMessage: 'Si è verificato un errore. Riprova più tardi.'
      };
    }
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section class="relative py-24 px-4 overflow-hidden">
        {/* Background decorations */}
        <div class="absolute top-20 right-10 w-32 h-32 bg-blue-100 rounded-full opacity-60 animate-pulse"></div>
        <div class="absolute bottom-10 left-10 w-24 h-24 bg-indigo-100 rounded-full opacity-40"></div>
        
        <div class="max-w-4xl mx-auto text-center relative z-10">
          
          
          <h1 class="text-2xl md:text-4xl lg:text-6xl text-brand max-w-4xl font-telegraf mb-6">
            Parliamo del tuo progetto
          </h1>
          
          <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Raccontaci la tua idea e scopri come possiamo trasformarla in realtà. 
            Il nostro team è pronto ad ascoltarti.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section class="pb-24 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-5 gap-16">
            
            {/* Contact Info */}
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
                      <p class="text-gray-600 mt-1">+39 351 354 7849</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900">Email</h3>
                      <p class="text-gray-600 mt-1">amministrazione@hvision.it</p>
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
                        Lun-Ven: 8:30-12:00<br/>
                        13:30-18:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div class="lg:col-span-3">
              <div class="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                
                {/* Header con step indicator */}
                <div class="mb-8">
                  <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-semibold text-gray-900">
                      {currentStep.value === 1 && "I tuoi dati"}
                      {currentStep.value === 2 && "Di cosa hai bisogno?"}
                      {currentStep.value === 3 && "Completiamo insieme"}
                    </h2>
                    <div class="text-sm text-gray-500">
                      Step {currentStep.value} di {totalSteps}
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      class="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={`width: ${(currentStep.value / totalSteps) * 100}%`}
                    ></div>
                  </div>
                  
                  <p class="text-gray-600">
                    {currentStep.value === 1 && "Iniziamo con le informazioni base per poterti contattare"}
                    {currentStep.value === 2 && "Aiutaci a capire quale servizio può interessarti di più"}
                    {currentStep.value === 3 && "Ultimo step: raccontaci il tuo progetto nel dettaglio"}
                  </p>
                </div>

                {/* Success Message */}
                {formState.value.isSuccess && (
                  <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <p class="text-green-800 font-medium">Messaggio inviato con successo! Ti ricontatteremo presto.</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {formState.value.isError && (
                  <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                      <p class="text-red-800">{formState.value.errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Form Steps */}
                <form class="space-y-6">
                  
                  {/* STEP 1: Informazioni Anagrafiche */}
                  {currentStep.value === 1 && (
                    <div class="space-y-6 animate-in slide-in-from-right duration-300">
                      {/* Nome e Cognome */}
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Nome *
                          </label>
                          <input
                            type="text"
                            value={formData.nome}
                            onInput$={(e) => formData.nome = (e.target as HTMLInputElement).value}
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder="Il tuo nome"
                            required
                          />
                        </div>
                        
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Cognome *
                          </label>
                          <input
                            type="text"
                            value={formData.cognome}
                            onInput$={(e) => formData.cognome = (e.target as HTMLInputElement).value}
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder="Il tuo cognome"
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-3">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onInput$={(e) => formData.email = (e.target as HTMLInputElement).value}
                          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                          placeholder="nome@email.com"
                          required
                        />
                      </div>

                      {/* Telefono e Azienda */}
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div class="space-y-6 animate-in slide-in-from-right duration-300">
                      {/* Categoria */}
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-3">
                          Che tipo di servizio ti interessa? *
                        </label>
                        <select
                          value={formData.categoria}
                          onChange$={(e) => {
                            formData.categoria = (e.target as HTMLSelectElement).value;
                            formData.servizio = ''; // Reset servizio quando cambia categoria
                          }}
                          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                          required
                        >
                          <option value="">Seleziona una categoria</option>
                          {Object.entries(categorieServizi).map(([key, categoria]) => (
                            <option key={key} value={key}>{categoria.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Servizio Specifico */}
                      {formData.categoria && (
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Servizio specifico *
                          </label>
                          <select
                            value={formData.servizio}
                            onChange$={(e) => formData.servizio = (e.target as HTMLSelectElement).value}
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            required
                          >
                            <option value="">Seleziona un servizio</option>
                            {categorieServizi[formData.categoria as keyof typeof categorieServizi]?.servizi.map((servizio) => (
                              <option key={servizio} value={servizio}>{servizio}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Budget e Urgenza */}
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Budget indicativo
                          </label>
                          <select
                            value={formData.budget}
                            onChange$={(e) => formData.budget = (e.target as HTMLSelectElement).value}
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                          >
                            <option value="">Seleziona un range</option>
                            <option value="< 1.000€">Meno di 1.000€</option>
                            <option value="1.000€ - 5.000€">1.000€ - 5.000€</option>
                            <option value="5.000€ - 10.000€">5.000€ - 10.000€</option>
                            <option value="10.000€ - 25.000€">10.000€ - 25.000€</option>
                            <option value="> 25.000€">Oltre 25.000€</option>
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
                    <div class="space-y-6 animate-in slide-in-from-right duration-300">
                      {/* Messaggio */}
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-3">
                          Raccontaci il tuo progetto
                        </label>
                        <textarea
                          value={formData.messaggio}
                          onInput$={(e) => formData.messaggio = (e.target as HTMLTextAreaElement).value}
                          rows={6}
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
                            onChange$={(e) => formData.privacy = (e.target as HTMLInputElement).checked}
                            class="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            required
                          />
                          <label for="privacy" class="text-sm text-gray-700">
                            Accetto la <a href="/privacy-policy" class="text-blue-600 hover:underline">Privacy Policy</a> e autorizzo il trattamento dei miei dati personali *
                          </label>
                        </div>
                        
                        <div class="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="marketing"
                            checked={formData.marketing}
                            onChange$={(e) => formData.marketing = (e.target as HTMLInputElement).checked}
                            class="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <label for="marketing" class="text-sm text-gray-700">
                            Acconsento al trattamento dei dati per finalità di marketing e comunicazioni commerciali
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div class="flex justify-between pt-8 border-t border-gray-200">
                    <button
                      type="button"
                      onClick$={prevStep}
                      class={`px-6 py-3 rounded-xl border transition-all duration-200 font-medium ${
                        currentStep.value === 1 
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                      disabled={currentStep.value === 1}
                    >
                      ← Indietro
                    </button>
                    
                    {currentStep.value < totalSteps ? (
                      <button
                        type="button"
                        onClick$={nextStep}
                        class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Avanti →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick$={handleSubmit}
                        disabled={formState.value.isLoading}
                        class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      >
                        {formState.value.isLoading ? (
                          <div class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Invio in corso...
                          </div>
                        ) : (
                          <div class="flex items-center">
                            Invia messaggio
                            <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});