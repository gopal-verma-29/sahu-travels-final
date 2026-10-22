# Adding a page

The contract for building a page on this site. Read all of it before you start; it is short.

The site is Vite, React 19 and Tailwind v4, with no backend and no other libraries. **Every page is
one folder in `src/pages/`.** The router, the header links, the page transition, the page's `<head>`
tags, the 404 page and the sitemap all pick a new folder up by themselves, so adding a page never
means editing a shared file.

## Add a page: two files

`src/pages/faq/meta.js`. Plain JavaScript with no JSX, because the build reads it in Node as well
as the browser.

```js
import { business } from '../../content.js'

export default {
  path: '/faq', // lowercase, no trailing slash. Nested is fine: '/trips/rajim'
  title: `Questions and answers | ${business.name}`, // browser tab, search results, link previews
  description: 'One or two plain sentences for search results and link previews.',
  nav: { label: 'FAQ', order: 50 }, // optional header link; a lower order sits further left
}
```

`src/pages/faq/Page.jsx`. The page itself, as the default export.

```jsx
export default function FaqPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h1 className="font-display text-[clamp(3.5rem,12vw,7.5rem)] font-semibold leading-[0.95]">Questions and answers</h1>
      </div>
    </section>
  )
}
```

That is the whole job. Run `npm run dev` and the page is at `/faq`.

Every field of `meta.js`:

| field | |
| --- | --- |
| `path` | required |
| `title`, `description` | required |
| `nav` | one `{ label, order, href? }` or a list of them. Becomes a header link, in the phone menu too |
| `stickyBar` | `false` hides the phone Call and WhatsApp bar on this page |
| `noindex` | `true` keeps the page out of search and the sitemap |
| `head` | extra raw tags for this page's `<head>`, one string or a list, e.g. a preload for the first image |
| `jsonLd` | schema.org data for this page. The build adds `@context`. `businessLd` in `src/lib/seo.js` describes the business |

A mistake in `meta.js` fails the build with a message that says what to fix.

## Rules

**Links.** Use a plain `<a href="/contact">`. There is no Link component to import: the router
handles every same-site link (transition, scroll, focus). A link to a page never ends in a slash.
A link to a section of the home page from another page is `href="/#services"`. Add `target="_blank"`
or `data-reload` to a link to opt out. To open the contact form pre-filled, build the link with
`contactLink({ lane: 'trip', to: 'Chitrakote', vehicle: 'Innova Crysta' })` from `src/lib/links.js` (it
gives `/contact?lane=trip&to=Chitrakote&vehicle=Innova+Crysta`). The lanes are `now`, `trip`, `group`
and `booked`; `vehicle` takes a vehicle type or the name of a vehicle on `/vehicles`. **The enquiry
form lives only on `/contact`: never add a second form to another page, link to it.** A Call button is
always a `tel:` link (`telLink`), never a link to `/contact`.

**Files you may touch.** Only your own folder, `src/pages/<name>/`. Copy and helpers that belong to
one page go in that folder (`content.js`, extra components). `src/components/` and `src/lib/` are
shared by every page: use them, and ask before changing how they behave. Client facts that several
pages use (`business`, `services`, `fleet`, `tours`) are in `src/content.js`: read them, do not
change existing values.

**Do not touch.** `index.html` (the `<!--seo:begin-->` markers belong to the build), `src/router.js`,
`src/App.jsx`, `vite.config.js`, `scripts/`.

**Layout and style.** One `<h1>` per page: the router moves focus to it after each navigation. A page
is a stack of full-width `<section>`s, each holding a `<div className="mx-auto max-w-6xl px-5 ...">`;
copy a section from `src/pages/home/`. The content `div` of each section rises a little as the page
arrives, so keep that structure. Use the theme colours and fonts (`plate`, `asphalt`, `wash`,
`font-display`) and the shared helpers: `h2`, `input` and `label` from `src/components/ui.js`,
`LinkButton` and `btn()` from `src/components/Button.jsx`, the icons in `Icons.jsx`, `Vehicle.jsx`.
Plain, short copy. No prices anywhere.

**Motion.** The page transition is automatic. Add no libraries (no framer-motion, GSAP or router).
A page's motion lives in its own CSS file (`about.css`, `vehicles.css` and `contact.css` are the
examples) and follows one pattern: the load sequence is CSS only, inside
`@media (prefers-reduced-motion: no-preference)`; anything that waits for a scroll is hidden only under
`html[data-motion='on']` (set by `src/lib/motion.js`), so a reader who asks for reduced motion gets the
finished page at once, and `useInView` (`src/lib/useInView.js`) adds `is-in` when a block scrolls into
view. Animate transform and opacity only, never loop an animation, and never put a form or a button
behind motion that could fail to start.

**The URL.** A page is mounted fresh on every navigation, so read `new URLSearchParams(window.location.search)`
when it mounts. To change a query without navigating, use `replaceSearch(key, value)` from `src/router.js`.

**Files and images.** Put them in `public/` and refer to them with an absolute path (`/photo.jpg`),
never a relative one: a relative path breaks as soon as the page is not at the site root.

## Before handing a page back

1. `npm run build:demo` passes. (`npm run build` also runs the client sign-off check, see the README.)
2. `npm run preview`: open `/<your-path>` directly, then reach it by clicking from the home page.
3. At 360px wide there is no sideways scroll and every tap target is at least 44px.
4. No console errors, headings in order, every image has `alt` (`alt=""` if decorative).
