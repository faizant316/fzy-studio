"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import IPhone from "./IPhone";
import {
  BOOKING as B, CAL_BLANKS, CAL_DAYS, CAL_MONTH, FILL_COUNT, OPEN_COUNT, PICK_DAY, dayStatus,
} from "./rokoData";

/* Makeup by Roko, recreated screen by screen inside a real-looking iPhone.
   Every screen mirrors the live product and loops quietly while on screen:
   DMs (before) → pick a date → review & sign → inquiry email → Zelle upload →
   Roko's admin confirms. Designed at 390 × 844 and scaled by <IPhone>. */

const ease = [0.22, 1, 0.36, 1] as const;
const spring = { type: "spring" as const, stiffness: 420, damping: 30 };
const soft = { type: "spring" as const, stiffness: 170, damping: 24 };

/* Steps through `durations` on a loop while `active`; parks on the last
   (finished) frame for reduced motion. */
function useCycle(durations: number[], active: boolean) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const key = durations.join(",");
  useEffect(() => {
    if (reduce) { setI(durations.length - 1); return; }
    if (!active) { setI(0); return; }
    let idx = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      t = setTimeout(() => {
        idx = (idx + 1) % durations.length;
        setI(idx);
        tick();
      }, durations[idx]);
    };
    setI(0);
    tick();
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduce, key]);
  return i;
}

function useActive<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const active = useInView(ref, { amount: 0.35 });
  return [ref, active] as const;
}

/* A soft finger-tap: a ring that blooms and fades, centred on its parent
   (the element being tapped), so it always lands exactly on target. */
function Tap({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          className="rs-tap"
          aria-hidden
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [0.4, 1, 1.5], opacity: [0, 0.5, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease, times: [0, 0.3, 1] }}
        />
      )}
    </AnimatePresence>
  );
}

function SheetHeader({ step }: { step: string }) {
  return (
    <div className="rs-sheethead">
      <span className="rs-roundbtn" aria-hidden>‹</span>
      <div className="rs-sheettitle">
        <b><i>✦</i> {B.service} <i>✦</i></b>
        <span>{step}</span>
      </div>
      <span className="rs-roundbtn" aria-hidden>×</span>
    </div>
  );
}

/* ── 01 · Before: the DM inbox that ran the business ─────────────────────── */

const DM_POOL = [
  { n: "Sarah M.", m: "hiii are you free nov 14??", h: "#E9C9D4" },
  { n: "Jess", m: "how much for bridal?", h: "#D9D0E8" },
  { n: "Priya", m: "when would you start getting me ready?", h: "#EBD7C4" },
  { n: "Alyssa", m: "is there a deposit?", h: "#CFE0DA" },
  { n: "Nadia", m: "can you do my sister too??", h: "#E8D3DC" },
  { n: "Hannah", m: "did you see my message?", h: "#D6DDEA" },
  { n: "Maria K.", m: "where do I send the deposit again?", h: "#EADBCB" },
  { n: "Leena", m: "sent the screenshot, did it come through?", h: "#DCD3E6" },
  { n: "Noura", m: "my venue changed the ready-by time", h: "#E6CFD3" },
  { n: "Danielle", m: "are you booked that weekend?", h: "#D3E2E0" },
];
const DM_TIMES = ["now", "2m", "6m", "14m", "32m", "1h", "2h", "3h"];
const DM_ROWS = 8;

