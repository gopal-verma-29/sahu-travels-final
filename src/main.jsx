import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/teko'
import '@fontsource/mukta/400.css'
import '@fontsource/mukta/700.css'
import './index.css'
import App from './App.jsx'
import { initMotionFlag } from './lib/motion.js'
import { startRouter } from './router.js'

const root = document.getElementById('root')

// Sets html[data-motion] once, before anything renders: the /about and /vehicles animations key off it.
initMotionFlag()

// Wait for the first page's code, so the first paint is the page and not an empty shell.
startRouter().then(
  () => {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  },
  () => {
    // The page's code would not download (a dropped mobile connection, say). Better a sentence than a blank screen.
    root.innerHTML =
      '<p style="padding:2rem 1.25rem;font:1.15rem/1.5 system-ui,sans-serif">This page could not load. Check your connection and reload.</p>'
  },
)
