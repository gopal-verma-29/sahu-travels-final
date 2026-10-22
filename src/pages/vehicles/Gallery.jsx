import { useRef, useState } from 'react'
import { motionOn } from '../../lib/motion.js'

const dir = '/images/vehicles/'
const arrow =
  'absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-2 border-asphalt bg-plate text-asphalt transition-colors hover:bg-plate-deep'

function Chevron({ back }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" aria-hidden="true" className={back ? 'rotate-180' : ''}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

// A scroll-snap strip: swipe on a phone, arrows or the arrow keys elsewhere, thumbnails to jump.
// Images are 16:9 WebP in two sizes, lazy-loaded, with their size set so nothing shifts.
export default function Gallery({ photos, name }) {
  const track = useRef(null)
  const [at, setAt] = useState(0)
  const many = photos.length > 1

  const go = (n) => {
    const el = track.current
    if (!el) return
    const k = (n + photos.length) % photos.length
    el.scrollTo({ left: k * el.clientWidth, behavior: motionOn() ? 'smooth' : 'auto' })
  }
  const onScroll = (e) => setAt(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(at + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(at - 1) }
  }

  return (
    <div role="group" aria-roledescription="carousel" aria-label={`${name} photos`}>
      <div className="relative border-2 border-asphalt bg-asphalt">
        <div
          ref={track}
          role="region"
          tabIndex={0}
          aria-label={`${name}, photo ${at + 1} of ${photos.length}`}
          onScroll={onScroll}
          onKeyDown={onKey}
          className="vh-track flex snap-x snap-mandatory overflow-x-auto"
        >
          {photos.map((p) => (
            <img
              key={p.n}
              src={`${dir}${p.n}-${p.maxW ?? 1000}.webp`}
              srcSet={
                p.maxW === 560
                  ? `${dir}${p.n}-160.webp 160w, ${dir}${p.n}-560.webp 560w`
                  : `${dir}${p.n}-560.webp 560w, ${dir}${p.n}-1000.webp 1000w`
              }
              sizes="(min-width: 768px) 560px, 100vw"
              width={p.maxW ?? 1000}
              height="563"
              alt={p.alt}
              loading="lazy"
              decoding="async"
              className="aspect-video w-full shrink-0 snap-center object-cover"
            />
          ))}
        </div>
        {many && (
          <>
            <button type="button" onClick={() => go(at - 1)} aria-label="Previous photo" className={`${arrow} left-2`}><Chevron back /></button>
            <button type="button" onClick={() => go(at + 1)} aria-label="Next photo" className={`${arrow} right-2`}><Chevron /></button>
          </>
        )}
      </div>
      {many && (
        <ul className="mt-2 flex gap-2">
          {photos.map((p, i) => (
            <li key={p.n} className="w-20 md:w-24">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Show photo ${i + 1} of ${photos.length}`}
                aria-current={i === at}
                className={`block w-full border-2 transition-opacity ${i === at ? 'border-asphalt' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={`${dir}${p.n}-160.webp`} width="160" height="90" alt="" loading="lazy" decoding="async" className="aspect-video w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