export function DMScreen() {
  const reduce = useReducedMotion();
  const [ref, active] = useActive<HTMLDivElement>();
  const [head, setHead] = useState(0);

  useEffect(() => {
    if (reduce || !active) return;
    const t = setInterval(() => setHead((h) => h + 1), 1500);
    return () => clearInterval(t);
  }, [active, reduce]);

  const rows = Array.from({ length: DM_ROWS }, (_, i) => {
    const idx = head + (DM_ROWS - 1 - i);
    return { ...DM_POOL[idx % DM_POOL.length], key: idx, time: DM_TIMES[i] };
  });

  return (
    <div ref={ref} className="rs rs-dm">
      <div className="rs-dm-head">
        <span className="rs-dm-back" aria-hidden>‹</span>
        <b>makeupbyroko_ <small>⌄</small></b>
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z" fill="none" stroke="#111" strokeWidth="1.7" strokeLinejoin="round" /></svg>
      </div>
      <div className="rs-dm-search">Search</div>
      <div className="rs-dm-notes">
        {["Your note", "jess", "priya", "nadia"].map((n, i) => (
          <span key={n}><i style={{ background: ["#EEE", "#D9D0E8", "#EBD7C4", "#E8D3DC"][i] }} />{n}</span>
        ))}
      </div>
      <div className="rs-dm-label">
        <b>Messages</b>
        <span>Requests ({23 + head})</span>
      </div>
      <div className="rs-dm-list">
        <AnimatePresence initial={false}>
          {rows.map((r, i) => (
            <motion.div
              key={r.key}
              layout="position"
              className="rs-dm-row"
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ ...soft, opacity: { duration: 0.35 } }}
            >
              <i className="rs-dm-av" style={{ background: r.h }}>{r.n[0]}</i>
              <div className="rs-dm-txt">
                <b>{r.n}</b>
                <span><em>{r.m}</em> · {r.time}</span>
              </div>
              <i className={`rs-dm-dot ${i < 6 ? "" : "rs-dm-dot--read"}`} />
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden><path d="M4 8.5h3l1.6-2h6.8l1.6 2h3V18H4z" fill="none" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="12" cy="13" r="3.2" fill="none" stroke="#111" strokeWidth="1.5" /></svg>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── 02 · Step 1 of 3: pick a wedding date (date only, never a time) ───────── */

export function BookDateScreen() {
  const [ref, active] = useActive<HTMLDivElement>();
  // idle → tap 14 → selected, Continue wakes up → press Continue
  const step = useCycle([1300, 650, 1700, 1100], active);
  const picked = step >= 2;
  const days = Array.from({ length: CAL_DAYS }, (_, i) => i + 1);

  return (
    <div ref={ref} className="rs rs-sheet">
      <SheetHeader step="Step 1 of 3 · Wedding date" />
      <div className="rs-body">
        <p className="rs-rule">Bookable at least <b>2 weeks out</b>.</p>
        <p className="rs-note"><i>✦</i> Every bride gets a <b>private consultation</b> about a month before her date.</p>

        <div className="rs-cal-head">
          <span className="rs-cal-arrow" aria-hidden>‹</span>
          <b>{CAL_MONTH} <small>⌄</small></b>
          <span className="rs-cal-arrow" aria-hidden>›</span>
        </div>
        <div className="rs-chips">
          <span className="rs-chip rs-chip--open"><i />{OPEN_COUNT} open</span>
          <span className="rs-chip rs-chip--fill"><i />{FILL_COUNT} filling</span>
          <span className="rs-swipe">Swipe to change month</span>
        </div>
        <div className="rs-week">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((w) => <span key={w}>{w}</span>)}
        </div>
        <div className="rs-days">
          {Array.from({ length: CAL_BLANKS }).map((_, i) => <span key={`b${i}`} />)}
          {days.map((d) => {
            const s = dayStatus(d);
            if (d === PICK_DAY) {
              return (
                <motion.span
                  key={d}
                  className="rs-day rs-day--pick"
                  initial={false}
                  animate={picked
                    ? { backgroundColor: "#111111", color: "#ffffff", scale: 1 }
                    : { backgroundColor: "rgba(17,17,17,0)", color: "#222222", scale: step === 1 ? 0.9 : 1 }}
                  transition={spring}
                >
                  {d}
                  <motion.i initial={false} animate={{ opacity: picked ? 0 : 1 }} className="rs-dot rs-dot--open" />
                  <Tap show={step === 1} />
                </motion.span>
              );
            }
            return (
              <span key={d} className={`rs-day rs-day--${s}`}>
                {d}
                {s !== "plain" && <i className={`rs-dot rs-dot--${s}`} />}
              </span>
            );
          })}
        </div>
        <div className="rs-legend">
          <span><i className="rs-dot rs-dot--open" />Open</span>
          <span><i className="rs-dot rs-dot--fill" />Filling</span>
          <span><i className="rs-dot rs-dot--off" />Unavailable</span>
          <span><i className="rs-sq" />Selected</span>
        </div>
        <p className="rs-cal-foot">Red dates are unavailable. Tap a date again to clear it.</p>

        <motion.div
          className="rs-picked"
          initial={false}
          animate={{ opacity: picked ? 1 : 0, y: picked ? 0 : 8 }}
          transition={{ duration: 0.4, ease }}
        >
          <span>Requested date</span>
          <b>{B.dateLong}</b>
          <em>Roko confirms your exact start time.</em>
        </motion.div>
      </div>

      <div className="rs-bar">
        <div>
          <b>{B.price}</b>
          <span>{B.deposit} deposit</span>
        </div>
        <motion.span
          className="rs-cta"
          initial={false}
          animate={{
            backgroundColor: picked ? "#111111" : "#D9D4D6",
            scale: step === 3 ? 0.96 : 1,
          }}
          transition={spring}
        >
          Continue →
          <Tap show={step === 3} />
        </motion.span>
      </div>
    </div>
  );
}

/* ── 02 · Step 3 of 3: review the agreement and sign in the app ─────────────── */

const SIGN_NAME = B.clientFull;

export function ReviewSignScreen() {
  const reduce = useReducedMotion();
  const [ref, active] = useActive<HTMLDivElement>();
  // read the summary → scroll to the agreement → type the name, tick the box → send
  const step = useCycle([1500, 1100, 2100, 1300], active);
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    if (reduce) { setTyped(SIGN_NAME.length); return; }
    if (step !== 2) { if (step < 2) setTyped(0); return; }
    const timers = Array.from(SIGN_NAME).map((_, i) => setTimeout(() => setTyped(i + 1), 200 + i * 75));
    return () => timers.forEach(clearTimeout);
  }, [step, reduce]);
  const signed = typed >= SIGN_NAME.length;

  return (
    <div ref={ref} className="rs rs-sheet">
      <SheetHeader step="Step 3 of 3 · Review & sign" />
      <div className="rs-viewport">
        <motion.div
          className="rs-body"
          initial={false}
          animate={{ y: step >= 1 ? -262 : 0 }}
          transition={{ duration: 0.95, ease: [0.62, 0, 0.2, 1] }}
        >
          <div className="rs-booking">
            <div>
              <span>You&rsquo;re booking</span>
              <b>{B.service}</b>
            </div>
            <div style={{ textAlign: "right" }}>
              <b>{B.price}</b>
              <span>{B.deposit} deposit</span>
            </div>
          </div>
          <h4 className="rs-h">Review &amp; <em>Sign</em></h4>
          <p className="rs-sub">Please read your service agreement and sign to confirm.</p>
          <div className="rs-rows">
            <div><span>Service</span><b>{B.service}</b></div>
            <div><span>Date</span><b>{B.dateLong}</b></div>
            <div><span>Service price</span><b>{B.price}</b></div>
            <div><span>Deposit to book today</span><b>{B.deposit}</b></div>
            <div className="rs-rows-total"><span>Due on the day</span><b>{B.dueOnDay}</b></div>
            <p>plus any travel fee or add-ons</p>
          </div>
          <div className="rs-agree">
            <span className="rs-agree-label">Service agreement <small>v1</small></span>
            <p>
              This Service Agreement is entered into between Roqia Moshref (&ldquo;Artist,&rdquo; Makeup by Roko)
              and {B.clientFull} (&ldquo;Client&rdquo;) for {B.service} on {B.dateLong}.
            </p>
            <p className="rs-clause"><i>1</i><span><b>Booking &amp; Confirmation.</b> Submitting this form is a booking request, not a confirmed appointment. Your date is only confirmed once the deposit has been received and acknowledged by the Artist.</span></p>
          </div>
          {/* The live site signs by typed name, not a drawn signature. */}
          <div className="rs-sign">
            <span className="rs-agree-label">Type your full name to sign *</span>
            <div className="rs-sign-input">
              <span>{SIGN_NAME.slice(0, typed)}</span>
              {step === 2 && !signed && <i className="rs-caret" aria-hidden />}
              {!typed && step !== 2 && <em>Your full name</em>}
            </div>
            <div className="rs-consent">
              <motion.i
                initial={false}
                animate={{ backgroundColor: signed ? "#111111" : "#ffffff", borderColor: signed ? "#111111" : "#D1D1D6" }}
                transition={{ duration: 0.25, delay: signed ? 0.2 : 0 }}
              >
                {signed && "✓"}
              </motion.i>
              <span>I have read and agree to this Service Agreement, and my typed name is my electronic signature.</span>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="rs-bar rs-bar--solo">
        <motion.span
          className="rs-cta rs-cta--wide"
          initial={false}
          animate={{ backgroundColor: signed ? "#111111" : "#D9D4D6", scale: step === 3 ? 0.97 : 1 }}
          transition={spring}
        >
          Sign &amp; Submit Bridal Inquiry
          <Tap show={step === 3} />
        </motion.span>
      </div>
    </div>
  );
}

