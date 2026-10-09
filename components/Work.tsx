"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import RokoWalkthrough from "./RokoWalkthrough";
import CaseStudy from "./CaseStudy";
import { WeddedPlanPhone, WeddedTourPhone, WEDDED_CSS } from "./WeddedScreens";
import { projects, type Project } from "./projects";

const ease = [0.22, 1, 0.36, 1] as const;

/* The page glitch-dissolves (ombre + dither) between black (the sections above
   and below) and a warm paper interlude, the same off-white as the Makeup by
   Roko LinkedIn carousel, that holds the Selected Work showcase. */
const BLACK = "#0a0a0b";
const PAPER = "#f2f1ed";

export default function Work() {
  return (
    <section id="work" style={{ background: BLACK }}>
      <GlitchBand top={BLACK} bottom={PAPER} seedBase={1} />

      <div
        data-paper
        className="on-paper"
        style={{ padding: "clamp(3rem, 6vw, 5.5rem) clamp(1.25rem, 4vw, 3rem) clamp(3.5rem, 7vw, 6rem)" }}
      >
        <div style={{ maxWidth: 1480, margin: "0 auto", position: "relative" }}>
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.8, ease }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "clamp(2rem, 4vw, 3.25rem)",
            }}
          >
            <div>
              <span className="eyebrow" style={{ color: "var(--gray)" }}>Selected Work</span>
              <h2
                className="display"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", marginTop: "0.9rem", letterSpacing: "-0.035em" }}
              >
                Platforms we&rsquo;ve built
              </h2>
            </div>
            <span className="mono" style={{ fontSize: "0.8rem", color: "var(--gray)", paddingBottom: "0.5rem", letterSpacing: "0.04em" }}>
              {String(projects.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
          </motion.div>

          {projects.map((p, i) => (
            <div key={p.client}>
              <div className="hairline" />
              <Feature p={p} index={i} />
            </div>
          ))}
        </div>
      </div>

      <GlitchBand top={PAPER} bottom={BLACK} seedBase={2} />

      <style dangerouslySetInnerHTML={{ __html: WORK_CSS + WEDDED_CSS }} />
    </section>
  );
}

/* ── One project: name, status, services and CTAs on one side, a big live
   preview on the other. Sides alternate down the list. ── */
