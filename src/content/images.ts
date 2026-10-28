/**
 * Image slots. Every image that hasn't been supplied yet is `null` and renders as a styled
 * placeholder in the design's colours. To fill one, put the file in /public/images (the
 * suggested filename is in the comment) and set its path here, e.g. '/images/work-payroll.webp'.
 */
export const IMAGES: Record<string, string | null> = {
  // Project cover screenshots (used on the hero collage, chapter cards and case study heroes)
  'work-payroll': null, // /images/work-payroll.webp — Mudad Payroll, full-page screenshot works best
  'work-subs-1': null, // /images/work-subs.webp — plans / billing screen
  'work-saned': null, // /images/work-saned.webp — Saned dispatch screen
  'work-onetox-1': null, // /images/work-onetox.webp — batch-scan screen (phone)

  // Mudad Payroll case study hero, 21:9 (4200×1800). Was never uploaded to the design project.
  'cs-hero-payroll': null, // /assets/mudad/hero-auto-payroll.webp

  // Chapter paintings (public domain, Wikimedia Commons)
  'chapter-strategy': null, // Hiroshige, Fireworks at Ryōgoku (1858)
  'chapter-visual': null, // Alphonse Mucha, The Seasons: Spring (1896)
  'art-orient': null, // Léon Belly, Pilgrims Going to Mecca (1861)

  'about-portrait': null, // portrait, 4:5

  // Case study beat images for the three projects without finished figures
  'cs2-subs-1': null,
  'cs2-subs-2': null,
  'cs2-subs-3': null,
  'cs2-saned-1': null,
  'cs2-saned-2': null,
  'cs2-saned-3': null,
  'cs2-onetox-1': null,
  'cs2-onetox-2': null,
  'cs2-onetox-3': null
};