/* ── 03 · The inquiry email, with the secure deposit link ──────────────────── */

export function InquiryEmailScreen() {
  const [ref, active] = useActive<HTMLDivElement>();
  const step = useCycle([2600, 900, 900], active);

  return (
    <div ref={ref} className="rs rs-mail">
      <div className="rs-mail-head">
        <b>Makeup by <em>Roko</em></b>
        <span>Sent just now</span>
      </div>
      <div className="rs-mail-hero">
        <span className="rs-kicker">Inquiry received</span>
        <h4>Thanks for booking,<br /><em>{B.client}</em></h4>
      </div>
      <div className="rs-mail-card">
        <span className="rs-kicker">Reserve your date</span>
        <b className="rs-mail-amt">{B.deposit}</b>
        <p>due now to hold {B.dateLong}</p>
        <motion.span
          className="rs-mail-btn"
          initial={false}
          animate={{ scale: step === 1 ? 0.96 : 1 }}
          transition={spring}
        >
          Send Deposit &amp; Upload Photos
          <Tap show={step === 1} />
        </motion.span>
      </div>
      <div className="rs-mail-inq">
        <span className="rs-kicker" style={{ textAlign: "left" }}>Your inquiry</span>
        <div><span>Package</span><b className="rs-rose">{B.service}</b></div>
        <div><span>Wedding date</span><b>{B.dateLong}</b></div>
      </div>
    </div>
  );
}

/* ── 03 · Secure upload: Zelle the deposit, upload the screenshot ──────────── */