function Feature({ p, index }: { p: Project; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yMedia = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const [open, setOpen] = useState(false);

  // Scroll-linked parallax runs on the main thread; on touch devices (esp.
  // in-app browsers) scroll events land late and the card visibly stutters as
  // it catches up. Static media on touch, parallax stays a desktop treat.
  const [touch, setTouch] = useState(false);
  useEffect(() => setTouch(window.matchMedia("(hover: none), (pointer: coarse)").matches), []);
  const flat = reduce || touch;
  const live = p.status === "live";

  return (
    <div ref={ref} className={`work-feature ${index % 2 === 1 ? "work-feature--flip" : ""}`}>
      <motion.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        transition={{ duration: 0.8, ease }}
        className="work-feature__info"
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem 1rem" }}>
          <span className="eyebrow" style={{ color: "var(--gray)" }}>
            {String(index + 1).padStart(2, "0")} · {p.category}
          </span>
          <span className={`work-status ${live ? "work-status--live" : ""}`}>
            {live && <i aria-hidden />}
            {p.statusLabel}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "clamp(1.25rem, 2.6vw, 1.9rem)" }}>
          {p.icon && <img src={p.icon} alt="" className="work-appicon" />}
          <h3 className="display" style={{ fontSize: "clamp(2.1rem, 4vw, 3.4rem)", letterSpacing: "-0.035em" }}>
            {p.client}
          </h3>
        </div>
        <p style={{ marginTop: "1rem", fontSize: "clamp(1.02rem, 1.35vw, 1.15rem)", lineHeight: 1.6, color: "var(--gray)", maxWidth: "40ch" }}>
          {p.summary}
        </p>

        <ul className="work-services">
          {p.services.map((s) => <li key={s}>{s}</li>)}
        </ul>

        {live ? (
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.85rem", marginTop: "clamp(1.6rem, 3vw, 2.2rem)" }}>
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="pill-solid" style={{ textDecoration: "none" }}>
              Visit live site
              <span style={{ fontSize: "0.85rem" }}>↗</span>
            </a>
            {p.detail && (
              <button type="button" onClick={() => setOpen(true)} className="work-outline">
                View details
                <span style={{ fontSize: "0.8rem" }}>↓</span>
              </button>
            )}
          </div>
        ) : (
          <p className="mono" style={{ marginTop: "clamp(1.6rem, 3vw, 2.2rem)", fontSize: "0.78rem", lineHeight: 1.7, color: "var(--gray)", letterSpacing: "0.02em" }}>
            {p.tech.join(" · ")}
          </p>
        )}

        {p.quote && (
          <div style={{ marginTop: "clamp(1.6rem, 3vw, 2.2rem)" }}>
            <p style={{ fontSize: "0.98rem", lineHeight: 1.6, color: "var(--gray)", maxWidth: "36ch" }}>
              &ldquo;{p.quote}&rdquo;
            </p>
            {p.quoteBy && <QuoteBy by={p.quoteBy} />}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        transition={{ duration: 0.9, ease }}
        className="work-feature__media"
      >
        <motion.div style={flat ? { height: "100%" } : { height: "100%", y: yMedia }}>
          {p.client === "Makeup by Roko" ? <RokoMedia p={p} /> : <WeddedMedia />}
        </motion.div>
      </motion.div>

      {p.detail && <CaseStudy p={p} open={open} onClose={() => setOpen(false)} />}
    </div>
  );
}

/* Makeup by Roko: the coded walkthrough of the live site in light browser
   chrome. The whole frame is the live-site link. */
function RokoMedia({ p }: { p: Project }) {
  const host = p.url.replace(/^https?:\/\//, "");
  return (
    <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`${p.client}, open live site`} className="wk-browser">
      <span className="wk-bar" aria-hidden>
        <span className="wk-dots"><i /><i /><i /></span>
        <span className="wk-url">
          <svg width="10" height="10" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2.4" /></svg>
          {host}
        </span>
        <span className="wk-dots wk-dots--ghost"><i /><i /><i /></span>
      </span>
      <span className="wk-screen">
        <span className="wk-walk"><RokoWalkthrough chrome={false} /></span>
        <span className="wk-cta" aria-hidden>Visit live site <span>↗</span></span>
      </span>
    </a>
  );
}

/* Wedded App: two phones on a soft stage, the app tour and the family plan. */
function WeddedMedia() {
  return (
    <div className="wk-stage" role="img" aria-label="Wedded App screens: home, vendor inquiry and the shared family plan">
      <div className="wk-phone wk-phone--a"><WeddedTourPhone /></div>
      <div className="wk-phone wk-phone--b"><WeddedPlanPhone /></div>
    </div>
  );
}

/* Testimonial attribution: a small round photo + name + role, so the quote
   reads as a real person vouching, not anonymous marketing copy. */
export function QuoteBy({ by }: { by: NonNullable<Project["quoteBy"]> }) {
  return (
    <div style={{ marginTop: "0.9rem", display: "flex", alignItems: "center", gap: "0.7rem" }}>
      {by.img && (
        <img
          src={by.img}
          alt={by.name}
          style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", objectPosition: "center 20%", border: "1px solid var(--line-strong)", flexShrink: 0 }}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
        <span style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--ink)" }}>{by.name}</span>
        <span style={{ fontSize: "0.78rem", color: "var(--gray)" }}>{by.role}</span>
      </div>
    </div>
  );
}

const WORK_CSS = `
.work-feature {
  padding: clamp(2.5rem, 5vw, 4.25rem) 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2rem, 5vw, 3rem);
  align-items: center;
}
.work-feature__info { display: flex; flex-direction: column; justify-content: center; min-width: 0; }
.work-feature__media { position: relative; min-width: 0; }
.work-status {
  display: inline-flex; align-items: center; gap: 0.45rem;
  font-family: var(--font-mono), ui-monospace, monospace; font-size: 0.72rem; letter-spacing: 0.04em;
  padding: 0.34rem 0.75rem; border-radius: 100px; background: #fff; color: var(--paper-ink-soft);
  box-shadow: 0 0 0 1px var(--paper-line);
}
.work-status i { width: 6px; height: 6px; border-radius: 50%; background: var(--live); display: block; }
.work-status--live { color: var(--paper-ink); }
.work-appicon { width: clamp(46px, 4.4vw, 58px); height: clamp(46px, 4.4vw, 58px); border-radius: 22.5%; background: #fff; box-shadow: 0 0 0 1px var(--paper-line), 0 10px 22px -14px rgba(20,20,20,0.5); flex-shrink: 0; }
.work-services { list-style: none; margin: clamp(1.4rem, 2.6vw, 1.9rem) 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
.work-services li { font-size: 0.86rem; padding: 0.5rem 0.95rem; border-radius: 100px; background: #fff; color: var(--paper-ink); box-shadow: 0 0 0 1px var(--paper-line); }
.work-outline {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.85rem 1.6rem; border-radius: 100px;
  border: 1px solid var(--line-strong); background: transparent; color: var(--ink);
  font-size: 0.92rem; font-weight: 500; cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
.work-outline:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); }
@media (min-width: 920px) {
  .work-feature { grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.4fr); gap: clamp(2.5rem, 5vw, 5rem); }
  .work-feature--flip { grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.8fr); }
  .work-feature--flip .work-feature__info { order: 2; }
  .work-feature--flip .work-feature__media { order: 1; }
}

/* Light Safari-style frame around the Roko walkthrough */
.wk-browser {
  position: relative; display: flex; flex-direction: column; text-decoration: none;
  height: clamp(380px, 52vw, 640px); height: clamp(380px, 46svh + 12vw, 660px);
  border-radius: 18px; overflow: hidden; background: #fff;
  box-shadow: 0 0 0 1px rgba(20,20,20,0.08), 0 40px 80px -40px rgba(20,20,20,0.45), 0 18px 36px -24px rgba(20,20,20,0.25);
}
.wk-bar { display: flex; align-items: center; gap: 0.8rem; flex-shrink: 0; padding: 0.7rem 1rem; background: #f7f6f3; border-bottom: 1px solid rgba(20,20,20,0.07); }
.wk-dots { display: flex; gap: 7px; }
.wk-dots i { width: 11px; height: 11px; border-radius: 50%; background: #dedcd6; display: block; }
.wk-dots--ghost { visibility: hidden; }
.wk-url { margin: 0 auto; display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.74rem; color: #55544f; background: #fff; border-radius: 8px; padding: 0.3rem 1.4rem; box-shadow: 0 0 0 1px rgba(20,20,20,0.06); }
.wk-screen { position: relative; flex: 1; min-height: 0; overflow: hidden; display: block; }
.wk-walk { position: absolute; inset: 0; display: block; transition: transform 1s cubic-bezier(0.22,1,0.36,1); }
.wk-browser:hover .wk-walk { transform: scale(1.02); }
.wk-cta { position: absolute; left: 50%; bottom: clamp(1rem, 3vw, 1.6rem); transform: translate(-50%, 10px); display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.62rem 1.2rem; border-radius: 100px; background: #141414; color: #f2f1ed; font-size: 0.86rem; font-weight: 500; box-shadow: 0 16px 38px rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.4s ease, transform 0.4s ease; pointer-events: none; z-index: 9; }
.wk-browser:hover .wk-cta { opacity: 1; transform: translate(-50%, 0); }
@media (max-width: 640px) { .wk-browser { height: clamp(440px, 120vw, 600px); } }

/* Soft stage for the Wedded phones, like the carousel's grey panel */
.wk-stage {
  position: relative; display: flex; align-items: center; justify-content: center; gap: clamp(0.9rem, 3vw, 2.6rem);
  padding: clamp(1.75rem, 4vw, 3.25rem) clamp(1rem, 3vw, 2.5rem);
  border-radius: clamp(20px, 2.4vw, 30px);
  background: radial-gradient(70% 60% at 50% 0%, rgba(255,255,255,0.7), rgba(255,255,255,0) 70%), var(--paper-2);
  min-height: clamp(420px, 52vw, 660px);
}
.wk-phone { width: clamp(150px, 19vw, 280px); flex-shrink: 0; }
.wk-phone--a { transform: translateY(-3%); }
.wk-phone--b { transform: translateY(5%); }
@media (max-width: 640px) {
  .wk-stage { min-height: 0; }
  .wk-phone { width: 44vw; max-width: 220px; }
}
@media (prefers-reduced-motion: reduce) {
  .wk-walk, .wk-cta { transition: none; }
  .wk-browser:hover .wk-walk { transform: none; }
}
`;

/* Glitch dissolve, an OMBRE gradient (old color carried into the new) with
   scattered `top`-colored pixels raining over it, thinning out as it descends so
   the glitch bleeds into the next section. Deterministic seeds keep it SSR-stable. ── */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Tile of `color` squares over transparent gaps (so the ombre shows through).
function scatterURL(coverage: number, color: string, seed: number, px = 4, n = 11): string {
  const size = px * n;
  const r = mulberry32(seed);
  let rects = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (r() < coverage) {
        rects += `<rect x='${x * px}' y='${y * px}' width='${px}' height='${px}' fill='${color}'/>`;
      }
    }
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' shape-rendering='crispEdges'>${rects}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function GlitchBand({ top, bottom, seedBase }: { top: string; bottom: string; seedBase: number }) {
  const N = 34;
  const rand = mulberry32(seedBase * 7919 + 13);
  const strips = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    // Eased ramp (exp < 1) keeps `top`-pixels dense longer, so they bleed far
    // down before dissolving. Combined with the ombre this reads as carry-over.
    let cov = Math.pow(1 - t, 0.8);
    cov += (rand() - 0.5) * 0.16;
    cov = Math.max(0, Math.min(1, cov));
    return {
      cov,
      grow: 0.5 + rand() * 1.5,
      offX: Math.floor(rand() * 44),
      tear: rand() < 0.1 && t > 0.12 && t < 0.86,
      seed: seedBase * 131 + i * 17 + 1,
    };
  });

  return (
    <div
      aria-hidden
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        // svh (not vh) so in-app browser chrome hiding/showing mid-scroll
        // can't resize the band and shift the page under the reader.
        height: "clamp(170px, 24svh, 320px)",
        overflow: "hidden",
        // ombre carries the old color smoothly into the new
        background: `linear-gradient(to bottom, ${top} 0%, ${bottom} 100%)`,
      }}
    >
      {strips.map((s, i) =>
        s.tear ? (
          <div
            key={i}
            style={{
              flexGrow: 0.3,
              flexBasis: 0,
              minHeight: 2,
              background: `repeating-linear-gradient(90deg, ${top} 0 ${5 + (i % 4)}px, transparent ${5 + (i % 4)}px ${11 + (i % 5)}px)`,
              transform: `translateX(${s.offX - 22}px)`,
              opacity: 0.9,
            }}
          />
        ) : (
          <div
            key={i}
            style={{
              flexGrow: s.grow,
              flexBasis: 0,
              backgroundImage: scatterURL(s.cov, top, s.seed),
              backgroundSize: "44px 44px",
              backgroundPositionX: `${s.offX}px`,
              imageRendering: "pixelated",
            }}
          />
        )
      )}
    </div>
  );
}
