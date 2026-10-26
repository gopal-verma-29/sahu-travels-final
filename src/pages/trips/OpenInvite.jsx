import { anywhere } from '../../content.js'
import { askAbout, telLink } from '../../lib/links.js'
import { LinkButton } from '../../components/Button.jsx'
import { ChatIcon, PhoneIcon } from '../../components/Icons.jsx'
import { h2 } from '../../components/ui.js'
import { quoteHref, ui } from './copy.js'
import Marker from './Marker.jsx'
import PhotoCredits from './PhotoCredits.jsx'

// The last stop is the open invitation: any place, any date. Also the target of the "?" milestone at the top
// and of the header's Enquire link, hence the id.
export default function OpenInvite() {
  return (
    <section id="enquire" className="scroll-mt-4 bg-plate text-asphalt">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-end gap-10 px-5 py-16 md:grid-cols-[1fr_auto] md:py-24">
        <div className="min-w-0">
          <h2 className={`${h2} [overflow-wrap:anywhere]`}>{anywhere.trip}</h2>
          <p className="mt-4 max-w-[36ch] text-xl">{anywhere.note}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LinkButton stack variant="ink" href={quoteHref()}>
              {ui.quote}
            </LinkButton>
            <LinkButton stack variant="line" icon={<ChatIcon />} href={askAbout("I'd like a quote for a trip.")}>
              {ui.whatsapp}
            </LinkButton>
            <LinkButton stack variant="line" icon={<PhoneIcon />} href={telLink}>
              {ui.call}
            </LinkButton>
          </div>
        </div>
        <div aria-hidden="true" className="hidden w-36 md:block">
          <Marker name={anywhere.name} km={anywhere.km} ink />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-12">
        <PhotoCredits />
      </div>
    </section>
  )
}
