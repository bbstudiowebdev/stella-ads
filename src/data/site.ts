/**
 * ALL site copy, contact details, prices and links live here.
 * Components, JSON-LD (src/lib/schema.ts) and /llms.txt read from this file.
 *
 * Blank slates: unknown client facts are empty values marked TODO(client) Q<n>,
 * numbered to match docs/CLIENT_QUESTIONS.md. Empty = hidden or a neutral fallback.
 * Never invent reviews, stats, client logos or credentials.
 */
import type { ImageMetadata } from 'astro';
import solomonSouth from '../assets/sites/solomon-mahlangu-southbound.webp';
import olievenWest from '../assets/sites/olievenhoutbosh-west.webp';
import olievenEast from '../assets/sites/olievenhoutbosh-east.webp';
import visionImg from '../assets/vision.webp';

export type City = 'Pretoria' | 'Centurion';

export interface BoardPhoto {
  src: ImageMetadata;
  alt: string;
  /** CSS object-position, copied from the design's image-slot crop */
  position?: string;
}

export interface Board {
  slug: string;
  name: string;
  city: City;
  lat: number;
  lon: number;
  /** Shown as "Daily traffic". Empty → "Traffic data on request". */
  traffic: string;
  /** Monthly rental, e.g. "R 7,000/mo". Empty → "Quote on request". */
  price: string;
  /** e.g. "Available now", "Available 1 Dec", "Occupied" */
  availability: string;
  available: boolean;
  photos: BoardPhoto[];
}

const WHATSAPP_NUMBER = '27796921727';

