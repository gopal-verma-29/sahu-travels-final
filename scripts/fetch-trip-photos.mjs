#!/usr/bin/env node
// Finds, checks and downloads one licensed photo per trip from Wikimedia Commons, resizes it, and writes
//   public/trips/<slug>-{480,960,1440}.webp
//   src/pages/trips/photos.js   (alt text and credit line included)
//   photos-report.md                 (what was picked, with licence, author and a link to check it)
//
//   npm i -D sharp                                       once
//   node scripts/fetch-trip-photos.mjs --review          writes photos-review.html: the best candidates per trip
//   node scripts/fetch-trip-photos.mjs                   downloads the top-ranked candidate for every trip
//   node scripts/fetch-trip-photos.mjs --only chitrakote --pick "File:Some name.jpg"
//                                                        use the file you chose on the review page
//   node scripts/fetch-trip-photos.mjs --local rajim=./photos/rajim.jpg --local sirpur=./photos/sirpur.jpg
//                                                        use your own photos (the client's, ideally): same
//                                                        resizing and photos.js entry, no network needed.
//                                                        Add --credit "Dinesh Sahu" to print a credit line, or
//                                                        leave it out to print none.
//
// Only CC0, public domain, CC BY and CC BY-SA photos are accepted (no NonCommercial, no NoDerivatives). Those
// licences require a credit, so the credit line is built from the file's own Commons data and the page prints it.
//
// Run it where commons.wikimedia.org is reachable. The ranking is a heuristic (size, wide shape, quality badges,
// file names that suggest a wide view). A trip whose best candidate scores poorly keeps its poster. Only a person
// can tell whether a photo shows the right place:
// open the review page, look at the seven, and re-run with --pick for any you would swap.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { tours } from '../src/content.js'

// Problems with the arguments, the network or a file end with one readable line, not a stack trace.
process.on('uncaughtException', (e) => {
  console.error(`\n${e.message}`)
  process.exit(1)
})

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const API = process.env.COMMONS_API ?? 'https://commons.wikimedia.org/w/api.php'
const UA = 'SahuTravelsSiteBuild/1.0 (https://zyvora.studio)' // Wikimedia asks for a descriptive agent with a contact URL
const WIDTHS = [480, 960, 1440]
const MIN_WIDTH = 1400
const MIN_AUTO_SCORE = 30 // below this the top candidate is a guess (a map, a close-up, a night shot): leave it to a person
const PHOTOS_JS = join(root, 'src/pages/trips/photos.js')

// What to look for, per trip slug. `categories` are Commons categories (exact names, without "Category:").
// `search` is the fallback when a category is missing or thin. `subject` becomes the alt text.
const TRIPS = {
  rajim: {
    subject: 'Rajiv Lochan temple at Rajim',
    categories: ['Rajivalochan mandir, Rajim', 'Rajim'],
    search: 'Rajim Rajiv Lochan temple Chhattisgarh',
  },
  sirpur: {
    subject: 'Laxman Temple at Sirpur',
    categories: ['Laxman Temple, Sirpur', 'Sirpur'],
    search: 'Sirpur Laxman temple Chhattisgarh',
  },
  barnawapara: {
    subject: 'Barnawapara Wildlife Sanctuary',
    categories: ['Barnawapara Wildlife Sanctuary', 'Barnawapara Sanctuary'],
    search: 'Barnawapara wildlife sanctuary Chhattisgarh',
  },
  dongargarh: {
    subject: 'Maa Bamleshwari temple on the hill at Dongargarh',
    categories: ['Bambleshwari Mandir', 'Dongargarh'],
    search: 'Dongargarh Bamleshwari temple hill',
  },
  bhoramdeo: {
    subject: 'Bhoramdeo temple',
    categories: ['Bhoramdeo Temple', 'Bhoramdeo'],
    search: 'Bhoramdeo temple Kawardha Chhattisgarh',
  },
  chitrakote: {
    subject: 'Chitrakote Falls on the Indravati river',
    categories: ['Chitrakote Falls'],
    search: 'Chitrakote Falls Indravati Bastar',
  },
  mainpat: {
    subject: 'Mainpat hill station',
    categories: ['Mainpat'],
    search: 'Mainpat Surguja Chhattisgarh',
  },
}

