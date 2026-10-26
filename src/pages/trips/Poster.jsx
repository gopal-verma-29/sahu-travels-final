import { useEffect, useRef, useState } from 'react'
import { photos } from './photos.js'
import { scenes } from './scenes.jsx'
import { visuals } from './visuals.js'

// The picture for a trip: a real photo when photos.js has one, the poster otherwise. The poster is always
// drawn underneath, so it shows while a photo loads and stays if the file is missing.
export default function Poster({ slug }) {
  const Scene = scenes[slug]
  const photo = photos[slug]
  const v = visuals[slug]
  const img = useRef(null)
  const [state, setState] = useState('loading')

  // A cached image can finish before React attaches onLoad.
  useEffect(() => {
    const el = img.current
    if (el?.complete) setState(el.naturalWidth ? 'ready' : 'failed')
  }, [])

  if (import.meta.env?.DEV && photo && !photo.alt) console.warn(`photos.js: "${slug}" needs alt text`)

  const showingPhoto = photo && state === 'ready'
  return (
    <div className="@container relative aspect-[4/3] overflow-hidden bg-plate md:aspect-auto md:h-full md:min-h-[24rem]">
      {Scene && <Scene />}
      {photo && state !== 'failed' && (
        <img
          ref={img}
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="(min-width: 1024px) 600px, (min-width: 768px) 50vw, 100vw"
          width={photo.width}
          height={photo.height}
          alt={photo.alt ?? ''}
          loading="lazy"
          decoding="async"
          onLoad={() => setState('ready')}
          onError={() => setState('failed')}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            state === 'ready' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      {v && !showingPhoto && (
        <p
          lang="hi"
          aria-hidden="true"
          className={`pointer-events-none absolute top-3 left-4 font-display text-[clamp(2.25rem,17cqw,5rem)] leading-[0.95] font-semibold md:top-5 md:left-6 ${
            v.ink === 'plate' ? 'text-plate' : 'text-asphalt'
          }`}
        >
          {v.hi}
        </p>
      )}
    </div>
  )
}
