import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// For a project site (https://<username>.github.io/indian-passport-photo/)
// keep base as '/indian-passport-photo/'.
// If this repo is the user site (username.github.io) set base: '/'.
export default defineConfig({
  base: '/indian-passport-photo/',
  plugins: [svelte()],
  build: {
    outDir: 'dist'
  }
});