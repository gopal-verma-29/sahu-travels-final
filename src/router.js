// The whole router. Pages are the folders in src/pages/ (a meta.js and a Page.jsx each), found
// automatically. Links are plain <a href="/contact">: any same-site link is picked up here, so
// pages never import a Link component.
//
// What it does on every navigation:
//   - loads the page's code first, so there is never a blank or half-built page
//   - swaps the page inside a View Transition (header and phone bar stay put; the page fades and
//     rises). Browsers without the API swap instantly with a CSS fade; reduced motion swaps instantly
//   - restores the scroll position on Back and Forward, scrolls to #hash targets, otherwise to the top
//   - moves keyboard and screen reader focus to the page's heading and updates document.title
//   - preloads a page when a link to it is hovered, touched or focused, and the rest when idle
import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

// ---- the page registry ------------------------------------------------------------------------
const metas = import.meta.glob('./pages/*/meta.js', { eager: true, import: 'default' })
const loaders = import.meta.glob('./pages/*/Page.jsx')

export const routes = Object.entries(metas).map(([file, meta]) => {
  const load = loaders[file.replace('meta.js', 'Page.jsx')]
  if (!load) throw new Error(`${file}: add a Page.jsx next to meta.js`)
  return { ...meta, load }
})

const notFound = routes.find((r) => r.path === '*')
if (!notFound) throw new Error('src/pages needs a not-found page: a folder whose meta.js has path "*"')

// Header links, gathered from each page's `nav` (one item or a list of { label, order, href? }).
export const navItems = routes
  .flatMap((r) => [].concat(r.nav ?? []).map((n) => ({ href: r.path, ...n })))
  .sort((a, b) => (a.order ?? 50) - (b.order ?? 50))

const clean = (path) => path.replace(/\/+$/, '') || '/'
const match = (path) => routes.find((r) => r.path === clean(path)) ?? notFound

// ---- loading a page's code --------------------------------------------------------------------
const loaded = new Map()
function loadPage(route) {
  if (!loaded.has(route)) {
    loaded.set(
      route,
      route.load().then(
        (mod) => mod.default,
        (err) => {
          loaded.delete(route) // allow a retry
          throw err
        },
      ),
    )
  }
  return loaded.get(route)
}

// ---- state: which page is showing -------------------------------------------------------------
// `moves` counts navigations. The shell keys the page on it, so every navigation, even to the same
// page with a different ?query, starts the page fresh.
let state = null
let committed = '' // path + query on screen; tells a real Back from a #hash-only change
const listeners = new Set()
const subscribe = (fn) => (listeners.add(fn), () => listeners.delete(fn))
export const useRoute = () => useSyncExternalStore(subscribe, () => state)

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const root = document.documentElement

// Keep ?lane=... style state in the address bar without a navigation.
export function replaceSearch(key, value) {
  const url = new URL(location.href)
  url.searchParams.set(key, value)
  history.replaceState(history.state, '', url)
  committed = clean(url.pathname) + url.search
}

function focusPage() {
  const target = document.querySelector('main h1') ?? document.getElementById('main')
  if (!target) return
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
}

function scrollToHash(hash) {
  if (!hash) return false
  let id = hash.slice(1)
  try {
    id = decodeURIComponent(id)
  } catch {
    // a malformed escape such as /#%E0%A4%A: use it as typed
  }
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'instant' })
  return Boolean(el)
}

// Runs once after the first render: honour a #hash in the address or a position saved by a reload.
export function settle() {
  if (scrollToHash(location.hash)) {
    // Fonts that arrive late reflow the text above the target and push it off its mark. Aim again
    // once they are in, unless the visitor has already started scrolling.
    let moved = false
    const stop = () => (moved = true)
    for (const type of ['wheel', 'touchstart', 'keydown']) addEventListener(type, stop, { once: true, passive: true })
    requestAnimationFrame(() =>
      requestAnimationFrame(() => document.fonts?.ready.then(() => moved || scrollToHash(location.hash))),
    )
    return
  }
  if (history.state?.y) scrollTo({ top: history.state.y, behavior: 'instant' })
}

// ---- navigating -------------------------------------------------------------------------------
let latest = 0

