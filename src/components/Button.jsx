const base =
  'inline-flex items-center justify-center gap-2.5 rounded-md border-2 pt-3 pb-2 text-center font-display font-semibold leading-[1.05] tracking-wide transition-colors'

// Labels may wrap on very narrow phones instead of pushing the page sideways.
const sizes = {
  md: 'min-h-[52px] px-5 text-[1.45rem] sm:px-6 sm:text-[1.6rem]',
  sm: 'min-h-[44px] px-4 text-[1.35rem]',
}

const variants = {
  // on yellow
  ink: 'border-asphalt bg-asphalt text-plate hover:border-asphalt-soft hover:bg-asphalt-soft',
  line: 'border-asphalt text-asphalt hover:bg-asphalt hover:text-plate',
  // on dark
  wa: 'border-wa bg-wa text-asphalt hover:brightness-95',
  plate: 'border-plate bg-plate text-asphalt hover:border-plate-deep hover:bg-plate-deep',
  lineLight: 'border-wash/60 text-wash hover:border-wash hover:bg-wash hover:text-asphalt',
}

// full: always full width. stack: full width on phones, natural width from the sm breakpoint up.
export const btn = ({ variant = 'ink', size = 'md', full = false, stack = false } = {}) =>
  `${base} ${sizes[size]} ${variants[variant]}${full ? ' w-full' : ''}${stack ? ' w-full sm:w-auto' : ''}`

export function LinkButton({ variant, size, full, stack, icon, href, children, ...rest }) {
  const external = /^https?:/.test(href)
  return (
    <a
      href={href}
      className={btn({ variant, size, full, stack })}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {icon}
      {children}
    </a>
  )
}
