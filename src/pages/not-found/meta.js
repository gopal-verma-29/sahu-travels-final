import { business } from '../../content.js'

// path "*" marks the page shown for any address that is not a page. The build writes it to
// 404.html, so a static host answers unknown addresses with this page and a real 404 status.
export default {
  path: '*',
  title: `Page not found | ${business.name}`,
  description: `This page does not exist. Go back to the ${business.name} home page.`,
  noindex: true,
}
