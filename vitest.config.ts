import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Shared by frontend (jsdom) and backend (.mjs) tests — backend test files opt
// out of jsdom via a `// @vitest-environment node` docblock at the top of the file.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['node_modules', 'dist', 'e2e'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}', 'server/**/*.mjs'],
      exclude: ['src/**/*.test.{ts,tsx}', 'server/**/*.test.mjs', 'src/main.tsx'],
    },
  },
});
