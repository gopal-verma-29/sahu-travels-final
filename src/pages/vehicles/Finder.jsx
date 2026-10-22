import { vehicles } from '../../content.js'
import { h2 } from '../../components/ui.js'

const byId = Object.fromEntries(vehicles.items.map((v) => [v.id, v]))

// Group size to vehicle, set like a road sign. Each name jumps to that vehicle's section.
export default function Finder() {
  const { title, intro, rows } = vehicles.finder
  return (
    <section aria-labelledby="finder-title" className="bg-asphalt text-wash [--focus:var(--color-plate)]">
      <div className="mx-auto max-w-6xl px-5 pt-6 pb-14 md:pt-10 md:pb-20">
        <h2 id="finder-title" className={h2}>{title}</h2>
        <p className="mt-4 max-w-[52ch] text-lg text-wash/80">{intro}</p>
        <ul className="mt-9 border-t-[3px] border-wash/60">
          {rows.map((r) => (
            <li key={r.group} className="grid gap-x-10 gap-y-2 border-b border-dashed border-wash/40 py-5 md:grid-cols-[15rem_1fr] md:items-baseline">
              <p className="font-display text-[2.2rem] font-semibold leading-none text-plate">{r.group}</p>
              <ul className="flex flex-wrap gap-x-8 gap-y-2">
                {r.ids.map((id) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="font-display text-[1.7rem] font-medium leading-tight underline decoration-wash/40 decoration-2 underline-offset-[6px] transition-colors hover:decoration-plate"
                    >
                      {byId[id].name}
                      <span className="ml-2 font-body text-base font-normal text-wash/70">{byId[id].seatLabel}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
