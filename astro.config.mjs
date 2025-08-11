// @ts-check
import { defineConfig } from 'astro/config';
import qwik from '@qwikdev/astro';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    qwik({
      // Configurazione specifica per evitare problemi di serializzazione
      include: ['**/src/components/**/*'],
      exclude: ['**/node_modules/**'],
    }), 
    tailwind()
  ],
  vite: {
    optimizeDeps: {
      include: ['@builder.io/qwik', '@builder.io/qwik/jsx-runtime']
    },
    ssr: {
      noExternal: ['@builder.io/qwik'],
      // Evita problemi di serializzazione con elementi DOM
      external: ['jsdom']
    },
    server: {
      hmr: {
        // Configurazione HMR per evitare serializzazione di elementi DOM
        clientPort: 4322,
      },
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Forward cookies correctly
              if (req.headers.cookie) {
                proxyReq.setHeader('cookie', req.headers.cookie);
              }
            });
          }
        }
      }
    },
    // Configurazione per evitare problemi di serializzazione
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }
});