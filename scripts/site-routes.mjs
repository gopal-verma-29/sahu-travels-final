// Build plugin: gives every page its own static HTML head, so the title, description, link preview
// and structured data are right even though the page itself is rendered by React.
//
// WhatsApp, Google's first pass and every link-preview bot read the HTML file they are served and
// do not run the page's JavaScript. So for each folder in src/pages/ this plugin writes
// dist/<path>/index.html: the same app shell with that page's own <head>, plus a preload hint for
// that page's code so a visitor who lands straight on /contact does not wait for it.
// It also writes dist/404.html, sitemap.xml and robots.txt.
//
// Nothing here is page-specific. A new page appears the moment its folder has a meta.js and Page.jsx.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { site } from '../src/content.js'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const SEO = /<!--seo:begin-->[\s\S]*?<!--seo:end-->/
const PATH_OK = /^\/([a-z0-9-]+(\/[a-z0-9-]+)*)?$/
const base = site.url.replace(/\/$/, '')

// Fonts the first screen needs. Preloading them stops the Hindi headline flashing in a system
// font on a slow connection. The hashed file names are only known at build time.
const PRELOAD_FONTS = [
  /teko-devanagari-wght-normal.*\.woff2$/,
  /teko-latin-wght-normal.*\.woff2$/,
  /mukta-latin-400-normal.*\.woff2$/,
]

async function loadPages(root) {
  const dir = resolve(root, 'src/pages')
  const pages = []
  for (const name of readdirSync(dir).sort()) {
    const metaFile = join(dir, name, 'meta.js')
    if (!existsSync(metaFile)) continue
    if (!existsSync(join(dir, name, 'Page.jsx'))) throw new Error(`src/pages/${name}/ has a meta.js but no Page.jsx`)
    // The mtime in the query makes a changed meta.js load fresh instead of from Node's module cache.
    const { default: meta } = await import(`${pathToFileURL(metaFile).href}?v=${statSync(metaFile).mtimeMs}`)
    if (meta.path !== '*' && !PATH_OK.test(meta.path ?? '')) {
      throw new Error(`src/pages/${name}/meta.js: path "${meta.path}" must look like "/about" or "/trips/rajim" (lowercase, no trailing slash), or "*" for the not-found page`)
    }
    if (!meta.title || !meta.description) throw new Error(`src/pages/${name}/meta.js needs a title and a description`)
    pages.push({ name, ...meta })
  }
  pages.sort((a, b) => (a.path === '/' ? -1 : b.path === '/' ? 1 : a.path.localeCompare(b.path)))
  const seen = new Set()
  for (const p of pages) {
    if (seen.has(p.path)) throw new Error(`Two pages use the path "${p.path}"`)
    seen.add(p.path)
  }
  if (!seen.has('/')) throw new Error('src/pages needs a home page (meta.path "/")')
  if (!seen.has('*')) throw new Error('src/pages needs a not-found page (meta.path "*")')
  return pages
}

function headBlock(page) {
  const url = base && page.path !== '*' ? base + (page.path === '/' ? '/' : page.path) : ''
  const lines = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
  ]
  if (url) lines.push(`<meta property="og:url" content="${esc(url)}" />`, `<link rel="canonical" href="${esc(url)}" />`)
  if (page.noindex) lines.push(`<meta name="robots" content="noindex" />`)
  if (page.head) lines.push(...[].concat(page.head)) // extra raw tags, e.g. an image preload
  if (page.jsonLd) {
    const json = JSON.stringify({ '@context': 'https://schema.org', ...page.jsonLd }).replace(/</g, '\\u003c')
    lines.push(`<script type="application/ld+json">${json}</script>`)
  }
  return `<!--seo:begin-->\n    ${lines.join('\n    ')}\n    <!--seo:end-->`
}

// The files a page's own code needs, minus what the entry already loads.
function chunkHints(bundle, page) {
  const chunks = Object.values(bundle).filter((c) => c.type === 'chunk')
  const byName = new Map(chunks.map((c) => [c.fileName, c]))
  const closure = (chunk, into = new Set()) => {
    if (!chunk || into.has(chunk.fileName)) return into
    into.add(chunk.fileName)
    chunk.imports.forEach((f) => closure(byName.get(f), into))
    return into
  }
  const entry = closure(chunks.find((c) => c.isEntry))
  const own = chunks.find((c) => c.facadeModuleId?.replaceAll('\\', '/').endsWith(`/src/pages/${page.name}/Page.jsx`))
  if (!own) return ''
  const js = [...closure(own)].filter((f) => !entry.has(f))
  const css = [...new Set(js.flatMap((f) => [...(byName.get(f).viteMetadata?.importedCss ?? [])]))]
  return [
    ...js.map((f) => `<link rel="modulepreload" crossorigin href="/${f}" />`),
    ...css.map((f) => `<link rel="stylesheet" crossorigin href="/${f}" />`),
  ].join('\n    ')
}

export function siteRoutes() {
  let pages = []
  let root = process.cwd()
  let outDir = ''
  return {
    name: 'site-routes',
    enforce: 'post',

    async configResolved(config) {
      root = config.root
      outDir = resolve(root, config.build.outDir)
      pages = await loadPages(root)
    },

    // Editing content.js or a page's meta.js changes the HTML head, so restart the dev server.
    configureServer(server) {
      server.watcher.on('change', (file) => {
        if (/[\\/]src[\\/](content\.js|lib[\\/]seo\.js|pages[\\/][^\\/]+[\\/]meta\.js)$/.test(file)) server.restart()
      })
    },

    // `vite preview` does not look for <path>/index.html when the trailing slash is missing, as most
    // static hosts do. This makes it behave like one, so preview shows what a visitor would get.
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const bare = (req.url ?? '').split('?')[0].replace(/\/+$/, '')
        const file = pages.some((p) => p.path === bare && bare !== '') && join(outDir, bare, 'index.html')
        if (!file || !existsSync(file)) return next()
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(readFileSync(file))
      })
    },

    transformIndexHtml: {
      handler(html, ctx) {
        // Dev serves index.html for every address, so pick the head from the address asked for.
        const asked = (ctx.originalUrl ?? '/').split(/[?#]/)[0].replace(/\/+$/, '') || '/'
        const page = pages.find((p) => p.path === asked) ?? pages.find((p) => p.path === '*')
        const tags = Object.keys(ctx.bundle ?? {})
          .filter((file) => PRELOAD_FONTS.some((re) => re.test(file)))
          .map((file) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: true, href: `/${file}` },
            injectTo: 'head',
          }))
        return { html: html.replace(SEO, headBlock(page)), tags }
      },
    },

    generateBundle(_, bundle) {
      const shell = bundle['index.html']
      if (!shell) return
      const source = String(shell.source)
      for (const page of pages) {
        const hints = chunkHints(bundle, page)
        const html = source.replace(SEO, headBlock(page)).replace('</head>', hints ? `  ${hints}\n  </head>` : '</head>')
        if (page.path === '/') shell.source = html
        else {
          const fileName = page.path === '*' ? '404.html' : `${page.path.slice(1)}/index.html`
          this.emitFile({ type: 'asset', fileName, source: html })
        }
      }
      if (!base) return
      const listed = pages.filter((p) => p.path !== '*' && !p.noindex)
      const loc = (p) => `${base}${p.path === '/' ? '/' : p.path}`
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${listed
          .map((p) => `  <url><loc>${esc(loc(p))}</loc></url>`)
          .join('\n')}\n</urlset>\n`,
      })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n` })
    },
  }
}