// ---------------------------------------------------------------- arguments
const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const opt = (n) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : undefined)
const only = opt('only')?.split(',').map((s) => s.trim())
const pick = opt('pick')
if (pick && (!only || only.length !== 1)) {
  console.error('--pick needs exactly one trip: --only <slug> --pick "File:Name.jpg"')
  process.exit(1)
}
// --local slug=path (repeatable)
const locals = args.flatMap((a, i) => (args[i - 1] === '--local' ? [a] : []))
const ownCredit = opt('credit')

// ---------------------------------------------------------------- Commons
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// fetch with a message a person can act on when the site cannot be reached at all.
async function get(url) {
  try {
    return await fetch(url, { headers: { 'user-agent': UA } })
  } catch (e) {
    throw new Error(`Could not reach ${new URL(url).host} (${e.cause?.code ?? e.message}). Run this where that site is reachable, or use --local with your own photos.`)
  }
}

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', origin: '*', ...params })}`
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await get(url)
    if (res.status === 429 || res.status >= 500) {
      await sleep(1500 * attempt)
      continue
    }
    if (!res.ok) throw new Error(`Commons answered ${res.status} for ${params.action}. Is commons.wikimedia.org reachable from here?`)
    return res.json()
  }
  throw new Error('Commons kept refusing (rate limit?). Wait a minute and run again.')
}

const categoryFiles = async (cat) =>
  ((await api({ action: 'query', list: 'categorymembers', cmtitle: `Category:${cat}`, cmtype: 'file', cmlimit: '60' })).query?.categorymembers ?? []).map((m) => m.title)

const searchFiles = async (q) =>
  ((await api({ action: 'query', list: 'search', srsearch: q, srnamespace: '6', srlimit: '30' })).query?.search ?? []).map((m) => m.title)

async function details(titles) {
  const out = []
  for (let i = 0; i < titles.length; i += 20) {
    const j = await api({
      action: 'query',
      titles: titles.slice(i, i + 20).join('|'),
      prop: 'imageinfo',
      iiprop: 'url|size|mime|extmetadata',
      iiurlwidth: '1600',
      iiextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist|Credit|Assessments|Restrictions',
    })
    for (const p of j.query?.pages ?? []) {
      const info = p.imageinfo?.[0]
      if (info) out.push({ title: p.title, ...info })
    }
    await sleep(200)
  }
  return out
}

// ---------------------------------------------------------------- choosing
const OK_LICENSE = /^(CC0|Public domain|PD\b|CC BY(-SA)? [\d.]+)/i
const strip = (html = '') =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
const field = (c, k) => strip(c.extmetadata?.[k]?.value ?? '')

function describe(c) {
  const license = field(c, 'LicenseShortName')
  return {
    title: c.title,
    page: c.descriptionurl,
    thumb: c.thumburl || c.url,
    width: c.width,
    height: c.height,
    mime: c.mime,
    license,
    licenseUrl: field(c, 'LicenseUrl'),
    artist: field(c, 'Artist') || field(c, 'Credit'),
    badges: field(c, 'Assessments').toLowerCase(),
    restrictions: field(c, 'Restrictions'),
  }
}

const isPublicDomain = (d) => /^(CC0|Public domain|PD\b)/i.test(d.license)
const usable = (d) =>
  /^image\/(jpeg|png|webp)$/.test(d.mime) && d.width >= MIN_WIDTH && OK_LICENSE.test(d.license) && (d.artist || isPublicDomain(d))

