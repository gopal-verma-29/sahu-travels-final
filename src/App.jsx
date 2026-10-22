import { Component, useEffect } from 'react'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import StickyBar from './components/StickyBar.jsx'
import { LinkButton } from './components/Button.jsx'
import { settle, useRoute } from './router.js'

// A mistake inside one page shows a message here instead of blanking the whole site. The shell
// stays usable, and the next navigation (which re-keys <main>) starts clean.
class PageBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.error(error)
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <section className="bg-plate text-asphalt">
        <div className="mx-auto max-w-6xl px-5 pt-6 pb-16 md:pt-10 md:pb-24">
          <h1 className="font-display text-[clamp(3.5rem,12vw,7.5rem)] font-semibold leading-[0.95] tracking-tight text-balance">
            Something went wrong
          </h1>
          <p className="mt-5 max-w-[40ch] text-xl leading-snug md:text-[1.4rem]">
            This page could not be shown. Try another page, or reload.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton stack variant="ink" href="/">
              Back to home
            </LinkButton>
          </div>
        </div>
      </section>
    )
  }
}

// The shell every page sits in. Header, footer and the phone bar are shared; a page controls only
// what is inside <main>. `stickyBar: false` in a page's meta.js hides the phone bar on that page.
export default function App() {
  const { route, Page, moves } = useRoute()
  useEffect(settle, [])
  const stickyBar = route.stickyBar !== false

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-asphalt focus:px-4 focus:py-2 focus:text-plate"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" key={moves} tabIndex={-1} className={`min-h-[70svh]${moves ? ' page-in' : ''}`}>
        <PageBoundary>
          <Page />
        </PageBoundary>
      </main>
      <Footer stickyBar={stickyBar} />
      {stickyBar && <StickyBar />}
    </>
  )
}
