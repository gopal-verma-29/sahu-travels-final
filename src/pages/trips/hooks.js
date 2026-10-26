import { useEffect, useState } from 'react'
import { motionOn } from '../../lib/motion.js'

// True while the element is on screen, and false again once it scrolls away. This is what pauses a poster's
// animation when its card is off screen. (src/lib/useInView.js is the other one: it turns true once and stays.)
export function useOnScreen(ref, { threshold = 0.2 } = {}) {
  // Without IntersectionObserver (very old browsers) every poster simply counts as on screen.
  const [on, setOn] = useState(() => !('IntersectionObserver' in window))
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([entry]) => setOn(entry.isIntersecting), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold])
  return on
}

// Writes how far down the road the middle of the screen has got (0 to 1) to --drive on the element.
// With reduced motion the road is simply drawn in full and nothing follows the scroll.
export function useDrive(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!motionOn()) {
      el.style.setProperty('--drive', '1')
      return
    }
    let frame = 0
    const update = () => {
      frame = 0
      const { top, height } = el.getBoundingClientRect()
      const p = (window.innerHeight * 0.5 - top) / height
      el.style.setProperty('--drive', Math.min(1, Math.max(0, p)).toFixed(4))
    }
    const queue = () => {
      frame ||= requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
      cancelAnimationFrame(frame)
    }
  }, [ref])
}

// The id of the stop the middle of the screen has reached: the last one whose top edge is above the line, or
// null while the first one is still ahead. Worked out from positions rather than from enter/leave events, so
// it is also right after a jump (a link, a reload part-way down the page) and after the last stop.
export function useActiveStop(ids) {
  const [active, setActive] = useState(null)
  const key = ids.join('|')
  useEffect(() => {
    const els = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!els.length) return
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.45
      let id = null
      for (const el of els) {
        if (el.getBoundingClientRect().top > line) break
        id = el.id
      }
      setActive(id)
    }
    const queue = () => {
      frame ||= requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
      cancelAnimationFrame(frame)
    }
  }, [key])
  return active
}
