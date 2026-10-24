import { business } from '../content.js'

// Instagram and Facebook links for the footer. The addresses live in src/content.js
// (business.instagram, business.facebook). Leave one empty and its icon disappears;
// leave both empty and this renders nothing at all.

// Feather-style outline icons (MIT), drawn the same way as src/components/Icons.jsx.
// Decorative: each link's aria-label carries the meaning.
const icon = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
  className: 'shrink-0',
}

function InstagramIcon() {
  return (
    <svg {...icon}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg {...icon}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

const networks = [
  { key: 'instagram', name: 'Instagram', Icon: InstagramIcon },
  { key: 'facebook', name: 'Facebook', Icon: FacebookIcon },
]

export default function SocialLinks({ className = '' }) {
  const items = networks.filter((n) => business[n.key])
  if (!items.length) return null

  return (
    <div className={className}>
      <p className="text-[0.95rem] text-wash/70">Follow us</p>
      <ul className="mt-2 flex gap-3">
        {items.map(({ key, name, Icon }) => (
          <li key={key}>
            <a
              href={business[key]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${business.name} on ${name}`}
              className="grid size-11 place-items-center rounded-full border-2 border-asphalt-soft text-wash transition-colors hover:border-plate hover:bg-plate hover:text-asphalt"
            >
              <Icon />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}