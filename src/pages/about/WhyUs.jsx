import { about } from '../../content.js'
import { h2 } from '../../components/ui.js'

// Same ruled-list pattern as "What you can book" on the homepage. Not numbered: these are
// reasons, not steps.
export default function WhyUs() {
  return (
    <section id="why" className="scroll-mt-4">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className={h2}>{about.why.title}</h2>
        <dl className="mt-10 border-t-2 border-asphalt">
          {about.why.points.map((p) => (
            <div
              key={p.name}
              className="grid gap-1 border-b border-asphalt/25 py-5 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-10 md:py-6"
            >
              <dt className="font-display text-[1.9rem] font-semibold leading-tight">{p.name}</dt>
              <dd className="max-w-[56ch] text-lg text-pretty">{p.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
