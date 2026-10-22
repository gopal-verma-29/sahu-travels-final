import { useEffect, useState } from 'react'
import { motionOn } from './motion.js'

// True once the element has scrolled into view (and stays true). Starts true when motion is off,
// so there is no hidden state to wait out.
export function useInView(ref, { threshold = 0.3, rootMargin = '0px' } = {}) {
  const [seen, setSeen] = useState(() => !motionOn())

  useEffect(() => {
    const el = ref.current
    if (seen || !el) return undefined
    if (!('IntersectionObserver' in window)) {
      setSeen(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, seen, threshold, rootMargin])

  return seen
}
