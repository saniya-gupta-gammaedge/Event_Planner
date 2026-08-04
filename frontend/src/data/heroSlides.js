import stageLoungeFloral from '../assets/photos/stage-lounge-floral.jpg'
import colorfulEntrance from '../assets/photos/colorful-entrance.jpg'
import gateChandelierAisle from '../assets/photos/gate-chandelier-aisle.jpg'
import loungeSeating from '../assets/photos/lounge-seating.jpg'
import cateringCounterNight from '../assets/photos/catering-counter-night.jpg'

// Each slide shows `image` first (instant paint, and the fallback on slow
// connections), then plays `video` on top once it is ready.
// To add a new clip: drop the file in `public/videos/` and set `video` below.
export const heroSlides = [
  {
    id: 'stage',
    video: '/videos/wedding-stage.mp4',
    image: stageLoungeFloral,
    eyebrow: 'Wedding & Stage Decoration',
    headline: 'Stages That Take Their Breath Away',
    caption: 'Floral mandaps, themed backdrops and grand stage setups.',
  },
  {
    id: 'lighting',
    video: null,
    image: colorfulEntrance,
    eyebrow: 'Lighting Decoration',
    headline: 'Lighting That Turns Night Into Celebration',
    caption: 'Coloured lights, moving lights and chandelier passages.',
  },
  {
    id: 'tent',
    video: null,
    image: gateChandelierAisle,
    eyebrow: 'Tent & Gate Setup',
    headline: 'Grand Entrances, Ready In A Day',
    caption: 'Complete tent, gate and passage setup for any size venue.',
  },
  {
    id: 'reception',
    video: null,
    image: loungeSeating,
    eyebrow: 'Reception & Seating',
    headline: 'Comfort For Every Single Guest',
    caption: 'Lounge seating, chairs and full reception arrangements.',
  },
  {
    id: 'counters',
    video: null,
    image: cateringCounterNight,
    eyebrow: 'Counters & Generators',
    headline: 'Everything Your Event Needs, From One Place',
    caption: 'Catering counters, bar counters and generators on rent.',
  },
]
