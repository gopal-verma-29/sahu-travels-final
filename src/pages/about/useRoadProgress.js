import { useLayoutEffect } from 'react'
import { motionOn } from '../../lib/motion.js'

// Draws the road as the reader scrolls. A "reading line" sits 62% of the way down the screen:
// the dashed line is drawn down to it, the marker rides its tip, and each milestone whose stud
// the line has passed gets `is-in` (the stone rises, the odometer rolls, the stud lights).
// Everything is written straight to the DOM, once per animation frame, so scrolling never
// re-renders React.
const READING_LINE = 0.62

export function useRoadProgress(ref) {
  useLayoutEffect(() => {
    const track = ref.current
    if (!track) return undefined

    const items = [...track.querySelectorAll('[data-milestone]')].map((el) => ({
      el,
      stud: el.querySelector('[data-stud]'),
    }))
    if (!motionOn()) {
      items.forEach(({ el }) => el.classList.add('is-in'))
      return undefined
    }

    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * READING_LINE
      const box = track.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, (line - box.top) / box.height))
      track.style.setProperty('--p', progress.toFixed(4))
      track.style.setProperty('--y', `${(progress * box.height).toFixed(1)}px`)
      for (const { el, stud } of items) {
        if (!el.classList.contains('is-in') && stud.getBoundingClientRect().top < line) {
          el.classList.add('is-in')
        }
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const resize = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null
    resize?.observe(track)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      resize?.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref])
}
