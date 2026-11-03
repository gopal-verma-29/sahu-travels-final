// Runs after `vite build` (see package.json). Fails the build when the tags a search engine reads disagree with
// each other: a canonical on one domain, a sitemap on another and a hand-edited robots.txt on a third is how
// this site once shipped, and the icon in search results never appeared. Everything is checked in dist/, the
// files that are actually served, not in the source.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { site } from '../src/content.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const base = site.url.replace(/\/$/, '')
const problems = []
const warnings = []

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      if (name !== 'assets' && name !== 'images') walk(full, out)
    } else out.push(full.slice(dist.length + 1).replaceAll('\\', '/'))
  }
  return out
}
const served = (url) => existsSync(join(dist, new URL(url, base).pathname))

const pages = walk(dist).filter((f) => f === '404.html' || f.endsWith('index.html'))
const canonicals = []

for (const file of pages) {
  const head = readFileSync(join(dist, file), 'utf8').split('</head>')[0]
  const where = `dist/${file}`
  const is404 = file === '404.html'
  const path = '/' + file.replace(/index\.html$/, '').replace(/\/$/, '')

  const canonical = head.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
  const ogUrl = head.match(/<meta property="og:url" content="([^"]+)"/)?.[1]
  if (is404) {
    if (!/<meta name="robots" content="noindex"/.test(head)) problems.push(`${where}: the not-found page must be noindex`)
  } else {
    const want = base + (path === '/' ? '/' : path)
    if (canonical !== want) problems.push(`${where}: canonical is ${canonical ?? 'missing'}, expected ${want}`)
    if (ogUrl !== want) problems.push(`${where}: og:url is ${ogUrl ?? 'missing'}, expected ${want}`)
    if (canonical) canonicals.push(canonical)

    const image = head.match(/<meta property="og:image" content="([^"]+)"/)?.[1]
    if (!image) problems.push(`${where}: no og:image, so a shared link has no picture`)
    else if (!image.startsWith(base + '/') || !served(image)) problems.push(`${where}: og:image ${image} is not a file this site serves`)
  }

  // Icons: Google Search reads <link rel="icon"> on the home page. SVG is not on its list of supported formats.
  if (file === 'index.html') {
    const icons = [...head.matchAll(/<link rel="(?:icon|apple-touch-icon)"[^>]*href="([^"]+)"/g)].map((m) => m[1])
    if (!icons.some((href) => /\.(ico|png)$/i.test(href))) problems.push(`${where}: no .ico or .png icon is linked (Google Search does not list SVG)`)
    for (const href of icons) if (!served(href)) problems.push(`${where}: icon ${href} is linked but not in the build`)
  }

  // Every address the structured data claims as its own must be on the one domain.
  for (const m of head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data
    try {
      data = JSON.parse(m[1])
    } catch {
      problems.push(`${where}: the JSON-LD is not valid JSON`)
      continue
    }
    const visit = (value, key) => {
      if (Array.isArray(value)) return value.forEach((v) => visit(v, key))
      if (value && typeof value === 'object') return Object.entries(value).forEach(([k, v]) => visit(v, k))
      if (['url', '@id', 'logo', 'image'].includes(key) && typeof value === 'string' && /^https?:/.test(value) && !value.startsWith(base)) {
        problems.push(`${where}: JSON-LD ${key} "${value}" is not on ${base}`)
      }
    }
    visit(data)
  }
}

const sitemap = existsSync(join(dist, 'sitemap.xml')) ? readFileSync(join(dist, 'sitemap.xml'), 'utf8') : ''
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
if (!locs.length) problems.push('dist/sitemap.xml is missing or empty')
for (const loc of locs) if (!loc.startsWith(base + '/') && loc !== base) problems.push(`dist/sitemap.xml: ${loc} is not on ${base}`)
const missing = canonicals.filter((c) => !locs.includes(c))
if (missing.length) problems.push(`dist/sitemap.xml does not list: ${missing.join(', ')}`)

const robots = existsSync(join(dist, 'robots.txt')) ? readFileSync(join(dist, 'robots.txt'), 'utf8') : ''
if (!robots.includes(`Sitemap: ${base}/sitemap.xml`)) problems.push(`dist/robots.txt does not point at ${base}/sitemap.xml`)
if (/^\s*Disallow:\s*\/\s*$/m.test(robots)) problems.push('dist/robots.txt blocks the whole site')

// The build writes its own robots.txt and sitemap.xml from site.url and overwrites these two, so editing them by hand does nothing.
for (const f of ['robots.txt', 'sitemap.xml']) {
  if (existsSync(join(root, 'public', f))) warnings.push(`public/${f} is overwritten by the build. Delete it and change site.url in src/content.js instead.`)
}

warnings.forEach((w) => console.warn(`SEO warning: ${w}`))
if (problems.length) {
  console.error('\nSEO check failed:\n  - ' + problems.join('\n  - ') + '\n')
  process.exit(1)
}
console.log(`SEO check passed: ${pages.length} pages, one domain (${base}), icons, share image and sitemap agree.`)
