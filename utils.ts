///<reference types="vite/client" />

import appManifest from './package.json';
export const getProjectPublicRoot = (path: string) => {
  if (import.meta.env.PROD) return `/${appManifest.name}/${path}`;
  return path;
};
