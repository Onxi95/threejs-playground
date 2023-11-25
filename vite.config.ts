import { defineConfig } from 'vite';
import config from './package.json';

export default defineConfig({
  base: config.name,
});
