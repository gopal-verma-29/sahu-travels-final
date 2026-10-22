import { about } from '../../content.js'
import { askAbout, telLink } from '../../lib/links.js'
import { LinkButton } from '../../components/Button.jsx'
import { ChatIcon, PhoneIcon } from '../../components/Icons.jsx'
import Portrait from './Portrait.jsx'

// Same yellow opening as the homepage. The headline lines rise through a mask, the photo is
// raised like a barrier, and the name plate lands last: one sequence, then the page is still.
export default function AboutHero() {
  return (
    <section id="top" className="bg-plate text-asphalt">
      <div className="mx-auto grid max-w-6xl gap-x-14 gap-y-9 px-5 pt-8 pb-14 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] md:pt-14 md:pb-20">
        <div className="md:col-start-1 md:row-start-1 md:self-end">
          <h1 className="ab-title font-display font-semibold leading-[1.02] tracking-tight">
            <span lang="hi" className="block">
              {about.headline.map((line, i) => (
                <span key={line} className="ab-mask block">
                  <span className="ab-rise block" style={{ '--i': i }}>
                    {line}
                  </span>
                </span>
              ))}
            </span>
            <span className="sr-only">{about.srHeading}</span>
          </h1>
          <p className="ab-fade mt-6 max-w-[34ch] text-xl leading-snug md:text-[1.6rem]">{about.lead}</p>
        </div>

        <Portrait className="md:col-start-2 md:row-span-2 md:row-start-1 md:self-center" />

        <div className="ab-fade flex flex-col gap-3 sm:flex-row sm:flex-wrap md:col-start-1 md:row-start-2 md:self-start">
          <LinkButton stack variant="ink" href={askAbout(about.cta.ask)} icon={<ChatIcon />}>
            Get best price on WhatsApp
          </LinkButton>
          <LinkButton stack variant="line" href={telLink} icon={<PhoneIcon />}>
            Call now
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
