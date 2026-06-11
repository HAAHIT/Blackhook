import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        hitesh: resolve(__dirname, 'hitesh.html'),
        'hitesh-v2': resolve(__dirname, 'hitesh-v2.html'),
      },
    },
  },
});
