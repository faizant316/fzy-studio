/* Shared mock data for every Makeup by Roko recreation on the site (home
   walkthrough + case study phones), so dates, prices and counts always agree.
   Mirrors the live product: date-only request, Roko confirms the time. */

export type DayStatus = "plain" | "open" | "fill" | "off";

// November 2026 starts on a Sunday, so no leading blanks.
export const CAL_MONTH = "November 2026";
export const CAL_BLANKS = 0;
export const CAL_DAYS = 30;
export const PICK_DAY = 14;

const OPEN = [8, 11, 14, 15, 19, 22, 29];
const FILL = [6, 13, 20, 27];
const OFF = [7, 21, 28];

export function dayStatus(d: number): DayStatus {
  if (OFF.includes(d)) return "off";
  if (FILL.includes(d)) return "fill";
  if (OPEN.includes(d)) return "open";
  return "plain";
}

export const OPEN_COUNT = OPEN.length; // 7
export const FILL_COUNT = FILL.length; // 4

export const BOOKING = {
  client: "Amara",
  clientFull: "Amara Reid",
  phone: "(555) 010-2231",
  service: "Luxury Bridal Look",
  price: "$750",
  deposit: "$375",
  dueOnDay: "$375",
  dateLong: "Saturday, November 14, 2026",
  dateShort: "Sat, Nov 14, 2026",
  start: "7:00 AM",
  booked: "Sep 30, 2026",
  // Consultation about a month before the wedding (Zoom).
  consultDate: "Thursday, October 15, 2026",
  consultTime: "6:30 PM",
  // Never the real Zelle details.
  zelleName: "Ruqia M.",
  zelleMasked: "r••••••@••••••.com",
};
