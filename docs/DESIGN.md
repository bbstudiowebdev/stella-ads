# Design spec — Stella Ads Landing Page v3

Source: Claude Design artifact "Stella Ads Website" → `project/Stella Ads Landing Page v3.dc.html` + `project/Stella Ads 3D Hero.html` (https://claude.ai/artifact/B2s3Ub2uuf3E12b2Uq61e5). The hero source is copied to `docs/reference/stella-3d-hero.html`. The v3 export needs the design runtime and stays in the artifact; this file captures everything needed from it.

## Direction

Dark, confident, utilitarian. Near-black bands (nav, hero, stats, coming soon, quote, footer) alternate with an off-white body. One electric green accent (#17D97A) for CTAs, availability and highlights; a deeper green (#0B7A43) for text accents on light backgrounds. Heavy League Spartan headings (800) with slight negative tracking. Max content width 1240 px.

## Colour tokens

| Token | Hex | Use |
|---|---|---|
| `--c-ink` | #131414 | Body text on light |
| `--c-bg` | #f7f8f7 | Page background |
| `--c-surface` | #ffffff | Cards, vision band |
| `--c-dark` | #0e0f0f | Nav, stats, coming soon, quote, footer, featured card |
| `--c-hero` | #0b0d0c | Hero background |
| `--c-dark-2` | #181919 | Form inputs |
| `--c-accent` | #17D97A | Primary buttons, "Ads" in wordmark, available dot |
| `--c-accent-hover` | #2BEA8B | Button hover |
| `--c-accent-deep` | #0B7A43 | Links, step numbers, eyebrow on light |
| `--c-accent-darkest` | #0B3D2E | Link hover, SA fill on globe |
| `--c-muted` | #55585c | Secondary text on light |
| `--c-muted-dark` | #b4b7b5 | Secondary text on dark, nav links |
| `--c-muted-dark-2` | #c8cac8 | Body text on dark |
| `--c-line` | #e5e7e6 | Card borders |
| `--c-line-2` | #d7d9d7 | Dividers, outline buttons |
| `--c-line-dark` | #222423 / #2a2c2b / #333534 | Borders on dark |
| `--c-occupied` | #b4b7b5 | Occupied dot (cards) |
| `--c-error` | #ff8a80 | Form error on dark |

Globe palette: ocean #0f1211, grid #18201c, land #232a26, borders #38413c, SA fill #0B3D2E, SA edge #17D97A, occupied pin #6b6f6d, rim #1f3a2e, panel #121514 / #262a28.

## Type

League Spartan, weights 400–800. Body 16 px.

| Role | Size | Weight | Line-height / tracking |
|---|---|---|---|
| Hero h1 | clamp(40px, 5.2vw, 68px); 34px ≤ 760 px | 800 | 1.02 / -0.01em |
| Hero lead | clamp(17px, 1.5vw, 20px); 16px mobile | 400 | 1.5, #e4e6e5 |
| Quote h2 | clamp(40px, 5vw, 64px) | 800 | 1.02 |
| Section h2 | clamp(32px, 4vw, 40px) | 800 | 1.05 / -0.01em |
| Coming soon h2 | clamp(28px, 3.4vw, 36px) | 800 | 1.08 |
| Featured name | clamp(30px, 3.4vw, 40px) | 800 | 1.05 |
| Stat value | 40px | 800 | 1 |
| Step number | 40px | 800 | #0B7A43 |
| Card title / reason title | 20px | 700 | 1.2 |
| Wordmark | 20px | 800 | -0.01em |
| Body large | 17px | 400 | 1.6–1.65 |
| Small / labels | 13–14px | 600–700 | |
| Eyebrow (quote) | 13px | 700 | 0.08em, uppercase |

## Spacing, radius, motion

- Page gutter: `clamp(20px, 4vw, 40px)`; container 1240 px.
- Radius: buttons/inputs 8–10 px, cards 14 px, big panels 16 px, chips 9 px, pills 999 px.
- Section top padding: billboards 96, coming soon 64, how 112, why 112 top + bottom; vision & quote `clamp(64px, 8vw, 112px)`.
- Transitions 160 ms colour/background; cards lift `translateY(-2px)` 180 ms; carousel 380 ms `cubic-bezier(.2,.8,.2,1)`.
- `scroll-margin-top: 72px` on sections (sticky nav).

## Sections (page order)

1. **Nav** (sticky, #0e0f0f): wordmark "Stella**Ads**" (Ads green) · links Billboards / How it works / Why Stella / Contact (14px 600, #b4b7b5 → #fff) · right: phone link + green "Get a quote" button (12×20 padding). Mobile < 768: "Menu" + 3-line icon toggles a stacked link list (18px, 14px padding rows, #222423 dividers).
2. **Hero — 3D globe** (#0b0d0c, height `min(88vh, 860px)`, min 600): three.js globe; SA highlighted; Gauteng high-res patch. Copy left-centre (max 520px / 42vw): h1, lead, "Get a quote" button + "Browse billboards →" underlined link. Dock bottom: view chips (Pretoria & Centurion / All of South Africa) + legend (Available / Occupied) + hint. Pins drop in with bounce; tap a pin → side panel (400 px, right) with photo, status, name, city, `<dl>` Daily traffic / Rental / GPS, "Request a quote" (or "Join the waitlist" when occupied), prev/next. Mobile: copy at top, panel becomes bottom sheet 64%. Intro: globe pops in, flies to SA, drops pins, flies to Gauteng.
3. **Stats** (#0e0f0f, top border #222423): 3 stats in auto-fit grid (min 160), value 40/800 + label 14 #c8cac8. 32 px vertical padding.
4. **Trust bar**: hidden in design (`showTrust=false`). Not built until real clients are supplied.
5. **Billboards** `#billboards`: h2 + intro left; city filter chips right (All / Pretoria / Centurion, 44 px high, active = ink fill). Optional **featured** dark card (only when a board is "Available now"; picks highest traffic): photo left, details right, green badge "Featured · Available now". Card grid `auto-fill minmax(270px,1fr)` gap 20: photo carousel 16/10 with 44 px round prev/next and dots; title 20/700; "City · traffic" 14 muted; price 18/700 + availability dot; outline button "Enquire about this site" (46 px) hover → ink fill. Empty state card.
6. **Coming soon** `#coming-soon`: dark rounded panel, green pill badge, h2, body, "Get notified" button; right: 3 dashed-border cards "New site / Location to be announced / Coming soon".
7. **How it works** `#how`: h2, 3 steps (2 px ink top border, number 40 px green, title 20, body 16 muted).
8. **Why Stella** `#why`: two columns; left sticky (top 100) h2 + body 17; right list of reasons with 1 px dividers (title 20/700 + body).
9. **Our vision** `#vision` (white band, top border): image 4/3 radius 16 left; right eyebrow "Our vision" (green deep, 16/700), h2, body 17.
10. **Quote** `#quote` (dark): left eyebrow, h2 (64), body, phone (24/700), email, area. Right: form grid `auto-fit minmax(200px,1fr)` gap 18: Full name, Company, Email, Phone, Monthly budget (select), Campaign start (select), Billboard of interest (full width select, "Any site" + boards), error line, full-width green submit (17 px padding). Submit label becomes "Request quote for {board}" when a board is chosen. Inputs: #181919, border #333534, radius 9, padding 14×16, focus border green + 3 px green glow. Success state → "Enquiry received" panel (becomes `/thanks`).
11. **Footer** (dark, top border): wordmark · "© 2026 Stella Ads (Pty) Ltd" left; Billboards / Contact links right.
12. **Mobile sticky bar** (< 768): fixed bottom, Call (outline) + Get a quote (green), 48 px buttons, 76 px spacer above.

## Responsive rules

- Breakpoint 768 px: nav switches to Menu toggle; sticky bottom bar appears.
- Globe breakpoint 760 px: hero copy moves to top, panel becomes bottom sheet, hint hidden, dock hides while the panel is open.
- Grids are `auto-fit/auto-fill` so cards collapse to one column naturally.
