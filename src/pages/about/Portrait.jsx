import { about } from '../../content.js'

const { src, width, height, alt, caption, role } = about.portrait
const widths = [480, 720, 896]

// The founder photo in a hard-edged asphalt frame, with his name on a number-plate caption.
// AVIF in three sizes with a JPEG fallback; width and height reserve the space, so nothing jumps.
export default function Portrait({ className = '' }) {
  return (
    <figure className={`relative mx-auto w-full max-w-[26rem] pb-14 md:max-w-none ${className}`}>
      <div className="relative">
        <div aria-hidden="true" className="ab-shadow absolute inset-0 bg-asphalt" />
        <picture className="ab-unveil relative block overflow-hidden bg-plate-deep">
          <source
            type="image/avif"
            srcSet={widths.map((w) => `${src}-${w}.avif ${w}w`).join(', ')}
            sizes="(min-width: 768px) 40vw, 90vw"
          />
          <img
            src={`${src}.jpg`}
            width={width}
            height={height}
            alt={alt}
            decoding="async"
            fetchPriority="high"
            className="block h-auto w-full"
          />
        </picture>
      </div>
      <figcaption className="ab-stamp absolute bottom-0 left-4 md:left-6">
        <span className="inline-block rounded-md border-[3px] border-asphalt bg-plate px-4 pt-2 pb-1 font-display text-[2.1rem] font-semibold leading-none md:text-[2.5rem]">
          {caption}
        </span>
        <span className="mt-1.5 block text-base font-bold">{role}</span>
      </figcaption>
    </figure>
  )
}
