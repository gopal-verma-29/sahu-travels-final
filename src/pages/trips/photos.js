// Real photos for the trip cards. Empty until you add some: every trip then shows its poster.
// `node scripts/fetch-trip-photos.mjs` fills this file in; you can also edit it by hand.
//
// Shape (one entry per trip slug):
//   rajim: {
//     src: '/trips/rajim-960.webp',
//     srcSet: '/trips/rajim-480.webp 480w, /trips/rajim-960.webp 960w, /trips/rajim-1440.webp 1440w',
//     width: 1440, height: 960,
//     alt: 'Rajiv Lochan temple at Rajim',            // say what the photo shows
//     credit: { text: 'A. Name, CC BY-SA 4.0', href: 'https://commons.wikimedia.org/wiki/File:...' },
//   },                                                // leave `credit` out for photos you or the client took;
//                                                     // `href` is optional (text-only credit)
//
// While a photo loads, or if its file is missing, the poster underneath stays visible.
export const photos = {}
