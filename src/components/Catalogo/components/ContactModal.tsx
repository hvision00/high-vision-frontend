// src/components/Catalogo/components/ContactModal.tsx - VERSIONE COMPATTA
import { component$ } from '@builder.io/qwik';
import type { ContactModalProps } from '../types/catalog.types';

/**
 * Modal di contatto COMPATTO e scrollabile per richieste di informazioni sui prodotti
 */
export const ContactModal = component$<ContactModalProps>(({ 
  isOpen, 
  contactForm, 
  onClose, 
  onSubmit, 
  onFormChange 
}) => {
  
  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header Modal - FISSO IN ALTO */}
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex-shrink-0">
          <div class="flex items-center justify-between text-white">
            <div>
              <h3 class="text-lg font-semibold">Richiedi Informazioni</h3>
              <p class="text-blue-100 text-xs mt-1">Ti contatteremo entro 2 ore</p>
            </div>
            <button 
              onClick$={onClose}
              class="text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Contenuto Form - SCROLLABILE */}
        <div class="flex-1 overflow-y-auto p-4">
          <form class="space-y-4" preventdefault:submit onSubmit$={onSubmit}>
            
            {/* Nome e Azienda compatti */}
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                  Nome *
                </label>
                <input
                  type="text"
                  value={contactForm.name}
                  onInput$={(e) => onFormChange('name', (e.target as HTMLInputElement).value)}
                  class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                  placeholder="Il tuo nome"
                  required
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                  Azienda
                </label>
                <input
                  type="text"
                  value={contactForm.company}
                  onInput$={(e) => onFormChange('company', (e.target as HTMLInputElement).value)}
                  class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                  placeholder="Azienda"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Email *
              </label>
              <input
                type="email"
                value={contactForm.email}
                onInput$={(e) => onFormChange('email', (e.target as HTMLInputElement).value)}
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                placeholder="nome@email.com"
                required
              />
            </div>

            {/* Telefono */}
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Telefono
              </label>
              <input
                type="tel"
                value={contactForm.phone}
                onInput$={(e) => onFormChange('phone', (e.target as HTMLInputElement).value)}
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                placeholder="+39 123 456 7890"
              />
            </div>

            {/* Messaggio compatto */}
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Messaggio
              </label>
              <textarea
                value={contactForm.message}
                onInput$={(e) => onFormChange('message', (e.target as HTMLTextAreaElement).value)}
                rows={3}
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white resize-none text-sm"
                placeholder="Descrivi brevemente le tue esigenze..."
              ></textarea>
            </div>

            {/* Prodotto di interesse COMPATTO */}
            {contactForm.productInterest && (
              <div class="bg-blue-50 border-l-3 border-blue-500 p-3 rounded-lg">
                <div class="flex items-start">
                  <svg class="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p class="text-xs font-medium text-blue-800">Prodotto</p>
                    <p class="text-xs text-blue-700 mt-0.5">{contactForm.productInterest}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Note informative COMPATTE */}
            <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="text-xs text-gray-600">
                  <p class="font-medium text-gray-800 mb-1">La tua privacy è importante</p>
                  <p>• Risposta entro 2 ore • Consulenza gratuita • Dati protetti</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer FISSO IN BASSO */}
        <div class="border-t border-gray-200 p-4 flex gap-3 bg-gray-50 flex-shrink-0">
          <button 
            type="button"
            onClick$={onClose}
            class="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
          >
            Annulla
          </button>
          <button 
            type="submit"
            onClick$={onSubmit}
            class="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-transform text-sm"
          >
            Invia Richiesta
          </button>
        </div>
      </div>
    </div>
  );
});

/**
 * Modal di successo COMPATTO
 */
export const SuccessModal = component$<{ 
  isOpen: boolean; 
  onClose: () => void; 
  productName?: string; 
}>(({ isOpen, onClose, productName }) => {
  
  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-sm w-full shadow-2xl transform transition-all duration-300 scale-100">
        
        <div class="text-center p-6">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Richiesta Inviata!
          </h3>
          
          <p class="text-sm text-gray-600 mb-4">
            {productName 
              ? `Ti contatteremo per "${productName}" entro 2 ore.`
              : 'Ti contatteremo entro 2 ore lavorative.'
            }
          </p>

          <div class="bg-blue-50 rounded-lg p-3 mb-4 text-left">
            <p class="text-xs font-medium text-blue-800 mb-1">Assistenza immediata?</p>
            <div class="text-xs text-blue-700 space-y-0.5">
              <p>📞 <a href="tel:+390212345678" class="hover:underline">+39 02 1234 5678</a></p>
              <p>📧 <a href="mailto:info@tuaazienda.it" class="hover:underline">info@tuaazienda.it</a></p>
            </div>
          </div>

          <button 
            onClick$={onClose}
            class="w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
          >
            Continua
          </button>
        </div>
      </div>
    </div>
  );
});

/**
 * Modal di errore COMPATTO
 */
export const ErrorModal = component$<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onRetry: () => void;
  errorMessage: string; 
}>(({ isOpen, onClose, onRetry, errorMessage }) => {
  
  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-sm w-full shadow-2xl transform transition-all duration-300 scale-100">
        
        <div class="text-center p-6">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Errore Invio
          </h3>
          
          <p class="text-sm text-gray-600 mb-4">
            {errorMessage || 'Si è verificato un errore. Riprova più tardi.'}
          </p>

          <div class="bg-gray-50 rounded-lg p-3 mb-4 text-left">
            <p class="text-xs font-medium text-gray-800 mb-1">Contattaci direttamente:</p>
            <div class="text-xs text-gray-600 space-y-0.5">
              <p>📞 <a href="tel:+390212345678" class="text-blue-600 hover:underline">+39 02 1234 5678</a></p>
              <p>📧 <a href="mailto:info@tuaazienda.it" class="text-blue-600 hover:underline">info@tuaazienda.it</a></p>
            </div>
          </div>

          <div class="flex gap-2">
            <button 
              onClick$={onClose}
              class="flex-1 border-2 border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Chiudi
            </button>
            <button 
              onClick$={onRetry}
              class="flex-1 bg-blue-600 text-white px-3 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
            >
              Riprova
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});