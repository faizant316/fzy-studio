"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/* ── A coded, self-driving walkthrough of the live Makeup by Roko site, framed in
   browser chrome. Replaces the old screen recording: it renders the real flow as
   pure DOM + Framer Motion so it stays crisp and loads instantly on every device.

   The loop mirrors the real site and keeps moving the whole way:
     hero → glide past about → services → zoom into + press the bridal card →
     booking sheet → zoom into calendar, pick June 14 → zoom out → zoom into form →
     it fills → submit → "You're Confirmed!" → fade back to the top.

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

type Phase = "hero" | "about" | "services" | "open" | "date" | "form" | "submit" | "confirm";

// One pass of the loop — kept brisk so it's always in motion, never parked.
const SEQUENCE: { phase: Phase; dur: number }[] = [
  { phase: "hero", dur: 900 },
  { phase: "about", dur: 650 },   // glides past — never parks here
  { phase: "services", dur: 1300 },
  { phase: "open", dur: 1100 },   // zoom into the card, press, sheet opens
  { phase: "date", dur: 1300 },   // zoom into the calendar, click 14
  { phase: "form", dur: 1750 },   // zoom out → into the form, it fills
  { phase: "submit", dur: 750 },
  { phase: "confirm", dur: 1500 },
];

const SCROLL_INDEX: Record<Phase, number> = {
  hero: 0, about: 1, services: 2, open: 2, date: 2, form: 2, submit: 2, confirm: 2,
};
const OVERLAY_PHASES: Phase[] = ["open", "date", "form", "submit", "confirm"];
const CLICK_PHASES: Phase[] = ["open", "date", "submit"];
const CURSOR_PHASES: Phase[] = ["services", "open", "date", "form", "submit"];

// The cursor aims at real elements, measured live from the DOM every frame, so
// it lands exactly on the button / June 14 / the form in every layout (wide,
// narrow, mid-zoom) instead of relying on hand-tuned percentages.
const TARGET_SEL: Partial<Record<Phase, string>> = {
  services: ".rw-card--target .rw-card-btn",
  open: ".rw-card--target .rw-card-btn",
  date: ".rw-day--sel",
  form: ".rw-field-box",
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
    case "submit": return { scale: 1.16, x: "-33%" };       // hold on the form
    default: return { scale: 1, x: "0%" };                  // open — both columns
  }
}

