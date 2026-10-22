import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { siteRoutes } from './scripts/site-routes.mjs'

// Routing, per-page <head> tags, 404.html and the sitemap all come from the folders in src/pages/.
// See scripts/site-routes.mjs and PAGES.md.
export default defineConfig({
  plugins: [react(), tailwindcss(), siteRoutes()],
})
