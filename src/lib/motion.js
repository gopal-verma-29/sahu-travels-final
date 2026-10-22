// One switch for every scripted animation. `initMotionFlag()` runs once before the first render
// and sets html[data-motion] to "on" or "off". CSS keeps its hidden "before" states behind
// html[data-motion='on'], so a reader who asks for reduced motion gets the finished page at once.
const query = '(prefers-reduced-motion: reduce)'

export const motionOn = () => document.documentElement.dataset.motion === 'on'

export function initMotionFlag() {
  const media = window.matchMedia(query)
  const sync = () => {
    document.documentElement.dataset.motion = media.matches ? 'off' : 'on'
  }
  sync()
  media.addEventListener('change', sync)
}
