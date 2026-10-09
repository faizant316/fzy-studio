"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import IPhone from "./IPhone";

/* Wedded App (in development), recreated in its own design language: iOS 26
   grouped pages, white rounded cards, a floating Liquid Glass tab bar and one
   maroon accent. Copy is lifted from the app's own strings. Designed at
   390 × 844 and scaled by <IPhone>. */

const ease = [0.22, 1, 0.36, 1] as const;
const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

const EVENTS = [
  { name: "Roka", tone: "#F7E3C4", ink: "#8A4B0A" },
  { name: "Mehndi", tone: "#DDEBD5", ink: "#2F5A2A" },
  { name: "Jaago", tone: "#F9DDC2", ink: "#A8500A" },
  { name: "Anand Karaj", tone: "#F5E8EB", ink: "#8A1C30" },
  { name: "Reception", tone: "#E4E2F2", ink: "#3D3A73" },
];

const TYPES = ["Banquet halls", "Caterers", "Dhol players", "Photographers", "Mehndi artists", "DJs"];

const TABS = [
  { label: "Home", d: "M4 10.5 12 4l8 6.5V20h-5v-5.5H9V20H4z" },
  { label: "Search", d: "M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zm5 11.5L20 20" },
  { label: "Reels", d: "M5 5h14v14H5zM10 9.2v5.6l4.6-2.8z" },
  { label: "Saved", d: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" },
  { label: "Profile", d: "M12 12a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2zM5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" },
];

function useCycle(durations: number[], active: boolean) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const key = durations.join(",");
  useEffect(() => {
    if (reduce || !active) { setI(0); return; }
    let idx = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      t = setTimeout(() => { idx = (idx + 1) % durations.length; setI(idx); tick(); }, durations[idx]);
    };
    setI(0);
    tick();
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduce, key]);
  return i;
}

