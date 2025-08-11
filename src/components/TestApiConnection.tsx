// frontend/src/components/TestApiConnection.tsx
import { component$, useStore, $ } from '@builder.io/qwik';
import { apiClient } from '../lib/api';

/**
 * Componente temporaneo per testare la connessione API
 * Da rimuovere dopo aver verificato che tutto funziona
 */
export const TestApiConnection = component$(() => {
  const testResults = useStore({
    backendHealth: 'non testato',
    categoriesCount: 0,
    categoriesData: [] as any[],
    error: '',
    isLoading: false,
    lastTest: ''
  });

  const runTests = $(async () => {
    console.log('🧪 Iniziando test connessione API...');
    
    testResults.isLoading = true;
    testResults.error = '';
    testResults.lastTest = new Date().toLocaleTimeString();
    
    try {
      // Test 1: Health check backend
      console.log('📡 Test 1: Health check...');
      const healthOk = await apiClient.testConnection();
      testResults.backendHealth = healthOk ? '✅ Connesso' : '❌ Disconnesso';
      console.log('Health result:', healthOk);
      
      // Test 2: Prova a caricare categorie
      if (healthOk) {
        console.log('📡 Test 2: Caricamento categorie...');
        const response = await apiClient.getCategories();
        console.log('Categories response:', response);
        
        if (response.success && response.data) {
          testResults.categoriesCount = response.data.length;
          testResults.categoriesData = response.data;
          console.log('📊 Categorie caricate con successo:', response.data);
        } else {
          testResults.error = response.error || 'Errore sconosciuto nel caricamento categorie';
          console.error('❌ Errore categorie:', response.error);
        }
      } else {
        testResults.error = 'Backend non raggiungibile - Verifica che sia attivo su localhost:3000';
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore network sconosciuto';
      testResults.error = errorMessage;
      console.error('🚨 Test fallito:', error);
    } finally {
      testResults.isLoading = false;
    }
  });

  const resetTest = $(() => {
    testResults.backendHealth = 'non testato';
    testResults.categoriesCount = 0;
    testResults.categoriesData = [];
    testResults.error = '';
    testResults.lastTest = '';
  });

  return (
    <div class="max-w-4xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl mb-6 shadow-lg">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-blue-900">🧪 Test Connessione API</h3>
        <div class="text-sm text-gray-600">
          {testResults.lastTest && `Ultimo test: ${testResults.lastTest}`}
        </div>
      </div>
      
      {/* Pulsanti di controllo */}
      <div class="flex gap-3 mb-6">
        <button 
          onClick$={runTests}
          disabled={testResults.isLoading}
          class={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            testResults.isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
          } text-white`}
        >
          {testResults.isLoading ? '⏳ Testando...' : '🚀 Avvia Test'}
        </button>
        
        <button 
          onClick$={resetTest}
          class="px-4 py-3 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white transition-all duration-200"
        >
          🔄 Reset
        </button>
      </div>
      
      {/* Risultati del test */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="bg-white p-4 rounded-lg border">
          <div class="font-semibold text-gray-700 mb-2">Backend Status</div>
          <div class="text-lg">{testResults.backendHealth}</div>
        </div>
        
        <div class="bg-white p-4 rounded-lg border">
          <div class="font-semibold text-gray-700 mb-2">Categorie Trovate</div>
          <div class="text-lg font-bold text-green-600">{testResults.categoriesCount}</div>
        </div>
      </div>
      
      {/* Errori */}
      {testResults.error && (
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div class="font-semibold text-red-800 mb-1">❌ Errore:</div>
          <div class="text-red-700">{testResults.error}</div>
        </div>
      )}
      
      {/* Dati categorie */}
      {testResults.categoriesData.length > 0 && (
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="font-semibold text-green-800 mb-3">✅ Categorie Caricate:</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            {testResults.categoriesData.map((category: any) => (
              <div key={category.id} class="bg-white p-3 rounded border text-sm">
                <div class="font-medium">{category.name}</div>
                <div class="text-gray-600">{category.description}</div>
                <div class="text-xs text-gray-500 mt-1">ID: {category.id}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Istruzioni */}
      <div class="mt-6 text-sm text-gray-600 bg-white p-4 rounded-lg border">
        <strong>💡 Come interpretare i risultati:</strong>
        <ul class="mt-2 space-y-1">
          <li>• <strong>Backend Status ✅ Connesso:</strong> Il backend è raggiungibile</li>
          <li>• <strong>Categorie &gt; 0:</strong> I dati vengono caricati correttamente</li>
          <li>• <strong>Se vedi errori:</strong> Verifica che il backend sia attivo su localhost:3000</li>
        </ul>
      </div>
    </div>
  );
});