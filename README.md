# Raipur cab site

Site for Sahu Travels, a Raipur cab and vehicle rental business. Vite, React and Tailwind v4. No backend:
every enquiry goes to WhatsApp or a phone call, and no prices are shown.

## Pages

| Address | Page | Folder |
| --- | --- | --- |
| `/` | Home | `src/pages/home` |
| `/vehicles` | Vehicles, with photos | `src/pages/vehicles` |
| `/trips` | Trips from Raipur | `src/pages/trips` |
| `/about` | About Dinesh Sahu and the fleet | `src/pages/about` |
| `/contact` | The one enquiry form | `src/pages/contact` |
| anything else | Not found (`404.html`) | `src/pages/not-found` |

## How the pages link

- **There is one contact form, and it is `/contact`.** Every "tell us about your trip", "plan my trip"
  and vehicle "Enquire" button goes there. Build those links with `contactLink()` in `src/lib/links.js`
  (`contactLink({ lane: 'trip', vehicle: 'Innova Crysta' })`), never by typing the address.
- **Call buttons are always `tel:` links** and never go to `/contact`. WhatsApp quick-message buttons
  (hero, phone bar, footer, "ask about this trip") open WhatsApp directly with the message typed in.
- The header links come from each page's `nav` in its `meta.js`; the footer links to every page.

## Run

```
npm install
npm run dev          # local preview
npm run build:demo   # build with placeholders, for showing the client
npm run build        # production build; refuses to run while placeholders remain
```

## Where things live

- `src/content.js`: everything the client can change, shared by several pages: business details,
  services, vehicles and trips. Components hold no copy.
- `src/pages/<name>/`: one folder per page (`meta.js` and `Page.jsx`, plus that page's own copy and
  components). Pages today: `home`, `vehicles`, `trips`, `about`, `contact`, `not-found`.
  **To add a page, read `PAGES.md`.**
- `src/components/`: the shell and pieces every page shares (header, footer, phone bar, buttons, the
  closing "Ready to book?" band, the roadside milestone).
- `public/images/`: the founder portrait (`about/`) and the vehicle photos (`vehicles/`).
  `scripts/make-vehicle-images.py` re-makes the vehicle images from the originals.
- `docs/`: notes on the About, Vehicles and Contact pages and the questions still open with the client.
- `src/router.js`: the whole router, about 150 lines and no dependency. `scripts/site-routes.mjs`:
  the build step that gives each page its own `<head>`, `404.html` and the sitemap.

The enquiry form is the `/contact` page. It has four lanes (need a cab now, plan a trip, wedding or
group, already booked) and every one ends as a WhatsApp message. `/contact?lane=booked` opens a lane
directly, so the client can paste that link into a WhatsApp reply to a customer who has booked.

## How pages load

The site is a single-page app with real addresses. A visitor who clicks around never reloads: the
header stays, the page dissolves into the next one (the View Transitions API; browsers without it
fade instead, and reduced motion swaps instantly), Back restores the scroll position, and a page's
code is fetched quietly in advance, so clicks feel instant.

The build also writes `dist/<path>/index.html` for every page and `dist/404.html`. Each is the same
app with that page's own title, description, link preview and structured data, because WhatsApp and
search engines read the HTML they are served and do not run JavaScript. The sitemap and `robots.txt`
are generated from the same pages once `site.url` is set.

## Before launch

1. Replace the placeholders in `business`: name, WhatsApp (`91` + ten digits), phone, address.
2. Check the vehicle list against what the client really owns, and check each trip distance on
   Google Maps (sources differed by a few km).
3. Set every flag in `confirmed` to `true`. `npm run build` stays blocked until they all are and
   both numbers are valid Indian mobiles.
4. Add the logo (`public/logo.svg`, then `business.logo`) and, once the domain is known, `site.url`.
5. Read the `/contact` lane names and the Hindi labels with the client (`src/pages/contact/content.js`),
   then set `confirmed.contactPage` to `true`.
6. Have Dinesh read the `/about`, `/vehicles` and `/trips` pages (open questions are in `docs/`), then set
   `confirmed.about`, `confirmed.vehicles` and `confirmed.trips` to `true`. Set `confirmed.domain` once the
   live address is configured. `npm run check` lists what is still open.
7. Deploy to any static host, served from the domain root. On Vercel: import the repo, framework
   preset "Vite" (`vercel.json` already turns on clean URLs). For a preview deployment that still has
   placeholders, set the build command to `npm run build:demo`.
8. On the first deployment, open `/contact` (no trailing slash) and an address that does not exist,
   such as `/nope`. Most hosts serve `/contact` from `contact/index.html` and answer unknown addresses
   with `404.html`. If a host answers `/contact` with a 404, switch on the host's clean URLs setting.

## Not in v1

Hindi and English toggle, a share-preview image for WhatsApp, analytics, prices.
