# Build plan — Stella Ads

Tick boxes as phases finish. One commit per phase; `npm run build` must pass first.

## Phase 0 — Setup
- [x] Astro 7 static + Vercel adapter + sitemap, TypeScript strict, Node 24
- [x] Design reference + photos recovered from the artifact into `docs/reference/` and `src/assets/`
- [x] CLAUDE.md, DESIGN.md, BUILD_PLAN.md, CLIENT_QUESTIONS.md, `site.ts`
- [x] Every section scaffolded as its own component in page order (styled from tokens, globe ported)
- [x] `npm run check` + `npm run build` pass
- [x] Pushed to GitHub `bbstudiowebdev/stella-ads`

**Done when:** a build of the full page structure is on GitHub.

## Phase 1 — Visual fidelity (desktop)
- [x] Every section styled from `tokens.css` to match v3 at 1440 px (2026-11-19)
- [ ] Globe ported (three.js from npm, intro, pins, panel, chips) and matches the design
- [x] Per-section comparison against the v3 render at 1440 px (2026-11-19): nav, hero copy + dock, stats, billboards, how, why, vision, footer match to < 1 px; coming soon +1.5 px (44 px button); quote +30 px (WhatsApp line + privacy note, both logged)
- [ ] Globe intro, pins and panel checked visually side by side (panel layout already matches)

**Done when:** side-by-side screenshots at 1440 px are indistinguishable.

## Phase 2 — Responsive
- [ ] 360, 768, 1280, 1440 px: no horizontal scroll, touch targets ≥ 44 px
- [ ] Mobile menu, sticky Call / WhatsApp / Get a quote bar, globe bottom sheet
- [ ] Mobile changes logged below

## Phase 3 — Content
- [x] Client answers from `docs/CLIENT_QUESTIONS.md` into `site.ts` (2026-11-16)
- [x] Remaining unknowns are blank slates with neutral fallbacks

## Phase 4 — Contact form
- [ ] `/api/contact` (Resend), honeypot, validation, works with JS off
- [ ] Resend domain verified for stellaads.co.za; env vars in Vercel; real test email received and Reply goes to the sender

## Phase 5 — SEO, legal, analytics
- [ ] Meta, canonical, OG image, JSON-LD, robots.txt, `/llms.txt`, sitemap
- [ ] POPIA privacy page `/privacy`
- [ ] Security headers in `vercel.json`; Vercel Web Analytics on

## Phase 6 — QA and launch
- [ ] Lighthouse mobile ≥ 95 ×4, axe 0 violations, keyboard pass, real devices
- [ ] DNS for stellaads.co.za → Vercel, one primary host, canonical matches
- [ ] Search Console + Bing sitemap submitted; client sign-off

## Backlog
- Higher-resolution drone photos for every site (current ones are 537–716 px wide) — client: later
- FAQ section for AEO (not in design; needs Wikus's approval and answers)
- Board detail pages (`/billboards/<slug>`) for "[billboard] + [area]" searches once there are more sites
- Trust bar once real clients agree to be named (Q11)

## Decisions log

| Date | Decision | Why |
|---|---|---|
| 2026-11-16 | Build from Landing Page v3 with the 3D globe hero (Wikus's choice). | Newest design. |
| 2026-11-16 | Hero copy, CTAs, chips and legend are static HTML; the globe canvas is a separate script loaded after first paint, inline on the page instead of an iframe. Desktop look unchanged. | LCP on the `<h1>`, crawlable hero text, no iframe/postMessage plumbing. |
| 2026-11-16 | three.js, d3-geo, topojson-client and world-atlas bundled from npm instead of unpkg/jsDelivr; billboard photos served as optimised files instead of base64. | No third-party requests (POPIA), faster, works if CDNs are down. |
| 2026-11-16 | League Spartan self-hosted via Fontsource instead of Google Fonts. | POPIA + speed. |
| 2026-11-16 | Added WhatsApp (+27 79 692 1727): link in the quote contact list (desktop + mobile) and a third button in the mobile sticky bar (Call / WhatsApp / Get a quote). | Wikus asked for WhatsApp. Desktop addition is one text link in the existing contact list. |
| 2026-11-16 | "Trusted by" bar not built (hidden in the design and its brand names were placeholders). | Never invent clients. |
| 2026-11-16 | Board cards with a single photo hide the carousel arrows and dots. Solomon Mahlangu has one photo. | Design showed an empty second slot. |
| 2026-11-16 | All traffic figures removed ("Traffic data on request"); billboards intro changed from "Every listing includes verified traffic data." to "Traffic data and site stats available on request." | Client: traffic/stats on request (Q5). |
| 2026-11-16 | Prices exclude VAT: small "excl. VAT" after card prices, featured label "Per month, excl. VAT", stat label "Starting price per month, excl. VAT", step 2 copy changed from "VAT included" to "excluding VAT". | Client: prices excl. VAT (Q6); design copy was wrong. |
| 2026-11-16 | Form posts to `/api/contact` and redirects to `/thanks` (the design's "Enquiry received" panel). Every Enquire / Get a quote link jumps to `#quote` and (with JS) pre-selects its board in the form. | Works with JS off. |
| 2026-11-16 | Globe stops rendering while the hero is off-screen. | Battery/CPU on phones; no visual change. |
| 2026-11-16 | Legal name changed from "Stella Ads (Pty) Ltd" (design) to "Stella Ads CC" in footer, privacy page and JSON-LD. | Client: registered as a CC. |
| 2026-11-16 | Added a `/privacy` link in the footer. | POPIA requires a privacy notice for the form. |
| 2026-11-19 | "excl. VAT" moved from each board card's price to the billboards intro ("Prices exclude VAT; traffic data and site stats on request."). Featured label and stat label keep "excl. VAT". | Per-card note wrapped the price row and made cards 14.5 px taller than the design; cards now match v3 exactly. |
| 2026-11-19 | Privacy note ("We only use your details…" + Privacy notice link) under the quote form submit. Quote band is 30 px taller than v3 with the WhatsApp line. | POPIA notice at the point of collection. |
| 2026-11-19 | Form inputs use the design's natural height (44.5 / 46.5 px) on desktop; 48 px min-height below 768 px only. "Get notified" keeps a 44 px min-height (+1.5 px vs design). | Desktop matches v3; touch targets stay ≥ 44 px. |
| 2026-11-19 | Hero dock offset uses `4cqh` of the hero (container query) instead of `4vh`. | The design ran the hero in an iframe, so its `vh` was the hero height; this reproduces the same 36 px → 31.7 px position. |
