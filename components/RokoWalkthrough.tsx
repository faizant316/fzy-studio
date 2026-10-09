"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { BOOKING as B, CAL_BLANKS, CAL_DAYS, CAL_MONTH, FILL_COUNT, OPEN_COUNT, PICK_DAY, dayStatus } from "./rokoData";

/* ── A coded, self-driving walkthrough of the live Makeup by Roko site, framed in
   browser chrome. Replaces the old screen recording: it renders the real flow as
   pure DOM + Framer Motion so it stays crisp and loads instantly on every device.

   The loop mirrors the real site and keeps moving the whole way:
     hero → glide past about → services → zoom into + press the bridal card →
     booking sheet: step 1 pick a date (date only) → step 2 details fill →
     step 3 type a name to sign → submit → "Inquiry received" with the deposit
     link (Roko confirms the time later, never instantly) → fade back to the top.

   Two homes, one engine (identical tempo in both):
     <RokoWalkthrough chrome={false} />  inside the flagship preview
     <RokoWalkthrough />                 the case-study header (chrome on)          */

const ease = [0.22, 1, 0.36, 1] as const;
// The easing the whole piece leans on — the same fluid curve as the form zoom.
const smooth = [0.62, 0, 0.2, 1] as const;
// Section scroll glides on that same curve.
const glide = { duration: 1.0, ease: smooth };
// Cursor: a soft spring so the pointer drifts and settles like a real hand.
const CURSOR_SPRING = { stiffness: 130, damping: 20, mass: 0.7 };
// Card press: a snappier spring so the click reads as a real tap.
const pressSpring = { type: "spring" as const, stiffness: 360, damping: 22 };

type Phase = "hero" | "about" | "services" | "open" | "date" | "form" | "sign" | "submit" | "sent";

// One pass of the loop — kept brisk so it's always in motion, never parked.
const SEQUENCE: { phase: Phase; dur: number }[] = [
  { phase: "hero", dur: 900 },
  { phase: "about", dur: 700 },   // glides past — never parks here
  { phase: "services", dur: 1300 },
  { phase: "open", dur: 1100 },   // zoom into the card, press, sheet opens
  { phase: "date", dur: 1300 },   // step 1: zoom into the calendar, tap the 14th
  { phase: "form", dur: 1650 },   // step 2: zoom out → into the details, they fill
  { phase: "sign", dur: 1900 },   // step 3: type the name, tick the box
  { phase: "submit", dur: 650 },
  { phase: "sent", dur: 2000 },   // inquiry received + deposit link
];

const SCROLL_INDEX: Record<Phase, number> = {
  hero: 0, about: 1, services: 2, open: 2, date: 2, form: 2, sign: 2, submit: 2, sent: 2,
};
const OVERLAY_PHASES: Phase[] = ["open", "date", "form", "sign", "submit", "sent"];
const CLICK_PHASES: Phase[] = ["open", "date", "submit"];
const CURSOR_PHASES: Phase[] = ["services", "open", "date", "form", "sign", "submit"];

// The cursor aims at real elements, measured live from the DOM every frame, so
// it lands exactly on the button / June 14 / the form in every layout (wide,
// narrow, mid-zoom) instead of relying on hand-tuned percentages.
const TARGET_SEL: Partial<Record<Phase, string>> = {
  services: ".rw-card--target .rw-card-btn",
  open: ".rw-card--target .rw-card-btn",
  date: ".rw-day--sel",
  form: ".rw-field-box",
  sign: ".rw-sign-input",
  submit: ".rw-submit",
};
// Click-ripple timing per phase; submit fires fast so it never feels laggy.
const CLICK_DELAY: Partial<Record<Phase, number>> = { open: 0.4, date: 0.55, submit: 0.18 };

// The book (calendar | form) zoom, by phase. Origin is the left edge, so scale +
// translateX pan into either column. "form" keyframes zoom out, then into the form.
function bookAnim(phase: Phase) {
  switch (phase) {
    case "date": return { scale: 1.42, x: "16%" };          // into the calendar (left)
    case "form": return { scale: [1.42, 1, 1.16], x: ["16%", "0%", "-33%"] }; // out → form
    case "sign":
    case "submit": return { scale: 1.16, x: "-33%" };       // hold on the right column
    default: return { scale: 1, x: "0%" };                  // open — both columns
  }
}

// Matches the live bridal cards (label, best-for line, specs, fact chips).
const SERVICE_CARDS = [
  {
    cat: "Most Brides", name: "Luxury Bridal Look", best: "Best for the bride on her wedding day",
    price: "$750", duration: "2 hours", deposit: "$375",
    img: "/IMG_9883.jpeg", pos: "center 30%",
    facts: ["Full bridal makeup + lashes", "Long-wear finish"],
  },
  {
    cat: "Premium Package", name: "Full Day Service", best: "Best for early starts, far venues, or one extra look or face",
    price: "$1,700", duration: "Up to 4 hours", deposit: "$850",
    img: "/IMG_9891.jpeg", pos: "center 26%",
    facts: ["Bride + any one extra", "Covers starts before 7 AM"],
  },
  {
    cat: "Trial Package", name: "Bridal Trial", best: "Best for testing your look 1 to 3 months ahead",
    price: "$600", duration: "3 hours", deposit: "$300",
    img: "/IMG_0655.jpeg", pos: "center 24%",
    facts: ["Full trial look", "Book 1 to 3 months ahead"],
  },
];

