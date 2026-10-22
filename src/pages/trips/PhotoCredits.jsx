import { tours } from '../../content.js'
import { photos } from './photos.js'

// Licences such as CC BY and CC BY-SA require a credit. This lists the credit for every photo that has one,
// each next to the trip it belongs to, and renders nothing when there are none (the client's own photos, or
// no photos yet).
export default function PhotoCredits() {
  const credited = Object.entries(photos).filter(([, p]) => p.credit)
  if (!credited.length) return null
  const nameOf = (slug) => tours.find((t) => t.slug === slug)?.name ?? slug
  return (
    <p className="mt-10 max-w-[70ch] text-[0.95rem]">
      Photos:{' '}
      {credited.map(([slug, p], i) => (
        <span key={slug}>
          {i > 0 && '; '}
          {nameOf(slug)},{' '}
          {p.credit.href ? (
            <a href={p.credit.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              {p.credit.text}
            </a>
          ) : (
            p.credit.text
          )}
        </span>
      ))}
    </p>
  )
}
