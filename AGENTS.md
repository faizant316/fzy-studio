# FZY Dev — Agent Guide

FZY Dev is a Next.js agency portfolio site. Project data lives in `components/projects.ts`,
the Selected Work section in `components/Work.tsx`, and the Roko case study in `components/CaseStudy.tsx`.
Phone mockups use `components/IPhone.tsx` with screens in `RokoScreens.tsx` / `WeddedScreens.tsx`.
The site is viewed locally during development with `npm run dev`.

Selected Work and the case study sit on warm "paper" (`#F2F1ED`, ink `#141414`), matching the
Makeup by Roko LinkedIn carousel. The rest of the site is black with a tan accent (`#C8B79A`).

## Featured case study: Makeup by Roko (bridal booking platform)

How the real product works (verified against the codebase, October 2026). Do not contradict this
in copy or mockups:

- It is a **request → deposit → confirm** pipeline, NOT instant self-serve booking.
- Booking is 3 steps: date, your details, review & sign. Clients pick a **preferred DATE only**.
  They give a "ready by" preference but never pick an appointment time.
- Clients sign the service agreement by **typing their full name** (no drawn signature).
- **Roko confirms the exact time afterward** from her admin dashboard, within 24 to 48 hours.
- Deposits are paid by **Zelle**, then the client uploads one or more screenshots and Roko marks
  the deposit received. It is NOT card-at-checkout. (Stripe is used only for makeup classes.)
- Remaining balance is **due on the day**. The site no longer says how it is paid, so never say cash.
- There are **no automated reminders** (no deposit reminder, no appointment reminder). The only
  cron job is a daily health check. Never say "instant confirmation" or "card at checkout."
- Counts: 49 API routes, 12 database tables, 21 email templates, 7 admin tabs (Home, Clients,
  Calendar, Services, Reviews, Class Sign-Ups, Reports).

### Brand visuals (Makeup by Roko)

- Fonts: the live site retired Cormorant Garamond. Everything is **Inter** (sans), and the emails
  use the system sans stack.
- Booking palette: rose `#D4A0B0`, deeper rose `#C4849A`, plum `#B8A0D4`, black `#111` for primary
  buttons and selected states, pink-tinted surfaces `#FBF5F7` `#F8F4F6` `#F7EEF2`, pink hairline
  borders `#F0E0E9` `#E8C4D0`.
- Calendar dots: Open = emerald `#34D399`, Filling = amber `#F0C27A`, Booked = red `#FCA5A5`,
  Selected = black `#111`, Today = rose `#D4A0B0`.
- Confirmation email accent: deeper rose `#C4849A`, palest pinks `#FDF0F5` `#FDF8FA` `#F7D8E5`.
- Privacy: never publish Roko's real Zelle phone number or Zelle email. Mask them.

## Wedded App (in development)

- Name is "Wedded App" (wordmark "Wedded"). A React Native + Expo app for iOS and Android, not
  native Swift. Pre-launch: no App Store or TestFlight build yet, so no live link or case study.
- Do not name the co-founder, the demo venue, monetization plans, or vendors (sample data is fictional).

## Copy & style rules

- Never use em dashes. Use commas, periods, or parentheses.
- Keep copy concise and on-brand.

## Git workflow

- Commit at meaningful checkpoints with a clear, descriptive message.
- Do NOT add "Co-Authored-By" lines to commit messages.
- Push only when you intend to deploy. Day-to-day work is viewed locally via `npm run dev`.
