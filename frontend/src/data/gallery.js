import gateArch from '../assets/photos/gate-arch.jpg'
import gateChandelierAisle from '../assets/photos/gate-chandelier-aisle.jpg'
import aisleWalkway from '../assets/photos/aisle-walkway.jpg'
import passageChandelier1 from '../assets/photos/passage-chandelier-1.jpg'
import passageChandelier2 from '../assets/photos/passage-chandelier-2.jpg'
import mandapIdol from '../assets/photos/mandap-idol.jpg'
import stageLoungeFloral from '../assets/photos/stage-lounge-floral.jpg'
import loungeSeating from '../assets/photos/lounge-seating.jpg'
import gardenWallBackdrop from '../assets/photos/garden-wall-backdrop.jpg'
import themeBackdrop from '../assets/photos/theme-backdrop.jpg'
import barCounter from '../assets/photos/bar-counter.jpg'
import cateringCounterNight from '../assets/photos/catering-counter-night.jpg'
import cateringCounters from '../assets/photos/catering-counters.jpg'
import mehndiSeating from '../assets/photos/mehndi-seating.jpg'
import colorfulEntrance from '../assets/photos/colorful-entrance.jpg'
import placeholderA from '../assets/photos/placeholder-a.jpg'
import placeholderB from '../assets/photos/placeholder-b.jpg'

const placeholders = [placeholderA, placeholderB]

export const gallery = [
  { id: 1, caption: 'Gate Decoration', images: [gateChandelierAisle, gateArch] },
  { id: 2, caption: 'Passage Decoration', images: [aisleWalkway, passageChandelier1, passageChandelier2] },
  { id: 3, caption: 'Mandap Decoration', images: [mandapIdol, ...placeholders] },
  { id: 4, caption: 'Stage Decoration', images: [stageLoungeFloral, ...placeholders] },
  { id: 5, caption: 'Seating Setup', images: [loungeSeating, ...placeholders] },
  { id: 6, caption: 'Photo Booth Decoration', images: [gardenWallBackdrop, ...placeholders] },
  { id: 7, caption: 'Theme Decoration', images: [themeBackdrop, ...placeholders] },
  { id: 8, caption: 'Counter Setup', images: [barCounter, cateringCounterNight, cateringCounters] },
  { id: 9, caption: 'Mehndi Setup', images: [mehndiSeating, ...placeholders] },
  { id: 10, caption: 'Lighting & Decoration', images: [colorfulEntrance, ...placeholders] },
]
