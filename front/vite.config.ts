import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/video': {
        target: 'http://localhost:3000', // URL вашего бэкенда
        changeOrigin: true,
      },
    },
  },
});
