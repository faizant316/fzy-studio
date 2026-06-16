# FZY Studio

Marketing site for **FZY**, a web development studio building custom platforms for real businesses. This is the agency-facing site (the QR code on the business card points here). The personal portfolio for recruiters lives in a separate repo.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + custom design tokens
- **Framer Motion** for scroll reveals and transitions
- **Resend** for the contact form
- **Vercel** for deployment

## Brand

- Background: `#0a0a0a` (ink)
- Text: `#f5f0eb` (cream)
- Accent: `#c9a96a` (champagne gold)
- Display: Syne · Body: Inter · Mono: JetBrains Mono

Tone: high-end, editorial, confident. No em dashes in copy.

## Local development

```bash
npm install
npm run dev
```

Create `.env.local` with:

```
RESEND_API_KEY=your_key_here
```

## Sections

`Hero → Marquee → Services → Work → Process → Testimonial → Contact → Footer`

Single-page site for now. Each section is a component in `components/`. Built to grow: case study detail pages, more client work, and pricing are the natural next additions.

## Notes

- The contact form posts to `app/api/contact/route.ts` and emails both the studio and the client (Resend). It currently sends from `onboarding@resend.dev`; swap to a verified domain sender once `fzystudio.dev` (or final domain) is registered and verified in Resend.
- Footer links back to the founder's portfolio. Update `PORTFOLIO_URL` in `components/Footer.tsx` if the portfolio domain changes.
