import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: [
        'indicadores-de-desempenho.onrender.com'
      ],
      hmr: {
        overlay: true,
      },
      proxy: {
        '/api': {
          target: 'http://localhost:4004',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL)
    },
    resolve: {
      alias: {
        '@': path.resolve(dirname(fileURLToPath(import.meta.url)), './src'),
      }
    }
  };
});

