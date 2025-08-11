import { component$, useSignal, $ } from '@builder.io/qwik';

interface FormState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
  successMessage: string;
}

interface NewsletterProps {
  className?: string;
}

export const Newsletter = component$<NewsletterProps>((props) => {
  // Stati del form
  const nome = useSignal('');
  const cognome = useSignal('');
  const email = useSignal('');
  
  // Stati UI
  const formState = useSignal<FormState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
    successMessage: ''
  });
  
  // Validazione email
  const validateEmail = $((email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  });
  
  // Gestione submit
  const handleSubmit = $(async (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset stati precedenti
    formState.value = {
      isLoading: true,
      isSuccess: false,
      isError: false,
      errorMessage: '',
      successMessage: ''
    };
    
    // Validazione
    if (!nome.value.trim() || !cognome.value.trim()) {
      formState.value = {
        ...formState.value,
        isLoading: false,
        isError: true,
        errorMessage: 'Per favore compila tutti i campi'
      };
      return;
    }
    
    if (!validateEmail(email.value)) {
      formState.value = {
        ...formState.value,
        isLoading: false,
        isError: true,
        errorMessage: 'Inserisci un indirizzo email valido'
      };
      return;
    }
    
    try {
      // Chiamata a Formspree
      const response = await fetch('https://formspree.io/f/xqalebop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome.value.trim(),
          cognome: cognome.value.trim(),
          email: email.value.trim(),
          source: 'newsletter_form',
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Successo
      formState.value = {
        isLoading: false,
        isSuccess: true,
        isError: false,
        errorMessage: '',
        successMessage: 'Grazie per esserti iscritto! Riceverai presto le nostre newsletter.'
      };
      
      // Reset form dopo successo
      setTimeout(() => {
        nome.value = '';
        cognome.value = '';
        email.value = '';
        formState.value = {
          ...formState.value,
          isSuccess: false,
          successMessage: ''
        };
      }, 5000);
      
    } catch (error) {
      console.error('Errore nell\'invio del form:', error);
      
      formState.value = {
        isLoading: false,
        isSuccess: false,
        isError: true,
        errorMessage: 'Si è verificato un errore durante l\'invio. Riprova più tardi.',
        successMessage: ''
      };
    }
  });
  
  return (
    <section class={`bg-gradient-to-b from-white to-gray-50 py-16 md:py-24 px-4 ${props.className || ''}`}>
      <div class="max-w-container mx-auto">
        {/* Titolo principale */}
        <h2 class="text-2xl md:text-4xl lg:text-6xl text-brand max-w-4xl font-telegraf text-center mb-12 leading-relaxed max-w-4xl mx-auto">
          Per conoscere news <br />e approfondimenti
        </h2>

        {/* Form container */}
        <form 
          class="space-y-8 max-w-4xl mx-auto" 
          onSubmit$={handleSubmit}
          preventdefault:submit
        >
          {/* Messaggio di successo */}
          {formState.value.isSuccess && (
            <div class="relative overflow-hidden bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg transform transition-all duration-500 ease-out animate-in slide-in-from-top">
              <div class="absolute inset-y-0 left-0 w-1 bg-green-500"></div>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="w-6 h-6 text-green-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="font-medium">Iscrizione completata!</p>
                  <p class="text-sm mt-1">{formState.value.successMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Messaggio di errore */}
          {formState.value.isError && (
            <div class="relative overflow-hidden bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg transform transition-all duration-500 ease-out animate-in slide-in-from-top">
              <div class="absolute inset-y-0 left-0 w-1 bg-red-500"></div>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="w-6 h-6 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="font-medium">Ops! Qualcosa è andato storto</p>
                  <p class="text-sm mt-1">{formState.value.errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Sezione Nome e Cognome */}
          <div>
            <h3 class="text-xl font-normal mb-6">Come ti chiami</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="relative">
                <input
                  type="text"
                  placeholder="Nome"
                  value={nome.value}
                  onInput$={(e) => nome.value = (e.target as HTMLInputElement).value}
                  disabled={formState.value.isLoading}
                  class={`w-full pb-2 border-b bg-transparent focus:outline-none transition-all duration-200 placeholder-gray-400 ${
                    formState.value.isLoading ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-gray-300 focus:border-brand hover:border-gray-400'
                  }`}
                />
                <div class={`absolute bottom-0 left-0 h-0.5 bg-brand transition-all duration-300 ${
                  nome.value ? 'w-full' : 'w-0'
                }`}></div>
              </div>
              <div class="relative">
                <input
                  type="text"
                  placeholder="Cognome"
                  value={cognome.value}
                  onInput$={(e) => cognome.value = (e.target as HTMLInputElement).value}
                  disabled={formState.value.isLoading}
                  class={`w-full pb-2 border-b bg-transparent focus:outline-none transition-all duration-200 placeholder-gray-400 ${
                    formState.value.isLoading ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-gray-300 focus:border-brand hover:border-gray-400'
                  }`}
                />
                <div class={`absolute bottom-0 left-0 h-0.5 bg-brand transition-all duration-300 ${
                  cognome.value ? 'w-full' : 'w-0'
                }`}></div>
              </div>
            </div>
          </div>

          {/* Sezione Email */}
          <div>
            <h3 class="text-xl font-normal mb-6">La tua e-mail è</h3>
            <div class="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-end">
              <div class="relative flex-grow w-full md:w-auto">
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email.value}
                  onInput$={(e) => email.value = (e.target as HTMLInputElement).value}
                  disabled={formState.value.isLoading}
                  class={`w-full pb-2 border-b bg-transparent focus:outline-none transition-all duration-200 placeholder-gray-400 ${
                    formState.value.isLoading ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-gray-300 focus:border-brand hover:border-gray-400'
                  }`}
                />
                <div class={`absolute bottom-0 left-0 h-0.5 bg-brand transition-all duration-300 ${
                  email.value ? 'w-full' : 'w-0'
                }`}></div>
              </div>
              <button
                type="submit"
                disabled={formState.value.isLoading}
                class={`relative px-8 py-3 rounded-md text-white font-medium flex items-center gap-2 whitespace-nowrap transition-all duration-300 transform ${
                  formState.value.isLoading 
                    ? 'bg-brand/80 cursor-not-allowed scale-95' 
                    : 'bg-brand hover:bg-brand-dark hover:shadow-lg hover:scale-105 active:scale-95'
                }`}
              >
                {/* Overlay animato durante il caricamento */}
                {formState.value.isLoading && (
                  <div class="absolute inset-0 bg-white/20 rounded-md overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
                  </div>
                )}
                
                {/* Contenuto del pulsante */}
                <span class="relative z-10 flex items-center gap-2">
                  {formState.value.isLoading ? (
                    <>
                      <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span class="animate-pulse">Invio in corso...</span>
                    </>
                  ) : (
                    <>
                      INVIA
                      <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
          
          {/* Privacy notice */}
          <p class="text-sm text-gray-500 text-center mt-6">
            Iscrivendoti accetti la nostra{' '}
            <a href="/privacy" class="underline hover:text-gray-700 transition-colors">
              privacy policy
            </a>
          </p>
        </form>
      </div>
    </section>
  );
});

export default Newsletter;

// Aggiungi questi stili CSS al tuo global.css o in un tag <style> nel componente Astro
export const newsletterStyles = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(200%);
    }
  }
  
  .animate-shimmer {
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes slide-in-from-top {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-in {
    animation: slide-in-from-top 0.5s ease-out;
  }
`;