import { defineConfig } from 'vite';
import config from './package.json';

export default defineConfig(({ mode }) => ({
  appType: 'mpa',

  base: mode === 'production' ? `/${config.name}` : '/',
}));
