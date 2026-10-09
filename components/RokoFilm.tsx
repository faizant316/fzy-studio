"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Laptop, { CANVAS_W } from "./Laptop";
import IPhone from "./IPhone";
import { BookDateScreen, InquiryEmailScreen, ReviewSignScreen, UploadScreen, ROKO_SCREENS_CSS } from "./RokoScreens";
import { BOOKING as B, CAL_BLANKS, CAL_DAYS, CAL_MONTH, FILL_COUNT, OPEN_COUNT, PICK_DAY, dayStatus } from "./rokoData";

/* ── The whole Makeup by Roko booking, start to finish, played on a laptop.

   A scripted film of the live site at desktop size (1280 × 800 canvas):
     browse → open the Luxury Bridal sheet → pick a date (date only) → details
     type in → type a name to sign → submit → "you're on the list" → the inquiry
     email lands → secure Zelle upload. Roko confirms the time later, so nothing
     here ever says "confirmed".

   A chapter rail under the laptop shows progress and jumps on click. Narrow
   containers get the same flow on an iPhone instead (the site is mobile-first). */

const ease = [0.22, 1, 0.36, 1] as const;
const glide = [0.62, 0, 0.2, 1] as const;
const press = { type: "spring" as const, stiffness: 520, damping: 26 };
const MENU_H = 26; // macOS menu bar (the notch sits in it)
const BAR_H = 52; // Safari toolbar
const VIEW_H = 800 - MENU_H - BAR_H; // the web page itself
const ABOUT_H = 620;
const SERVICES_Y = VIEW_H + ABOUT_H;

type PhaseName =
  | "hero" | "about" | "services" | "press" | "open" | "pick" | "next1" | "details" | "next2"
  | "sign" | "submit" | "done" | "notify" | "email" | "upload" | "uploading" | "received";

const PHASES: { name: PhaseName; dur: number; ch: number }[] = [
  { name: "hero", dur: 1300, ch: 0 },
  { name: "about", dur: 950, ch: 0 },
  { name: "services", dur: 1350, ch: 0 },
  { name: "press", dur: 550, ch: 0 },
  { name: "open", dur: 850, ch: 1 },
  { name: "pick", dur: 1000, ch: 1 },
  { name: "next1", dur: 850, ch: 1 },
  { name: "details", dur: 2500, ch: 2 },
  { name: "next2", dur: 800, ch: 2 },
  { name: "sign", dur: 2200, ch: 3 },
  { name: "submit", dur: 950, ch: 3 },
  { name: "done", dur: 1900, ch: 3 },
  { name: "notify", dur: 1350, ch: 4 },
  { name: "email", dur: 2100, ch: 4 },
  { name: "upload", dur: 1000, ch: 4 },
  { name: "uploading", dur: 1500, ch: 4 },
  { name: "received", dur: 2000, ch: 4 },
];
const CHAPTERS = ["Browse", "Pick a date", "Details", "Review & sign", "Deposit"];
const idx = (n: PhaseName) => PHASES.findIndex((p) => p.name === n);

const DETAILS = [
  { label: "Bride", value: B.clientFull },
  { label: "Email", value: "amara.reid@example.com" },
  { label: "Phone", value: B.phone },
  { label: "Getting ready", value: "San Jose, CA" },
  { label: "Ready by (your preference)", value: "11:00 AM" },
  { label: "Photographer arrives", value: "10:30 AM" },
];
const DETAIL_TOTAL = DETAILS.reduce((n, f) => n + f.value.length, 0);
const SIGN = B.clientFull;

type FilmState = {
  aim: string | null;
  clicks: number;
  pressed: string | null;
  picked: boolean;
  step: 1 | 2 | 3 | 4;
  detailChars: number;
  signChars: number;
  consent: boolean;
  submitting: boolean;
  notify: boolean;
  mail: boolean;
  upload: "idle" | "uploading" | "done";
};

// What is true at the START of phase i, so the rail can jump anywhere cleanly.
function baseline(i: number, clicks = 0): FilmState {
  const at = (n: PhaseName) => i >= idx(n);
  return {
    aim: null,
    clicks,
    pressed: null,
    picked: at("next1"),
    step: at("done") ? 4 : at("sign") ? 3 : at("details") ? 2 : 1,
    detailChars: at("next2") ? DETAIL_TOTAL : 0,
    signChars: at("submit") ? SIGN.length : 0,
    consent: at("submit"),
    submitting: false,
    // The banner is still up as the email phase starts, so the click lands on it.
    notify: i === idx("email"),
    mail: false,
    upload: at("received") ? "done" : at("uploading") ? "uploading" : "idle",
  };
}

/* ── Desktop film ─────────────────────────────────────────────────────────── */

