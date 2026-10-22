import { hero } from '../../content.js'
import { askAbout, telLink } from '../../lib/links.js'
import { LinkButton } from '../../components/Button.jsx'
import { ChatIcon, PhoneIcon } from '../../components/Icons.jsx'
import Vehicle from '../../components/Vehicle.jsx'

// The cab pulls in from the left and parks once, while the headline lines rise through a mask:
// the same opening sequence as /about. Then the hero is still.
function Road() {
  return (
    <div aria-hidden="true" className="relative h-24 overflow-x-clip bg-asphalt md:h-28">
      <div className="absolute inset-x-0 bottom-5 h-[5px] bg-[repeating-linear-gradient(90deg,var(--color-plate)_0_44px,transparent_44px_88px)]" />
      <Vehicle
        kind="sedan"
        sign
        className="drive-in absolute right-3 bottom-9 w-[17rem] md:right-[7%] md:bottom-10 md:w-[26rem]"
      />
    </div>
  )
}

export default function Hero() {
  return (
    <section id="top" className="bg-plate text-asphalt">
      <div className="mx-auto max-w-6xl px-5 pt-8 pb-16 md:pt-14 md:pb-24">
        <h1 className="-mb-[0.1em] font-display text-[clamp(5rem,24vw,14rem)] font-semibold leading-[1.02] tracking-tight">
          <span lang="hi" className="block">
            {hero.headline.map((line, i) => (
              <span key={line} className="hm-mask block">
                <span className="hm-rise block" style={{ '--i': i }}>
                  {line}
                </span>
              </span>
            ))}
          </span>
          <span className="sr-only">{hero.srHeading}</span>
        </h1>
        <p className="hm-fade mt-6 max-w-[32ch] text-xl leading-snug md:text-[1.6rem]">{hero.lead}</p>
        <div className="hm-fade mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <LinkButton stack variant="ink" href={askAbout("I'd like the best price for a cab.")} icon={<ChatIcon />}>
            Get best price on WhatsApp
          </LinkButton>
          <LinkButton stack variant="line" href={telLink} icon={<PhoneIcon />}>
            Call now
          </LinkButton>
        </div>
      </div>
      <Road />
    </section>
  )
}
