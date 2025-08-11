// frontend/src/components/TestLoadCategories.tsx
import { component$, useStore, $, useComputed$ } from '@builder.io/qwik';
import { useCatalogNavigation } from './Catalogo/hooks/useCatalogNavigation';

/**
 * Componente per testare la funzione loadCategories()
 * Mostra se carica le categorie dal backend o usa i dati statici
 */
export const TestLoadCategories = component$(() => {
  const { 
    loadCategories, 
    getCategories, 
    apiState, 
    clearApiError 
  } = useCatalogNavigation();

  // Valori computati che non sono Promise
  const isLoading = useComputed$(() => {
    return apiState.loadingCategories || 
           apiState.loadingSubcategories || 
           apiState.loadingProducts || 
           apiState.loadingSearch;
  });

  const hasApiError = useComputed$(() => {
    return !!apiState.error;
  });
  
  const testState = useStore({
    categories: [] as any[],
    lastTest: '',
    testType: 'none' as 'none' | 'loadCategories' | 'getCategories'
  });

  const runLoadCategoriesTest = $(async () => {
    console.log('🧪 Testing loadCategories()...');
    testState.lastTest = new Date().toLocaleTimeString();
    testState.testType = 'loadCategories';
    
    try {
      const categories = await loadCategories();
      testState.categories = categories || [];
      console.log('✅ loadCategories result:', categories);
    } catch (error) {
      console.error('❌ loadCategories error:', error);
    }
  });

  const runGetCategoriesTest = $(async () => {
    console.log('🧪 Testing getCategories()...');
    testState.lastTest = new Date().toLocaleTimeString();
    testState.testType = 'getCategories';
    
    const categories = await getCategories();
    testState.categories = categories || [];
    console.log('✅ getCategories result:', categories);
  });

  const clearErrors = $(() => {
    clearApiError();
  });

  return (
    <div class="max-w-4xl mx-auto p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl mb-6 shadow-lg">
      <h3 class="text-xl font-bold text-green-900 mb-4">
        🧪 Test LoadCategories Function
      </h3>
      
      {/* Pulsanti di controllo */}
      <div class="flex gap-3 mb-4 flex-wrap">
        <button 
          onClick$={runLoadCategoriesTest}
          disabled={isLoading.value}
          class={`px-4 py-2 rounded-lg font-medium transition-all ${
            isLoading.value
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
          } text-white`}
        >
          {isLoading.value ? '⏳ Loading...' : '🚀 Test loadCategories()'}
        </button>
        
        <button 
          onClick$={runGetCategoriesTest}
          disabled={isLoading.value}
          class="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all"
        >
          📋 Test getCategories()
        </button>
        
        <button 
          onClick$={clearErrors}
          class="px-4 py-2 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white transition-all"
        >
          🔄 Clear Errors
        </button>
      </div>
      
      {/* Statistiche del test */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div class="bg-white p-4 rounded-lg border">
          <div class="font-semibold text-gray-700 mb-2">Loading Status</div>
          <div class={`text-lg ${isLoading.value ? 'text-orange-600' : 'text-green-600'}`}>
            {isLoading.value ? '⏳ Loading...' : '✅ Ready'}
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-lg border">
          <div class="font-semibold text-gray-700 mb-2">Categories Found</div>
          <div class="text-lg font-bold text-green-600">{testState.categories.length}</div>
        </div>
        
        <div class="bg-white p-4 rounded-lg border">
          <div class="font-semibold text-gray-700 mb-2">Last Test</div>
          <div class="text-sm text-gray-600">{testState.lastTest || 'Non testato'}</div>
        </div>
        
        <div class="bg-white p-4 rounded-lg border">
          <div class="font-semibold text-gray-700 mb-2">Test Type</div>
          <div class="text-sm font-medium">
            {testState.testType === 'loadCategories' && '🚀 API Call'}
            {testState.testType === 'getCategories' && '📋 Cache/Static'}
            {testState.testType === 'none' && '⏸️ None'}
          </div>
        </div>
      </div>
      
      {/* Stato cache API */}
      <div class="bg-white p-4 rounded-lg border mb-4">
        <div class="font-semibold text-gray-700 mb-2">📊 API Cache Status</div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-gray-600">Cache Categories:</span>
            <span class="ml-2 font-medium">{apiState.categories.length}</span>
          </div>
          <div>
            <span class="text-gray-600">Loading Categories:</span>
            <span class="ml-2 font-medium">{apiState.loadingCategories ? '✅' : '❌'}</span>
          </div>
          <div>
            <span class="text-gray-600">Cache Age:</span>
            <span class="ml-2 font-medium">
              {apiState.lastCategoriesLoad ? 
                Math.round((Date.now() - apiState.lastCategoriesLoad) / 1000) + 's' : 
                'Never'
              }
            </span>
          </div>
        </div>
      </div>
      
      {/* Errori API */}
      {hasApiError.value && apiState.error && (
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div class="font-semibold text-red-800 mb-1">❌ API Error:</div>
          <div class="text-red-700">{apiState.error}</div>
          <div class="mt-2 text-sm text-red-600">
            💡 Se vedi questo errore, il sistema sta usando automaticamente i dati statici come fallback.
          </div>
        </div>
      )}
      
      {/* Risultati categorie */}
      {testState.categories.length > 0 && (
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div class="font-semibold text-green-800 mb-3">
            ✅ Categories Result ({testState.categories.length} found):
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            {testState.categories.map((category: any, index: number) => (
              <div key={category.id || index} class="bg-white p-3 rounded border text-sm shadow-sm">
                <div class="font-medium text-gray-900">{category.name}</div>
                <div class="text-gray-600 mt-1">{category.description}</div>
                <div class="text-xs text-gray-500 mt-2 space-y-1">
                  <div><strong>ID:</strong> {category.id}</div>
                  {category.slug && <div><strong>Slug:</strong> {category.slug}</div>}
                  {category.subcategories && (
                    <div><strong>Subcategories:</strong> {category.subcategories.length}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Istruzioni */}
      <div class="bg-white p-4 rounded-lg border">
        <div class="font-semibold text-gray-700 mb-2">💡 Come interpretare i risultati:</div>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>• <strong>🚀 Test loadCategories():</strong> Chiama l'API backend (se backend attivo)</li>
          <li>• <strong>📋 Test getCategories():</strong> Usa cache o dati statici (più veloce)</li>
          <li>• <strong>✅ Successo:</strong> Dovresti vedere 4 categorie</li>
          <li>• <strong>❌ Errore API:</strong> Sistema usa automaticamente dati statici</li>
          <li>• <strong>Cache:</strong> Seconda chiamata loadCategories() sarà più veloce</li>
        </ul>
      </div>
    </div>
  );
});