# FZY Studio — Agent Guide

FZY Studio is a Next.js agency portfolio site. Case studies live in `components/Work.tsx`.
The site is viewed locally during development with `npm run dev`.

## Featured case study: Makeup by Roko (bridal booking platform)

How the real product works. Do not contradict this in copy or mockups:

- It is a **request → deposit → confirm** pipeline, NOT instant self-serve booking.
- Clients pick a **preferred DATE only** on a live availability calendar. They never pick a time.
- **Roko confirms the exact time afterward** from her admin dashboard, within 24 to 48 hours.
- Deposits are paid by **Zelle**, then the client uploads a screenshot and Roko verifies it.
  It is NOT card-at-checkout. (Stripe is used only for makeup classes.)
- Remaining balance is **cash on the day**.
- Never say "instant confirmation," "card at checkout," or "reminders before each appointment."
  The only automated reminder is the Zelle **deposit** reminder.

### Brand visuals (Makeup by Roko)

- Fonts: **Cormorant Garamond** (serif: headlines, prices, dates) + **Inter** (sans: labels, body, buttons).
- Booking palette: rose `#D4A0B0`, deeper rose `#C4849A`, plum `#B8A0D4`, black `#111` for primary
  buttons and selected states, pink-tinted surfaces `#FBF5F7` `#F8F4F6` `#F7EEF2`, pink hairline
  borders `#F0E0E9` `#E8C4D0`.
- Calendar dots: Open = emerald `#34D399`, Filling = amber `#F0C27A`, Booked = red `#FCA5A5`,
  Selected = black `#111`, Today = rose `#D4A0B0`.
- Confirmation email accent: deeper rose `#C4849A`, palest pinks `#FDF0F5` `#FDF8FA` `#F7D8E5`.
- Privacy: never publish Roko's real Zelle phone number. Mask it.

## Copy & style rules

- Never use em dashes. Use commas, periods, or parentheses.
- Keep copy concise and on-brand.

## Git workflow

- Commit at meaningful checkpoints with a clear, descriptive message.
- Do NOT add "Co-Authored-By" lines to commit messages.
- Push only when you intend to deploy. Day-to-day work is viewed locally via `npm run dev`.
