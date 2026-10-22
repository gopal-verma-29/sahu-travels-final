import { about } from '../../content.js'
import { h2 } from '../../components/ui.js'

// The four reasons already on /about, set in painted bay lines like the /about fleet lot.
// Reasons, not steps, so not numbered. Still: all the motion on this band is the owner band above.
export default function Why() {
  const { title, points } = about.why
  return (
    <section id="why" className="scroll-mt-4 bg-asphalt text-wash [--focus:var(--color-plate)]">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className={h2}>{title}</h2>
        <ul className="mt-10 grid border-t-[3px] border-l-[3px] border-wash/60 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => (
            <li key={p.name} className="border-r-[3px] border-b-[3px] border-wash/60 p-5 md:p-6">
              <h3 className="font-display text-[1.9rem] font-semibold leading-[1.05] text-plate">{p.name}</h3>
              <p className="mt-3 text-wash/80 text-pretty">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
