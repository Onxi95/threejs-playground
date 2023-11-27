import { defineConfig } from 'vite';
import config from './package.json';

export default defineConfig(({ mode }) => ({
  appType: 'mpa',
  base: mode === 'production' ? `/${config.name}` : '/',
  assetsInclude: ['**/*.hdr'],
  build: {
    rollupOptions: {
      input: [
        'index.html',
        'pages/animation-example/index.html',
        'pages/rotations/index.html',
        'pages/materials/index.html',
        'pages/text/index.html',
      ],
    },
  },
}));
