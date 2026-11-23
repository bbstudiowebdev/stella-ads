# Stella Ads website

One-page marketing site for **Stella Ads**, a billboard advertising business in Pretoria and Centurion (Gauteng, South Africa). Built by bb. studio from the Claude Design artifact "Stella Ads Website" (Landing Page v3 + 3D globe hero).

- **Goal:** advertisers request a billboard quote (form → email to stellaads.co@gmail.com via Resend; info@stellaads.co.za is the public address), or call / WhatsApp +27 79 692 1727.
- **Audience:** SA business owners and marketing managers, mostly on phones.
- **Locale:** en-ZA, Rand prices with "R 7,000" spacing as in the design.
- **Domain:** www.stellaads.co.za is the primary host; stellaads.co.za 308-redirects to it (Wikus controls DNS). Hosting: Vercel. Repo: `bbstudiowebdev/stella-ads`.

## Commands

```
npm run dev      # local dev server
npm run check    # astro check (types)
npm run build    # check + production build (must pass before every commit)
```
Node 24 (`.nvmrc`); Astro 7 needs ≥ 22.23.4.

## Project map

| Path | What |
|---|---|
| `src/data/site.ts` | **All copy, contact details, prices, boards, links.** Edit content here only. |
| `src/styles/tokens.css` | Colours, type, spacing, radius from the design |
| `src/layouts/BaseLayout.astro` | `<head>`, meta, OG, JSON-LD, fonts |
| `src/components/*.astro` | One component per page section, in page order |
| `src/components/Hero.astro` + `src/scripts/globe.ts` | Static hero copy + the three.js globe (loaded after first paint) |
| `src/lib/schema.ts` | JSON-LD built from `site.ts` |
| `src/pages/api/contact.ts` | Form endpoint → Resend → `/thanks` or `/form-error` |
| `src/pages/llms.txt.ts` | `/llms.txt` generated from `site.ts` |
| `docs/DESIGN.md` | Design spec (tokens, sections, responsive rules) |
| `docs/BUILD_PLAN.md` | Phases, backlog, dated Decisions log |
| `docs/CLIENT_QUESTIONS.md` | Numbered questions; match `TODO(client) Q<n>` in code |
| `docs/reference/` | Read-only design reference (3D hero source). Not built. |

## Rules

- **The design is the source of truth.** Desktop (≥ 768 px) must match Landing Page v3. Mobile may be improved; log every mobile change in the Decisions log in `docs/BUILD_PLAN.md`.
- **Blank slates, never placeholders.** Unknown facts are empty values marked `TODO(client) Q<n>`; empty = hidden or a neutral fallback ("Quote on request").
- **Never invent** reviews, stats, client logos, testimonials, traffic figures or credentials. The design's "Trusted by" brands (MTN, Shoprite…) are NOT used.
- No hard-coded copy or colours in components: copy from `site.ts`, colours from `tokens.css`.
- Accessible and mobile first: WCAG 2.2 AA, touch targets ≥ 44 px, visible focus, `prefers-reduced-motion` respected (globe skips its intro animation).
- Zero JS by default. Allowed scripts: globe (lazy), city filter + photo carousel, mobile menu, form board pre-select. Everything must still read and the form must still submit with JS off.
- Fonts self-hosted (Fontsource League Spartan Variable). No Google Fonts / unpkg / CDN requests (POPIA + speed). three.js, d3-geo and world-atlas are bundled from npm.

## SEO / GEO / AEO rules

- All copy, prices and board details are in static HTML (AI crawlers don't run JS). The globe is decoration on top of crawlable content.
- One `<h1>` (hero). One `<h2>` per section; `<section aria-labelledby>`; `<ol>` for steps; `<dl>` for board facts.
- Answer-first copy: section intros open with a sentence that stands alone when quoted; prefer specifics (R amounts, 5 days, one invoice) over adjectives.
- JSON-LD in `src/lib/schema.ts`: `WebSite`, `LocalBusiness` (AdvertisingAgency-style via `ProfessionalService` + `additionalType`) with `hasOfferCatalog` of boards, `areaServed` Pretoria + Centurion. Address, hours, `sameAs` added automatically once filled in `site.ts`. Only mark up what's visible.
- `public/robots.txt` allows all crawlers incl. GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended. `/llms.txt` generated, never hand-written.
- Title ≤ 60 chars, description ≤ 155 chars, canonical, OG/Twitter in `BaseLayout`; `noindex` on `/thanks`, `/form-error`, 404 (also excluded from the sitemap).
- `public/og.jpg` 1200×630 < 300 KB.
- LCP < 2.5 s (LCP element = hero `<h1>`, never the canvas), CLS < 0.1.

## Open client items

All 12 answered 2026-11-16 (see `docs/CLIENT_QUESTIONS.md`). Prices are **excl. VAT**; traffic data is **on request** — never add traffic figures without the client.
