// src/components/Admin/AdminLogin.tsx
import { component$, useSignal, useStore, $ } from '@builder.io/qwik';
import { apiClient } from '../../lib/api';

export default component$(() => {
  const formData = useStore({
    email: '',
    password: '',
    remember: false
  });

  const state = useStore({
    loading: false,
    error: '',
    success: false
  });

  const handleSubmit = $(async (e: Event) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      state.error = 'Email e password sono richiesti';
      return;
    }

    state.loading = true;
    state.error = '';

    try {
      const response = await apiClient.login(formData.email, formData.password, formData.remember);
      
      if (response.success) {
        state.success = true;
        // Redirect to admin dashboard
        window.location.href = '/admin/products';
      } else {
        state.error = response.error || 'Errore durante il login';
      }
    } catch (error) {
      state.error = 'Errore di connessione';
    } finally {
      state.loading = false;
    }
  });

  return (
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Accesso Admin
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          High Vision CMS
        </p>
      </div>
      
      <form class="mt-8 space-y-6" onSubmit$={handleSubmit}>
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onInput$={(e) => formData.email = (e.target as HTMLInputElement).value}
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email admin"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onInput$={(e) => formData.password = (e.target as HTMLInputElement).value}
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={formData.remember}
              onChange$={(e) => formData.remember = (e.target as HTMLInputElement).checked}
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-900">
              Ricordami
            </label>
          </div>
        </div>

        {state.error && (
          <div class="rounded-md bg-red-50 p-4">
            <div class="text-sm text-red-700">{state.error}</div>
          </div>
        )}

        {state.success && (
          <div class="rounded-md bg-green-50 p-4">
            <div class="text-sm text-green-700">Login effettuato! Reindirizzamento...</div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={state.loading}
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Credenziali di test:<br />
            <strong>admin@highvision.com</strong><br />
            <strong>password123</strong>
          </p>
        </div>
      </form>
    </div>
  );
});