import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Deshabilitar caché del servidor de desarrollo
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },
  // Forzar que Vite siempre genere nuevos hashes
  optimizeDeps: {
    force: true,
  },
});
