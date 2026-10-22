// Line icons for the service signs: Feather and Lucide outlines (MIT and ISC), drawn the same way
// as src/components/Icons.jsx. Decorative: the service name next to each one carries the meaning.
const base = {
  width: 30,
  height: 30,
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

const Plane = () => (
  <svg {...base}>
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 2H4l-1 1 3 2 2 3 1-1v-3l2-2 3.3 5.5c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
)
const Route = () => (
  <svg {...base}>
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
    <circle cx="18" cy="5" r="3" />
  </svg>
)
const Mountain = () => (
  <svg {...base}>
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
)
const Heart = () => (
  <svg {...base}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)
const Users = () => (
  <svg {...base}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const Briefcase = () => (
  <svg {...base}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)
const Pin = () => (
  <svg {...base}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

// Picked by the words in the service name, so reordering or renaming services in content.js
// never shows the wrong icon. Anything unrecognised gets the map pin.
const BY_NAME = [
  [/outstation|one-way/i, Route],
  [/airport|railway|\bstations?\b/i, Plane],
  [/tour|pilgrim/i, Mountain],
  [/wedding|event/i, Heart],
  [/group|famil/i, Users],
  [/city|rental/i, Briefcase],
]

export function ServiceIcon({ name }) {
  const Icon = BY_NAME.find(([re]) => re.test(name))?.[1] ?? Pin
  return <Icon />
}