export default function RokoWalkthrough({ chrome = true }: { chrome?: boolean }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduce ? "services" : "hero");
  // Wide frames get the two-column calendar↦form with zooms and the 3-card
  // services row; narrow frames (phones, tight columns) get one full-width
  // featured card and a clean cross-fade. Follows the FRAME's real width, not
  // the window, so the case-study column and tablets get the layout that fits.
  const [wide, setWide] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const running = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWide(entry.contentRect.width >= 620));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Cursor position as motion values (percent of the stage), driven by live DOM
  // measurement below — no React re-renders while it glides.
  const cx = useMotionValue(50);
  const cy = useMotionValue(82);
  const sx = useSpring(cx, CURSOR_SPRING);
  const sy = useSpring(cy, CURSOR_SPRING);
  const cursorLeft = useMotionTemplate`${sx}%`;
  const cursorTop = useMotionTemplate`${sy}%`;

  // Aim the cursor at the real element for this phase, re-measured every frame
  // so it tracks the zoom/pan transforms and lands precisely in every layout.
  useEffect(() => {
    if (reduce || !CURSOR_PHASES.includes(phase)) return;
    let raf = 0;
    const aim = () => {
      const stage = stageRef.current;
      const sel = TARGET_SEL[phase];
      const el = sel && stage ? stage.querySelector<HTMLElement>(sel) : null;
      if (stage && el) {
        const s = stage.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        if (s.width > 0 && s.height > 0) {
          cx.set(((r.left + r.width / 2 - s.left) / s.width) * 100);
          cy.set(((r.top + r.height / 2 - s.top) / s.height) * 100);
        }
      }
      raf = requestAnimationFrame(aim);
    };
    raf = requestAnimationFrame(aim);
    return () => cancelAnimationFrame(raf);
  }, [phase, reduce, cx, cy]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Schedule one pass, then re-schedule itself — a single, steady loop.
  const schedule = () => {
    clear();
    let t = 0;
    SEQUENCE.forEach(({ phase: ph, dur }) => {
      timers.current.push(setTimeout(() => setPhase(ph), t));
      t += dur;
    });
    timers.current.push(setTimeout(schedule, t));
  };

  // Guarded start so repeated viewport-enter events can't stack loops (which made
  // the case-study copy run jumpy/quick). Both copies now share one tempo.
  const start = () => {
    if (reduce) { setPhase("services"); return; }
    if (running.current) return;
    running.current = true;
    schedule();
  };
  const stop = () => { clear(); running.current = false; };

  useEffect(() => () => clear(), []);

  const overlayOpen = OVERLAY_PHASES.includes(phase);
  const dateSelected = phase === "date" || phase === "form" || phase === "sign" || phase === "submit";
  const formFill = phase === "form" || phase === "sign" || phase === "submit";
  const signing = phase === "sign" || phase === "submit";
  const stepLabel = phase === "date" || phase === "open" ? "Step 1 of 3 · Wedding date"
    : phase === "form" ? "Step 2 of 3 · Your details"
    : phase === "sent" ? "Inquiry received"
    : "Step 3 of 3 · Review & sign";
  const cursorOn = !reduce && CURSOR_PHASES.includes(phase);
  const cardState = phase === "open" ? "press" : phase === "services" ? "hover" : "idle";

  return (
    <motion.div
      ref={rootRef}
      className={`rw ${chrome ? "rw--chrome" : "rw--bare"}`}
      role="img"
      aria-label="Makeup by Roko booking walkthrough"
      onViewportEnter={start}
      onViewportLeave={stop}
      viewport={{ amount: 0.3 }}
    >
      {chrome && (
        <div className="rw-bar" aria-hidden>
          <span className="rw-dots"><i /><i /><i /></span>
          <span className="rw-url">makeupbyroko.org</span>
          <span className="rw-dots rw-dots--ghost"><i /><i /><i /></span>
        </div>
      )}

      <div className="rw-stage" ref={stageRef}>
        {/* Vertically-scrolling site: hero → about → services */}
        <motion.div
          className="rw-scroll"
          animate={{ y: `${SCROLL_INDEX[phase] * -33.3333}%` }}
          // Hero is only re-entered at the loop (hidden behind the fading sheet), so
          // snap there instantly; everything else glides.
          transition={phase === "hero" ? { duration: 0 } : glide}
        >
          {/* Hero — the real site capture, shown in full (no crop) on desktop */}
          <div className="rw-panel rw-hero">
            <img src="/roko-hero-screenshot.png" alt="" className="rw-hero-img" />
          </div>

          {/* About */}
          <div className="rw-panel rw-about">
            <div className="rw-about-photo">
              <img src="/roko_pic.png" alt="" className="rw-about-img" />
            </div>
            <div className="rw-about-text">
              <span className="rw-eyebrow">About</span>
              <h3 className="rw-serif rw-about-h">Making every woman feel truly <em>stunning</em>.</h3>
              <p className="rw-about-p">
                With over 17 years of experience and thousands of faces behind my brush, I&rsquo;ve learned that
                makeup is never one-size-fits-all.
              </p>
              <p className="rw-about-p">
                My goal has never been to change who you are, but to enhance what already makes you beautiful.
              </p>
              <span className="rw-about-link">View my work on Instagram →</span>
            </div>
          </div>

          {/* Services — bridal cards, matched to the live site */}
          <div className="rw-panel rw-services">
            <motion.div
              className="rw-svc-inner"
              style={{ transformOrigin: wide ? "17% 70%" : "50% 64%" }}
              animate={{ scale: phase === "open" ? 1.4 : 1 }}
              transition={{ duration: 0.9, ease: smooth }}
            >
              <span className="rw-eyebrow rw-services-eyebrow">Services</span>
              <h3 className="rw-serif rw-services-h">
                What I <em>Offer</em>
              </h3>
              <div className="rw-tabs">
                {["All Services", "Bridal", "Non-Bridal Makeup", "Photoshoot Makeup", "Makeup Courses"].map((t, i) => (
                  <span key={t} className={`rw-tab ${i === 0 ? "rw-tab--on" : ""}`}>{t}</span>
                ))}
              </div>
              <div className={`rw-cards ${wide ? "" : "rw-cards--one"}`}>
                {SERVICE_CARDS.map((c, i) => {
                  const active = i === 0;
                  // Narrow frames show only the featured card, full width, like
                  // the real site on a phone — three squeezed columns read as clutter.
                  if (!active && !wide) return null;
                  const content = (
                    <>
                      <div className="rw-card-photo">
                        <img src={c.img} alt="" style={{ objectPosition: c.pos }} />
                      </div>
                      <div className="rw-card-body">
                        <span className="rw-card-cat"><i aria-hidden />{c.cat}</span>
                        <span className="rw-serif rw-card-name">{c.name}</span>
                        <span className="rw-card-best">{c.best}</span>
                        <div className="rw-specs">
                          <span><b>{c.price}</b>Price</span>
                          <span><b>{c.duration}</b>Duration</span>
                          <span><b>{c.deposit}</b>Deposit</span>
                        </div>
                        <div className="rw-card-bullets">
                          {c.facts.map((b) => (
                            <span key={b} className="rw-card-bullet"><i aria-hidden />{b}</span>
                          ))}
                        </div>
                        <div className="rw-card-ctas">
                          <span className="rw-card-details">Details</span>
                          <span className="rw-card-btn">Book now →</span>
                        </div>
                      </div>
                    </>
                  );
                  if (!active) {
                    return <div key={c.name} className="rw-card">{content}</div>;
                  }
                  return (
                    <motion.div
                      key={c.name}
                      className={`rw-card rw-card--target ${cardState !== "idle" ? "rw-card--on" : ""}`}
                      animate={cardState === "press" ? { scale: 0.95, y: -1 } : cardState === "hover" ? { scale: 1, y: -7 } : { scale: 1, y: 0 }}
                      transition={pressSpring}
                    >
                      {content}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Booking sheet, slides up over the services screen */}
        <AnimatePresence>
          {overlayOpen && (
            <motion.div
              className="rw-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              // At the loop the sheet fades out, revealing the (already-reset) hero
              // behind it — a clean white→hero cross-fade, no rewind.
              exit={{ opacity: 0, transition: { duration: 0.5, ease } }}
              transition={{ duration: 0.6, ease: smooth, delay: 0.5 }}
            >
              <div className="rw-sheet-bar">
                <span className="rw-sheet-x" aria-hidden>‹</span>
                <span className="rw-sheet-title">
                  <b><i>✦</i> {B.service} <i>✦</i></b>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={stepLabel}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.25, ease }}
                    >
                      {stepLabel}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="rw-sheet-x" aria-hidden>×</span>
              </div>
              <div className="rw-sheet-body">
                <AnimatePresence mode="wait">
                  {phase !== "sent" ? (
                    <motion.div
                      key="book"
                      className="rw-bookfill"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease }}
                    >
                      {wide ? (
                        /* Two-column view; zooms into calendar, out, then into form */
                        <motion.div
                          className="rw-book"
                          style={{ transformOrigin: "0% 50%" }}
                          animate={bookAnim(phase)}
                          transition={phase === "form"
                            ? { duration: 1.45, ease: smooth, times: [0, 0.42, 1] }
                            : { duration: 0.95, ease: smooth }}
                        >
                          <div className="rw-book-cal">
                            <BookCalendar selected={dateSelected} />
                          </div>
                          <div className="rw-book-form">
                            <AnimatePresence mode="wait" initial={false}>
                              {!signing ? (
                                <motion.div key="form" className="rw-swap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }}>
                                  <BookForm fill={formFill} />
                                </motion.div>
                              ) : (
                                <motion.div key="sign" className="rw-swap" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease }}>
                                  <SignPane pressed={phase === "submit"} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      ) : (
                        /* Narrow: calendar then form, cross-fading with a zoom-in feel */
                        <div className="rw-booknarrow">
                          <AnimatePresence mode="wait">
                            {signing ? (
                              <motion.div
                                key="nsign"
                                className="rw-narrow-pane"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, ease }}
                              >
                                <SignPane pressed={phase === "submit"} />
                              </motion.div>
                            ) : !formFill ? (
                              <motion.div
                                key="ncal"
                                className="rw-narrow-pane"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 1.06 }}
                                transition={{ duration: 0.35, ease }}
                              >
                                <BookCalendar selected={dateSelected} />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="nform"
                                className="rw-narrow-pane"
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.45, ease }}
                              >
                                <BookForm fill={formFill} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sent"
                      className="rw-confirmfill"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease }}
                    >
                      <SentView />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Synthetic cursor — spring-driven motion values, aimed at real elements */}
        {cursorOn && (
          <motion.div
            className="rw-cursor"
            aria-hidden
            style={{ left: cursorLeft, top: cursorTop }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M5 3l14 8-6 1.6 3.4 6.2-2.7 1.4-3.4-6.2L7 18z" fill="#111" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            {CLICK_PHASES.includes(phase) && (
              <motion.span
                key={phase}
                className="rw-click"
                initial={{ scale: 0.3, opacity: 0.55 }}
                animate={{ scale: 2.1, opacity: 0 }}
                transition={{ duration: 0.5, ease, delay: CLICK_DELAY[phase] ?? 0.4 }}
              />
            )}
          </motion.div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: RW_CSS }} />
    </motion.div>
  );
}