export function UploadScreen() {
  const [ref, active] = useActive<HTMLDivElement>();
  // idle → tap the drop zone → uploading → received
  const step = useCycle([1500, 500, 1400, 2400], active);
  const uploading = step === 2;
  const done = step === 3;

  return (
    <div ref={ref} className="rs rs-up">
      <div className="rs-up-top">
        <span className="rs-up-back">‹ Back</span>
        <b>Makeup by Roko</b>
      </div>
      <div className="rs-up-card">
        <span className="rs-up-secure">
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden><rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
          Secure upload
        </span>
        <span className="rs-kicker">Reserve your date</span>
        <b className="rs-up-amt">{B.deposit}</b>
        <p className="rs-up-lead">Send your deposit on Zelle, then upload the screenshot here to lock in your date.</p>
        <div className="rs-up-how">
          <span className="rs-kicker" style={{ textAlign: "left" }}>How to send your deposit</span>
          <ol>
            <li><i>1</i><span>Open <b>Zelle</b> in your banking app and send <b>{B.deposit}</b>.</span></li>
            <li><i>2</i><span>Take a <b>screenshot</b> of the confirmation.</span></li>
            <li><i>3</i><span>Come back and <b>upload your screenshot</b> here.</span></li>
          </ol>
          <div className="rs-up-zelle">
            <div><span>Zelle to</span><b>{B.zelleName}</b></div>
            <div><span>Email</span><b className="rs-masked">{B.zelleMasked}</b><em>Copy</em></div>
          </div>
        </div>
        <div className="rs-up-drop">
          <Tap show={step === 1} />
          <AnimatePresence mode="wait" initial={false}>
            {!uploading && !done && (
              <motion.div key="idle" className="rs-up-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <i>↑</i>
                <b>Upload your Zelle screenshot</b>
                <span>Tap to choose · you can pick more than one</span>
              </motion.div>
            )}
            {uploading && (
              <motion.div key="up" className="rs-up-file" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }}>
                <i className="rs-up-thumb" />
                <div>
                  <b>zelle-confirmation.png</b>
                  <span className="rs-up-track"><motion.i initial={{ width: "8%" }} animate={{ width: "100%" }} transition={{ duration: 1.25, ease: [0.4, 0, 0.2, 1] }} /></span>
                </div>
              </motion.div>
            )}
            {done && (
              <motion.div key="done" className="rs-up-done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease }}>
                <motion.i initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={spring}>✓</motion.i>
                <div>
                  <b>Screenshot received</b>
                  <span>Roko verifies it from her dashboard.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── 04 · Roko's admin: a request lands pending, one tap confirms it ───────── */

export function AdminScreen({ onStep }: { onStep?: (s: number) => void }) {
  const [ref, active] = useActive<HTMLDivElement>();
  // pending → tap Confirm → confirmed + "client notified" toast → hold
  const step = useCycle([1900, 600, 2300, 1300], active);
  const confirmed = step >= 2;
  useEffect(() => { onStep?.(step); }, [step, onStep]);

  return (
    <div ref={ref} className="rs rs-admin">
      <div className="rs-ad-top">
        <b>Roqia Moshref <small>Home</small></b>
        <span className="rs-burger" aria-hidden><i /><i /><i /></span>
      </div>
      <div className="rs-ad-body">
        <h4>Home</h4>
        <p className="rs-ad-hi">Welcome back, <em>Roqia</em></p>

        <div className="rs-ad-status">
          <div className="rs-ad-band">
            {/* Confirmed blue wipes across the pending amber, no muddy midpoint. */}
            <motion.i
              className="rs-ad-wipe"
              aria-hidden
              initial={false}
              animate={{ clipPath: confirmed ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)" }}
              transition={{ duration: confirmed ? 0.6 : 0.35, ease: [0.65, 0, 0.35, 1] }}
            />
            <span aria-hidden>←</span>
            <div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.b
                  key={confirmed ? "c" : "p"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease }}
                >
                  {confirmed ? "Confirmed" : "Pending"}
                </motion.b>
              </AnimatePresence>
              <small>ID: B-AMARA · Booked {B.booked}</small>
            </div>
            <span>Edit</span>
          </div>
          <div className="rs-ad-when">
            <div><span>Start</span><b>{B.start}</b></div>
            <div><span>Date</span><b>{B.dateShort}</b></div>
            <i aria-hidden>›</i>
          </div>
        </div>

        <div className="rs-ad-client">
          <span className="rs-ad-pill">{B.service}</span>
          <div className="rs-ad-who">
            <i>A</i>
            <div><b>{B.clientFull} ›</b><span>{B.phone}</span></div>
          </div>
          <span className="rs-ad-label">Date &amp; time</span>
          <p>{B.dateLong}<br /><span>{B.start}</span></p>
          <span className="rs-ad-label">Deposit</span>
          <p>{B.deposit} · Zelle screenshot received</p>
          <div className="rs-ad-actions">
            <AnimatePresence mode="wait" initial={false}>
              {!confirmed ? (
                <motion.span
                  key="confirm"
                  className="rs-ad-confirm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, scale: step === 1 ? 0.96 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={spring}
                >
                  Confirm &amp; Notify {B.client}
                  <Tap show={step === 1} />
                </motion.span>
              ) : (
                <motion.span
                  key="done"
                  className="rs-ad-done"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease }}
                >
                  ✓ Client notified
                </motion.span>
              )}
            </AnimatePresence>
            <span className="rs-ad-msg">✉ Message client</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* The toast that drops out of the Dynamic Island when Roko confirms. */
export function ConfirmToast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="rs-toast"
          initial={{ opacity: 0, y: -26, scaleX: 0.55, scaleY: 0.7 }}
          animate={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1 }}
          exit={{ opacity: 0, y: -20, scaleX: 0.6, scaleY: 0.75 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          <i />
          Confirmed, client notified
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Admin phone with the island toast wired to the admin loop. */
export function AdminPhone({ onStep }: { onStep?: (s: number) => void }) {
  const [step, setStep] = useState(0);
  return (
    <IPhone island={<ConfirmToast show={step === 2} />}>
      <AdminScreen onStep={(s) => { setStep(s); onStep?.(s); }} />
    </IPhone>
  );
}

export const ROKO_SCREENS_CSS = `
.rs { position: absolute; inset: 0; background: #fff; color: #111; font-family: var(--font-inter), system-ui, sans-serif; overflow: hidden; }
.rs b { font-weight: 600; }
.rs-tap { position: absolute; z-index: 25; left: 50%; top: 50%; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%; background: rgba(17,17,17,0.14); border: 1.5px solid rgba(17,17,17,0.22); pointer-events: none; }
.rs-kicker { display: block; text-align: center; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #C4849A; }
.rs-rose { color: #C4849A !important; }

/* DM inbox */
.rs-dm { padding-top: 58px; }
.rs-dm-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 18px 10px; }
.rs-dm-head b { font-size: 19px; font-weight: 700; letter-spacing: -0.2px; }
.rs-dm-head small { font-size: 13px; }
.rs-dm-back { font-size: 30px; line-height: 1; font-weight: 300; }
.rs-dm-search { margin: 0 16px; padding: 9px 14px; border-radius: 11px; background: #EFEFF0; color: #8E8E93; font-size: 15px; }
.rs-dm-notes { display: flex; gap: 18px; padding: 16px 18px 6px; }
.rs-dm-notes span { display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 11px; color: #8E8E93; }
.rs-dm-notes i { width: 58px; height: 58px; border-radius: 50%; display: block; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05); }
.rs-dm-label { display: flex; justify-content: space-between; align-items: baseline; padding: 12px 18px 6px; }
.rs-dm-label b { font-size: 16px; font-weight: 700; }
.rs-dm-label span { font-size: 14px; color: #3B6FF0; font-weight: 600; font-variant-numeric: tabular-nums; }
.rs-dm-list { position: relative; }
.rs-dm-row { display: grid; grid-template-columns: 54px 1fr 10px 24px; align-items: center; gap: 12px; padding: 8px 18px; }
.rs-dm-av { width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-style: normal; font-size: 18px; font-weight: 600; color: rgba(17,17,17,0.55); }
.rs-dm-txt { min-width: 0; }
.rs-dm-txt b { display: block; font-size: 14.5px; font-weight: 600; }
.rs-dm-txt span { display: block; font-size: 13.5px; color: #111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rs-dm-txt em { font-style: normal; font-weight: 600; }
.rs-dm-dot { width: 9px; height: 9px; border-radius: 50%; background: #3B6FF0; display: block; }
.rs-dm-dot--read { background: transparent; }

/* booking sheet (shared by steps) */
.rs-sheet { display: flex; flex-direction: column; }
.rs-sheethead { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 60px 14px 12px; border-bottom: 1px solid #F1E6EB; background: #fff; position: relative; z-index: 2; }
.rs-roundbtn { width: 32px; height: 32px; border-radius: 50%; background: #F6F2F4; color: #8b7f86; display: inline-flex; align-items: center; justify-content: center; font-size: 18px; }
.rs-sheettitle { text-align: center; display: flex; flex-direction: column; gap: 3px; }
.rs-sheettitle b { font-size: 15.5px; font-weight: 500; }
.rs-sheettitle b i { font-style: normal; color: #D4A0B0; font-size: 9px; vertical-align: 2px; }
.rs-sheettitle span { font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #C4A8B4; }
.rs-viewport { position: relative; flex: 1; min-height: 0; overflow: hidden; }
.rs-body { padding: 14px 18px 0; }
.rs-rule { font-size: 13px; color: #333; line-height: 1.45; }
.rs-note { margin-top: 8px; font-size: 12px; color: #7d7377; line-height: 1.45; }
.rs-note i { font-style: normal; color: #D4A0B0; margin-right: 4px; }
.rs-cal-head { display: flex; align-items: center; justify-content: center; gap: 46px; margin-top: 18px; }
.rs-cal-head b { font-size: 19px; font-weight: 400; letter-spacing: -0.2px; }
.rs-cal-head small { font-size: 11px; color: #999; }
.rs-cal-arrow { color: #B5A99A; font-size: 22px; }
.rs-chips { display: flex; align-items: center; gap: 6px; margin-top: 14px; }
.rs-chip { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 500; padding: 4px 9px; border-radius: 100px; }
.rs-chip i { width: 6px; height: 6px; border-radius: 50%; display: block; }
.rs-chip--open { background: #E7F7EF; color: #1F8A5B; } .rs-chip--open i { background: #34D399; }
.rs-chip--fill { background: #FDF3E3; color: #A86B12; } .rs-chip--fill i { background: #F0C27A; }
.rs-swipe { margin-left: auto; font-size: 10.5px; color: #C9C2C5; }
.rs-week { display: grid; grid-template-columns: repeat(7, 46px); margin: 16px 0 0 16px; }
.rs-week span { text-align: center; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: #9a9396; }
.rs-days { display: grid; grid-template-columns: repeat(7, 46px); grid-auto-rows: 46px; margin: 6px 0 0 16px; }
.rs-day { position: relative; display: flex; align-items: center; justify-content: center; font-size: 15px; color: #222; border-radius: 8px; margin: 2px; }
.rs-day--plain { color: #6f6a6c; }
.rs-day--off { color: #EBA1A1; text-decoration: line-through; }
.rs-day--pick { font-weight: 600; }
.rs-dot { position: absolute; bottom: 5px; left: 50%; width: 5px; height: 5px; margin-left: -2.5px; border-radius: 50%; display: block; }
.rs-legend .rs-dot { position: static; margin: 0; }
.rs-dot--open { background: #34D399; } .rs-dot--fill { background: #F0C27A; } .rs-dot--off { background: #FCA5A5; }
.rs-legend { display: flex; justify-content: center; gap: 14px; margin-top: 12px; }
.rs-legend span { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; color: #8b8386; }
.rs-sq { width: 9px; height: 9px; border-radius: 2px; background: #111; display: block; }
.rs-cal-foot { margin-top: 8px; text-align: center; font-size: 10.5px; color: #a49b9f; }
.rs-picked { margin-top: 14px; border: 1px solid #F0DCE5; border-radius: 14px; padding: 11px 14px; background: linear-gradient(100deg, #FDF6F9, #F8F3FB); }
.rs-picked span { display: block; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #C4849A; font-weight: 600; }
.rs-picked b { display: block; margin-top: 3px; font-size: 16px; font-weight: 500; }
.rs-picked em { display: block; margin-top: 2px; font-style: normal; font-size: 11.5px; color: #8b7f86; }
.rs-bar { position: absolute; left: 0; right: 0; bottom: 0; z-index: 3; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px 30px; background: rgba(255,255,255,0.94); border-top: 1px solid #F1E6EB; backdrop-filter: blur(8px); }
.rs-bar b { display: block; font-size: 19px; font-weight: 600; }
.rs-bar span { font-size: 11px; color: #9a8f94; }
.rs-bar--solo { justify-content: center; }
.rs-cta { position: relative; display: inline-flex; align-items: center; justify-content: center; padding: 13px 26px; border-radius: 100px; color: #fff !important; font-size: 14.5px !important; font-weight: 500; }
.rs-cta--wide { width: 100%; }

/* review & sign */
.rs-booking { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 12px; border-bottom: 1px solid #F3EAEE; }
.rs-booking span { display: block; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #C4849A; font-weight: 600; }
.rs-booking b { display: block; font-size: 16px; font-weight: 500; margin-top: 2px; }
.rs-h { margin-top: 18px; font-size: 25px; font-weight: 400; letter-spacing: -0.3px; }
.rs-h em { font-style: normal; color: #D4A0B0; }
.rs-sub { margin-top: 4px; font-size: 12.5px; color: #9a8f94; line-height: 1.45; }
.rs-rows { margin-top: 14px; border: 1px solid #F1E6EB; border-radius: 14px; overflow: hidden; background: #fff; }
.rs-rows > div { display: flex; justify-content: space-between; gap: 10px; padding: 12px 14px; border-bottom: 1px solid #F5EDF1; font-size: 13px; }
.rs-rows > div span { color: #8b8386; }
.rs-rows > div b { font-weight: 500; }
.rs-rows-total { background: #FBF5F7; }
.rs-rows-total span { color: #111 !important; font-weight: 600; }
.rs-rows-total b { font-weight: 700 !important; font-size: 15px; }
.rs-rows p { background: #FBF5F7; text-align: right; font-size: 10.5px; color: #B0A4AA; padding: 0 14px 10px; margin-top: -4px; }
.rs-agree { margin-top: 14px; border: 1px solid #F1E6EB; border-radius: 14px; padding: 14px; font-size: 12px; line-height: 1.6; color: #444; }
.rs-agree-label { display: flex; justify-content: space-between; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #C4849A; font-weight: 600; margin-bottom: 8px; }
.rs-agree-label small { color: #C9BFC4; letter-spacing: 0.04em; }
.rs-clause { display: flex; gap: 9px; margin-top: 10px; }
.rs-clause i { flex-shrink: 0; width: 18px; height: 18px; border-radius: 50%; background: #F7EEF2; color: #C4849A; font-style: normal; font-size: 10px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; margin-top: 1px; }
.rs-clause b { font-weight: 600; color: #111; }
.rs-sign { margin-top: 14px; border: 1px solid #F1E6EB; border-radius: 14px; padding: 14px 14px 12px; background: #FDFAFB; }
.rs-sign-input { display: flex; align-items: center; min-height: 34px; padding: 6px 0; border-bottom: 1.5px solid #D4A0B0; font-size: 17px; color: #111; }
.rs-sign-input em { font-style: normal; color: #C9C2C5; font-size: 15px; }
.rs-caret { display: inline-block; width: 1.5px; height: 18px; margin-left: 1px; background: #C4849A; }
.rs-consent { display: flex; gap: 9px; align-items: flex-start; margin-top: 12px; font-size: 11.5px; line-height: 1.45; color: #6f666a; }
.rs-consent i { flex-shrink: 0; width: 17px; height: 17px; border-radius: 4px; border: 1.5px solid #D1D1D6; color: #fff; font-style: normal; font-size: 10px; display: inline-flex; align-items: center; justify-content: center; margin-top: 1px; }

/* inquiry email */
.rs-mail { padding-top: 54px; background: #FAF7F8; }
.rs-mail-head { display: flex; align-items: baseline; justify-content: space-between; padding: 16px 20px 14px; background: #fff; border-bottom: 1px solid #F3EAEE; }
.rs-mail-head b { font-size: 18px; font-weight: 500; }
.rs-mail-head em { color: #C4849A; }
.rs-mail-head span { font-size: 11px; color: #A69CA1; }
.rs-mail-hero { text-align: center; padding: 26px 20px 24px; background: #F9EEF3; }
.rs-mail-hero h4 { margin-top: 12px; font-size: 27px; font-weight: 400; line-height: 1.18; letter-spacing: -0.3px; }
.rs-mail-hero em { color: #C4849A; }
.rs-mail-card { margin: 18px 18px 0; padding: 20px 18px; border-radius: 18px; background: #FDF6F9; border: 1px solid #F3DCE6; text-align: center; }
.rs-mail-amt { display: block; margin-top: 8px; font-size: 46px; font-weight: 400 !important; letter-spacing: -1px; }
.rs-mail-card p { font-size: 12.5px; color: #8b7f86; margin-top: 4px; }
.rs-mail-btn { position: relative; display: block; margin-top: 16px; padding: 15px 18px; border-radius: 100px; background: #C88A9E; color: #fff; font-size: 15px; font-weight: 600; box-shadow: 0 10px 24px -12px rgba(196,132,154,0.9); }
.rs-mail-inq { margin: 14px 18px 0; padding: 16px 18px; border-radius: 18px; background: #fff; border: 1px solid #F1E6EB; }
.rs-mail-inq > div { display: flex; justify-content: space-between; gap: 10px; padding: 9px 0; border-bottom: 1px solid #F6EEF2; font-size: 12.5px; }
.rs-mail-inq > div:last-child { border-bottom: none; }
.rs-mail-inq > div span { color: #8b8386; }
.rs-mail-inq > div b { font-weight: 500; text-align: right; }

/* secure upload */
.rs-up { padding-top: 54px; background: #FAF7F8; }
.rs-up-top { display: flex; align-items: center; gap: 70px; padding: 12px 18px; }
.rs-up-back { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #C4849A; border: 1px solid #F0DCE5; border-radius: 100px; padding: 6px 12px; background: #fff; }
.rs-up-top b { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C4849A; font-weight: 600; }
.rs-up-card { margin: 4px 14px 0; padding: 16px; border-radius: 20px; background: #fff; border: 1px solid #F1E6EB; }
.rs-up-secure { display: flex; align-items: center; gap: 6px; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #9a8f94; padding-bottom: 12px; margin-bottom: 14px; border-bottom: 1px solid #F5EDF1; }
.rs-up-amt { display: block; text-align: center; margin-top: 6px; font-size: 40px; font-weight: 400 !important; letter-spacing: -1px; }
.rs-up-lead { text-align: center; font-size: 12.5px; color: #8b7f86; line-height: 1.5; margin-top: 4px; padding: 0 8px; }
.rs-up-how { margin-top: 14px; padding: 14px; border-radius: 14px; border: 1px solid #F1E6EB; }
.rs-up-how ol { list-style: none; margin-top: 10px; display: grid; gap: 9px; }
.rs-up-how li { display: flex; gap: 9px; font-size: 12px; color: #444; line-height: 1.45; }
.rs-up-how li i { flex-shrink: 0; width: 18px; height: 18px; border-radius: 50%; background: #F7EEF2; color: #C4849A; font-style: normal; font-size: 10px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; }
.rs-up-how li b { font-weight: 600; color: #111; }
.rs-up-zelle { margin-top: 12px; padding-top: 10px; border-top: 1px solid #F5EDF1; display: grid; gap: 8px; }
.rs-up-zelle div { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.rs-up-zelle span { width: 62px; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #9a8f94; }
.rs-up-zelle b { font-weight: 600; }
.rs-masked { letter-spacing: 0.04em; color: #6B4055; }
.rs-up-zelle em { margin-left: auto; font-style: normal; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #fff; background: #C88A9E; border-radius: 100px; padding: 4px 10px; }
.rs-up-drop { position: relative; margin-top: 12px; height: 96px; border: 1.5px dashed #EBCFDB; border-radius: 14px; background: #FDFAFB; overflow: hidden; }
.rs-up-drop > div { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.rs-up-idle { flex-direction: column; gap: 3px; text-align: center; }
.rs-up-idle i { font-style: normal; color: #C4849A; font-size: 16px; }
.rs-up-idle b { font-size: 13px; font-weight: 600; }
.rs-up-idle span { font-size: 10.5px; color: #A69CA1; }
.rs-up-file { gap: 12px; padding: 0 16px; justify-content: flex-start !important; }
.rs-up-thumb { width: 44px; height: 58px; border-radius: 7px; background: linear-gradient(160deg, #6D1ED4 0%, #8F4AE8 60%, #EFE6FB 60.5%); box-shadow: 0 4px 10px rgba(0,0,0,0.12); flex-shrink: 0; }
.rs-up-file > div { flex: 1; }
.rs-up-file b { font-size: 12.5px; font-weight: 600; }
.rs-up-track { display: block; margin-top: 8px; height: 5px; border-radius: 5px; background: #F3E6EC; overflow: hidden; }
.rs-up-track i { display: block; height: 100%; border-radius: 5px; background: #C4849A; }
.rs-up-done { gap: 12px; padding: 0 16px; justify-content: flex-start !important; background: #FDF6F9; }
.rs-up-done > i { width: 34px; height: 34px; border-radius: 50%; background: #C4849A; color: #fff; font-style: normal; display: inline-flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
.rs-up-done b { display: block; font-size: 13.5px; font-weight: 600; }
.rs-up-done span { display: block; font-size: 11px; color: #8b7f86; margin-top: 2px; line-height: 1.4; }

/* admin */
.rs-admin { padding-top: 54px; background: #fff; }
.rs-ad-top { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px 14px; border-bottom: 1px solid #F1F1F1; }
.rs-ad-top b { font-size: 16px; font-weight: 400; letter-spacing: 0.16em; text-transform: uppercase; }
.rs-ad-top small { font-size: 9px; letter-spacing: 0.12em; color: #C4849A; background: #FBF1F5; padding: 3px 6px; border-radius: 4px; margin-left: 6px; vertical-align: 2px; }
.rs-burger { display: grid; gap: 4px; } .rs-burger i { width: 20px; height: 1.6px; background: #111; display: block; border-radius: 2px; }
.rs-ad-body { padding: 18px 20px; }
.rs-ad-body h4 { font-size: 30px; font-weight: 600; letter-spacing: -0.5px; }
.rs-ad-hi { font-size: 13px; color: #A69CA1; margin-top: 2px; }
.rs-ad-hi em { font-style: normal; color: #C4849A; }
.rs-ad-status { margin-top: 18px; position: relative; }
.rs-ad-band { position: relative; overflow: hidden; border-radius: 16px; padding: 14px 16px 52px; color: #fff; display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; background: linear-gradient(135deg, #E5850B 0%, #F0A33A 100%); }
.rs-ad-wipe { position: absolute; inset: 0; background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%); }
.rs-ad-band > span { position: relative; font-size: 15px; font-weight: 500; }
.rs-ad-band > div { text-align: center; flex: 1; position: relative; }
.rs-ad-band b { display: block; font-size: 20px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
.rs-ad-band small { display: block; font-size: 10px; opacity: 0.85; margin-top: 3px; }
.rs-ad-when { position: relative; margin: -42px 12px 0; padding: 12px 14px; border-radius: 12px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.1); display: grid; grid-template-columns: 1fr 1.5fr 10px; align-items: center; }
.rs-ad-when div + div { border-left: 1px solid #EEE; padding-left: 12px; }
.rs-ad-when span { display: block; font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9a9a; }
.rs-ad-when b { display: block; margin-top: 4px; font-size: 15px; font-weight: 600; }
.rs-ad-when i { font-style: normal; color: #bbb; }
.rs-ad-client { margin-top: 16px; padding: 16px; border-radius: 16px; border: 1px solid #F0F0F0; }
.rs-ad-pill { display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #C4849A; background: #FBEFF4; border-radius: 100px; padding: 4px 10px; margin-left: 50px; }
.rs-ad-who { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
.rs-ad-who > i { width: 38px; height: 38px; border-radius: 50%; background: #FBEFF4; color: #C4849A; font-style: normal; font-weight: 500; display: inline-flex; align-items: center; justify-content: center; }
.rs-ad-who b { display: block; font-size: 19px; font-weight: 400; }
.rs-ad-who span { font-size: 12px; color: #9a9a9a; }
.rs-ad-label { display: block; margin-top: 14px; font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9a9a; }
.rs-ad-client p { margin-top: 4px; font-size: 13.5px; line-height: 1.4; }
.rs-ad-client p span { color: #8a8a8a; }
.rs-ad-actions { display: flex; align-items: center; gap: 8px; margin-top: 16px; min-height: 38px; }
.rs-ad-confirm { position: relative; white-space: nowrap; padding: 10px 16px; border-radius: 100px; background: #111; color: #fff; font-size: 12.5px; font-weight: 600; }
.rs-ad-done { white-space: nowrap; padding: 10px 14px; border-radius: 100px; background: #EEF3FF; color: #2563EB; font-size: 12px; font-weight: 600; }
.rs-ad-msg { white-space: nowrap; margin-left: auto; padding: 10px 14px; border-radius: 100px; background: #C88A9E; color: #fff; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }

/* island toast */
.rs-toast { position: absolute; z-index: 45; top: 58px; left: 50%; margin-left: -128px; width: 256px; transform-origin: 50% 0; display: flex; align-items: center; gap: 10px; padding: 13px 18px; border-radius: 20px; background: #fff; box-shadow: 0 14px 34px -8px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,0,0,0.04); font-size: 14px; font-weight: 600; color: #111; font-family: var(--font-inter), system-ui, sans-serif; }
.rs-toast i { width: 22px; height: 22px; border-radius: 50%; background: radial-gradient(circle, #2563EB 0 5px, #E6EDFF 5.5px); display: block; flex-shrink: 0; }
`;
