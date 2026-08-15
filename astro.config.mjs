import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const GITHUB_USERNAME = "orbitalsite";
const REPO_NAME = "orbital-apps";

export default defineConfig({
  site: `https://${GITHUB_USERNAME}.github.io`,
  base: `/${REPO_NAME}`,
  output: 'static',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ar',
        locales: {
          ar: 'ar',
          en: 'en',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'ar',
    locales: ['ar', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/three')) {
              return 'three';
            }
            if (id.includes('node_modules/gsap')) {
              return 'gsap';
            }
          },
        },
      },
    },
  },
});
