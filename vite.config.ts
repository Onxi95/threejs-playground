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
      input: ['index.html', ...findHtmlEntries('pages')],
    },
  },
}));

function findHtmlEntries(directoryPath: string) {
  const buildPaths: string[] = [];

  function traverseSubdirectories(subDirectoryPath: string) {
    const files = readdirSync(subDirectoryPath);

    files.forEach((file) => {
      const filePath = join(subDirectoryPath, file);

      if (statSync(filePath).isDirectory()) {
        traverseSubdirectories(filePath);
      } else {
        if (extname(filePath) === '.html') {
          buildPaths.push(filePath);
        }
      }
    });
  }

  traverseSubdirectories(directoryPath);

  console.log({ buildPaths });
  return buildPaths;
}