const SERVICE_CARDS = [
  {
    cat: "Featured service", name: "Luxury Bridal Look", price: "$750", meta: "2 hours · $375 deposit",
    img: "/IMG_9883.jpeg", pos: "center 30%",
    bullets: ["Full bridal makeup application", "Lash application included"], more: "+2 more", cta: "Inquire About Bridal",
  },
  {
    cat: "Premium package", name: "Full Day Service", price: "$1,700", meta: "Full day · $850 deposit",
    img: "/IMG_9891.jpeg", pos: "center 26%",
    bullets: ["Full bridal makeup + second look", "All-day availability"], more: "+1 more", cta: "Inquire About Full Day",
  },
  {
    cat: "Trial package", name: "Bridal Trial", price: "$500", meta: "2–3 hrs · $250 deposit",
    img: "/IMG_0655.jpeg", pos: "center 24%",
    bullets: ["Full trial makeup application", "Personalized look consult"], more: "+1 more", cta: "Inquire About Trial",
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
  const dateSelected = phase === "date" || phase === "form" || phase === "submit";
  const formFill = phase === "form" || phase === "submit";
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
              <h3 className="rw-serif rw-about-h">More than makeup.</h3>
              <p className="rw-about-p">
                I don&rsquo;t just provide a service, I create an experience. Every client receives my full
                attention, care, and dedication.
              </p>
              <p className="rw-about-p">
                The most rewarding part isn&rsquo;t the makeup itself, it&rsquo;s watching someone look in the
                mirror and light up.
              </p>
              <span className="rw-about-link">⟢ View my work on Instagram →</span>
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
              <span className="rw-eyebrow rw-services-eyebrow">Bridal services</span>
              <h3 className="rw-serif rw-services-h">
                What I <em>Offer</em>
              </h3>
              <div className="rw-tabs">
                {["All Services", "Bridal", "Non-Bridal", "Photoshoot", "Courses"].map((t, i) => (
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
                        <span className="rw-card-photos" aria-hidden>✦ 5 photos</span>
                      </div>
                      <div className="rw-card-body">
                        <span className="rw-card-cat">{c.cat}</span>
                        <span className="rw-serif rw-card-name">{c.name}</span>
                        <span className="rw-card-price"><b>{c.price}</b> · {c.meta}</span>
                        <div className="rw-card-bullets">
                          {c.bullets.map((b) => (
                            <span key={b} className="rw-card-bullet"><i aria-hidden>✦</i>{b}</span>
                          ))}
                          <span className="rw-card-more">{c.more} (tap to see all)</span>
                        </div>
                        <span className="rw-card-btn">{c.cta} →</span>
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
                <span className="rw-sheet-title">Bridal Inquiry · Luxury Bridal</span>
                <span className="rw-sheet-x" aria-hidden>×</span>
              </div>
              <div className="rw-sheet-body">
                <AnimatePresence mode="wait">
                  {phase !== "confirm" ? (
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
                            <BookForm fill={formFill} />
                          </div>
                        </motion.div>
                      ) : (
                        /* Narrow: calendar then form, cross-fading with a zoom-in feel */
                        <div className="rw-booknarrow">
                          <AnimatePresence mode="wait">
                            {!formFill ? (
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
                      key="confirm"
                      className="rw-confirmfill"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease }}
                    >
                      <ConfirmView />
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

function BookCalendar({ selected }: { selected: boolean }) {
  const blanks = 1; // June 1, 2026 is a Monday
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const klass = (d: number) => {
    if ([1, 2, 6, 7, 8, 13, 20, 21].includes(d)) return "rw-day rw-day--booked";
    if (d === 14) return "rw-day rw-day--target";
    if ([10, 17, 24, 28].includes(d)) return "rw-day rw-day--fill";
    return "rw-day rw-day--open";
  };
  return (
    <div className="rw-cal">
      <div className="rw-cal-head">
        <div>
          <span className="rw-eyebrow">Choose your date</span>
          <h4 className="rw-serif rw-cal-title">June 2026</h4>
        </div>
        <span className="rw-cal-nav" aria-hidden>‹ ›</span>
      </div>
      <div className="rw-week">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((w) => <span key={w}>{w}</span>)}
      </div>
      <div className="rw-days">
        {Array.from({ length: blanks }).map((_, i) => <span key={`b${i}`} />)}
        {days.map((d) => {
          const c = klass(d);
          const dot = c.includes("--open") || c.includes("--fill");
          if (d === 14) {
            return (
              <motion.span
                key={d}
                className="rw-day rw-day--sel"
                initial={false}
                animate={selected
                  ? { backgroundColor: "#111111", color: "#ffffff", scale: [0.9, 1.14, 1] }
                  : { backgroundColor: "#ffffff", color: "#8a8a8a", scale: 1 }}
                transition={{ duration: 0.4, ease }}
              >
                {d}
              </motion.span>
            );
          }
          return (
            <span key={d} className={c}>
              {d}{dot && <i aria-hidden />}
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
        <b className="rw-serif">{selected ? "Saturday, June 14" : "Select a date"}</b>
      </motion.div>
    </div>
  );
}

const FORM_ROWS = [
  { label: "Event location", value: "Los Angeles County, CA" },
  { label: "Date requested", value: "Saturday, June 14, 2026" },
  { label: "Photographer", value: "@habebbazee" },
  { label: "How many need glam?", value: "1" },
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
      <button type="button" className="rw-submit" tabIndex={-1}>
        Submit Bridal Inquiry →
      </button>
      <span className="rw-form-note">Roko confirms within 24–48 hrs · $175 deposit secures your date.</span>
    </div>
  );
}

function ConfirmView() {
  const row = (delay: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay, ease },
  });
  return (
    <div className="rw-confirm">
      <span className="rw-confirm-wm">Makeup by Roko</span>
      <motion.span
        className="rw-confirm-circle"
        aria-hidden
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: [0.7, 1.1, 1] }}
        transition={{ duration: 0.4, ease }}
      >
        ✓
      </motion.span>
      <h4 className="rw-serif rw-confirm-h">
        You&rsquo;re <em>Confirmed!</em>
      </h4>
      <span className="rw-confirm-sub">Saturday, June 14 · 10:30 AM</span>
      <div className="rw-confirm-card">
        <motion.div className="rw-detail" {...row(0.1)}><span>Service</span><b>Luxury Bridal</b></motion.div>
        <motion.div className="rw-detail" {...row(0.16)}><span>Date</span><b>Sat, June 14</b></motion.div>
        <motion.div className="rw-detail" {...row(0.22)}><span>Time</span><b>10:30 AM</b></motion.div>
        <motion.div className="rw-detail" {...row(0.28)}><span>Status</span><b className="rw-ok">✓ Confirmed</b></motion.div>
      </div>
      <span className="rw-confirm-foot">With love, Roko · @makeupbyroko_</span>
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
.rw--chrome { border-radius: 16px; box-shadow: 0 14px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(226,196,210,0.2); }
.rw-serif { font-family: var(--font-cormorant), 'Cormorant Garamond', Georgia, serif; font-weight: 300; }
.rw-eyebrow { font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--rk-rose-deep); font-weight: 500; }

.rw-bar { display: flex; align-items: center; gap: 0.8rem; flex-shrink: 0; padding: 0.6rem 0.95rem; background: #0f0d0d; border-bottom: 1px solid rgba(255,255,255,0.08); }
.rw-dots { display: flex; gap: 6px; }
.rw-dots i { width: 9px; height: 9px; border-radius: 50%; background: rgba(255,255,255,0.18); display: block; }
.rw-url { margin-left: auto; font-size: 0.72rem; color: rgba(255,255,255,0.62); background: rgba(255,255,255,0.05); border: 1px solid rgba(212,160,176,0.25); border-radius: 100px; padding: 0.2rem 0.9rem; }

.rw-stage { position: relative; flex: 1; min-height: 0; overflow: hidden; background: #080607; }
.rw-scroll { position: absolute; top: 0; left: 0; right: 0; height: 300%; }
.rw-panel { height: 33.3333%; overflow: hidden; position: relative; }

/* Hero — real capture, shown in full everywhere. The screenshot is dark-on-dark,
   so 'contain' letterboxing blends invisibly instead of cropping on phones. */
.rw-hero { background: #080607; }
.rw-hero-img { width: 100%; height: 100%; object-fit: contain; object-position: center; display: block; }

/* About */
.rw-about { background: #fff; display: grid; grid-template-columns: 0.82fr 1.18fr; gap: clamp(0.9rem, 2.4vw, 2rem); align-items: center; padding: clamp(1.1rem, 3.2vw, 2.6rem) clamp(1.1rem, 3.6vw, 3rem); }
.rw-about-photo { height: 80%; border-radius: 12px; overflow: hidden; position: relative; background: radial-gradient(70% 60% at 28% 22%, rgba(212,160,176,0.55), transparent 65%), radial-gradient(60% 60% at 80% 92%, rgba(184,160,212,0.42), transparent 70%), linear-gradient(150deg, #2c2228 0%, #15100f 72%); box-shadow: 0 18px 40px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.05); }
.rw-about-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 22%; display: block; }
.rw-about-text { min-width: 0; }
.rw-about-h { font-size: clamp(1.5rem, 3.4vw, 2.6rem); margin: 0.5rem 0 0; letter-spacing: -0.01em; }
.rw-about-p { font-size: clamp(0.74rem, 1.2vw, 0.95rem); line-height: 1.55; color: var(--rk-muted); margin: 0.7rem 0 0; max-width: 42ch; }
.rw-about-link { display: inline-block; margin-top: 1rem; font-size: 0.66rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--rk-rose-deep); }

/* Services — bridal cards */
.rw-services { background: #fff; padding: clamp(0.9rem, 2.6vw, 1.9rem) clamp(1.1rem, 3.4vw, 2.6rem); display: flex; flex-direction: column; justify-content: center; }
.rw-svc-inner { width: 100%; }
.rw-services-eyebrow { color: var(--rk-rose-deep); }
.rw-services-h { font-size: clamp(1.5rem, 3.4vw, 2.5rem); margin: 0.3rem 0 0; letter-spacing: -0.01em; }
.rw-services-h em { font-style: italic; color: var(--rk-plum-text); }
.rw-tabs { display: flex; gap: clamp(0.7rem, 1.8vw, 1.5rem); margin-top: clamp(0.7rem, 1.6vw, 1.1rem); flex-wrap: wrap; }
.rw-tab { font-size: clamp(0.58rem, 0.95vw, 0.72rem); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rk-faint); padding-bottom: 0.3rem; }
.rw-tab--on { color: var(--rk-ink); border-bottom: 1.5px solid var(--rk-rose-deep); }
.rw-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(0.6rem, 1.5vw, 1.05rem); margin-top: clamp(0.8rem, 2vw, 1.35rem); align-items: start; }
/* Narrow frames: one featured card, full width, with a proper photo. */
.rw-cards--one { grid-template-columns: 1fr; max-width: 440px; }
.rw-cards--one .rw-card-photo { height: clamp(110px, 30vw, 150px); }
.rw-cards--one .rw-card-name { font-size: clamp(1.15rem, 5vw, 1.4rem); }
.rw-cards--one .rw-card-price { font-size: clamp(0.66rem, 2.6vw, 0.8rem); }
.rw-cards--one .rw-card-btn { font-size: clamp(0.64rem, 2.6vw, 0.78rem); padding: 0.6rem 0.5rem; }
.rw-card { display: flex; flex-direction: column; border: 1px solid var(--rk-border-2); border-radius: 13px; background: #fff; overflow: hidden; transition: border-color 0.45s ease, box-shadow 0.45s ease; }
.rw-card--on { border-color: var(--rk-rose); box-shadow: 0 18px 44px rgba(196,132,154,0.3); }
.rw-card-photo { position: relative; height: clamp(64px, 9vw, 108px); overflow: hidden; background: #ede4e7; }
.rw-card-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.rw-card-photos { position: absolute; right: 0.4rem; bottom: 0.4rem; font-size: 0.5rem; letter-spacing: 0.04em; color: #fff; background: rgba(0,0,0,0.42); border-radius: 100px; padding: 0.12rem 0.5rem; }
.rw-card-body { display: flex; flex-direction: column; gap: 0.22rem; padding: clamp(0.6rem, 1.4vw, 0.95rem); }
.rw-card-cat { font-size: 0.5rem; letter-spacing: 0.13em; text-transform: uppercase; color: var(--rk-rose-deep); }
.rw-card-name { font-size: clamp(0.95rem, 1.7vw, 1.35rem); color: var(--rk-ink); line-height: 1.1; }
.rw-card-price { font-size: clamp(0.56rem, 0.95vw, 0.74rem); color: var(--rk-muted); }
.rw-card-price b { color: var(--rk-ink); font-weight: 600; font-size: clamp(0.62rem, 1vw, 0.8rem); }
.rw-card-bullets { display: grid; gap: 0.18rem; margin-top: 0.2rem; }
.rw-card-bullet { display: flex; gap: 0.34rem; align-items: baseline; font-size: clamp(0.55rem, 0.92vw, 0.72rem); color: var(--rk-muted); line-height: 1.3; }
.rw-card-bullet i { color: var(--rk-rose-deep); font-style: normal; font-size: 0.62em; transform: translateY(-1px); }
.rw-card-more { font-size: 0.55rem; color: var(--rk-rose-deep); margin-top: 0.1rem; }
.rw-card-btn { margin-top: 0.5rem; text-align: center; font-size: clamp(0.56rem, 0.92vw, 0.72rem); font-weight: 500; color: #fff; background: var(--rk-ink); border-radius: 100px; padding: 0.5rem 0.4rem; }

/* Booking sheet */
.rw-sheet { position: absolute; inset: 0; z-index: 5; background: #fff; display: flex; flex-direction: column; box-shadow: 0 -20px 60px rgba(0,0,0,0.25); }
.rw-sheet-bar { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; padding: clamp(0.7rem, 1.8vw, 1rem) clamp(1rem, 3vw, 2rem); border-bottom: 1px solid var(--rk-border-2); background: var(--rk-surface-2); }
.rw-sheet-title { font-size: clamp(0.66rem, 1.1vw, 0.86rem); letter-spacing: 0.06em; text-transform: uppercase; color: var(--rk-plum-text); }
.rw-sheet-x { font-size: 1.2rem; color: var(--rk-faint); }
.rw-sheet-body { position: relative; flex: 1; min-height: 0; overflow: hidden; }
.rw-bookfill, .rw-confirmfill { position: absolute; inset: 0; }
.rw-confirmfill { display: flex; align-items: center; justify-content: center; padding: clamp(1rem, 3vw, 2.2rem); }

/* Two-column booking: calendar | form (framer drives the zoom transforms) */
.rw-book {
  width: 100%; height: 100%;
  display: grid; grid-template-columns: 0.94fr 1.06fr; gap: clamp(0.9rem, 2.4vw, 2rem);
  padding: clamp(1rem, 2.8vw, 1.9rem) clamp(1.1rem, 3.2vw, 2.3rem);
  align-items: start;
}
.rw-book-cal, .rw-book-form { min-width: 0; }
.rw-book-form { position: relative; }
.rw-book-form::before { content: ""; position: absolute; left: calc(clamp(0.9rem, 2.4vw, 2rem) / -2); top: 4%; bottom: 4%; width: 1px; background: var(--rk-border-2); }

/* Calendar */
.rw-cal { display: flex; flex-direction: column; }
.rw-cal-head { display: flex; align-items: flex-end; justify-content: space-between; }
.rw-cal-title { font-size: clamp(1.1rem, 2vw, 1.6rem); margin: 0.1rem 0 0; }
.rw-cal-nav { color: var(--rk-faint); letter-spacing: 0.3em; font-size: 0.85rem; }
.rw-week { display: grid; grid-template-columns: repeat(7, 1fr); margin-top: clamp(0.45rem, 1.1vw, 0.7rem); }
.rw-week span { text-align: center; font-size: 0.48rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--rk-faint); padding-bottom: 0.35rem; }
.rw-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.rw-day { height: clamp(26px, 5.4vw, 38px); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; font-size: clamp(0.58rem, 1vw, 0.8rem); border-radius: 6px; color: #8a8a8a; }
.rw-day i { width: 4px; height: 4px; border-radius: 50%; display: block; }
.rw-day--open i { background: #34D399; }
.rw-day--fill { color: #555; } .rw-day--fill i { background: #F0C27A; }
.rw-day--booked { color: #E7B6B6; text-decoration: line-through; }
.rw-day--sel { border-radius: 6px; }
.rw-req { margin-top: clamp(0.6rem, 1.4vw, 0.95rem); padding-top: clamp(0.5rem, 1.1vw, 0.8rem); border-top: 1px solid var(--rk-border-2); display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; }
.rw-req span { font-size: 0.54rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--rk-rose-deep); }
.rw-req b { font-size: clamp(0.92rem, 1.7vw, 1.3rem); color: var(--rk-ink); }

/* Form */
.rw-form { display: flex; flex-direction: column; justify-content: center; height: 100%; }
.rw-form-rows { display: grid; gap: clamp(0.4rem, 1vw, 0.65rem); }
.rw-field { display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; }
.rw-field-label { font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--rk-muted); }
.rw-field-box { display: flex; align-items: center; min-height: 1.7rem; padding: 0.36rem 0.62rem; border: 1px solid var(--rk-border); border-radius: 8px; background: var(--rk-surface); }
.rw-field-val { font-size: clamp(0.62rem, 1vw, 0.82rem); color: var(--rk-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rw-field-caret { width: 1px; height: 0.9em; margin-left: 1px; background: var(--rk-rose-deep); }
.rw-submit { margin-top: clamp(0.7rem, 1.6vw, 1.1rem); width: 100%; padding: 0.62rem; border: none; border-radius: 100px; background: #111; color: #fff; font-size: clamp(0.64rem, 1vw, 0.82rem); font-weight: 500; }
.rw-form-note { margin-top: 0.5rem; text-align: center; font-size: 0.54rem; color: var(--rk-muted); }

/* Confirmation */
.rw-confirm { text-align: center; display: flex; flex-direction: column; align-items: center; }
.rw-confirm-wm { font-size: 0.56rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--rk-rose-deep); }
.rw-confirm-circle { width: clamp(38px, 5vw, 52px); height: clamp(38px, 5vw, 52px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: var(--rk-rose-deep); background: linear-gradient(135deg, #FDF0F5, #F7D8E5); margin: clamp(0.5rem, 1.4vw, 0.9rem) 0 0; }
.rw-confirm-h { font-size: clamp(1.6rem, 3.4vw, 2.6rem); margin: 0.5rem 0 0; }
.rw-confirm-h em { font-style: italic; color: var(--rk-rose-deep); }
.rw-confirm-sub { font-size: clamp(0.7rem, 1.2vw, 0.92rem); color: var(--rk-muted); margin-top: 0.2rem; }
.rw-confirm-card { width: 100%; max-width: 360px; margin: clamp(0.8rem, 2vw, 1.3rem) auto 0; text-align: left; background: var(--rk-surface); border: 1px solid var(--rk-border-2); border-radius: 12px; padding: 0.5rem 1rem; }
.rw-detail { display: flex; justify-content: space-between; gap: 1rem; padding: 0.45rem 0; border-bottom: 1px solid #F5E8EF; }
.rw-detail:last-child { border-bottom: none; }
.rw-detail span { font-size: clamp(0.64rem, 1vw, 0.8rem); color: #999; }
.rw-detail b { font-size: clamp(0.64rem, 1vw, 0.8rem); color: #111; font-weight: 500; }
.rw-detail .rw-ok { color: var(--rk-rose-deep); }
.rw-confirm-foot { margin-top: clamp(0.7rem, 1.6vw, 1.1rem); font-size: 0.66rem; color: var(--rk-faint); }

/* Narrow booking: calendar then form, full-width, cross-fading (no horizontal scale) */
.rw-booknarrow { position: absolute; inset: 0; display: grid; padding: clamp(1rem, 4vw, 1.7rem) clamp(1rem, 4.5vw, 1.8rem); }
.rw-narrow-pane { grid-area: 1 / 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }

/* Cursor */
.rw-cursor { position: absolute; z-index: 8; transform: translate(-4px, -2px); filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35)); pointer-events: none; }
.rw-click { position: absolute; left: 2px; top: 1px; width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid var(--rk-rose-deep); }

@media (max-width: 760px) {
  .rw-about { grid-template-columns: 1fr; }
  .rw-about-photo { display: none; }
  .rw-card-bullets { display: none; }
  .rw-card-photo { height: clamp(56px, 16vw, 84px); }
}
@media (prefers-reduced-motion: reduce) {
  .rw-cursor { display: none; }
}
`;