function score(d) {
  let s = 0
  const ratio = d.width / d.height
  if (ratio >= 1.35 && ratio <= 2.1) s += 30
  else if (ratio >= 1.15) s += 12
  else s -= 25
  s += Math.min(d.width, 4000) / 100
  if (d.badges.includes('featured')) s += 40
  else if (d.badges.includes('quality')) s += 25
  else if (d.badges.includes('valued')) s += 15
  if (/(idol|deity|statue|sculpture|relief|carving|inscription|close|interior|inside|night|map|logo|flag|collage|poster|signboard|panoramio)/i.test(d.title)) s -= 40
  return s
}

async function candidates(slug, cfg) {
  const titles = new Set()
  for (const cat of cfg.categories) (await categoryFiles(cat)).forEach((t) => titles.add(t))
  if (titles.size < 8) (await searchFiles(cfg.search)).forEach((t) => titles.add(t))
  const all = (await details([...titles])).map(describe)
  return all
    .filter(usable)
    .map((d) => ({ ...d, score: score(d) }))
    .sort((a, b) => b.score - a.score)
}

// ---------------------------------------------------------------- output
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

async function writeReview(results) {
  const sections = Object.entries(results)
    .map(([slug, list]) => {
      const cards = list
        .slice(0, 6)
        .map(
          (d) => `<figure><img src="${esc(d.thumb)}" width="320" alt="">
<figcaption><a href="${esc(d.page)}">${esc(d.title)}</a><br>${esc(d.license)}, ${esc(d.artist || 'author not stated')}<br>${d.width}x${d.height}, score ${d.score.toFixed(0)}
<br><code>node scripts/fetch-trip-photos.mjs --only ${slug} --pick "${esc(d.title)}"</code></figcaption></figure>`,
        )
        .join('\n')
      return `<h2>${esc(slug)}: ${esc(TRIPS[slug].subject)}</h2><div class="row">${list.length ? cards : '<p>No usable candidate (licence, size or author missing). Add photos by hand.</p>'}</div>`
    })
    .join('\n')
  const html = `<!doctype html><meta charset="utf-8"><title>Trip photo candidates</title>
<style>body{font:16px/1.4 system-ui;margin:24px}.row{display:flex;flex-wrap:wrap;gap:16px}figure{margin:0;width:320px}img{display:block;background:#ddd}figcaption{font-size:13px}code{font-size:11px;word-break:break-all}</style>
<h1>Trip photo candidates</h1><p>Top six per trip, best first. Open the file page to confirm the photo shows the right place before you use it.</p>${sections}`
  await writeFile(join(root, 'photos-review.html'), html)
  console.log('Wrote photos-review.html. Open it, then run again (optionally with --pick) to download.')
}

// Resizes one photo to the three widths and returns the photos.js entry (without the credit).
async function render(slug, input, sharp) {
  await mkdir(join(root, 'public/trips'), { recursive: true })
  const made = []
  for (const w of WIDTHS) {
    const file = join(root, 'public/trips', `${slug}-${w}.webp`)
    const info = await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(file)
    made.push({ w: info.width, h: info.height, name: `${slug}-${w}.webp` })
  }
  const mid = made[1]
  const big = made[made.length - 1]
  return {
    src: `/trips/${mid.name}`,
    srcSet: made.map((m) => `/trips/${m.name} ${m.w}w`).join(', '),
    width: big.w,
    height: big.h,
    alt: TRIPS[slug]?.subject ?? slug,
  }
}

