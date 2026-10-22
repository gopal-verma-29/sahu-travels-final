import { useRef } from 'react'
import { about } from '../../content.js'
import { useInView } from '../../lib/useInView.js'
import { LinkButton } from '../../components/Button.jsx'
import Odo from './Odo.jsx'

const { src, width, height, alt, caption, role } = about.portrait
const widths = [480, 720, 896]
// The milestones that have happened (the planned one is left for /about), all from content.js.
const facts = about.milestones.filter((m) => !m.planned)
const firstName = about.founder.split(' ')[0]

// A roadside milestone, small: odometer on the dark cap, label on the whitewashed body.
function Fact({ m, i }) {
  return (
    <li
      style={{ '--i': i, '--d': `${i * 0.2}s` }}
      className="hm-fact flex flex-col overflow-hidden rounded-t-full border-2 border-asphalt text-center"
    >
      <p className="flex h-[6.5rem] flex-col items-center justify-end bg-asphalt px-1 pt-6 pb-2 font-display leading-none text-plate">
        <span className="block text-[2.4rem] font-semibold leading-[0.8] sm:text-[2.9rem]">
          <Odo value={m.value} from={m.from} />
        </span>
        {m.unit && <span className="mt-1 block text-lg leading-none">{m.unit}</span>}
      </p>
      <p aria-hidden="true" className="bg-wash px-1.5 pt-2 pb-2.5 font-display text-[1.4rem] font-semibold leading-none">
        {m.label}
      </p>
      <span className="sr-only">
        {m.when}: {m.title}
      </span>
    </li>
  )
}

// The one human face on the home page, in the same frame as the /about hero: raised like a
// barrier, name plate last. It plays once, when the band scrolls into view.
export default function Dinesh() {
  const ref = useRef(null)
  const seen = useInView(ref, { threshold: 0.15 })

  return (
    <section id="owner" ref={ref} className={`hm-din scroll-mt-4 bg-plate text-asphalt ${seen ? 'is-in' : ''}`}>
      <div className="mx-auto grid max-w-6xl items-center gap-x-14 gap-y-10 px-5 py-16 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:py-24">
        <figure className="relative mx-auto w-full max-w-[22rem] pb-14 md:max-w-none">
          <div className="relative">
            <div aria-hidden="true" className="hm-shadow absolute inset-0 bg-asphalt" />
            <picture className="hm-unveil relative block overflow-hidden bg-plate-deep">
              <source
                type="image/avif"
                srcSet={widths.map((w) => `${src}-${w}.avif ${w}w`).join(', ')}
                sizes="(min-width: 768px) 34vw, 80vw"
              />
              <img
                src={`${src}.jpg`}
                width={width}
                height={height}
                alt={alt}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </picture>
          </div>
          <figcaption className="hm-stamp absolute bottom-0 left-4 md:left-6">
            <span className="inline-block rounded-md border-[3px] border-asphalt bg-plate px-4 pt-2 pb-1 font-display text-[2.1rem] font-semibold leading-none md:text-[2.5rem]">
              {caption}
            </span>
            <span className="mt-1.5 block text-base font-bold">{role}</span>
          </figcaption>
        </figure>

        <div>
          <h2 className="hm-hd font-display font-semibold leading-[1.02] tracking-tight">
            <span lang="hi" className="block">
              {about.headline.map((line, i) => (
                <span key={line} className="hm-mask block">
                  <span className="hm-rise-in block" style={{ '--i': i }}>
                    {line}
                  </span>
                </span>
              ))}
            </span>
            <span className="sr-only">Meet {about.founder}: from driver to owner</span>
          </h2>
          <p className="mt-6 max-w-[34ch] text-xl leading-snug md:text-[1.6rem]">{about.lead}</p>

          <ol className="mt-9 grid max-w-[26rem] grid-cols-3 gap-3 sm:gap-5">
            {facts.map((m, i) => (
              <Fact key={m.title} m={m} i={i} />
            ))}
          </ol>

          <div className="mt-9">
            <LinkButton stack variant="ink" href="/about">
              Read {firstName}’s story
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}