function DesktopFilm() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const playing = inView && !reduce;
  const [phase, setPhase] = useState(reduce ? idx("done") : 0);
  const [s, setS] = useState<FilmState>(() => baseline(reduce ? idx("done") : 0));
  const name = PHASES[phase].name;

  // Drive the phases + each phase's little script of cursor moves and clicks.
  useEffect(() => {
    if (!playing) return;
    setS((prev) => baseline(phase, prev.clicks));
    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    const patch = (p: Partial<FilmState>) => setS((prev) => ({ ...prev, ...p }));
    const click = (target: string) => {
      setS((prev) => ({ ...prev, clicks: prev.clicks + 1, pressed: target }));
      at(190, () => setS((prev) => (prev.pressed === target ? { ...prev, pressed: null } : prev)));
    };
    const typeInto = (key: "detailChars" | "signChars", total: number, every: number, start: number) => {
      at(start, () => {
        const iv = setInterval(() => {
          setS((prev) => {
            const n = Math.min(total, prev[key] + 1);
            if (n >= total) clearInterval(iv);
            return { ...prev, [key]: n };
          });
        }, every);
        intervals.push(iv);
      });
    };

    switch (name) {
      case "services": at(250, () => patch({ aim: "book" })); break;
      case "press": patch({ aim: "book" }); at(120, () => click("book")); break;
      case "open": at(380, () => patch({ aim: `day${PICK_DAY}` })); break;
      case "pick": patch({ aim: `day${PICK_DAY}` }); at(320, () => { click(`day${PICK_DAY}`); patch({ picked: true }); }); break;
      case "next1": patch({ aim: "next" }); at(480, () => click("next")); at(640, () => patch({ step: 2 })); break;
      case "details": patch({ aim: "@field" }); typeInto("detailChars", DETAIL_TOTAL, 21, 260); break;
      case "next2": patch({ aim: "next" }); at(420, () => click("next")); at(600, () => patch({ step: 3 })); break;
      case "sign":
        patch({ aim: "sign" });
        at(380, () => click("sign"));
        typeInto("signChars", SIGN.length, 72, 480);
        at(1400, () => patch({ aim: "consent" }));
        at(1820, () => { click("consent"); patch({ consent: true }); });
        break;
      case "submit": patch({ aim: "submit" }); at(420, () => { click("submit"); patch({ submitting: true }); }); break;
      case "done": patch({ aim: null }); break;
      case "notify": at(100, () => patch({ notify: true })); at(520, () => patch({ aim: "notif" })); break;
      case "email":
        patch({ aim: "notif" });
        at(80, () => click("notif"));
        at(260, () => patch({ notify: false, mail: true }));
        at(950, () => patch({ aim: "deposit" }));
        break;
      case "upload": patch({ aim: "deposit", mail: true }); at(80, () => click("deposit")); at(300, () => patch({ mail: false })); at(560, () => patch({ aim: "drop" })); break;
      case "uploading": patch({ aim: "drop" }); at(60, () => click("drop")); break;
      case "received": patch({ aim: null }); break;
    }

    const next = setTimeout(() => setPhase((p) => (p + 1) % PHASES.length), PHASES[phase].dur);
    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
      clearTimeout(next);
    };
  }, [phase, playing, name]);

  // While details type, the cursor follows the field being filled.
  let typedField = 0;
  {
    let n = s.detailChars;
    for (let i = 0; i < DETAILS.length; i++) {
      if (n <= DETAILS[i].value.length) { typedField = i; break; }
      n -= DETAILS[i].value.length;
      typedField = Math.min(i + 1, DETAILS.length - 1);
    }
  }
  const aimKey = s.aim === "@field" ? `f${typedField}` : s.aim;

  // Cursor: spring-driven motion values, aimed at real elements measured live.
  const cx = useMotionValue(700);
  const cy = useMotionValue(520);
  const sx = useSpring(cx, { stiffness: 120, damping: 20, mass: 0.8 });
  const sy = useSpring(cy, { stiffness: 120, damping: 20, mass: 0.8 });
  useEffect(() => {
    if (!playing || !aimKey) return;
    let raf = 0;
    const tick = () => {
      const cam = camRef.current;
      const el = cam?.querySelector<HTMLElement>(`[data-t="${aimKey}"]`);
      if (cam && el) {
        const c = cam.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        if (c.width > 0) {
          cx.set(((r.left + r.width / 2 - c.left) / c.width) * CANVAS_W);
          cy.set(((r.top + r.height / 2 - c.top) / c.height) * VIEW_H);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [aimKey, playing, cx, cy]);

  const modalOpen = phase >= idx("open") && phase <= idx("email");
  const onUploadPage = phase >= idx("upload") && !s.mail;
  const scrollY = phase >= idx("services") ? SERVICES_Y : phase === idx("about") ? 580 : 0;
  const camScale = modalOpen ? (phase >= idx("notify") ? 1.02 : 1.05) : onUploadPage ? 1.02 : 1;
  const cursorOn = !reduce && phase >= idx("services");
  const ch = PHASES[phase].ch;

  return (
    <div ref={rootRef} className="rf-wrap">
      <Laptop>
        <div className="rf" role="img" aria-label="Makeup by Roko booking, recreated on a laptop: browse, pick a date, add details, sign, and send the deposit">
          <MenuBar />
          <SafariBar url={onUploadPage ? "makeupbyroko.org/upload-zelle" : "makeupbyroko.org"} />
          <div className="rf-view">
            <motion.div
              ref={camRef}
              className="rf-cam"
              initial={false}
              animate={{ scale: camScale }}
              transition={{ duration: 1.1, ease: glide }}
            >
              {/* The site, scrolling */}
              <motion.div
                className="rf-page"
                initial={false}
                animate={{ y: -scrollY }}
                transition={phase === 0 ? { duration: 0 } : { duration: 1.05, ease: glide }}
              >
                <SiteHero />
                <SiteAbout />
                <SiteServices pressed={s.pressed === "book"} hover={phase >= idx("services") && phase <= idx("press")} />
              </motion.div>

              {/* Booking sheet */}
              <AnimatePresence>
                {modalOpen && (
                  <motion.div key="dim" className="rf-dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {modalOpen && (
                  <motion.div
                    key="modal"
                    className="rf-modal"
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
                    transition={{ type: "spring", stiffness: 210, damping: 26 }}
                  >
                    <BookingModal s={s} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The inquiry email lands */}
              <AnimatePresence>
                {s.notify && (
                  <motion.div
                    key="notif"
                    className="rf-notif"
                    data-t="notif"
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0, scale: s.pressed === "notif" ? 0.97 : 1 }}
                    exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
                    transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  >
                    <i className="rf-notif-icon" aria-hidden>
                      <svg width="22" height="22" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="#fff" /><path d="M4 7l8 6 8-6" fill="none" stroke="#2E7CF6" strokeWidth="1.8" strokeLinejoin="round" /></svg>
                    </i>
                    <div>
                      <div className="rf-notif-top"><b>Makeup by Roko</b><span>now</span></div>
                      <b className="rf-notif-title">Thanks for booking, {B.client}</b>
                      <p>Reserve your date: {B.deposit} due now to hold {B.dateLong}.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {s.mail && (
                  <motion.div
                    key="mail"
                    className="rf-mailwin"
                    initial={{ opacity: 0, scale: 0.94, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.25 } }}
                    transition={{ type: "spring", stiffness: 240, damping: 26 }}
                  >
                    <MailWindow pressed={s.pressed === "deposit"} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Secure Zelle upload page */}
              <AnimatePresence>
                {onUploadPage && (
                  <motion.div
                    key="upload"
                    className="rf-uppage"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <UploadPage state={s.upload} pressed={s.pressed === "drop"} />
                  </motion.div>
                )}
              </AnimatePresence>

              {cursorOn && (
                <motion.div className="rf-cursor" style={{ x: sx, y: sy }} aria-hidden>
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M5.5 3.2v15.6l4.1-3.9 2.6 6 2.7-1.2-2.6-5.9h5.6z" fill="#111" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                  <AnimatePresence>
                    {s.clicks > 0 && (
                      <motion.span
                        key={s.clicks}
                        className="rf-ripple"
                        initial={{ scale: 0.3, opacity: 0.55 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.55, ease }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </Laptop>
      <Rail phase={phase} chapter={ch} onJump={(c) => setPhase(PHASES.findIndex((p) => p.ch === c))} />
    </div>
  );
}

/* Chapter rail: where the film is, and a way to jump to any part of it. */
function Rail({ phase, chapter, onJump }: { phase: number; chapter: number; onJump: (c: number) => void }) {
  const inCh = PHASES.map((p, i) => ({ ...p, i })).filter((p) => p.ch === chapter);
  const total = inCh.reduce((n, p) => n + p.dur, 0);
  const doneMs = inCh.filter((p) => p.i <= phase).reduce((n, p) => n + p.dur, 0);
  const pct = (doneMs / total) * 100;
  return (
    <div className="rf-rail" role="tablist" aria-label="Booking steps">
      {CHAPTERS.map((c, i) => (
        <button
          key={c}
          type="button"
          role="tab"
          aria-selected={i === chapter}
          className={`rf-chip ${i === chapter ? "is-on" : ""} ${i < chapter ? "is-done" : ""}`}
          onClick={() => onJump(i)}
        >
          <span className="rf-chip-bar">
            <i
              style={i === chapter
                ? { width: `${pct}%`, transition: `width ${PHASES[phase].dur}ms linear` }
                : { width: i < chapter ? "100%" : "0%", transition: "none" }}
            />
          </span>
          <span className="rf-chip-label"><em>{String(i + 1).padStart(2, "0")}</em>{c}</span>
        </button>
      ))}
    </div>
  );
}

function MenuBar() {
  return (
    <div className="rf-menubar" aria-hidden>
      <span className="rf-menu-left"><b>Safari</b><span>File</span><span>Edit</span><span>View</span><span>History</span><span>Bookmarks</span><span>Window</span><span>Help</span></span>
      <span className="rf-menu-right">
        <svg width="15" height="11" viewBox="0 0 17 12"><path d="M8.5 2.3c2.4 0 4.6.9 6.3 2.5l1.2-1.2C14 1.6 11.4.6 8.5.6S3 1.6 1 3.6l1.2 1.2C3.9 3.2 6.1 2.3 8.5 2.3zm0 3.4c1.5 0 2.9.6 4 1.6l1.2-1.2C12.3 4.8 10.5 4 8.5 4s-3.8.8-5.2 2.1l1.2 1.2c1.1-1 2.5-1.6 4-1.6zm0 3.4c.6 0 1.2.2 1.6.6L8.5 11.4 6.9 9.7c.4-.4 1-.6 1.6-.6z" fill="#111" /></svg>
        <svg width="22" height="11" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.8" stroke="#111" strokeOpacity="0.4" fill="none" /><rect x="2.2" y="2.2" width="17" height="8.6" rx="2.4" fill="#111" /><path d="M25 4.4v4.2c.8-.3 1.4-1.1 1.4-2.1S25.8 4.7 25 4.4z" fill="#111" fillOpacity="0.45" /></svg>
        <span>Sat 9:41 AM</span>
      </span>
    </div>
  );
}

function SafariBar({ url }: { url: string }) {
  return (
    <div className="rf-safari" aria-hidden>
      <span className="rf-lights"><i /><i /><i /></span>
      <span className="rf-navbtns">‹ ›</span>
      <span className="rf-url">
        <svg width="11" height="11" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2.4" /></svg>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={url} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>{url}</motion.span>
        </AnimatePresence>
      </span>
      <span className="rf-tools"><i /><i /></span>
    </div>
  );
}

/* ── The site ── */

function SiteHero() {
  return (
    <section className="rf-hero">
      <img src="/roko-hero-screenshot.png" alt="" />
    </section>
  );
}

function SiteAbout() {
  return (
    <section className="rf-about">
      <div className="rf-about-photo"><img src="/roko_pic.png" alt="" /></div>
      <div>
        <span className="rf-eyebrow">About</span>
        <h3 className="rf-about-h">Making every woman feel truly <em>stunning</em>.</h3>
        <p>With over 17 years of experience and thousands of faces behind my brush, I&rsquo;ve learned that makeup is never one-size-fits-all.</p>
        <p>My goal has never been to change who you are, but to enhance what already makes you beautiful.</p>
        <span className="rf-about-link">View my work on Instagram →</span>
      </div>
    </section>
  );
}

const CARDS = [
  { cat: "Most Brides", name: "Luxury Bridal Look", best: "Best for the bride on her wedding day", price: "$750", duration: "2 hours", deposit: "$375", img: "/IMG_9883.jpeg", pos: "center 30%", facts: ["Full bridal makeup + lashes", "Long-wear finish"] },
  { cat: "Premium Package", name: "Full Day Service", best: "Best for early starts, far venues, or one extra look or face", price: "$1,700", duration: "Up to 4 hours", deposit: "$850", img: "/IMG_9891.jpeg", pos: "center 26%", facts: ["Bride + any one extra", "Covers starts before 7 AM"] },
  { cat: "Trial Package", name: "Bridal Trial", best: "Best for testing your look 1 to 3 months ahead", price: "$600", duration: "3 hours", deposit: "$300", img: "/IMG_0655.jpeg", pos: "center 24%", facts: ["Full trial look", "Book 1 to 3 months ahead"] },
];

function SiteServices({ pressed, hover }: { pressed: boolean; hover: boolean }) {
  return (
    <section className="rf-services">
      <span className="rf-eyebrow">Services</span>
      <h3 className="rf-services-h">What I <em>Offer</em></h3>
      <p className="rf-services-sub">Each service is tailored to you, from everyday glam to your wedding day. Limited bookings taken each month.</p>
      <div className="rf-tabs">
        {["All Services", "Bridal", "Non-Bridal Makeup", "Photoshoot Makeup", "Makeup Courses"].map((t, i) => (
          <span key={t} className={i === 0 ? "on" : ""}>{t}</span>
        ))}
      </div>
      <div className="rf-cards">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.name}
            className={`rf-card ${i === 0 && hover ? "is-hot" : ""}`}
            initial={false}
            animate={i === 0 ? { y: hover ? -6 : 0, scale: pressed ? 0.98 : 1 } : undefined}
            transition={press}
          >
            <div className="rf-card-photo"><img src={c.img} alt="" style={{ objectPosition: c.pos }} /></div>
            <div className="rf-card-body">
              <span className="rf-card-cat"><i />{c.cat}</span>
              <b className="rf-card-name">{c.name}</b>
              <span className="rf-card-best">{c.best}</span>
              <div className="rf-specs">
                <span><b>{c.price}</b>Price</span>
                <span><b>{c.duration}</b>Duration</span>
                <span><b>{c.deposit}</b>Deposit</span>
              </div>
              <div className="rf-facts">{c.facts.map((f) => <span key={f}><i />{f}</span>)}</div>
              <div className="rf-ctas">
                <span className="rf-details">Details</span>
                <span className="rf-book" data-t={i === 0 ? "book" : undefined}>Book now →</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── The booking sheet (3 steps, then the done screen) ── */

const STEP_LABEL = ["", "Step 1 of 3 · Wedding date", "Step 2 of 3 · Your details", "Step 3 of 3 · Review & sign", "Inquiry received"];

function BookingModal({ s }: { s: FilmState }) {
  return (
    <div className="rf-sheet">
      <div className="rf-sheet-head">
        <span className="rf-round">‹</span>
        <div className="rf-sheet-title">
          <b><i>✦</i> {B.service} <i>✦</i></b>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={s.step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.22 }}>
              {STEP_LABEL[s.step]}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="rf-round">×</span>
      </div>
      <div className="rf-progress">
        {[1, 2, 3].map((n) => (
          <span key={n}><motion.i initial={false} animate={{ scaleX: s.step >= n ? 1 : 0 }} transition={{ duration: 0.5, ease }} /></span>
        ))}
      </div>
      <div className="rf-track-wrap">
        <motion.div className="rf-track" initial={false} animate={{ x: `${-(s.step - 1) * 25}%` }} transition={{ duration: 0.6, ease: glide }}>
          {[<StepDate key="1" s={s} />, <StepDetails key="2" s={s} />, <StepSign key="3" s={s} />, <StepDone key="4" />].map((el, n) => (
            <motion.div
              key={n}
              className="rf-pane"
              initial={false}
              animate={{ opacity: s.step === n + 1 ? 1 : 0 }}
              transition={{ duration: 0.38, ease, delay: s.step === n + 1 ? 0.12 : 0 }}
            >
              {el}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function Foot({ left, note, cta, active, pressed, target, busy }: {
  left?: React.ReactNode; note: string; cta: string; active: boolean; pressed: boolean; target: string; busy?: boolean;
}) {
  return (
    <div className="rf-foot">
      <div className="rf-foot-left">
        {left}
        <span className="rf-foot-note">{note}</span>
      </div>
      <motion.span
        className="rf-cta"
        data-t={target}
        initial={false}
        animate={{ backgroundColor: active ? "#111111" : "#D9D4D6", scale: pressed ? 0.95 : 1 }}
        transition={press}
      >
        {busy ? <i className="rf-spin" aria-hidden /> : cta}
      </motion.span>
    </div>
  );
}

function StepDate({ s }: { s: FilmState }) {
  const days = Array.from({ length: CAL_DAYS }, (_, i) => i + 1);
  return (
    <>
      <div className="rf-pane-body">
        <p className="rf-rule">Bookable at least <b>2 weeks out</b>. <i>✦</i> Every bride gets a <b>private consultation</b> about a month before her date.</p>
        <div className="rf-cal-head">
          <span className="rf-cal-arrow">‹</span>
          <b>{CAL_MONTH} <small>⌄</small></b>
          <span className="rf-cal-arrow">›</span>
        </div>
        <div className="rf-chips">
          <span className="rf-chip-open"><i />{OPEN_COUNT} open</span>
          <span className="rf-chip-fill"><i />{FILL_COUNT} filling</span>
        </div>
        <div className="rf-week">{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((w) => <span key={w}>{w}</span>)}</div>
        <div className="rf-days">
          {Array.from({ length: CAL_BLANKS }).map((_, i) => <span key={`b${i}`} />)}
          {days.map((d) => {
            const st = dayStatus(d);
            if (d === PICK_DAY) {
              return (
                <motion.span
                  key={d}
                  data-t={`day${d}`}
                  className="rf-day rf-day--pick"
                  initial={false}
                  animate={s.picked
                    ? { backgroundColor: "#111111", color: "#ffffff", scale: s.pressed === `day${d}` ? 0.9 : 1 }
                    : { backgroundColor: "rgba(17,17,17,0)", color: "#222222", scale: 1 }}
                  transition={press}
                >
                  {d}
                  {!s.picked && <i className="rf-dot rf-dot--open" />}
                </motion.span>
              );
            }
            return <span key={d} className={`rf-day rf-day--${st}`}>{d}{st !== "plain" && <i className={`rf-dot rf-dot--${st}`} />}</span>;
          })}
        </div>
        <div className="rf-legend">
          <span><i className="rf-dot rf-dot--open" />Open</span>
          <span><i className="rf-dot rf-dot--fill" />Filling</span>
          <span><i className="rf-dot rf-dot--off" />Unavailable</span>
          <span><i className="rf-sq" />Selected</span>
        </div>
        <motion.div className="rf-picked" initial={false} animate={{ opacity: s.picked ? 1 : 0.35 }} transition={{ duration: 0.35 }}>
          <span>Requested date</span>
          <b>{s.picked ? B.dateLong : "Select a date"}</b>
        </motion.div>
      </div>
      <Foot
        left={<b className="rf-foot-price">{B.price} <span>· {B.deposit} deposit</span></b>}
        note="Confirmed within 24–48 hrs · Private consultation 1 month before"
        cta="Continue →"
        active={s.picked}
        pressed={s.pressed === "next" && s.step === 1}
        target={s.step === 1 ? "next" : "next-x"}
      />
    </>
  );
}

function StepDetails({ s }: { s: FilmState }) {
  let left = s.detailChars;
  return (
    <>
      <div className="rf-pane-body">
        <h4 className="rf-step-h">Your <em>details</em></h4>
        <div className="rf-fields">
          {DETAILS.map((f, i) => {
            const shown = Math.max(0, Math.min(f.value.length, left));
            left -= f.value.length;
            const typing = shown > 0 && shown < f.value.length;
            return (
              <div key={f.label} className="rf-field" data-t={`f${i}`}>
                <span>{f.label}</span>
                <div className={`rf-input ${typing ? "is-focus" : ""}`}>
                  {f.value.slice(0, shown)}
                  {typing && <i className="rf-caret" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Foot
        note="Confirmed within 24–48 hrs · Private consultation 1 month before"
        cta="Continue →"
        active={s.detailChars >= DETAIL_TOTAL}
        pressed={s.pressed === "next" && s.step === 2}
        target={s.step === 2 ? "next" : "next-y"}
      />
    </>
  );
}

function StepSign({ s }: { s: FilmState }) {
  const typing = s.signChars > 0 && s.signChars < SIGN.length;
  return (
    <>
      <div className="rf-pane-body">
        <h4 className="rf-step-h">Review &amp; <em>Sign</em></h4>
        <p className="rf-step-sub">Please read your service agreement and sign to confirm.</p>
        <div className="rf-rows">
          <div><span>Date</span><b>{B.dateLong}</b></div>
          <div><span>Service price</span><b>{B.price}</b></div>
          <div><span>Deposit to book today</span><b>{B.deposit}</b></div>
          <div className="rf-rows-total"><span>Due on the day</span><b>{B.dueOnDay}</b></div>
        </div>
        <div className="rf-agree">
          <span className="rf-agree-label">Service agreement <small>v1</small></span>
          <p><b>1 · Booking &amp; Confirmation.</b> Submitting this form is a booking request, not a confirmed appointment. Your date is only confirmed once the deposit has been received and acknowledged by the Artist.</p>
        </div>
        <span className="rf-sign-label">Type your full name to sign *</span>
        <motion.div className={`rf-input rf-sign ${typing || s.pressed === "sign" ? "is-focus" : ""}`} data-t="sign" initial={false}>
          {s.signChars ? SIGN.slice(0, s.signChars) : <em>Your full name</em>}
          {typing && <i className="rf-caret" />}
        </motion.div>
        <div className="rf-consent">
          <motion.i
            data-t="consent"
            initial={false}
            animate={{ backgroundColor: s.consent ? "#111111" : "#ffffff", borderColor: s.consent ? "#111111" : "#D1D1D6", scale: s.pressed === "consent" ? 0.85 : 1 }}
            transition={press}
          >
            {s.consent && "✓"}
          </motion.i>
          <span>I have read and agree to this Service Agreement, and my typed name is my electronic signature.</span>
        </div>
      </div>
      <Foot
        note={`Roko will confirm within 24–48 hours · ${B.deposit} secures your date ✦`}
        cta="Sign & Submit Bridal Inquiry"
        active={s.consent}
        pressed={s.pressed === "submit"}
        target="submit"
        busy={s.submitting}
      />
    </>
  );
}

function StepDone() {
  return (
    <div className="rf-done">
      <motion.span className="rf-done-check" initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 16 }}>✓</motion.span>
      <span className="rf-kicker">Bridal inquiry received</span>
      <h4>Hey {B.client}, you&rsquo;re on <em>the list!</em></h4>
      <p className="rf-done-sub">I can&rsquo;t wait to be part of your big day.</p>
      <div className="rf-done-card">
        <span className="rf-kicker" style={{ textAlign: "left" }}>What&rsquo;s next</span>
        <p>Your bridal inquiry has been received. I&rsquo;ll be in touch within <b>24–48 hours</b> to confirm everything and schedule your consultation.</p>
        <div className="rf-done-mail">
          <i>✉</i>
          <b>Check your email for your secure upload link</b>
        </div>
      </div>
    </div>
  );
}

/* ── The inquiry email in a Mail window ── */

function MailWindow({ pressed }: { pressed: boolean }) {
  return (
    <div className="rf-mail">
      <div className="rf-mail-bar">
        <span className="rf-lights"><i /><i /><i /></span>
        <span className="rf-mail-tools"><i /><i /><i /></span>
      </div>
      <div className="rf-mail-meta">
        <i>R</i>
        <div>
          <b>Makeup by Roko</b>
          <span>To: {B.clientFull}</span>
        </div>
        <em>Today at 9:41 AM</em>
      </div>
      <div className="rf-mail-body">
        <div className="rf-em">
          <div className="rf-em-head"><b>Makeup by <em>Roko</em></b></div>
          <div className="rf-em-hero">
            <span className="rf-kicker">Inquiry received</span>
            <h4>Thanks for booking,<br /><em>{B.client}</em></h4>
          </div>
          <div className="rf-em-card">
            <span className="rf-kicker">Reserve your date</span>
            <b className="rf-em-amt">{B.deposit}</b>
            <p>due now to hold {B.dateLong}</p>
            <motion.span className="rf-em-btn" data-t="deposit" initial={false} animate={{ scale: pressed ? 0.96 : 1 }} transition={press}>
              Send Deposit &amp; Upload Photos
            </motion.span>
          </div>
          <div className="rf-em-inq">
            <span className="rf-kicker" style={{ textAlign: "left" }}>Your inquiry</span>
            <div><span>Package</span><b style={{ color: "#C4849A" }}>{B.service}</b></div>
            <div><span>Wedding date</span><b>{B.dateLong}</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── /upload-zelle ── */

function UploadPage({ state, pressed }: { state: FilmState["upload"]; pressed: boolean }) {
  return (
    <div className="rf-up">
      <div className="rf-up-top">
        <span className="rf-up-back">‹ Back</span>
        <b>Makeup by Roko</b>
        <span />
      </div>
      <div className="rf-up-card">
        <div className="rf-up-left">
          <span className="rf-up-secure">
            <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden><rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
            Secure upload
          </span>
          <span className="rf-kicker" style={{ textAlign: "left" }}>Reserve your date</span>
          <b className="rf-up-amt">{B.deposit}</b>
          <p className="rf-up-lead">Send your deposit on Zelle, then upload the screenshot here to lock in your date.</p>
          <span className="rf-kicker" style={{ textAlign: "left", marginTop: 22 }}>How to send your deposit</span>
          <ol>
            <li><i>1</i><span>Open <b>Zelle</b> in your banking app and send <b>{B.deposit}</b>.</span></li>
            <li><i>2</i><span>Take a <b>screenshot</b> of the confirmation.</span></li>
            <li><i>3</i><span>Come back and <b>upload your screenshot</b> here.</span></li>
          </ol>
        </div>
        <div className="rf-up-right">
          <div className="rf-up-zelle">
            <div><span>Zelle to</span><b>{B.zelleName}</b></div>
            <div><span>Email</span><b className="rf-masked">{B.zelleMasked}</b><em>Copy</em></div>
            <p>Add your <b>name + appointment date</b> in the Zelle memo.</p>
          </div>
          <motion.div className="rf-up-drop" data-t="drop" initial={false} animate={{ scale: pressed ? 0.98 : 1 }} transition={press}>
            <AnimatePresence mode="wait" initial={false}>
              {state === "idle" && (
                <motion.div key="idle" className="rf-up-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <i>↑</i>
                  <b>Upload your Zelle screenshots</b>
                  <span>Tap to choose · you can pick more than one</span>
                </motion.div>
              )}
              {state === "uploading" && (
                <motion.div key="up" className="rf-up-file" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <i className="rf-up-thumb" />
                  <div>
                    <b>zelle-confirmation.png</b>
                    <span className="rf-up-track"><motion.i initial={{ width: "6%" }} animate={{ width: "100%" }} transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1] }} /></span>
                  </div>
                </motion.div>
              )}
              {state === "done" && (
                <motion.div key="done" className="rf-up-done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <motion.i initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 380, damping: 16 }}>✓</motion.i>
                  <div>
                    <b>Screenshot received</b>
                    <span>Roko verifies it from her dashboard.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ── Phone version for narrow screens ─────────────────────────────────────── */

const PHONE_STEPS = [
  { label: "Pick a date", dur: 4800, el: <BookDateScreen /> },
  { label: "Review & sign", dur: 6200, el: <ReviewSignScreen /> },
  { label: "Check email", dur: 4500, el: <InquiryEmailScreen /> },
  { label: "Deposit", dur: 6000, el: <UploadScreen /> },
];

function PhoneFilm() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const t = setTimeout(() => setI((n) => (n + 1) % PHONE_STEPS.length), PHONE_STEPS[i].dur);
    return () => clearTimeout(t);
  }, [i, inView, reduce]);

  return (
    <div ref={ref} className="rf-phonefilm">
      <div className="rf-phone">
        <IPhone>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={i}
              style={{ position: "absolute", inset: 0 }}
              initial={{ x: 390 }}
              animate={{ x: 0 }}
              exit={{ x: -140, opacity: 0.4 }}
              transition={{ type: "spring", stiffness: 240, damping: 32 }}
            >
              {PHONE_STEPS[i].el}
            </motion.div>
          </AnimatePresence>
        </IPhone>
      </div>
      <div className="rf-rail rf-rail--phone" role="tablist" aria-label="Booking steps">
        {PHONE_STEPS.map((p, n) => (
          <button key={p.label} type="button" role="tab" aria-selected={n === i} className={`rf-chip ${n === i ? "is-on" : ""} ${n < i ? "is-done" : ""}`} onClick={() => setI(n)}>
            <span className="rf-chip-bar">
              <i key={n === i ? `on-${i}` : `off-${n}`} className={n === i && !reduce ? "rf-fill-run" : ""} style={{ width: n < i ? "100%" : n === i ? undefined : "0%", animationDuration: `${p.dur}ms` }} />
            </span>
            <span className="rf-chip-label"><em>{String(n + 1).padStart(2, "0")}</em>{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* Picks the laptop or the phone by the space it actually has. */
export default function RokoFilm() {
  const ref = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWide(e.contentRect.width >= 560));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="rf-root">
      {wide ? <DesktopFilm /> : <PhoneFilm />}
      <style dangerouslySetInnerHTML={{ __html: RF_CSS + ROKO_SCREENS_CSS }} />
    </div>
  );
}

const RF_CSS = `
.rf-root { width: 100%; }
.rf-wrap { width: 100%; }
.rf { position: absolute; inset: 0; background: #fff; font-family: var(--font-inter), system-ui, sans-serif; color: #111; overflow: hidden; }
.rf b { font-weight: 600; }
.rf-kicker { display: block; text-align: center; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #C4849A; }

/* Safari */
.rf-menubar { position: relative; z-index: 6; height: ${MENU_H}px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: rgba(236,233,228,0.96); font-size: 13px; color: #111; }
.rf-menu-left { display: inline-flex; gap: 18px; }
.rf-menu-left b { font-weight: 700; }
.rf-menu-right { display: inline-flex; align-items: center; gap: 14px; font-size: 13px; }
.rf-safari { position: relative; z-index: 5; height: ${BAR_H}px; display: flex; align-items: center; gap: 18px; padding: 0 18px; background: #f6f5f3; border-bottom: 1px solid rgba(0,0,0,0.08); }
.rf-lights { display: inline-flex; gap: 8px; }
.rf-lights i { width: 12px; height: 12px; border-radius: 50%; display: block; box-shadow: inset 0 0 0 0.5px rgba(0,0,0,0.12); }
.rf-lights i:nth-child(1) { background: #FF5F57; } .rf-lights i:nth-child(2) { background: #FEBC2E; } .rf-lights i:nth-child(3) { background: #28C840; }
.rf-navbtns { color: #9a9a9a; font-size: 20px; letter-spacing: 10px; }
.rf-url { position: absolute; left: 50%; transform: translateX(-50%); width: 440px; height: 32px; display: inline-flex; align-items: center; justify-content: center; gap: 7px; border-radius: 9px; background: #fff; box-shadow: 0 0 0 1px rgba(0,0,0,0.07); font-size: 13.5px; color: #3a3a3a; }
.rf-url svg { color: #8a8a8a; }
.rf-tools { margin-left: auto; display: inline-flex; gap: 14px; }
.rf-tools i { width: 16px; height: 16px; border-radius: 4px; box-shadow: inset 0 0 0 1.5px #a9a9a9; display: block; }

.rf-view { position: absolute; left: 0; right: 0; top: ${MENU_H + BAR_H}px; height: ${VIEW_H}px; overflow: hidden; background: #080607; }
.rf-cam { position: absolute; inset: 0; transform-origin: 50% 46%; }
.rf-page { position: absolute; left: 0; top: 0; width: ${CANVAS_W}px; }

/* site: hero */
.rf-hero { height: ${VIEW_H}px; background: #080607; overflow: hidden; }
.rf-hero img { width: 100%; height: 100%; object-fit: cover; object-position: left top; display: block; }
/* site: about */
.rf-about { height: ${ABOUT_H}px; background: #fff; display: grid; grid-template-columns: 430px 1fr; gap: 70px; align-items: center; padding: 0 110px; }
.rf-about-photo { height: 500px; border-radius: 16px; overflow: hidden; box-shadow: 0 24px 50px rgba(0,0,0,0.16); }
.rf-about-photo img { width: 100%; height: 100%; object-fit: cover; object-position: center 22%; display: block; }
.rf-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #C4849A; }
.rf-about-h { margin-top: 12px; font-size: 46px; font-weight: 300; line-height: 1.08; letter-spacing: -0.02em; }
.rf-about-h em { font-style: italic; color: #C4849A; }
.rf-about p { margin-top: 18px; font-size: 17px; line-height: 1.6; color: #6E6058; max-width: 52ch; }
.rf-about-link { display: inline-block; margin-top: 22px; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #C4849A; }
/* site: services */
.rf-services { height: ${VIEW_H}px; background: #fff; padding: 46px 96px 0; }
.rf-services-h { margin-top: 8px; font-size: 44px; font-weight: 300; letter-spacing: -0.02em; }
.rf-services-h em { font-style: italic; color: #6B4055; }
.rf-services-sub { margin-top: 8px; font-size: 15px; color: #8a7f79; }
.rf-tabs { display: flex; gap: 26px; margin-top: 18px; }
.rf-tabs span { font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #B5A99A; padding-bottom: 6px; }
.rf-tabs span.on { color: #111; border-bottom: 1.5px solid #C4849A; }
.rf-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 22px; align-items: start; }
.rf-card { border: 1px solid #EDE6DF; border-radius: 16px; overflow: hidden; background: #fff; transition: border-color 0.4s ease, box-shadow 0.4s ease; }
.rf-card.is-hot { border-color: #D4A0B0; box-shadow: 0 22px 50px rgba(196,132,154,0.26); }
.rf-card-photo { height: 150px; overflow: hidden; background: #ede4e7; }
.rf-card-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.rf-card-body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 5px; }
.rf-card-cat { display: inline-flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #C4849A; }
.rf-card-cat i { width: 18px; height: 1px; background: #C4849A; display: block; }
.rf-card-name { font-size: 24px; font-weight: 400 !important; letter-spacing: -0.01em; }
.rf-card-best { font-size: 13px; line-height: 1.4; color: #8a7f79; min-height: 36px; }
.rf-specs { display: grid; grid-template-columns: 1fr 1.3fr 1fr; margin-top: 6px; border-top: 1px solid #f0ebe6; border-bottom: 1px solid #f0ebe6; }
.rf-specs span { display: flex; flex-direction: column; gap: 3px; padding: 9px 4px; font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #a89f99; }
.rf-specs span + span { border-left: 1px solid #f0ebe6; padding-left: 10px; }
.rf-specs b { font-size: 15px; letter-spacing: 0; text-transform: none; color: #111; white-space: nowrap; }
.rf-facts { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.rf-facts span { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 500; color: #8A5468; background: rgba(196,132,154,0.09); border-radius: 100px; padding: 5px 10px; }
.rf-facts i { width: 3px; height: 3px; border-radius: 50%; background: #C4849A; display: block; }
.rf-ctas { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 8px; margin-top: 12px; }
.rf-details, .rf-book { text-align: center; padding: 11px 6px; border-radius: 100px; font-size: 12.5px; font-weight: 600; }
.rf-details { border: 1px solid #e6dfe2; color: #111; font-weight: 500; }
.rf-book { background: #111; color: #fff; letter-spacing: 0.05em; text-transform: uppercase; }

/* booking sheet */
.rf-dim { position: absolute; inset: 0; background: rgba(17,12,14,0.46); }
.rf-modal { position: absolute; left: 50%; top: 30px; width: 660px; margin-left: -330px; height: 662px; }
.rf-sheet { width: 100%; height: 100%; display: flex; flex-direction: column; background: #fff; border-radius: 22px; overflow: hidden; box-shadow: 0 40px 90px -30px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.04); }
.rf-sheet-head { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 16px 18px 12px; }
.rf-round { width: 34px; height: 34px; border-radius: 50%; background: #F6F2F4; color: #8b7f86; display: inline-flex; align-items: center; justify-content: center; font-size: 19px; }
.rf-sheet-title { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.rf-sheet-title b { font-size: 17px; font-weight: 500 !important; }
.rf-sheet-title b i { font-style: normal; color: #D4A0B0; font-size: 10px; vertical-align: 3px; }
.rf-sheet-title span { font-size: 10.5px; letter-spacing: 0.15em; text-transform: uppercase; color: #C4A8B4; }
.rf-progress { flex-shrink: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 0 22px 14px; border-bottom: 1px solid #F3EAEE; }
.rf-progress span { height: 3px; border-radius: 3px; background: #F3E8ED; overflow: hidden; }
.rf-progress i { display: block; height: 100%; background: #C4849A; transform-origin: left; }
.rf-track-wrap { position: relative; flex: 1; min-height: 0; overflow: hidden; }
.rf-track { position: absolute; inset: 0; width: 400%; display: flex; }
.rf-pane { position: relative; width: 25%; height: 100%; display: flex; flex-direction: column; }
.rf-pane-body { flex: 1; min-height: 0; padding: 18px 32px 0; overflow: hidden; }
.rf-foot { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 24px 18px; border-top: 1px solid #F3EAEE; }
.rf-foot-left { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.rf-foot-price { font-size: 19px; }
.rf-foot-price span { font-size: 13px; font-weight: 400; color: #9a8f94; }
.rf-foot-note { font-size: 11.5px; color: #a49b9f; }
.rf-cta { position: relative; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; min-width: 150px; height: 46px; padding: 0 26px; border-radius: 100px; color: #fff; font-size: 14.5px; font-weight: 600; }
.rf-spin { width: 18px; height: 18px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; display: block; animation: rf-spin 0.7s linear infinite; }
@keyframes rf-spin { to { transform: rotate(360deg); } }

/* step 1 */
.rf-rule { font-size: 13px; line-height: 1.5; color: #6f666a; }
.rf-rule b { color: #111; }
.rf-rule i { font-style: normal; color: #D4A0B0; margin: 0 2px 0 4px; }
.rf-cal-head { display: flex; align-items: center; justify-content: center; gap: 60px; margin-top: 14px; }
.rf-cal-head b { font-size: 21px; font-weight: 400 !important; letter-spacing: -0.01em; }
.rf-cal-head small { font-size: 12px; color: #999; }
.rf-cal-arrow { color: #B5A99A; font-size: 22px; }
.rf-chips { display: flex; gap: 6px; margin-top: 8px; }
.rf-chips span { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 500; padding: 4px 10px; border-radius: 100px; }
.rf-chips i { width: 6px; height: 6px; border-radius: 50%; display: block; }
.rf-chip-open { background: #E7F7EF; color: #1F8A5B; } .rf-chip-open i { background: #34D399; }
.rf-chip-fill { background: #FDF3E3; color: #A86B12; } .rf-chip-fill i { background: #F0C27A; }
.rf-week { display: grid; grid-template-columns: repeat(7, 1fr); margin-top: 10px; }
.rf-week span { text-align: center; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: #a39a9e; }
.rf-days { display: grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: 44px; margin-top: 4px; }
.rf-day { position: relative; display: flex; align-items: center; justify-content: center; margin: 2px 14px; border-radius: 10px; font-size: 15px; color: #222; }
.rf-day--plain { color: #8a8486; }
.rf-day--off { color: #EBA1A1; text-decoration: line-through; }
.rf-day--pick { font-weight: 600; }
.rf-dot { position: absolute; bottom: 4px; left: 50%; width: 5px; height: 5px; margin-left: -2.5px; border-radius: 50%; display: block; }
.rf-legend .rf-dot { position: static; margin: 0; }
.rf-dot--open { background: #34D399; } .rf-dot--fill { background: #F0C27A; } .rf-dot--off { background: #FCA5A5; }
.rf-legend { display: flex; justify-content: center; gap: 18px; margin-top: 8px; }
.rf-legend span { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: #8b8386; }
.rf-sq { width: 9px; height: 9px; border-radius: 2px; background: #111; display: block; }
.rf-picked { margin-top: 12px; display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-radius: 14px; border: 1px solid #F0DCE5; background: linear-gradient(100deg, #FDF6F9, #F8F3FB); }
.rf-picked span { font-size: 10.5px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #C4849A; }
.rf-picked b { font-size: 17px; font-weight: 500 !important; }

/* step 2 */
.rf-step-h { font-size: 28px; font-weight: 400; letter-spacing: -0.02em; }
.rf-step-h em { font-style: normal; color: #D4A0B0; }
.rf-step-sub { margin-top: 4px; font-size: 13.5px; color: #9a8f94; }
.rf-fields { margin-top: 22px; display: grid; grid-template-columns: 1fr 1fr; gap: 22px 28px; }
.rf-field span { display: block; font-size: 10.5px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #6E6660; }
.rf-input { display: flex; align-items: center; height: 40px; border-bottom: 1px solid #E5DEE1; font-size: 16px; color: #111; transition: border-color 0.25s ease; }
.rf-input.is-focus { border-bottom-color: #D4A0B0; }
.rf-input em { font-style: normal; color: #C9C2C5; }
.rf-caret { display: inline-block; width: 1.5px; height: 19px; margin-left: 1px; background: #C4849A; animation: rf-blink 1s steps(1) infinite; }
@keyframes rf-blink { 50% { opacity: 0; } }

/* step 3 */
.rf-rows { margin-top: 14px; border: 1px solid #F1E6EB; border-radius: 14px; overflow: hidden; }
.rf-rows > div { display: flex; justify-content: space-between; padding: 8px 16px; border-bottom: 1px solid #F5EDF1; font-size: 13.5px; }
.rf-rows > div:last-child { border-bottom: none; }
.rf-rows span { color: #8b8386; }
.rf-rows b { font-weight: 500 !important; }
.rf-rows-total { background: #FBF5F7; }
.rf-rows-total span { color: #111 !important; font-weight: 600; }
.rf-rows-total b { font-weight: 700 !important; }
.rf-agree { margin-top: 12px; padding: 12px 16px; border-radius: 14px; border: 1px solid #F1E6EB; font-size: 12.5px; line-height: 1.55; color: #555; }
.rf-agree-label { display: flex; justify-content: space-between; font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #C4849A; margin-bottom: 5px; }
.rf-agree-label small { color: #C9BFC4; }
.rf-agree b { color: #111; }
.rf-sign-label { display: block; margin-top: 14px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #6E6660; }
.rf-sign { font-size: 18px; }
.rf-consent { display: flex; gap: 10px; align-items: flex-start; margin-top: 12px; font-size: 12.5px; line-height: 1.45; color: #6f666a; }
.rf-consent i { flex-shrink: 0; width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid #D1D1D6; color: #fff; font-style: normal; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; }

/* done */
.rf-done { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 48px; background: radial-gradient(70% 50% at 50% 0%, #FBEFF4, #fff 70%); }
.rf-done-check { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #FDF0F5, #F7D8E5); color: #C4849A; font-size: 24px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.rf-done h4 { margin-top: 10px; font-size: 34px; font-weight: 300; letter-spacing: -0.02em; line-height: 1.1; }
.rf-done h4 em { font-style: italic; color: #C4849A; }
.rf-done-sub { margin-top: 8px; font-style: italic; color: #A0785A; font-size: 15px; }
.rf-done-card { width: 100%; margin-top: 24px; text-align: left; padding: 18px 20px; border-radius: 16px; border: 1px solid #F1E6EB; background: #fff; }
.rf-done-card p { margin-top: 8px; font-size: 13.5px; line-height: 1.6; color: #6f666a; }
.rf-done-card p b { color: #2C1A14; }
.rf-done-mail { display: flex; align-items: center; gap: 10px; margin-top: 14px; padding: 12px 14px; border-radius: 12px; background: #FDF6F9; }
.rf-done-mail i { font-style: normal; color: #C4849A; font-size: 16px; }
.rf-done-mail b { font-size: 13.5px; color: #2C1A14; }

/* notification */
.rf-notif { position: absolute; z-index: 20; top: 16px; right: 16px; width: 360px; display: flex; gap: 12px; padding: 13px 14px; border-radius: 18px; background: rgba(245,245,247,0.86); backdrop-filter: blur(20px) saturate(1.6); box-shadow: 0 18px 40px -12px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.12); }
.rf-notif-icon { flex-shrink: 0; width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(180deg, #5AC8FA, #2E7CF6); display: flex; align-items: center; justify-content: center; }
.rf-notif-top { display: flex; justify-content: space-between; font-size: 13px; }
.rf-notif-top span { color: #8a8a8e; font-size: 12px; }
.rf-notif-title { display: block; margin-top: 1px; font-size: 13px; }
.rf-notif p { margin-top: 1px; font-size: 12.5px; line-height: 1.35; color: #3a3a3c; }

/* mail window */
.rf-mailwin { position: absolute; z-index: 18; left: 50%; top: 20px; width: 720px; margin-left: -360px; height: 682px; }
.rf-mail { width: 100%; height: 100%; display: flex; flex-direction: column; border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 0 40px 90px -24px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(0,0,0,0.2); }
.rf-mail-bar { flex-shrink: 0; height: 44px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: #f3f3f2; border-bottom: 1px solid rgba(0,0,0,0.07); }
.rf-mail-tools { display: inline-flex; gap: 14px; }
.rf-mail-tools i { width: 16px; height: 14px; border-radius: 3px; box-shadow: inset 0 0 0 1.5px #a9a9a9; display: block; }
.rf-mail-meta { flex-shrink: 0; display: grid; grid-template-columns: 38px 1fr auto; gap: 12px; align-items: center; padding: 14px 22px; border-bottom: 1px solid #eee; }
.rf-mail-meta > i { width: 38px; height: 38px; border-radius: 50%; background: #F7EEF2; color: #C4849A; font-style: normal; font-weight: 600; display: flex; align-items: center; justify-content: center; }
.rf-mail-meta b { display: block; font-size: 14px; }
.rf-mail-meta span { font-size: 12.5px; color: #8a8a8e; }
.rf-mail-meta em { font-style: normal; font-size: 12px; color: #8a8a8e; }
.rf-mail-body { flex: 1; min-height: 0; overflow: hidden; background: #F1EAED; padding: 22px 0; }
.rf-em { width: 520px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", var(--font-inter), Helvetica, Arial, sans-serif; }
.rf-em-head { padding: 0 0 14px; font-size: 19px; color: #16110F; }
.rf-em-head b { font-weight: 400 !important; }
.rf-em-head em { color: #C4849A; }
.rf-em-hero { text-align: center; padding: 22px 20px; border-radius: 16px 16px 0 0; background: #F9EEF3; }
.rf-em-hero h4 { margin-top: 10px; font-size: 30px; font-weight: 400; line-height: 1.16; color: #16110F; }
.rf-em-hero em { color: #C4849A; font-style: italic; }
.rf-em-card { text-align: center; padding: 20px 26px 24px; background: #fff; }
.rf-em-amt { display: block; margin-top: 4px; font-size: 46px; font-weight: 400 !important; color: #16110F; letter-spacing: -1px; }
.rf-em-card p { font-size: 13px; color: #8b7f86; margin-top: 2px; }
.rf-em-btn { position: relative; display: block; margin: 16px auto 0; width: 330px; padding: 15px; border-radius: 100px; background: #C88A9E; color: #fff; font-size: 15px; font-weight: 600; box-shadow: 0 12px 26px -12px rgba(196,132,154,0.9); }
.rf-em-inq { padding: 16px 26px 18px; background: #fff; border-top: 1px solid #F3EAEE; border-radius: 0 0 16px 16px; }
.rf-em-inq > div { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F6EEF2; font-size: 13px; }
.rf-em-inq > div:last-child { border-bottom: none; }
.rf-em-inq span { color: #8b8386; }
.rf-em-inq b { font-weight: 500 !important; }

/* upload page */
.rf-uppage { position: absolute; inset: 0; z-index: 15; background: #FAF7F8; }
.rf-up { height: 100%; display: flex; flex-direction: column; align-items: center; }
.rf-up-top { width: 100%; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 22px 40px; }
.rf-up-back { justify-self: start; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #C4849A; border: 1px solid #F0DCE5; border-radius: 100px; padding: 7px 14px; background: #fff; }
.rf-up-top b { font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase; color: #C4849A; }
.rf-up-card { width: 940px; margin-top: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 34px; padding: 30px 34px; border-radius: 24px; background: #fff; border: 1px solid #F1E6EB; box-shadow: 0 30px 60px -40px rgba(0,0,0,0.25); }
.rf-up-secure { display: flex; align-items: center; gap: 7px; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #9a8f94; padding-bottom: 14px; margin-bottom: 16px; border-bottom: 1px solid #F5EDF1; }
.rf-up-amt { display: block; margin-top: 6px; font-size: 56px; font-weight: 300 !important; letter-spacing: -1.5px; }
.rf-up-lead { font-size: 14px; line-height: 1.55; color: #8b7f86; max-width: 34ch; }
.rf-up-left ol { list-style: none; margin-top: 12px; display: grid; gap: 11px; }
.rf-up-left li { display: flex; gap: 10px; font-size: 13.5px; color: #444; line-height: 1.45; }
.rf-up-left li i { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: #F7EEF2; color: #C4849A; font-style: normal; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; }
.rf-up-left li b { color: #111; }
.rf-up-right { display: flex; flex-direction: column; gap: 16px; }
.rf-up-zelle { padding: 18px; border-radius: 16px; border: 1px solid #F1E6EB; display: grid; gap: 12px; }
.rf-up-zelle div { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.rf-up-zelle span { width: 70px; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #9a8f94; }
.rf-up-zelle em { margin-left: auto; font-style: normal; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: #fff; background: #C88A9E; border-radius: 100px; padding: 5px 12px; }
.rf-up-zelle p { font-size: 12.5px; color: #8b7f86; }
.rf-up-zelle p b { color: #111; }
.rf-masked { color: #6B4055; letter-spacing: 0.04em; }
.rf-up-drop { position: relative; height: 150px; border: 1.5px dashed #EBCFDB; border-radius: 16px; background: #FDFAFB; overflow: hidden; }
.rf-up-drop > div { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.rf-up-idle { flex-direction: column; gap: 4px; text-align: center; }
.rf-up-idle i { font-style: normal; color: #C4849A; font-size: 20px; }
.rf-up-idle b { font-size: 14.5px; }
.rf-up-idle span { font-size: 12px; color: #A69CA1; }
.rf-up-file { gap: 14px; padding: 0 22px; justify-content: flex-start !important; }
.rf-up-thumb { width: 56px; height: 74px; border-radius: 8px; background: linear-gradient(160deg, #6D1ED4 0%, #8F4AE8 58%, #EFE6FB 58.5%); box-shadow: 0 6px 14px rgba(0,0,0,0.14); flex-shrink: 0; }
.rf-up-file > div { flex: 1; }
.rf-up-file b { font-size: 14px; }
.rf-up-track { display: block; margin-top: 10px; height: 6px; border-radius: 6px; background: #F3E6EC; overflow: hidden; }
.rf-up-track i { display: block; height: 100%; border-radius: 6px; background: #C4849A; }
.rf-up-done { gap: 14px; padding: 0 22px; justify-content: flex-start !important; background: #FDF6F9; }
.rf-up-done > i { width: 44px; height: 44px; border-radius: 50%; background: #C4849A; color: #fff; font-style: normal; font-size: 19px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.rf-up-done b { display: block; font-size: 15px; }
.rf-up-done span { display: block; margin-top: 2px; font-size: 12.5px; color: #8b7f86; }

/* cursor */
.rf-cursor { position: absolute; z-index: 40; left: -5px; top: -3px; pointer-events: none; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35)); }
.rf-ripple { position: absolute; left: -7.5px; top: -9.8px; width: 26px; height: 26px; border-radius: 50%; background: rgba(196,132,154,0.25); border: 1.5px solid #C4849A; }

/* chapter rail (outside the laptop) */
.rf-rail { display: grid; grid-template-columns: repeat(5, 1fr); gap: clamp(0.4rem, 1vw, 0.75rem); margin: clamp(1rem, 2.2vw, 1.6rem) auto 0; width: 84%; }
.rf-rail--phone { grid-template-columns: repeat(4, 1fr); width: 100%; max-width: 420px; }
.rf-chip { appearance: none; border: none; background: none; padding: 0; text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 0.55rem; color: var(--paper-faint, #8c8b86); transition: color 0.3s ease; }
.rf-chip:hover, .rf-chip.is-on { color: var(--paper-ink, #141414); }
.rf-chip.is-done { color: var(--paper-ink-soft, #3b3b38); }
.rf-chip-bar { display: block; height: 2px; border-radius: 2px; background: var(--paper-line-strong, rgba(20,20,20,0.2)); overflow: hidden; }
.rf-chip-bar i { display: block; height: 100%; width: 0; background: var(--paper-ink, #141414); }
.rf-fill-run { animation: rf-fill linear forwards; }
@keyframes rf-fill { from { width: 0; } to { width: 100%; } }
.rf-chip-label { display: flex; align-items: baseline; gap: 0.45rem; font-size: clamp(0.7rem, 1vw, 0.84rem); line-height: 1.3; }
.rf-chip-label em { font-style: normal; font-family: var(--font-mono), ui-monospace, monospace; font-size: 0.68rem; color: var(--paper-faint, #8c8b86); }
.rf-phonefilm { display: flex; flex-direction: column; align-items: center; }
.rf-phone { width: min(62vw, 280px); }
@media (max-width: 720px) { .rf-chip-label em { display: none; } }
@media (prefers-reduced-motion: reduce) { .rf-caret, .rf-spin { animation: none; } }
`;
