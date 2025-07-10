import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('svelte/config').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    alias: {
      $components: './src/components',
      $lib: './src/lib'
    }
    // Add adapter if needed for SSR/static
  }
};

export default config;
