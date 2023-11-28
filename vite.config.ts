import { defineConfig } from 'vite';
import config from './package.json';
import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

export default defineConfig(({ mode }) => ({
  appType: 'mpa',
  base: mode === 'production' ? `/${config.name}` : '/',
  assetsInclude: ['**/*.hdr'],
  build: {
    rollupOptions: {
      input: ['index.html', ...findHtmlEntries(join(__dirname, 'pages'))],
    },
  },
}));

function findHtmlEntries(directoryPath: string) {
  const result: string[] = [];
  const files = readdirSync(directoryPath);

  files.forEach((file) => {
    const filePath = join(directoryPath, file);

    if (statSync(filePath).isDirectory()) {
      findHtmlEntries(filePath);
    } else {
      if (extname(filePath) === '.html') {
        result.push(filePath);
        console.log(filePath);
      }
    }
  });
  return result;
}
