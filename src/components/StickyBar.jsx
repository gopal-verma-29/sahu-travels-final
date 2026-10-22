import { askAbout, telLink } from '../lib/links.js'
import { LinkButton } from './Button.jsx'
import { ChatIcon, PhoneIcon } from './Icons.jsx'

// Phones only: the two actions that matter stay one tap away while scrolling.
export default function StickyBar() {
  return (
    <section aria-label="Quick contact" className="vt-sticky fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 bg-asphalt p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] [--focus:var(--color-plate)] md:hidden">
      <LinkButton variant="wa" full href={askAbout("I'd like the best price for a cab.")} icon={<ChatIcon />}>
        WhatsApp
      </LinkButton>
      <LinkButton variant="plate" full href={telLink} icon={<PhoneIcon />}>
        Call
      </LinkButton>
    </section>
  )
}
