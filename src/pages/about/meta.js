import { about } from '../../content.js'
import { absolute, businessLd } from '../../lib/seo.js'

export default {
  path: '/about',
  title: about.title,
  description: about.description,
  nav: { label: 'About', order: 40 },
  // The page is drawn by script, so the browser would find the founder photo late. Preload it.
  head: [
    '<link rel="preload" as="image" type="image/avif" imagesrcset="/images/about/dinesh-sahu-480.avif 480w, /images/about/dinesh-sahu-720.avif 720w, /images/about/dinesh-sahu-896.avif 896w" imagesizes="(min-width: 768px) 40vw, 90vw" fetchpriority="high" />',
  ],
  jsonLd: {
    '@type': 'AboutPage',
    name: about.title,
    description: about.description,
    ...(absolute('/about') ? { url: absolute('/about') } : {}),
    mainEntity: { ...businessLd, founder: { '@type': 'Person', name: about.founder } },
  },
}
