import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '127.0.0.1',
    proxy: {
      '/kekstagram': {
        target: 'https://31.javascript.htmlacademy.pro',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
