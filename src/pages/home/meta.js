import { site } from '../../content.js'
import { businessLd } from '../../lib/seo.js'

// Read by the router in the browser and by the build plugin (scripts/site-routes.mjs) in Node,
// so keep this file plain JavaScript with no JSX.
export default {
  path: '/',
  title: site.title,
  description: site.description,
  // Header link to a section of this page. Vehicles, Trips, About and Contact are pages of their
  // own, and each declares its header link in its own meta.js (order 20, 30, 40 and 90).
  nav: [{ label: 'Services', href: '/#services', order: 10 }],
  jsonLd: businessLd,
}
