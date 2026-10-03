import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // GitHub Pages 주소가 https://artgun79.github.io/notiondate/ 이므로 빌드할 때만 하위 경로를 붙인다.
  base: command === 'build' ? '/notiondate/' : '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
}));