/* ── Booking sub-views ── */

// Step 1: the date-only calendar (the bride never picks a time).
function BookCalendar({ selected }: { selected: boolean }) {
  const days = Array.from({ length: CAL_DAYS }, (_, i) => i + 1);
  return (
    <div className="rw-cal">
      <p className="rw-rule">Bookable at least <b>2 weeks out</b>. Every bride gets a private consultation about a month before her date.</p>
      <div className="rw-cal-head">
        <h4 className="rw-cal-title">{CAL_MONTH}</h4>
        <span className="rw-chips">
          <span className="rw-chip rw-chip--open"><i />{OPEN_COUNT} open</span>
          <span className="rw-chip rw-chip--fill"><i />{FILL_COUNT} filling</span>
        </span>
      </div>
      <div className="rw-week">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((w) => <span key={w}>{w}</span>)}
      </div>
      <div className="rw-days">
        {Array.from({ length: CAL_BLANKS }).map((_, i) => <span key={`b${i}`} />)}
        {days.map((d) => {
          const st = dayStatus(d);
          if (d === PICK_DAY) {
            return (
              <motion.span
                key={d}
                className="rw-day rw-day--sel"
                initial={false}
                animate={selected
                  ? { backgroundColor: "#111111", color: "#ffffff", scale: [0.9, 1.12, 1] }
                  : { backgroundColor: "rgba(17,17,17,0)", color: "#222222", scale: 1 }}
                transition={{ duration: 0.4, ease }}
              >
                {d}
                {!selected && <i className="rw-dot rw-dot--open" aria-hidden />}
              </motion.span>
            );
          }
          return (
            <span key={d} className={`rw-day rw-day--${st}`}>
              {d}{st !== "plain" && <i className={`rw-dot rw-dot--${st}`} aria-hidden />}
            </span>
          );
        })}
      </div>
      <motion.div
        className="rw-req"
        initial={false}
        animate={{ opacity: selected ? 1 : 0.35 }}
        transition={{ duration: 0.35, ease }}
      >
        <span>Requested date</span>
        <b>{selected ? B.dateLong.replace(", 2026", "") : "Select a date"}</b>
      </motion.div>
    </div>
  );
}

