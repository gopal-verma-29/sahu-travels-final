import { LinkButton } from '../../components/Button.jsx'

export default function NotFoundPage() {
  return (
    <section className="bg-plate text-asphalt">
      <div className="mx-auto max-w-6xl px-5 pt-6 pb-16 md:pt-10 md:pb-24">
        <h1 className="font-display text-[clamp(3.5rem,12vw,7.5rem)] font-semibold leading-[0.95] tracking-tight text-balance">
          Page not found
        </h1>
        <p className="mt-5 max-w-[40ch] text-xl leading-snug md:text-[1.4rem]">
          That address does not lead anywhere. Head back to the start, or tell us about your trip.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <LinkButton stack variant="ink" href="/">
            Back to home
          </LinkButton>
          <LinkButton stack variant="line" href="/contact">
            Contact us
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
