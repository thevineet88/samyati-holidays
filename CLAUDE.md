# CLAUDE.md

## What this is

The public-facing marketing website for Samyati Holidays, a Mumbai and Pune
based group tour operator. This is a **static brochure and enquiry site** deployed
on Netlify at samyatiholidays.com. It showcases 20+ fixed-departure group tour
packages across India.

**This site does not take bookings or payments.** Its only job is to show trip
details, build trust, and push every visitor toward WhatsApp. Every "Book on
WhatsApp" button on every page opens a wa.me link to +91 90760 68549.

## Business context

Samyati runs fully organized group tours from Mumbai and Pune: spiritual
yatras (Kedarnath-Badrinath), beach trips (Gokarna-Murudeshwar), high-altitude
adventure (Sikkim-Darjeeling), Himalayan treks, Char Dham circuits, Ladies
Special and Parents Special tours. Tagline is "Feeling FamilyVali." Current
WhatsApp contact is +91 90760 68549. Human team: Rohit, Tejashree.

**The site does not take bookings or payments.** It is a brochure that shows
trip details and funnels every visitor to WhatsApp. Every "Book on WhatsApp"
button, every contact form, and every enquiry path must lead to the same
WhatsApp number. No exceptions.

## Site structure

The site has 26 HTML pages, all static:

- `index.html` — Home page with hero, featured packages, stats, team section
- `packages.html` — Grid of all packages with category filter tabs
- `package-detail.html` — Dynamic detail page (slug-based, reads from data)
- `about.html` — Company story, values, team, stats
- `contact.html` — Contact form and WhatsApp CTA
- 20 individual package pages — one per destination, each a self-contained trip
  page showing the full itinerary, inclusions/exclusions, travel details, payment
  schedule, refund policy, gallery, and a prominent "Book on WhatsApp" button

Each package page is a standalone trip page designed for Google SEO. It is a
self-contained trip brochure showing the full itinerary, inclusions/exclusions,
travel details, payment schedule, refund policy, gallery, and a prominent
"Book on WhatsApp" button. The page is designed to answer every question a
traveller might have and then send them to WhatsApp to book.

## Tech stack

| Component | Technology |
|-----------|-----------|
| **Markup** | Plain HTML5 |
| **Styling** | Tailwind CSS via CDN + custom `css/style.css` |
| **JavaScript** | Vanilla JS (no framework) |
| **Data** | `packages.json` (canonical) + `js/packages-data.js` (mirror for browser) |
| **Fonts** | Google Fonts — Poppins, Inter, Kalam |
| **Images** | Unsplash URLs for package photos (curated per trip to match the destination), local assets for logo and team photos |
| **Hosting** | Netlify (`netlify.toml` configured, SPA fallback to index.html) |
| **Icons** | Inline SVG (no icon library dependency) |
| **Preloader** | Custom CSS animation in `js/preloader.js` |

## Data model

`packages.json` is the single source of truth for package data (2924 lines).
It is mirrored into `js/packages-data.js` for browser-side rendering. Each
package entry carries:

- **Identity**: slug, title, subtitle
- **Display**: hero image, gallery array, category tags
- **Summary**: dates, duration, price (in INR, per person), price label,
  price note (shows class variants like Sleeper / 3AC), last booking date
- **Content**: highlights array, inclusions array, exclusions array
- **Travel**: departure point and time, train/transport name, return details
- **Itinerary**: ordered day-by-day array (day number, date, title, description, meals)
- **Advisory**: important advisory text (altitude, weather, fitness)
- **Policy**: payment schedule array, refund policy array
- **Notes**: points to note (operational disclaimers)

Categories used across packages: Spiritual, Adventure, Nature & Hills, Beach,
Ladies Special, Parents Special.

## JS architecture

`js/components.js` — Shared UI components rendered into placeholder divs:
site navigation (with mobile hamburger), footer, WhatsApp floating button.
Uses string concatenation to build HTML (no template engine).

`js/main.js` — Page-level behavior:
- Mobile nav toggle
- Sticky nav shadow on scroll
- Accordion collapse/expand
- Dynamic package card rendering (reads from `packages-data.js`)
- Filter tabs on the packages listing page

`js/preloader.js` — Splash screen animation that hides on load.

`packages.html` calls `renderPackageCard()` from main.js to render cards from
the data array, with category filter buttons.

`package-detail.html` reads the URL slug, looks up the matching package in
`packages-data.js`, and renders the full detail view including accordions for
itinerary, inclusions/exclusions, payment schedule, refund policy, and gallery.

## Design system

- **Primary color**: Navy (#2D2E6E) — headers, nav, hero overlay, buttons
- **Accent color**: Orange (#F47920) — CTAs, highlights, taglines
- **Text**: Dark gray (#2C2C2C) for body, muted gray for secondary text
- **Background**: White and light gray (#F5F6FA) alternating sections
- **Fonts**: Poppins for headings, Inter for body, Kalam for decorative/tagline
- **Responsive**: Mobile-first with Tailwind breakpoints (sm, md, lg)

## Conventions

- Every page follows the same pattern: `<div id="site-nav"></div>` in the body,
  `components.js` fills it, `<div id="site-footer"></div>` at the end.
- Tailwind config is repeated inline in each page `<head>` (CDN approach, no build step).
- All WhatsApp links use `https://wa.me/919076068549` with a pre-filled message.
- Emoji is used for section icons (e.g., day chips like "Day 1" with icons).
- No build process, no bundler, no framework. Files are served as-is by Netlify.
- Version query strings on CSS/JS files (`?v=3`, `?v=6`) for cache busting.

## Package pages

Every individual package page is a standalone trip page designed for Google SEO.
Each page is a self-contained trip brochure: hero image, highlights, full
day-by-day itinerary, inclusions/exclusions, travel details, payment schedule,
refund policy, gallery, and a prominent "Book on WhatsApp" button. The page
must answer every question a traveller might have and then send them to
WhatsApp to book.

## Future: WhatsApp automation bot

A WhatsApp automation bot is planned for the future. The full specification,
tech stack, build order, and invariants are documented in
[`docs/WHATSAPP-BOT.md`](docs/WHATSAPP-BOT.md). That is the authoritative
plan and should not be duplicated here. The package data structure on this site
is already modeled to feed directly into the bot's knowledge base.

## What not to do

- Do not introduce a build step or framework without discussion. The site is
  intentionally static and simple.
- Do not remove or restructure the existing package data without preserving
  backwards compatibility for all 20+ package pages.
- Do not add em dashes in code comments or user-facing copy.
- Do not add any booking or payment collection logic. The site does not take
  bookings. Every path must lead to WhatsApp.
- Do not use random or mismatched images. Every photo must match its destination.
- Do not let individual package pages drift from `packages.json`. When JSON data
  changes, the HTML pages must be updated to match.
