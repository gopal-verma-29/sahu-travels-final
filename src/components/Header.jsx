import { useEffect, useState } from 'react'
import { business } from '../content.js'
import { assetUrl, telLink } from '../lib/links.js'
import { navItems, useRoute } from '../router.js'
import { LinkButton, btn } from './Button.jsx'
import { PhoneIcon } from './Icons.jsx'

// Milestone mark, the same shape as the favicon.
function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9 shrink-0" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="6" fill="#24272C" />
      <path d="M9 26V15a7 7 0 0 1 14 0v11z" fill="#F6C000" />
      <rect x="9" y="19" width="14" height="7" fill="#F2F4F1" />
    </svg>
  )
}

// The links come from each page's `nav` in its meta.js, so adding a page never means editing this file.
export default function Header() {
  const { path, moves } = useRoute()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [moves]) // close the phone menu once a page has changed
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open])

  const current = (href) => (href === path ? 'page' : undefined)

  return (
    <header className="vt-header bg-plate text-asphalt">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <a href="/" className="flex min-w-0 items-center gap-3 font-display text-[1.6rem] font-semibold leading-[0.95] tracking-wide md:text-[2rem] md:leading-none">
          {business.logo ? (
            <img src={assetUrl(business.logo)} alt="" className="h-10 w-auto" />
          ) : (
            <Mark />
          )}
          <span className="pt-1">{business.name}</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex lg:gap-8">
          {navItems.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              aria-current={current(href)}
              className="font-display text-[1.5rem] font-medium leading-none underline decoration-2 underline-offset-[6px] decoration-transparent transition-colors hover:decoration-asphalt aria-[current=page]:decoration-asphalt"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Phones get the sticky Call bar and a menu, which frees the header for the business name. */}
        <div className="hidden md:block">
          <LinkButton variant="ink" size="sm" href={telLink} icon={<PhoneIcon width={20} height={20} />}>
            Call
          </LinkButton>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
          className={`${btn({ variant: 'line', size: 'sm' })} md:hidden`}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      <div className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none md:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <nav id="menu" aria-label="Main" inert={!open} className="overflow-hidden">
          <ul className="mx-auto max-w-6xl border-t-2 border-asphalt/20 px-5 pb-2">
            {[{ label: 'Home', href: '/' }, ...navItems].map(({ label, href }) => (
              <li key={href} className="border-b border-asphalt/15 last:border-b-0">
                <a href={href} aria-current={current(href)} className="block py-3.5 font-display text-[1.9rem] font-medium leading-none aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-[6px]">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