// Step 2: the details the real bridal form asks for. The bride gives a
// "ready by" preference; Roko still sets the exact start time.
const FORM_ROWS = [
  { label: "Getting ready", value: "San Jose, CA" },
  { label: "Ready by (your preference)", value: "11:00 AM" },
  { label: "Photographer arrives", value: "10:30 AM" },
  { label: "How did you hear about me?", value: "Instagram" },
];

function BookForm({ fill }: { fill: boolean }) {
  return (
    <div className="rw-form">
      <div className="rw-form-rows">
        {FORM_ROWS.map((r, i) => (
          <div className="rw-field" key={r.label}>
            <span className="rw-field-label">{r.label}</span>
            <div className="rw-field-box">
              <motion.span
                className="rw-field-val"
                initial={false}
                animate={{ opacity: fill ? 1 : 0 }}
                transition={{ duration: 0.25, delay: fill ? 0.3 + i * 0.22 : 0, ease }}
              >
                {r.value}
              </motion.span>
              {fill && (
                <motion.span
                  className="rw-field-caret"
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.35, delay: 0.18 + i * 0.22, ease, times: [0, 0.1, 0.85, 1] }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <span className="rw-next">Continue →</span>
      <span className="rw-form-note">Roko confirms your exact time within 24–48 hrs.</span>
    </div>
  );
}

// Step 3: review the totals and sign by typing a full name.
const SIGN_NAME = B.clientFull;

function SignPane({ pressed }: { pressed: boolean }) {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(reduce ? SIGN_NAME.length : 0);
  useEffect(() => {
    if (reduce) return;
    setTyped(0);
    const timers = Array.from(SIGN_NAME).map((_, i) => setTimeout(() => setTyped(i + 1), 380 + i * 70));
    return () => timers.forEach(clearTimeout);
  }, [reduce]);
  const done = typed >= SIGN_NAME.length;

  return (
    <div className="rw-sign">
      <h4 className="rw-sign-h">Review &amp; <em>Sign</em></h4>
      <p className="rw-sign-sub">Please read your service agreement and sign to confirm.</p>
      <div className="rw-sign-rows">
        <div><span>Date</span><b>{B.dateShort}</b></div>
        <div><span>Service price</span><b>{B.price}</b></div>
        <div><span>Deposit to book today</span><b>{B.deposit}</b></div>
        <div className="rw-sign-total"><span>Due on the day</span><b>{B.dueOnDay}</b></div>
      </div>
      <span className="rw-field-label" style={{ marginTop: "0.7rem" }}>Type your full name to sign *</span>
      <div className="rw-sign-input">
        <span>{SIGN_NAME.slice(0, typed)}</span>
        {!done && <i className="rw-field-caret" aria-hidden />}
      </div>
      <div className="rw-agree">
        <motion.i
          initial={false}
          animate={{ backgroundColor: done ? "#111111" : "#ffffff", borderColor: done ? "#111111" : "#d6d6d6" }}
          transition={{ duration: 0.25, delay: done ? 0.25 : 0 }}
        >
          {done && "✓"}
        </motion.i>
        <span>I have read and agree to this Service Agreement, and my typed name is my electronic signature.</span>
      </div>
      <motion.button
        type="button"
        className="rw-submit"
        tabIndex={-1}
        initial={false}
        animate={{ scale: pressed ? 0.97 : 1, opacity: done ? 1 : 0.45 }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
      >
        Sign &amp; Submit Bridal Inquiry
      </motion.button>
    </div>
  );
}

// After submit: the inquiry email, with the secure deposit link. The time is
// confirmed by Roko afterwards, so nothing here says "confirmed".
function SentView() {
  const row = (delay: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay, ease },
  });
  return (
    <div className="rw-confirm">
      <span className="rw-confirm-wm">Makeup by <em>Roko</em></span>
      <motion.span className="rw-confirm-eyebrow" {...row(0.05)}>Inquiry received</motion.span>
      <h4 className="rw-confirm-h">
        Thanks for booking, <em>{B.client}</em>
      </h4>
      <motion.div className="rw-confirm-card" {...row(0.16)}>
        <span className="rw-confirm-eyebrow">Reserve your date</span>
        <b className="rw-confirm-amt">{B.deposit}</b>
        <span className="rw-confirm-sub">due now to hold {B.dateLong}</span>
        <span className="rw-confirm-btn">Send Deposit &amp; Upload Photos</span>
      </motion.div>
      <motion.span className="rw-confirm-foot" {...row(0.3)}>Roko confirms your exact time within 24–48 hrs.</motion.span>
    </div>
  );
}

const RW_CSS = `
.rw {
  --rk-surface: #FBF5F7; --rk-surface-2: #F8F4F6;
  --rk-rose: #D4A0B0; --rk-rose-deep: #C4849A; --rk-plum-text: #6B4055;
  --rk-ink: #111111; --rk-muted: #6E6058; --rk-faint: #B5A99A;
  --rk-border: #E2C4D2; --rk-border-2: #EDE6DF;
  position: relative; width: 100%; height: 100%; min-height: inherit;
  display: flex; flex-direction: column; overflow: hidden;
  font-family: var(--font-inter), system-ui, sans-serif; color: var(--rk-ink);
  background: #080607;
}
.rw--chrome { border-radius: 18px; box-shadow: 0 0 0 1px rgba(20,20,20,0.08), 0 40px 80px -40px rgba(20,20,20,0.45), 0 18px 36px -24px rgba(20,20,20,0.25); }
/* The live site retired its serif; headings are the same clean sans, light weight. */
.rw-serif { font-family: var(--font-inter), system-ui, sans-serif; font-weight: 300; letter-spacing: -0.02em; }
.rw-eyebrow { font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--rk-rose-deep); font-weight: 600; }

/* light Safari-style chrome, to sit on the paper case study */
.rw-bar { display: flex; align-items: center; gap: 0.8rem; flex-shrink: 0; padding: 0.7rem 1rem; background: #f7f6f3; border-bottom: 1px solid rgba(20,20,20,0.07); }
.rw-dots { display: flex; gap: 7px; }
.rw-dots i { width: 11px; height: 11px; border-radius: 50%; background: #dedcd6; display: block; }
.rw-dots--ghost { visibility: hidden; }
.rw-url { margin: 0 auto; font-size: 0.74rem; color: #55544f; background: #fff; border-radius: 8px; padding: 0.3rem 1.4rem; box-shadow: 0 0 0 1px rgba(20,20,20,0.06); }

.rw-stage { position: relative; flex: 1; min-height: 0; overflow: hidden; background: #080607; }
.rw-scroll { position: absolute; top: 0; left: 0; right: 0; height: 300%; }
.rw-panel { height: 33.3333%; overflow: hidden; position: relative; }

/* Hero, the real capture, shown in full everywhere. The screenshot is dark-on-dark,
   so 'contain' letterboxing blends invisibly instead of cropping on phones. */
.rw-hero { background: #080607; }
.rw-hero-img { width: 100%; height: 100%; object-fit: contain; object-position: center; display: block; }

/* About */
.rw-about { background: #fff; display: grid; grid-template-columns: 0.82fr 1.18fr; gap: clamp(0.9rem, 2.4vw, 2rem); align-items: center; padding: clamp(1.1rem, 3.2vw, 2.6rem) clamp(1.1rem, 3.6vw, 3rem); }
.rw-about-photo { height: 80%; border-radius: 12px; overflow: hidden; position: relative; background: linear-gradient(150deg, #2c2228 0%, #15100f 72%); box-shadow: 0 18px 40px rgba(0,0,0,0.18); }
.rw-about-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 22%; display: block; }
.rw-about-text { min-width: 0; }
.rw-about-h { font-size: clamp(1.4rem, 3vw, 2.3rem); line-height: 1.1; margin: 0.5rem 0 0; }
.rw-about-h em { font-style: italic; color: var(--rk-rose-deep); }
.rw-about-p { font-size: clamp(0.72rem, 1.15vw, 0.92rem); line-height: 1.55; color: var(--rk-muted); margin: 0.7rem 0 0; max-width: 44ch; }
.rw-about-link { display: inline-block; margin-top: 1rem; font-size: 0.64rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--rk-rose-deep); font-weight: 600; }

/* Services, the live bridal cards */
.rw-services { background: #fff; padding: clamp(0.8rem, 2.2vw, 1.6rem) clamp(1.1rem, 3.4vw, 2.6rem); display: flex; flex-direction: column; justify-content: center; }
.rw-svc-inner { width: 100%; }
.rw-services-h { font-size: clamp(1.4rem, 3vw, 2.3rem); margin: 0.25rem 0 0; }
.rw-services-h em { font-style: italic; color: var(--rk-plum-text); }
.rw-tabs { display: flex; gap: clamp(0.7rem, 1.8vw, 1.4rem); margin-top: clamp(0.5rem, 1.3vw, 0.9rem); flex-wrap: wrap; }
.rw-tab { font-size: clamp(0.54rem, 0.9vw, 0.68rem); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rk-faint); padding-bottom: 0.3rem; }
.rw-tab--on { color: var(--rk-ink); border-bottom: 1.5px solid var(--rk-rose-deep); }
.rw-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(0.55rem, 1.4vw, 1rem); margin-top: clamp(0.7rem, 1.7vw, 1.2rem); align-items: start; }
.rw-cards--one { grid-template-columns: 1fr; max-width: 440px; }
.rw-cards--one .rw-card-photo { height: clamp(96px, 26vw, 140px); }
.rw-cards--one .rw-card-name { font-size: clamp(1.1rem, 4.8vw, 1.35rem); }
.rw-card { display: flex; flex-direction: column; border: 1px solid var(--rk-border-2); border-radius: 13px; background: #fff; overflow: hidden; transition: border-color 0.45s ease, box-shadow 0.45s ease; }
.rw-card--on { border-color: var(--rk-rose); box-shadow: 0 18px 44px rgba(196,132,154,0.28); }
.rw-card-photo { position: relative; height: clamp(54px, 7.4vw, 92px); overflow: hidden; background: #ede4e7; }
.rw-card-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.rw-card-body { display: flex; flex-direction: column; gap: 0.2rem; padding: clamp(0.55rem, 1.2vw, 0.85rem); }
.rw-card-cat { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.48rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--rk-rose-deep); }
.rw-card-cat i { width: 0.8rem; height: 1px; background: var(--rk-rose-deep); display: block; }
.rw-card-name { font-size: clamp(0.9rem, 1.55vw, 1.25rem); color: var(--rk-ink); line-height: 1.12; font-weight: 400; }
.rw-card-best { font-size: clamp(0.5rem, 0.82vw, 0.66rem); color: #8a7f79; line-height: 1.35; }
.rw-specs { display: grid; grid-template-columns: 1fr 1.25fr 1fr; margin-top: 0.3rem; border-top: 1px solid #f0ebe6; border-bottom: 1px solid #f0ebe6; }
.rw-specs span { display: flex; flex-direction: column; gap: 0.1rem; padding: 0.32rem 0.2rem; font-size: 0.42rem; letter-spacing: 0.1em; text-transform: uppercase; color: #a89f99; }
.rw-specs span + span { border-left: 1px solid #f0ebe6; padding-left: 0.4rem; }
.rw-specs b { font-size: clamp(0.56rem, 0.92vw, 0.74rem); letter-spacing: 0; text-transform: none; color: var(--rk-ink); font-weight: 600; white-space: nowrap; }
.rw-card-bullets { display: flex; flex-wrap: wrap; gap: 0.22rem; margin-top: 0.3rem; }
.rw-card-bullet { display: inline-flex; align-items: center; gap: 0.25rem; font-size: clamp(0.46rem, 0.76vw, 0.6rem); font-weight: 500; color: #8A5468; background: rgba(196,132,154,0.09); border-radius: 100px; padding: 0.18rem 0.42rem; white-space: nowrap; }
.rw-card-bullet i { width: 3px; height: 3px; border-radius: 50%; background: var(--rk-rose-deep); display: block; }
.rw-card-ctas { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 0.3rem; margin-top: 0.45rem; }
.rw-card-details { text-align: center; font-size: clamp(0.5rem, 0.82vw, 0.66rem); font-weight: 500; color: var(--rk-ink); border: 1px solid #e6dfe2; border-radius: 100px; padding: 0.42rem 0.3rem; }
.rw-card-btn { text-align: center; font-size: clamp(0.5rem, 0.82vw, 0.66rem); font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #fff; background: var(--rk-ink); border-radius: 100px; padding: 0.42rem 0.3rem; }

/* Booking sheet */
.rw-sheet { position: absolute; inset: 0; z-index: 5; background: #fff; display: flex; flex-direction: column; box-shadow: 0 -20px 60px rgba(0,0,0,0.25); }
.rw-sheet-bar { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; padding: clamp(0.55rem, 1.5vw, 0.85rem) clamp(1rem, 3vw, 2rem); border-bottom: 1px solid #F1E6EB; background: #fff; }
.rw-sheet-title { display: flex; flex-direction: column; align-items: center; gap: 0.15rem; text-align: center; }
.rw-sheet-title b { font-size: clamp(0.72rem, 1.2vw, 0.95rem); font-weight: 500; }
.rw-sheet-title b i { font-style: normal; color: var(--rk-rose); font-size: 0.55em; vertical-align: 0.2em; }
.rw-sheet-title span { font-size: clamp(0.46rem, 0.7vw, 0.58rem); letter-spacing: 0.14em; text-transform: uppercase; color: #C4A8B4; }
.rw-sheet-x { width: 26px; height: 26px; border-radius: 50%; background: #F6F2F4; color: #8b7f86; display: inline-flex; align-items: center; justify-content: center; font-size: 0.95rem; }
.rw-sheet-body { position: relative; flex: 1; min-height: 0; overflow: hidden; }
.rw-bookfill, .rw-confirmfill { position: absolute; inset: 0; }
.rw-confirmfill { display: flex; align-items: center; justify-content: center; padding: clamp(1rem, 3vw, 2.2rem); background: radial-gradient(70% 55% at 50% 0%, #FBEFF4, #fff 70%); }

/* Two-column booking: calendar | details then sign (framer drives the zoom) */
.rw-book {
  width: 100%; height: 100%;
  display: grid; grid-template-columns: 0.94fr 1.06fr; gap: clamp(0.9rem, 2.4vw, 2rem);
  padding: clamp(0.9rem, 2.4vw, 1.6rem) clamp(1.1rem, 3.2vw, 2.3rem);
  align-items: start;
}
.rw-book-cal, .rw-book-form { min-width: 0; }
.rw-book-form { position: relative; display: grid; }
.rw-swap { grid-area: 1 / 1; min-width: 0; }
.rw-book-form::before { content: ""; position: absolute; left: calc(clamp(0.9rem, 2.4vw, 2rem) / -2); top: 4%; bottom: 4%; width: 1px; background: var(--rk-border-2); }

/* Calendar */
.rw-cal { display: flex; flex-direction: column; }
.rw-rule { font-size: clamp(0.5rem, 0.8vw, 0.66rem); line-height: 1.45; color: #6f666a; }
.rw-rule b { color: var(--rk-ink); font-weight: 600; }
.rw-cal-head { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-top: clamp(0.4rem, 1vw, 0.7rem); }
.rw-cal-title { font-size: clamp(0.95rem, 1.7vw, 1.35rem); font-weight: 400; margin: 0; letter-spacing: -0.01em; }
.rw-chips { display: inline-flex; gap: 0.25rem; }
.rw-chip { display: inline-flex; align-items: center; gap: 0.22rem; font-size: clamp(0.44rem, 0.7vw, 0.58rem); font-weight: 500; padding: 0.15rem 0.4rem; border-radius: 100px; }
.rw-chip i { width: 4px; height: 4px; border-radius: 50%; display: block; }
.rw-chip--open { background: #E7F7EF; color: #1F8A5B; } .rw-chip--open i { background: #34D399; }
.rw-chip--fill { background: #FDF3E3; color: #A86B12; } .rw-chip--fill i { background: #F0C27A; }
.rw-week { display: grid; grid-template-columns: repeat(7, 1fr); margin-top: clamp(0.35rem, 0.9vw, 0.6rem); }
.rw-week span { text-align: center; font-size: 0.46rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--rk-faint); padding-bottom: 0.3rem; }
.rw-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.rw-day { position: relative; height: clamp(22px, 4.4vw, 33px); display: flex; align-items: center; justify-content: center; font-size: clamp(0.56rem, 0.95vw, 0.76rem); border-radius: 6px; color: #333; }
.rw-day--plain { color: #8a8486; }
.rw-day--off { color: #EBA1A1; text-decoration: line-through; }
.rw-day--sel { font-weight: 600; }
.rw-dot { position: absolute; bottom: 2px; left: 50%; width: 4px; height: 4px; margin-left: -2px; border-radius: 50%; display: block; }
.rw-dot--open { background: #34D399; } .rw-dot--fill { background: #F0C27A; } .rw-dot--off { background: #FCA5A5; }
.rw-req { margin-top: clamp(0.5rem, 1.2vw, 0.85rem); padding-top: clamp(0.45rem, 1vw, 0.7rem); border-top: 1px solid var(--rk-border-2); display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; }
.rw-req span { font-size: 0.52rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--rk-rose-deep); font-weight: 600; }
.rw-req b { font-size: clamp(0.78rem, 1.4vw, 1.05rem); font-weight: 500; color: var(--rk-ink); }

/* Details form */
.rw-form { display: flex; flex-direction: column; justify-content: center; height: 100%; }
.rw-form-rows { display: grid; gap: clamp(0.4rem, 1vw, 0.6rem); }
.rw-field { display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; }
.rw-field-label { display: block; font-size: 0.48rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #6E6660; }
.rw-field-box { display: flex; align-items: center; min-height: 1.6rem; padding: 0.3rem 0; border-bottom: 1px solid #E8E2E4; }
.rw-field-val { font-size: clamp(0.62rem, 1vw, 0.82rem); color: var(--rk-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rw-field-caret { display: inline-block; width: 1px; height: 0.9em; margin-left: 1px; background: var(--rk-rose-deep); }
.rw-next { margin-top: clamp(0.7rem, 1.6vw, 1rem); text-align: center; padding: 0.55rem; border-radius: 100px; background: #111; color: #fff; font-size: clamp(0.6rem, 0.95vw, 0.78rem); font-weight: 500; }
.rw-form-note { margin-top: 0.45rem; text-align: center; font-size: 0.52rem; color: var(--rk-muted); }

/* Review & sign */
.rw-sign { display: flex; flex-direction: column; }
.rw-sign-h { font-size: clamp(1rem, 1.8vw, 1.4rem); font-weight: 400; letter-spacing: -0.01em; margin: 0; }
.rw-sign-h em { font-style: normal; color: var(--rk-rose); }
.rw-sign-sub { margin-top: 0.15rem; font-size: 0.52rem; color: #9a8f94; }
.rw-sign-rows { margin-top: 0.5rem; border: 1px solid #F1E6EB; border-radius: 10px; overflow: hidden; }
.rw-sign-rows > div { display: flex; justify-content: space-between; gap: 0.6rem; padding: 0.32rem 0.6rem; border-bottom: 1px solid #F5EDF1; font-size: clamp(0.52rem, 0.85vw, 0.68rem); }
.rw-sign-rows > div:last-child { border-bottom: none; }
.rw-sign-rows span { color: #8b8386; }
.rw-sign-rows b { font-weight: 500; }
.rw-sign-total { background: #FBF5F7; }
.rw-sign-total span { color: #111 !important; font-weight: 600; }
.rw-sign-total b { font-weight: 700 !important; }
.rw-sign-input { display: flex; align-items: center; min-height: 1.7rem; margin-top: 0.25rem; padding: 0.3rem 0; border-bottom: 1px solid #D4A0B0; font-size: clamp(0.66rem, 1.05vw, 0.86rem); color: var(--rk-ink); }
.rw-agree { display: flex; gap: 0.4rem; align-items: flex-start; margin-top: 0.5rem; font-size: clamp(0.46rem, 0.72vw, 0.58rem); line-height: 1.4; color: #6f666a; }
.rw-agree i { flex-shrink: 0; width: 12px; height: 12px; border-radius: 3px; border: 1.5px solid #d6d6d6; color: #fff; font-style: normal; font-size: 0.5rem; display: inline-flex; align-items: center; justify-content: center; margin-top: 1px; }
.rw-submit { margin-top: clamp(0.55rem, 1.3vw, 0.85rem); width: 100%; padding: 0.58rem; border: none; border-radius: 100px; background: #111; color: #fff; font-size: clamp(0.6rem, 0.95vw, 0.78rem); font-weight: 500; }

/* Inquiry received */
.rw-confirm { text-align: center; display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 380px; }
.rw-confirm-wm { font-size: clamp(0.8rem, 1.3vw, 1rem); color: var(--rk-ink); }
.rw-confirm-wm em { font-style: italic; color: var(--rk-rose-deep); }
.rw-confirm-eyebrow { display: block; margin-top: clamp(0.6rem, 1.4vw, 0.95rem); font-size: 0.54rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--rk-rose-deep); }
.rw-confirm-h { font-size: clamp(1.25rem, 2.6vw, 1.95rem); font-weight: 300; line-height: 1.15; margin: 0.35rem 0 0; letter-spacing: -0.02em; }
.rw-confirm-h em { font-style: italic; color: var(--rk-rose-deep); }
.rw-confirm-card { width: 100%; margin-top: clamp(0.7rem, 1.8vw, 1.15rem); padding: clamp(0.7rem, 1.8vw, 1.1rem); border-radius: 14px; background: #FDF6F9; border: 1px solid #F3DCE6; }
.rw-confirm-card .rw-confirm-eyebrow { margin-top: 0; }
.rw-confirm-amt { display: block; margin-top: 0.2rem; font-size: clamp(1.6rem, 3.4vw, 2.5rem); font-weight: 300; letter-spacing: -0.03em; }
.rw-confirm-sub { display: block; font-size: clamp(0.52rem, 0.85vw, 0.68rem); color: #8b7f86; }
.rw-confirm-btn { display: block; margin-top: 0.7rem; padding: 0.6rem; border-radius: 100px; background: #C88A9E; color: #fff; font-size: clamp(0.6rem, 0.95vw, 0.78rem); font-weight: 600; }
.rw-confirm-foot { margin-top: clamp(0.6rem, 1.4vw, 0.9rem); font-size: 0.58rem; color: #9a8f94; }

/* Narrow booking: calendar, details, sign, cross-fading (no horizontal scale) */
.rw-booknarrow { position: absolute; inset: 0; display: grid; padding: clamp(1rem, 4vw, 1.7rem) clamp(1rem, 4.5vw, 1.8rem); }
.rw-narrow-pane { grid-area: 1 / 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }

/* Cursor */
.rw-cursor { position: absolute; z-index: 8; transform: translate(-4px, -2px); filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35)); pointer-events: none; }
.rw-click { position: absolute; left: 2px; top: 1px; width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid var(--rk-rose-deep); }

@media (max-width: 760px) {
  .rw-about { grid-template-columns: 1fr; }
  .rw-about-photo { display: none; }
  .rw-card-best { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .rw-cursor { display: none; }
}
`;
