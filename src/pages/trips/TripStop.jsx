import { Fragment, useRef } from 'react'
import { fleet } from '../../content.js'
import { askAbout } from '../../lib/links.js'
import { useInView } from '../../lib/useInView.js'
import { LinkButton } from '../../components/Button.jsx'
import { ChatIcon } from '../../components/Icons.jsx'
import { quoteHref, shareHref, ui } from './copy.js'
import { useOnScreen } from './hooks.js'
import { Icon } from './icons.jsx'
import Poster from './Poster.jsx'

// The milestone standing on the edge of the poster: distance on a painted cap, over a whitewashed base.
function KmCap({ km }) {
  return (
    <p className="absolute right-4 bottom-0 flex w-[4.5rem] flex-col items-center rounded-t-full border-b-[10px] border-wash bg-plate px-2 pt-5 pb-1.5 font-display leading-none text-asphalt md:right-6 md:w-[5.25rem]">
      <span className="text-[2.9rem] leading-[0.8] font-semibold md:text-[3.4rem]">{km}</span>
      <span className="mt-1 text-lg leading-none">km</span>
      <span className="sr-only"> from Raipur by road</span>
    </p>
  )
}

// How far this stop is compared with the farthest one on the page, as a short stretch of road. Decoration for
// sighted users only (the distance is already in text on the stone), so it is hidden from screen readers.
function Reach({ km, maxKm, seen }) {
  const pct = Number.isFinite(km) && maxKm > 0 ? Math.min(100, Math.max(6, (km / maxKm) * 100)) : 0
  if (!pct) return null
  return (
    <div aria-hidden="true" className="flex items-center gap-3 font-display text-xl leading-none text-wash/70">
      <span>{ui.start}</span>
      <span className="reach relative h-2.5 flex-1 rounded-full bg-asphalt" data-seen={seen || undefined}>
        <span className="reach-fill absolute inset-y-0 left-0 rounded-full bg-plate" style={{ width: `${pct}%` }}>
          <span className="absolute top-1/2 right-0 size-4 -translate-y-1/2 translate-x-1/2 rounded-full border-[3px] border-asphalt-soft bg-plate" />
        </span>
      </span>
      <span>{maxKm} km</span>
    </div>
  )
}

// Optional trip details (see the schema comment in content.js). Each shows only when it has been filled in.
function Facts({ trip }) {
  const suits = (trip.suits ?? []).map((id) => fleet.find((f) => f.id === id)?.name).filter(Boolean)
  const rows = [
    trip.driveTime && ['Drive from Raipur', trip.driveTime],
    trip.bestSeason && ['Best months', trip.bestSeason],
    suits.length > 0 && ['Suits', suits.join(', ')],
  ].filter(Boolean)
  const highlights = trip.highlights ?? []
  if (!rows.length && !highlights.length) return null
  return (
    <div className="space-y-4">
      {rows.length > 0 && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5">
          {rows.map(([term, value]) => (
            <Fragment key={term}>
              <dt className="pt-1 font-display text-xl leading-none font-semibold text-plate">{term}</dt>
              <dd>{value}</dd>
            </Fragment>
          ))}
        </dl>
      )}
      {highlights.length > 0 && (
        <ul className="space-y-2">
          {highlights.map((h) => (
            <li key={h.name}>
              <span className="font-bold">{h.name}.</span> {h.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// One stop on the road: poster on top (beside the text from md up), the trip's details and two ways to ask.
// `passed` is true once the middle of the screen has reached this stop (it lights the stone on the road).
export default function TripStop({ trip, passed, maxKm }) {
  const { slug, name, km, note } = trip
  const ref = useRef(null)
  const live = useOnScreen(ref, { threshold: 0.2 })
  const seen = useInView(ref, { threshold: 0.35 })
  return (
    <li
      ref={ref}
      id={slug}
      data-passed={passed}
      data-live={live}
      className="group relative scroll-mt-16 [--gx:-0.625rem] md:[--gx:-2.875rem]"
    >
      <span
        aria-hidden="true"
        className="absolute top-7 left-[var(--gx)] z-10 h-4 w-3.5 -translate-x-1/2 rounded-t-full border-2 border-plate bg-asphalt transition-colors group-data-[passed=true]:bg-plate"
      />
      <article aria-labelledby={`${slug}-name`} className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr]">
        <div className="relative">
          <Poster slug={slug} />
          <a
            href={shareHref(name, slug)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ui.share(name)}
            className="absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-full border-2 border-asphalt bg-wash text-asphalt transition-colors hover:bg-plate md:top-5 md:right-5"
          >
            <Icon name="share" />
          </a>
          <KmCap km={km} />
        </div>

        <div className="flex min-w-0 flex-col gap-4 bg-asphalt-soft p-5 pt-7 md:p-8 md:pt-9">
          <div className="@container">
            <h3 id={`${slug}-name`} className="font-display text-[clamp(1.75rem,15cqw,3.75rem)] leading-[0.9] font-semibold [overflow-wrap:anywhere]">
              {name}
            </h3>
            <p className="mt-2 font-display text-2xl leading-none font-semibold text-plate">{trip.trip}</p>
          </div>
          <p className="max-w-[46ch] text-wash/90">{note}</p>
          {trip.summary && <p className="max-w-[46ch] text-wash/90">{trip.summary}</p>}
          <Facts trip={trip} />
          <div className="mt-auto space-y-5 pt-3">
            <Reach km={km} maxKm={maxKm} seen={seen} />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] gap-2 sm:flex sm:flex-wrap">
              <LinkButton variant="plate" size="sm" href={quoteHref(name)}>
                {ui.quote}
              </LinkButton>
              <LinkButton
                variant="lineLight"
                size="sm"
                icon={<ChatIcon width={20} height={20} />}
                href={askAbout(`I'd like a quote for a cab from Raipur to ${name}.`)}
              >
                {ui.whatsapp}
              </LinkButton>
            </div>
          </div>
        </div>
      </article>
    </li>
  )
}