export async function navigate(to, { replace = false, fromPop = false } = {}) {
  const url = new URL(to, location.href)
  const id = ++latest
  const route = match(url.pathname)

  // On a slow connection, show a thin progress bar if the page's code has not arrived in 120 ms.
  const slow = setTimeout(() => root.setAttribute('data-navigating', ''), 120)
  let Page
  try {
    Page = await loadPage(route)
  } catch {
    location.assign(url.href) // the code would not load (offline, or a new deploy): let the browser try
    return
  } finally {
    clearTimeout(slow)
  }
  if (id !== latest) return // a newer navigation took over

  const next = { route, Page, path: clean(url.pathname), search: url.search, hash: url.hash, moves: state.moves + 1 }
  const apply = () => {
    if (id !== latest) return
    root.removeAttribute('data-navigating')
    if (!fromPop) {
      history.replaceState({ ...history.state, y: scrollY }, '') // remember where this page was left
      history[replace ? 'replaceState' : 'pushState']({}, '', next.path + next.search + next.hash)
    }
    committed = next.path + next.search
    state = next
    flushSync(() => listeners.forEach((fn) => fn()))
    document.title = route.title
    if (fromPop) scrollTo({ top: history.state?.y ?? 0, behavior: 'instant' })
    else if (!scrollToHash(next.hash)) scrollTo({ top: 0, behavior: 'instant' })
    if (!next.hash) focusPage()
  }

  if (document.startViewTransition && !reduceMotion.matches) {
    const transition = document.startViewTransition(apply)
    transition.ready.catch(() => {}) // "skipped" is normal when a newer navigation starts
    transition.finished.catch(() => {})
  } else {
    apply()
  }
}

// ---- wiring -----------------------------------------------------------------------------------
function routeFor(anchor) {
  if (anchor.origin !== location.origin) return null // other sites, tel:, mailto:, wa.me
  if (anchor.target && anchor.target !== '_self') return null
  if (anchor.hasAttribute('download') || anchor.hasAttribute('data-reload')) return null
  if (/\.[a-z0-9]+$/i.test(anchor.pathname)) return null // a file such as /brochure.pdf
  return match(anchor.pathname)
}

function onClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const anchor = e.target.closest?.('a[href]')
  if (!anchor || !routeFor(anchor)) return
  const samePage = clean(anchor.pathname) + anchor.search === clean(location.pathname) + location.search
  if (samePage && anchor.hash) return // an in-page anchor: the browser scrolls to it
  e.preventDefault()
  if (samePage) scrollTo({ top: 0 }) // the logo on its own page: glide back up
  else navigate(anchor.pathname + anchor.search + anchor.hash)
}

function onPop() {
  if (clean(location.pathname) + location.search === committed) return // only the #hash changed
  navigate(location.pathname + location.search + location.hash, { fromPop: true })
}

function prefetch(e) {
  const anchor = e.target.closest?.('a[href]')
  const route = anchor && routeFor(anchor)
  if (route) loadPage(route).catch(() => {})
}

export async function startRouter() {
  history.scrollRestoration = 'manual' // the browser cannot restore a position before the page exists
  const route = match(location.pathname)
  const Page = await loadPage(route)
  const path = clean(location.pathname)
  // /contact/ and /contact are one page. Show the version without the slash.
  if (path !== location.pathname) history.replaceState(history.state, '', path + location.search + location.hash)
  committed = path + location.search
  state = { route, Page, path, search: location.search, hash: location.hash, moves: 0 }
  document.title = route.title // a host that serves one HTML file for every address needs this

  document.addEventListener('click', onClick)
  document.addEventListener('pointerover', prefetch, { passive: true })
  document.addEventListener('touchstart', prefetch, { passive: true })
  document.addEventListener('focusin', prefetch)
  addEventListener('popstate', onPop)
  addEventListener('pagehide', () => history.replaceState({ ...history.state, y: scrollY }, ''))

  // Once the page is up, fetch the other pages' code quietly so every navigation is instant.
  if (!navigator.connection?.saveData) {
    const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 1500))
    idle(() => routes.forEach((r) => loadPage(r).catch(() => {})))
  }
}
