import './reviews.css'
import { useEffect, useRef, useState } from 'react'
import { business } from '../../../content.js'
import { motionOn } from '../../../lib/motion.js'
import { useInView } from '../../../lib/useInView.js'
import { h2 } from '../../../components/ui.js'
import { reviews } from './reviews.js'

const { title, lead, rating, count, items } = reviews

// Type follows length: a very short quote is set large, like a road sign; a middle-length one a
// size up from a long one, so the cards fill out evenly.
const SHORT = 60
const MIDDLE = 140
const quoteType = (text) =>
  text.length <= SHORT
    ? 'font-display text-[2.1rem] font-medium leading-[1.08]'
    : text.length <= MIDDLE
      ? 'text-[1.3rem] leading-[1.5]'
      : 'text-[1.15rem] leading-[1.55]'

// Same round yellow buttons as the photo gallery on /vehicles. At either end of the strip the
// button stays in place but dims, so keyboard focus is never lost.
const arrow =
  'grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-asphalt bg-plate text-asphalt transition-colors hover:bg-plate-deep aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:hover:bg-plate'

function Chevron({ back }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="square"
      aria-hidden="true"
      className={back ? 'rotate-180' : ''}
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

// One card plus the gap after it, read from the page so it follows the breakpoints.
function cardStep(el) {
  const first = el.firstElementChild
  if (!first) return el.clientWidth
  const gap = parseFloat(getComputedStyle(el).columnGap) || 0
  return first.getBoundingClientRect().width + gap
}

// Keeps the cab, the arrows and the screen reader label in step with the strip, however it was
// moved: a swipe, a trackpad, the arrow keys or the buttons.
function useStrip(track, road) {
  const [at, setAt] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    const el = track.current
    if (!el) return undefined
    let frame = 0
    const sync = () => {
      frame = 0
      const max = el.scrollWidth - el.clientWidth
      const p = max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0
      road.current?.style.setProperty('--p', p.toFixed(4))
      setAt(Math.round(el.scrollLeft / cardStep(el)))
      setAtStart(el.scrollLeft < 2)
      setAtEnd(el.scrollLeft > max - 2)
    }
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(sync)
    }
    sync()
    el.addEventListener('scroll', queue, { passive: true })
    const resize = new ResizeObserver(queue)
    resize.observe(el)
    return () => {
      el.removeEventListener('scroll', queue)
      resize.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [track, road])

  const by = (cards) => {
    const el = track.current
    if (!el) return
    el.scrollBy({ left: cards * cardStep(el), behavior: motionOn() ? 'smooth' : 'auto' })
  }
  // The buttons turn a whole screenful of cards: one on a phone, two on a tablet, three on a desktop.
  const page = (dir) => {
    const el = track.current
    if (!el) return
    by(dir * Math.max(1, Math.round(el.clientWidth / cardStep(el))))
  }
  const onKey = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      by(1)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      by(-1)
    }
  }

  return { at, atStart, atEnd, page, onKey }
}

// The overall rating as a roadside stone: the same shape as the seat counts on /vehicles. Only the
// stone is hidden from screen readers; the sentence beside it says the same in words.
function Rating() {
  return (
    <div className="rv-stone flex items-end gap-4">
      <div
        aria-hidden="true"
        className="flex min-w-[6.5rem] shrink-0 flex-col overflow-hidden rounded-t-[3.25rem] border-2 border-asphalt text-center"
      >
        <span className="bg-plate px-4 pt-5 pb-0.5 font-display text-[3.4rem] font-semibold leading-none">{rating}</span>
        <span className="bg-asphalt px-2 pt-1 pb-0.5 font-display text-[1.3rem] leading-none text-wash">on Google</span>
      </div>
      <div>
        <p className="font-display text-[2.2rem] font-semibold leading-none">
          {count} reviews
          <span className="sr-only">
            . Rated {rating} out of 5 on Google.
          </span>
        </p>
        {business.mapsUrl && (
          <a
            href={business.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block font-display text-[1.5rem] leading-none underline decoration-2 underline-offset-[6px]"
          >
            Read them all on Google
          </a>
        )}
      </div>
    </div>
  )
}

// A review is a plain quote on a hard-edged card, with the reviewer's name on a number plate
// stamped across the bottom edge, like the portrait on /about.
function Card({ r, i }) {
  return (
    <li
      style={{ '--i': Math.min(i, 3) }}
      className="flex w-[82%] shrink-0 snap-start md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
    >
      <figure className="relative flex min-h-[13rem] w-full flex-col border-2 border-asphalt bg-wash p-5 pb-10 md:p-6 md:pb-11">
        <blockquote lang={r.lang}>
          <p className={`whitespace-pre-line text-pretty ${quoteType(r.text)}`}>{r.text}</p>
        </blockquote>
        <figcaption className="rv-plate absolute -bottom-4 left-4 max-w-[calc(100%-2rem)] truncate rounded-md border-[3px] border-asphalt bg-plate px-3 pt-1.5 pb-0.5 font-display text-[1.6rem] font-semibold leading-none">
          {r.name}
        </figcaption>
      </figure>
    </li>
  )
}

// A strip of Google reviews that snaps card by card. Nothing moves by itself (no autoplay): the
// little cab on the road below drives along as the reader swipes, and parks at the end.
export default function Reviews() {
  const section = useRef(null)
  const track = useRef(null)
  const road = useRef(null)
  const seen = useInView(section, { threshold: 0.2 })
  const { at, atStart, atEnd, page, onKey } = useStrip(track, road)

  return (
    <section
      id="reviews"
      ref={section}
      aria-labelledby="reviews-title"
      className={`rv-sec scroll-mt-4 bg-white ${seen ? 'is-in' : ''}`}
    >
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
          <div>
            <h2 id="reviews-title" className={h2}>
              {title}
            </h2>
            <p className="mt-4 max-w-[46ch] text-lg">{lead}</p>
          </div>
          <Rating />
        </header>

        {/* On phones the strip runs to the edges of the screen, so the next card peeks in. */}
        <ul
          ref={track}
          tabIndex={0}
          aria-label={`Reviews, ${at + 1} of ${items.length}`}
          onKeyDown={onKey}
          className="rv-track -mx-5 mt-12 flex snap-x snap-mandatory scroll-pl-5 gap-4 overflow-x-auto overflow-y-hidden px-5 pb-10 md:mx-0 md:scroll-pl-0 md:gap-6 md:px-0"
        >
          {items.map((r, i) => (
            <Card key={r.name} r={r} i={i} />
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <div aria-hidden="true" ref={road} className="relative h-12 flex-1 overflow-x-clip bg-asphalt">
            <div className="absolute inset-x-0 bottom-2 h-[4px] bg-[repeating-linear-gradient(90deg,var(--color-plate)_0_28px,transparent_28px_56px)]" />
            <div className="rv-cab absolute bottom-3.5 w-[5.5rem]">
              <img
                src="/images/vehicles/ertiga-1-160.webp"
                srcSet="/images/vehicles/ertiga-1-160.webp 160w, /images/vehicles/ertiga-1-560.webp 560w"
                sizes="88px"
                width="160"
                height="90"
                alt=""
                aria-hidden="true"
                draggable="false"
                className="rv-cab-in block w-full object-cover"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous reviews"
              aria-disabled={atStart}
              onClick={() => !atStart && page(-1)}
              className={arrow}
            >
              <Chevron back />
            </button>
            <button
              type="button"
              aria-label="Next reviews"
              aria-disabled={atEnd}
              onClick={() => !atEnd && page(1)}
              className={arrow}
            >
              <Chevron />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