export const site = {
  name: 'Stella Ads',
  legalName: 'Stella Ads CC',
  url: 'https://www.stellaads.co.za', // must match astro.config.mjs `site` and public/robots.txt
  locale: 'en-ZA',
  lang: 'en',
  year: 2026,

  meta: {
    title: 'Billboard advertising in Pretoria & Centurion | Stella Ads',
    description:
      'Find, book and pay for billboard space in Pretoria and Centurion in one place. Rental, printing and installation on one invoice, live in about 5 days.',
  },

  contact: {
    phoneDisplay: '+27 79 692 1727',
    phoneHref: 'tel:+27796921727',
    email: 'info@stellaads.co.za',
    whatsappHref: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Stella Ads, I would like a billboard quote.')}`,
    area: 'Pretoria / Centurion, Gauteng',
    // Service area only, no street address (client, Q2). Hours not shown (Q3).
    streetAddress: '',
    locality: '',
    region: 'Gauteng',
    postalCode: '',
    country: 'ZA',
    hours: '',
  },

  /** Social / directory profiles for JSON-LD sameAs. */
  sameAs: ['https://www.linkedin.com/company/stella-ads-cc/'] as string[],

  nav: [
    { label: 'Billboards', href: '#billboards' },
    { label: 'How it works', href: '#how' },
    { label: 'Why Stella', href: '#why' },
    { label: 'Contact', href: '#quote' },
  ],

  hero: {
    h1: 'Book premium billboard space with total confidence.',
    lead: 'Find it, book it, pay for it all in one place.',
    ctaQuote: 'Get a quote',
    ctaBrowse: 'Browse billboards →',
    globeLabel: 'Interactive 3D globe showing Stella Ads billboard locations. Drag to rotate, scroll to zoom.',
    loading: 'Loading network',
    hint: 'Drag to rotate · Scroll to zoom · Tap a pin',
    views: [
      { id: 'gauteng', label: 'Pretoria & Centurion', lat: -25.85, lon: 28.2, d: 1.06 },
      { id: 'sa', label: 'All of South Africa', lat: -29.0, lon: 25.5, d: 2.3 },
    ],
    cities: [
      { name: 'Pretoria', lat: -25.7479, lon: 28.2293 },
      { name: 'Centurion', lat: -25.8603, lon: 28.1894 },
    ],
  },

  // Confirmed by client (Q4). Prices exclude VAT (Q6).
  stats: [
    { value: 'R 7,000', label: 'Starting price per month, excl. VAT' },
    { value: '1', label: 'All-inclusive invoice' },
    { value: '5 days', label: 'Avg install time' },
  ],

  /** Real clients only, with their permission. Empty = section hidden (client: leave out for now). */
  trustedBy: [] as string[],

  billboards: {
    h2: 'Find your next site',
    intro: 'Available sites first. Prices exclude VAT; traffic data and site stats on request.',
    filters: ['All', 'Pretoria', 'Centurion'] as const,
    enquire: 'Enquire about this site',
    featuredBadge: 'Featured · Available now',
    empty: 'No sites match right now. Ask us about upcoming availability.',
    trafficFallback: 'Traffic data on request',
    priceFallback: 'Quote on request',
    vatNote: 'excl. VAT',
  },

  boards: [
    {
      slug: 'solomon-mahlangu-southbound',
      name: 'Solomon Mahlangu Southbound',
      city: 'Pretoria',
      lat: -25.801,
      lon: 28.314,
      traffic: '', // on request (client, Q5)
      price: 'R 7,000/mo',
      availability: 'Available 1 Dec',
      available: true,
      photos: [
        { src: solomonSouth, alt: 'Aerial drone view of Solomon Mahlangu Drive southbound traffic, Pretoria' },
      ],
    },
    {
      slug: 'olievenhoutbosh-west',
      name: 'Olievenhoutbosh West',
      city: 'Centurion',
      lat: -25.906,
      lon: 28.094,
      traffic: '', // on request (client, Q5)
      price: 'R 9,000/mo',
      availability: 'Occupied',
      available: false,
      photos: [
        { src: olievenWest, alt: 'Olievenhoutbosh West billboard beside the road, Centurion' },
        { src: olievenEast, alt: 'Second view of the Olievenhoutbosh billboard, Centurion', position: '50% 14%' },
      ],
    },
    {
      slug: 'olievenhoutbosh-east',
      name: 'Olievenhoutbosh East',
      city: 'Centurion',
      lat: -25.9,
      lon: 28.12,
      traffic: '', // on request (client, Q5)
      price: 'R 9,000/mo',
      availability: 'Occupied',
      available: false,
      photos: [
        { src: olievenEast, alt: 'Olievenhoutbosh East billboard on a pole beside the road, Centurion', position: '50% 14%' },
        { src: olievenWest, alt: 'Second view of the Olievenhoutbosh billboard, Centurion' },
      ],
    },
  ] as Board[],

  comingSoon: {
    badge: 'Coming soon',
    h2: 'New locations on the way',
    body: "We're adding more billboard sites soon. Tell us where you'd like to advertise and we'll let you know as soon as new locations go live.",
    cta: 'Get notified',
    /** Client will name upcoming sites later (Q10). */
    slots: [
      { tag: 'New site', name: 'Location to be announced', note: 'Coming soon' },
      { tag: 'New site', name: 'Location to be announced', note: 'Coming soon' },
      { tag: 'New site', name: 'Location to be announced', note: 'Coming soon' },
    ],
  },

  how: {
    h2: 'Live on the road in three steps',
    steps: [
      { n: '01', title: 'Pick a site', body: 'Browse billboards by city and budget, with drone footage for every location.' },
      { n: '02', title: 'Get your quote', body: 'Rental, printing and flighting in one clear price, excluding VAT. No surprises.' },
      { n: '03', title: 'Go live', body: 'Approve your artwork and we print, install and send proof of flighting, typically within 5 days.' },
    ],
  },

  why: {
    h2: 'Outdoor advertising, without the hassle.',
    body: 'From choosing a site to seeing your ad on the road, we handle everything: booking, printing, installation and billing. You focus on your campaign; we take care of the rest.',
    reasons: [
      { title: 'One invoice', body: 'Rental, production and installation billed together.' },
      { title: 'Proof of flighting', body: 'Photo confirmation the day your campaign goes up.' },
      { title: 'Local reach', body: 'Prime sites across Pretoria and Centurion, with more on the way.' },
    ],
  },

  vision: {
    eyebrow: 'Our vision',
    h2: 'To make outdoor advertising accessible to every South African brand.',
    body: "We believe a billboard shouldn't be reserved for the biggest budgets. By putting every site, price and booking in one place, we help local businesses and national brands alike get seen where it matters most: on the road.",
    image: { src: visionImg, alt: 'Stella Ads logo' },
  },

  quote: {
    eyebrow: 'Get a quote',
    h2: 'Ready to book a billboard?',
    body: "Tell us where and when. We'll come back with availability, pricing and production within one business day.",
    whatsappLabel: 'WhatsApp us',
    fields: {
      name: 'Full name',
      company: 'Company',
      email: 'Email address',
      phone: 'Phone',
      budget: 'Monthly budget',
      start: 'Campaign start',
      board: 'Billboard of interest',
    },
    budgetOptions: ['Under R10,000', 'R10,000 – R30,000', 'R30,000 – R75,000', 'R75,000+'],
    startOptions: ['As soon as possible', 'Within 1 month', '1–3 months', 'Just exploring'],
    anyBoard: 'Any site',
    submit: 'Send enquiry',
    submitFor: 'Request quote for ',
    emailError: 'Please enter a valid email address so we can send your quote.',
    privacyNote: 'We only use your details to reply to your enquiry.',
  },

  thanks: {
    h1: 'Enquiry received',
    body: 'Thanks. A member of our sales team will be in touch within one business day.',
    back: 'Back to the website',
  },

  formError: {
    h1: 'Something went wrong',
    body: "Your enquiry didn't send. Please try again, or contact us directly:",
    back: 'Back to the form',
  },

  footer: {
    links: [
      { label: 'Billboards', href: '/#billboards' },
      { label: 'Contact', href: '/#quote' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },

  mobileBar: { call: 'Call', whatsapp: 'WhatsApp', quote: 'Get a quote' },

  /** FAQ for AEO. Answer-first, specifics over adjectives. Not in the design: shown only if Wikus approves (see BUILD_PLAN Backlog). */
  faq: [] as { q: string; a: string }[],

  privacy: {
    informationOfficer: 'Wikus',
    updated: '', // set on launch
  },
} as const;

export type Site = typeof site;
