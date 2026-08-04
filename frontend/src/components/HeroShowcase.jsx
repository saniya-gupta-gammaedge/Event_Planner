import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { company, whatsappLink, callLink } from '../data/company'
import { heroSlides } from '../data/heroSlides'
import { useInView } from '../hooks/useInView'

const SLIDE_MS = 7000

function prefersReducedMotion() {
  return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
}

/**
 * Video is a luxury, not a requirement. We skip it on phones, on metered or
 * slow connections, and for reduced-motion users — those visitors get the same
 * hero as a photo cross-fade instead, at a fraction of the data.
 */
function canPlayHeroVideo() {
  if (prefersReducedMotion()) return false
  if (window.matchMedia?.('(max-width: 767px)').matches) return false

  const connection = navigator.connection
  if (connection?.saveData) return false
  if (['slow-2g', '2g', '3g'].includes(connection?.effectiveType)) return false

  return true
}

/**
 * One backdrop layer. The photo sits under the video, so the slide paints
 * instantly and still looks right if the video never loads.
 * `preload="none"` keeps the file off the wire until this slide plays.
 */
function HeroSlide({ slide, isActive, withVideo, withMotion }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isActive) {
      video.currentTime = 0
      video.play?.()?.catch(() => {
        /* autoplay refused — the photo underneath stays visible */
      })
    } else {
      video.pause()
    }
  }, [isActive])

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img
        src={slide.image}
        alt=""
        className={`h-full w-full object-cover ${
          isActive && withMotion ? 'hero-kenburns' : ''
        }`}
      />

      {withVideo && slide.video && (
        <video
          ref={videoRef}
          src={slide.video}
          poster={slide.image}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  )
}

export default function HeroShowcase() {
  const [index, setIndex] = useState(0)
  const [withVideo] = useState(canPlayHeroVideo)
  const [withMotion] = useState(() => !prefersReducedMotion())

  // Nothing plays or advances while the hero is off screen.
  const [rootRef, inView] = useInView()
  const slide = heroSlides[index]

  useEffect(() => {
    if (!withMotion || !inView) return
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % heroSlides.length),
      SLIDE_MS
    )
    return () => clearTimeout(timer)
  }, [index, withMotion, inView])

  return (
    <section
      ref={rootRef}
      className="relative min-h-[85vh] overflow-hidden bg-maroon-dark"
    >
      {heroSlides.map((item, i) => (
        <HeroSlide
          key={item.id}
          slide={item}
          isActive={i === index && inView}
          withVideo={withVideo}
          withMotion={withMotion}
        />
      ))}

      {/* Readability wash — neutral black, so the photo keeps its own colours */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />

      <div className="relative z-10 flex min-h-[85vh] items-center">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full border border-gold/50 bg-black/20 px-3 py-1.5 text-xs font-semibold text-gold-light backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
              🎉 Trusted Event Partner in Betul
            </span>

            <h1 className="font-display mt-5 text-3xl font-bold leading-tight text-white sm:mt-6 sm:text-5xl lg:text-6xl">
              {company.name}
            </h1>

            {/* Re-keyed so the copy animates in with every slide change */}
            <div key={slide.id} className="hero-text-in mt-5 sm:mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold sm:text-sm">
                {slide.eyebrow}
              </p>

              <p className="font-display mt-2 text-xl font-semibold text-white sm:text-3xl">
                {slide.headline}
              </p>

              <p className="mt-3 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                {slide.caption}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
              <a
                href={callLink()}
                className="rounded-xl bg-gold px-5 py-3 font-semibold text-maroon-dark shadow-lg transition hover:bg-gold-light sm:px-7 sm:py-4"
              >
                📞 Call Now
              </a>

              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-green-700 sm:px-7 sm:py-4"
              >
                💬 WhatsApp
              </a>

              <Link
                to="/rent"
                className="rounded-xl border-2 border-white/70 px-5 py-3 font-semibold text-white transition hover:bg-white hover:text-maroon sm:px-7 sm:py-4"
              >
                📋 Rent Items
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3 sm:mt-12">
              {heroSlides.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${item.eyebrow}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === index ? 'w-10 bg-gold' : 'w-4 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