/* Floating Liquid Glass tab bar; the glass lens glides to the active tab. */
function TabBar({ active }: { active: number }) {
  return (
    <div className="wd-tabbar" aria-hidden>
      <motion.span
        className="wd-lens"
        initial={false}
        animate={{ x: active * 66 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      />
      {TABS.map((t, i) => (
        <span key={t.label} className={`wd-tab ${i === active ? "wd-tab--on" : ""}`}>
          <svg width="23" height="23" viewBox="0 0 24 24"><path d={t.d} fill={i === active && i !== 1 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" /></svg>
          {t.label}
        </span>
      ))}
    </div>
  );
}

/* ── Home: every vendor for every event ─────────────────────────────────── */
function HomeView() {
  return (
    <div className="wd-page">
      <div className="wd-home-top">
        <img src="/wedded-ribbon.png" alt="" className="wd-mini-ribbon" />
        <span className="wd-avatar">A</span>
      </div>
      <h4 className="wd-display">Every vendor for every event of your wedding</h4>
      <p className="wd-sub">Roka to reception. Northern California.</p>
      <div className="wd-search">
        <svg width="16" height="16" viewBox="0 0 24 24"><path d={TABS[1].d} fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" /></svg>
        Try &ldquo;dhol&rdquo; or &ldquo;photographer&rdquo;
      </div>
      <div className="wd-sechead"><b>Plan by event</b><span>See all</span></div>
      <div className="wd-events">
        {EVENTS.map((e) => (
          <span key={e.name} className="wd-event" style={{ background: e.tone, color: e.ink }}>
            <i style={{ borderColor: e.ink }} />
            {e.name}
          </span>
        ))}
      </div>
      <div className="wd-sechead"><b>What do you need?</b><span>All types</span></div>
      <div className="wd-types">
        {TYPES.map((t, i) => (
          <span key={t} className={`wd-type ${i === 2 ? "wd-type--hot" : ""}`}>{t}<i>›</i></span>
        ))}
      </div>
    </div>
  );
}

/* ── Vendor profile with the one big action ───────────────────────────────── */
function VendorView({ pressing }: { pressing: boolean }) {
  return (
    <div className="wd-page wd-page--vendor">
      <div className="wd-cover">
        <span className="wd-cover-back">‹</span>
        <div className="wd-grid">
          {Array.from({ length: 6 }).map((_, i) => <i key={i} style={{ opacity: 0.55 + (i % 3) * 0.15 }} />)}
        </div>
      </div>
      <div className="wd-vcard">
        <span className="wd-kind">Banquet hall · Sacramento</span>
        <h4>Venue profile</h4>
        <div className="wd-facts">
          {["Seats 500", "Outside caterers OK", "Full bar", "Ends by 11 PM"].map((f) => <span key={f}>{f}</span>)}
        </div>
        <div className="wd-actions">
          {["Call", "Text", "WhatsApp", "Directions"].map((a) => <span key={a}><i />{a}</span>)}
        </div>
        <p className="wd-price">Prices vary. Ask for a quote.</p>
        <motion.span
          className="wd-ask"
          initial={false}
          animate={{ scale: pressing ? 0.96 : 1 }}
          transition={spring}
        >
          Ask about price &amp; date
        </motion.span>
      </div>
    </div>
  );
}

/* ── The inquiry sheet: event, date, guests, send ─────────────────────────── */
function AskSheet({ sent }: { sent: boolean }) {
  return (
    <motion.div
      className="wd-sheet"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
    >
      <span className="wd-grabber" />
      <h5>Ask about price &amp; date</h5>
      <span className="wd-q">Which event?</span>
      <div className="wd-pills">
        {["Roka", "Mehndi", "Anand Karaj", "Reception"].map((e) => (
          <span key={e} className={e === "Reception" ? "on" : ""}>{e}</span>
        ))}
      </div>
      <span className="wd-q">When is it?</span>
      <div className="wd-field">Sat, May 15, 2027</div>
      <span className="wd-q">About how many guests?</span>
      <div className="wd-pills">
        {["100 to 250", "250 to 500", "500+"].map((e) => (
          <span key={e} className={e === "250 to 500" ? "on" : ""}>{e}</span>
        ))}
      </div>
      <motion.span className="wd-send" initial={false} animate={{ backgroundColor: sent ? "#248A3D" : "#8A1C30" }} transition={{ duration: 0.35 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={sent ? "s" : "n"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
            {sent ? "✓ Sent. They reply to you directly." : "Send"}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </motion.div>
  );
}

/* Phone A: home → vendor → ask, the core loop of the app. */
export function WeddedTourPhone() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { amount: 0.35 });
  // home · vendor · press ask · sheet up · sent
  const step = useCycle([2200, 1300, 450, 1700, 1800], active);
  const view = step === 0 ? "home" : "vendor";
  const sheet = step >= 3;

  return (
    <div ref={ref}>
      <IPhone>
        <div className="wd">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={view}
              className="wd-view"
              initial={{ x: view === "vendor" ? 390 : -120, opacity: view === "vendor" ? 1 : 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: view === "vendor" ? 390 : -120, opacity: 0.6 }}
              transition={{ type: "spring", stiffness: 260, damping: 32 }}
            >
              {view === "home" ? <HomeView /> : <VendorView pressing={step === 2} />}
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {sheet && (
              <motion.div key="dim" className="wd-dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
            )}
          </AnimatePresence>
          <AnimatePresence>{sheet && <AskSheet key="sheet" sent={step === 4} />}</AnimatePresence>
          <motion.div initial={false} animate={{ opacity: sheet ? 0 : 1 }} transition={{ duration: 0.25 }}>
            <TabBar active={0} />
          </motion.div>
        </div>
      </IPhone>
    </div>
  );
}

/* Phone B: My Wedding, the shared family plan with its countdown. */
export function WeddedPlanPhone() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [booked, setBooked] = useState(5);
  useEffect(() => {
    if (!active || reduce) return;
    setBooked(5);
    const t = setInterval(() => setBooked((b) => (b >= 7 ? 5 : b + 1)), 1700);
    return () => clearInterval(t);
  }, [active, reduce]);
  const total = 12;
  const R = 30;
  const C = 2 * Math.PI * R;

  return (
    <div ref={ref}>
      <IPhone>
        <div className="wd">
          <div className="wd-page">
            <h4 className="wd-large">My Wedding</h4>
            <p className="wd-sub" style={{ marginTop: 2 }}>Your date, your events and who&rsquo;s booked</p>
            <div className="wd-count">
              <div>
                <b>218</b>
                <span>days to go</span>
                <small>Sat, May 15, 2027</small>
              </div>
              <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden>
                <circle cx="38" cy="38" r={R} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="6" />
                <motion.circle
                  cx="38" cy="38" r={R} fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={C}
                  initial={false}
                  animate={{ strokeDashoffset: C * (1 - booked / total) }}
                  transition={{ duration: 0.9, ease }}
                  transform="rotate(-90 38 38)"
                />
                <text x="38" y="43" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff">{booked}/{total}</text>
              </svg>
            </div>
            <div className="wd-group">
              <div className="wd-grouphead"><b>Your wedding</b><span>4 events</span></div>
              {EVENTS.filter((e) => e.name !== "Jaago").map((e, i) => (
                <div key={e.name} className="wd-row">
                  <i style={{ background: e.tone, borderColor: e.ink }} />
                  <span>{e.name}</span>
                  <em>{[2, 1, 2, 0][i] + (i === 3 ? booked - 5 : 0)} of 3 booked</em>
                </div>
              ))}
            </div>
            <div className="wd-group">
              <div className="wd-grouphead"><b>Planning together</b><span>Invite</span></div>
              <div className="wd-family">
                {[
                  { n: "You", r: "Owner", c: "#8A1C30" },
                  { n: "Mom", r: "Can edit", c: "#B4335C" },
                  { n: "Simran", r: "Can suggest", c: "#A8500A" },
                ].map((f) => (
                  <span key={f.n}><i style={{ background: f.c }}>{f.n[0]}</i><b>{f.n}</b><small>{f.r}</small></span>
                ))}
              </div>
            </div>
          </div>
          <TabBar active={0} />
        </div>
      </IPhone>
    </div>
  );
}

export const WEDDED_CSS = `
.wd { position: absolute; inset: 0; background: #F2F2F7; color: #000; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--font-inter), system-ui, sans-serif; overflow: hidden; }
.wd-view { position: absolute; inset: 0; }
.wd-page { position: absolute; inset: 0; padding: 62px 18px 0; overflow: hidden; }
.wd-home-top { display: flex; align-items: center; justify-content: space-between; height: 34px; }
.wd-mini-ribbon { height: 30px; width: auto; }
.wd-avatar { width: 32px; height: 32px; border-radius: 50%; background: #F5E8EB; color: #8A1C30; font-weight: 600; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; }
.wd-display { margin-top: 10px; font-family: var(--font-fraunces), Georgia, serif; font-weight: 500; font-size: 29px; line-height: 1.08; letter-spacing: -0.4px; }
.wd-sub { margin-top: 8px; font-size: 14px; color: #6C6C70; }
.wd-search { margin-top: 14px; display: flex; align-items: center; gap: 8px; padding: 11px 14px; border-radius: 13px; background: #fff; color: #8E8E93; font-size: 15px; box-shadow: 0 1px 0 rgba(0,0,0,0.03); }
.wd-sechead { display: flex; justify-content: space-between; align-items: baseline; margin-top: 20px; }
.wd-sechead b { font-size: 19px; font-weight: 700; letter-spacing: -0.3px; }
.wd-sechead span { font-size: 14px; color: #8A1C30; }
.wd-events { display: flex; gap: 9px; margin-top: 10px; width: 600px; }
.wd-event { display: flex; flex-direction: column; justify-content: space-between; width: 104px; height: 112px; padding: 12px; border-radius: 18px; font-size: 15px; font-weight: 600; }
.wd-event i { width: 26px; height: 26px; border-radius: 50%; border: 1.6px solid; opacity: 0.55; display: block; }
.wd-types { margin-top: 10px; background: #fff; border-radius: 16px; overflow: hidden; }
.wd-type { display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; font-size: 15.5px; border-bottom: 0.5px solid #E5E5EA; }
.wd-type:last-child { border-bottom: none; }
.wd-type i { font-style: normal; color: #C7C7CC; font-size: 18px; }
.wd-type--hot { color: #000; }

.wd-page--vendor { padding: 0; background: #F2F2F7; }
.wd-cover { position: relative; height: 300px; background: linear-gradient(160deg, #3B0D17 0%, #8A1C30 55%, #B4335C 100%); padding: 64px 0 0; overflow: hidden; }
.wd-cover-back { position: absolute; z-index: 2; left: 16px; top: 60px; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.28); backdrop-filter: blur(10px); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; }
.wd-grid { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
.wd-grid i { display: block; background: radial-gradient(120% 90% at 30% 20%, rgba(255,236,210,0.55), rgba(255,236,210,0) 60%), linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.25)); }
.wd-vcard { position: relative; margin: -36px 12px 0; padding: 18px 16px; border-radius: 22px; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
.wd-kind { font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: #8A1C30; text-transform: uppercase; }
.wd-vcard h4 { margin-top: 4px; font-size: 25px; font-weight: 700; letter-spacing: -0.4px; }
.wd-facts { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.wd-facts span { font-size: 12.5px; padding: 6px 10px; border-radius: 100px; background: #F2F2F7; color: #3A3A3C; }
.wd-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 14px; }
.wd-actions span { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 10px 0; border-radius: 14px; background: #F5E8EB; color: #8A1C30; font-size: 11.5px; font-weight: 600; }
.wd-actions i { width: 18px; height: 18px; border-radius: 50%; border: 1.8px solid #8A1C30; display: block; }
.wd-price { margin-top: 14px; font-size: 13.5px; color: #6C6C70; }
.wd-ask { display: block; margin-top: 12px; padding: 15px; text-align: center; border-radius: 100px; background: #8A1C30; color: #fff; font-size: 16px; font-weight: 600; box-shadow: 0 10px 22px -12px rgba(138,28,48,0.8); }

.wd-dim { position: absolute; inset: 0; background: rgba(0,0,0,0.28); z-index: 5; }
.wd-sheet { position: absolute; z-index: 6; left: 8px; right: 8px; bottom: 8px; padding: 10px 18px 22px; border-radius: 34px; background: #fff; box-shadow: 0 -10px 40px rgba(0,0,0,0.15); }
.wd-grabber { display: block; width: 36px; height: 5px; border-radius: 3px; background: #D1D1D6; margin: 0 auto 12px; }
.wd-sheet h5 { font-size: 20px; font-weight: 700; letter-spacing: -0.3px; }
.wd-q { display: block; margin-top: 14px; font-size: 13px; font-weight: 600; color: #6C6C70; }
.wd-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 7px; }
.wd-pills span { font-size: 13.5px; padding: 8px 13px; border-radius: 100px; background: #F2F2F7; color: #1C1C1E; }
.wd-pills span.on { background: #8A1C30; color: #fff; }
.wd-field { margin-top: 7px; padding: 11px 13px; border-radius: 12px; background: #F2F2F7; font-size: 15px; }
.wd-send { display: block; margin-top: 18px; padding: 15px; text-align: center; border-radius: 100px; color: #fff; font-size: 15.5px; font-weight: 600; overflow: hidden; }

.wd-tabbar { position: absolute; z-index: 4; left: 20px; right: 20px; bottom: 26px; height: 64px; padding: 0 9px; display: flex; align-items: center; border-radius: 34px;
  background: rgba(255,255,255,0.62); backdrop-filter: blur(18px) saturate(1.6); -webkit-backdrop-filter: blur(18px) saturate(1.6);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.25), inset 0 0.5px 0 rgba(255,255,255,0.9), inset 0 0 0 0.5px rgba(0,0,0,0.06); }
.wd-lens { position: absolute; left: 9px; top: 6px; width: 66px; height: 52px; border-radius: 26px; background: rgba(138,28,48,0.09); box-shadow: inset 0 0.5px 0 rgba(255,255,255,0.8); }
.wd-tab { position: relative; width: 66px; display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 10px; font-weight: 500; color: #3A3A3C; }
.wd-tab--on { color: #8A1C30; }

.wd-large { font-size: 32px; font-weight: 700; letter-spacing: -0.6px; margin-top: 8px; }
.wd-count { margin-top: 16px; display: flex; align-items: center; justify-content: space-between; padding: 18px 18px; border-radius: 22px; color: #fff; background: linear-gradient(135deg, #8A1C30 0%, #B4335C 100%); box-shadow: 0 14px 30px -16px rgba(138,28,48,0.9); }
.wd-count b { display: block; font-family: var(--font-fraunces), Georgia, serif; font-weight: 500; font-size: 44px; line-height: 1; letter-spacing: -1px; }
.wd-count span { display: block; font-size: 14px; opacity: 0.9; margin-top: 2px; }
.wd-count small { display: block; font-size: 12px; opacity: 0.7; margin-top: 8px; }
.wd-group { margin-top: 16px; background: #fff; border-radius: 18px; padding: 4px 0; }
.wd-grouphead { display: flex; justify-content: space-between; align-items: baseline; padding: 12px 16px 6px; }
.wd-grouphead b { font-size: 17px; font-weight: 700; }
.wd-grouphead span { font-size: 13.5px; color: #8A1C30; }
.wd-row { display: grid; grid-template-columns: 28px 1fr auto; align-items: center; gap: 10px; padding: 10px 16px; border-top: 0.5px solid #E5E5EA; font-size: 15px; }
.wd-row i { width: 26px; height: 26px; border-radius: 8px; border: 1.4px solid; display: block; }
.wd-row em { font-style: normal; font-size: 13px; color: #6C6C70; font-variant-numeric: tabular-nums; }
.wd-family { display: flex; gap: 14px; padding: 8px 16px 12px; }
.wd-family span { display: flex; flex-direction: column; align-items: center; gap: 3px; width: 82px; }
.wd-family i { width: 44px; height: 44px; border-radius: 50%; color: #fff; font-style: normal; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; }
.wd-family b { font-size: 13px; font-weight: 600; }
.wd-family small { font-size: 11px; color: #6C6C70; }
`;