async function download(slug, d, sharp) {
  const res = await get(d.thumb)
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${d.title}`)
  const entry = await render(slug, Buffer.from(await res.arrayBuffer()), sharp)
  const changed = isPublicDomain(d) ? '' : ', resized and cropped'
  return { ...entry, credit: { text: `${d.artist || 'Wikimedia Commons'}, ${d.license}${changed}`, href: d.page } }
}

// ---------------------------------------------------------------- main
async function loadSharp() {
  try {
    return (await import('sharp')).default
  } catch {
    console.error('This step needs sharp. Run: npm i -D sharp')
    process.exit(1)
  }
}

async function existingPhotos() {
  try {
    return (await import(`${pathToFileURL(PHOTOS_JS).href}?t=${Date.now()}`)).photos ?? {}
  } catch {
    return {} // no file yet
  }
}

// Writes photos.js and a report that always lists every photo in it, whichever run added it.
async function save(entries, notes) {
  const rows = Object.entries(entries).map(([slug, p]) => `| ${slug} | ${p.credit ? `${p.credit.text}${p.credit.href ? ` ([file page](${p.credit.href}))` : ''}` : 'no credit line (own photo)'} | ${notes[slug] ?? ''} |`)
  const report = ['# Trip photos', '', 'Check each photo shows the place named. The alt text is the place name only: add detail if you like.', '', '| Trip | Credit | Chosen file |', '|---|---|---|', ...rows]
  const body = `// Real photos for the trip cards. Written by scripts/fetch-trip-photos.mjs; you can also edit it by hand.
// A trip with no entry shows its poster. Check each alt text against its photo before you ship.
export const photos = ${JSON.stringify(entries, null, 2)}
`
  await writeFile(PHOTOS_JS, body)
  await writeFile(join(root, 'photos-report.md'), report.join('\n') + '\n')
  console.log('\nWrote src/pages/trips/photos.js and photos-report.md. Open the file pages in the report to confirm each photo.')
}

const known = new Set(tours.map((t) => t.slug))

// Your own photos: no network, no licence to check.
if (locals.length) {
  const sharp = await loadSharp()
  const entries = await existingPhotos()
  const notes = {}
  for (const spec of locals) {
    const [slug, ...rest] = spec.split('=')
    const path = rest.join('=')
    if (!slug || !path) throw new Error(`--local needs slug=path, got "${spec}"`)
    if (!known.has(slug)) throw new Error(`"${slug}" is not a trip slug in content.js (${[...known].join(', ')}).`)
    const entry = await render(slug, await readFile(resolve(path)), sharp)
    entries[slug] = ownCredit ? { ...entry, credit: { text: ownCredit } } : entry
    notes[slug] = path
    console.log(`${slug}: ${path}`)
  }
  await save(entries, notes)
  process.exit(0)
}

const slugs = tours.map((t) => t.slug).filter((s) => !only || only.includes(s))
for (const s of slugs) if (!TRIPS[s]) console.warn(`No search settings for "${s}" in this script: add it to TRIPS, or add its photo by hand.`)
const wanted = slugs.filter((s) => TRIPS[s])
if (only) for (const s of only) if (!known.has(s)) console.warn(`"${s}" is not a trip slug in content.js.`)

const results = {}
for (const slug of wanted) {
  process.stdout.write(`${slug}: looking... `)
  if (pick) {
    const found = (await details([pick])).map(describe).filter(usable)
    if (!found.length) throw new Error(`${pick} is missing, too small, or not under an accepted licence (CC0, public domain, CC BY, CC BY-SA).`)
    results[slug] = found.map((d) => ({ ...d, score: score(d) }))
  } else {
    results[slug] = await candidates(slug, TRIPS[slug])
  }
  console.log(`${results[slug].length} usable`)
}

if (flag('review')) {
  await writeReview(results)
  process.exit(0)
}

const sharp = await loadSharp()
const entries = await existingPhotos()
const notes = {}
for (const slug of wanted) {
  const top = results[slug][0]
  if (!top) {
    console.warn(`${slug}: nothing usable, keeping the poster`)
    continue
  }
  if (!pick && top.score < MIN_AUTO_SCORE) {
    console.warn(`${slug}: the best candidate (${top.title}) is a weak match, keeping the poster. Run --review, then --only ${slug} --pick "File:..." if you find a good one.`)
    continue
  }
  entries[slug] = await download(slug, top, sharp)
  notes[slug] = `[${top.title}](${top.page})`
  console.log(`${slug}: ${top.title} (${top.license})`)
}
await save(entries, notes)
