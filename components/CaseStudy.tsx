"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import { lenisScrollTo, lenisStart, lenisStop } from "./lenis";
import RokoFilm from "./RokoFilm";
import IPhone from "./IPhone";
import {
  AdminPhone, BookDateScreen, DMScreen, InquiryEmailScreen, ReviewSignScreen, UploadScreen, ROKO_SCREENS_CSS,
} from "./RokoScreens";
import { BOOKING as B } from "./rokoData";
import { QuoteBy } from "./Work";
import type { Project } from "./projects";

const ease = [0.22, 1, 0.36, 1] as const;

// Mirrors the site nav so the case study keeps the real header.
const NAV_LINKS = [
  { label: "Work", id: "work" },
  { label: "Process", id: "process" },
  { label: "Studio", id: "studio" },
  { label: "Get a Quote", id: "contact" },
];

const SECTIONS = ["The problem", "Booking", "Deposits", "Admin dashboard", "Automation"];

/* Full case study: portals to <body> (above the nav), slides up, and scrolls
   with its own Lenis instance. Set on the same warm paper as the LinkedIn
   carousel, with the product itself shown in realistic iPhones. */
export default function CaseStudy({ p, open, onClose }: { p: Project; open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const csLenis = useRef<Lenis | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    lenisStop(); // freeze the page behind the overlay
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Its own momentum scroll so it feels like the rest of the site.
    // Desktop-only, matching the page: on touch, native scroll is smoother.
    let raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const wrap = wrapRef.current;
    const content = wrap?.firstElementChild as HTMLElement | undefined;
    if (!reduce && !touch && wrap && content) {
      const lenis = new Lenis({
        wrapper: wrap,
        content,
        duration: 1.25,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      csLenis.current = lenis;
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      lenisStart();
      window.removeEventListener("keydown", onKey);
      if (raf) cancelAnimationFrame(raf);
      csLenis.current?.destroy();
      csLenis.current = null;
    };
  }, [open, onClose]);

  const d = p.detail;
  if (!mounted || !d) return null;

  const scrollToSec = (i: number) => {
    const el = document.getElementById(`cs-sec-${i}`);
    if (!el) return;
    if (csLenis.current) csLenis.current.scrollTo(el, { offset: -90 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const metaPrimary = [
    { label: "Client", values: [p.client] },
    { label: "Year", values: [p.year] },
    { label: "Project type", values: d.projectType },
  ];
  const metaSecondary = [
    { label: "Role", values: p.services },
    { label: "Tech", values: p.tech },
  ];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.65, ease }}
          className="on-paper"
          style={{ position: "fixed", inset: 0, zIndex: 200 }}
        >
          <div
            ref={wrapRef}
            className="no-scrollbar"
            style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden", overscrollBehavior: "contain", background: "var(--paper)" }}
          >
            <div>
              {/* Top bar: keeps the real site header, with a clean way back */}
              <div className="cs-top">
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", minWidth: 0 }}>
                  <button type="button" onClick={onClose} className="cs-back" aria-label="Back to site">
                    <svg width="17" height="17" viewBox="0 0 16 16" fill="none"><path d="M10 3l-5 5 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => { onClose(); setTimeout(() => lenisScrollTo(0), 80); }}
                    aria-label="FZY home"
                    className="cs-brand"
                  >
                    FZY
                  </button>
                  <span className="cs-crumb mono">/ Work / {p.client}</span>
                </div>
                <div className="cs-nav-links">
                  {NAV_LINKS.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => { onClose(); setTimeout(() => lenisScrollTo("#" + l.id), 80); }}
                      className="link-line cs-navlink"
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cs-wrap">
                {/* Title */}
                <div className="cs-title">
                  <div>
                    <span className="eyebrow" style={{ color: "var(--gray)" }}>{p.category} · {p.year}</span>
                    <h2 className="display" style={{ fontSize: "clamp(2.6rem, 7.5vw, 6rem)", letterSpacing: "-0.045em", marginTop: "0.8rem" }}>
                      {p.client}
                    </h2>
                    <p style={{ marginTop: "1.1rem", fontSize: "clamp(1.1rem, 1.7vw, 1.45rem)", lineHeight: 1.5, color: "var(--gray)", maxWidth: "36ch" }}>
                      {d.lead}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
                    <span className="cs-chip"><i />Live since July 2026</span>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="pill-solid" style={{ textDecoration: "none" }}>
                      Visit live site
                      <span style={{ fontSize: "0.85rem" }}>↗</span>
                    </a>
                  </div>
                </div>

                {/* A peek into the real product */}
                <Reveal style={{ marginTop: "clamp(2.5rem, 5vw, 4rem)" }}>
                  <RokoPreview />
                </Reveal>

                {/* Meta on the left, description + tags on the right */}
                <div className="cs-hero">
                  <div className="cs-meta">
                    <div style={{ display: "grid", gap: "clamp(1.5rem, 3vw, 2.25rem)", alignContent: "start" }}>
                      {metaPrimary.map((m) => <MetaBlock key={m.label} label={m.label} values={m.values} />)}
                    </div>
                    <div style={{ display: "grid", gap: "clamp(1.5rem, 3vw, 2.25rem)", alignContent: "start" }}>
                      {metaSecondary.map((m) => <MetaBlock key={m.label} label={m.label} values={m.values} />)}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: "clamp(1.45rem, 2.6vw, 2.45rem)", lineHeight: 1.36, letterSpacing: "-0.02em" }}>
                      {d.description}
                    </p>
                    <div style={{ marginTop: "clamp(1.4rem, 2.5vw, 2rem)" }}>
                      <p style={{ fontSize: "1.06rem", lineHeight: 1.6, color: "var(--gray)", maxWidth: "46ch" }}>
                        &ldquo;{p.quote}&rdquo;
                      </p>
                      {p.quoteBy && <QuoteBy by={p.quoteBy} />}
                    </div>
                    <div style={{ marginTop: "clamp(1.75rem, 3vw, 2.25rem)", display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
                      {SECTIONS.map((s, i) => (
                        <button key={s} type="button" onClick={() => scrollToSec(i)} className="cs-tag">{s}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <BuildBlock d={d} />

                {/* The product, section by section */}
                <div className="cs-rows">
                  <Row
                    id={0}
                    eyebrow="The problem"
                    title="Before, every booking happened in her DMs."
                    body="185K followers and no way to book online. Every date, price and deposit was a conversation, answered one message at a time."
                    bullets={["Clients couldn't see which dates were open", "Prices and deposits explained one DM at a time", "Every booking tracked and confirmed by hand"]}
                    stage={<Stage><div className="cs-ph"><IPhone><DMScreen /></IPhone></div></Stage>}
                  />

                  <Row
                    id={1}
                    flip
                    eyebrow="The client side"
                    title="Booking takes four steps."
                    body="A mobile-first flow on a live availability calendar. The bride picks her service and a date, never a time, adds her details, then reads her service agreement and signs it right in the app. No DMs, no back-and-forth."
                    stage={
                      <Stage>
                        <div className="cs-ph"><IPhone><BookDateScreen /></IPhone></div>
                        <div className="cs-ph cs-ph--low"><IPhone><ReviewSignScreen /></IPhone></div>
                      </Stage>
                    }
                    after={
                      <Steps
                        items={[
                          { t: "Pick a date", b: "Choose a service, then an open date." },
                          { t: "Review & sign", b: "Agreement signed in the app." },
                          { t: "Check email", b: "The inquiry email has a secure deposit link." },
                          { t: "Send deposit", b: `${B.deposit} on Zelle, then upload a screenshot.` },
                        ]}
                      />
                    }
                  />

                  <Row
                    id={2}
                    eyebrow="Deposits"
                    title="Deposits, without the chasing."
                    body="The inquiry email carries a secure link. The bride sends her deposit on Zelle and uploads her screenshots, and Roko marks it received from her dashboard. The rest is due on the day."
                    bullets={["Private, secure upload page for Zelle screenshots", "Roko checks each screenshot and marks the deposit received", "Remaining balance due on the day"]}
                    stage={
                      <Stage>
                        <div className="cs-ph"><IPhone><InquiryEmailScreen /></IPhone></div>
                        <div className="cs-ph cs-ph--low"><IPhone><UploadScreen /></IPhone></div>
                      </Stage>
                    }
                  />

                  <DashboardRow />

                  <Row
                    id={4}
                    eyebrow="Automation"
                    title="The emails send themselves."
                    body="Every step that used to be a DM now sends its own email: 21 templates, branded to match the site and sent through Resend. Each step saves to Supabase, and every send is tracked."
                    bullets={["Inquiry received, with the secure deposit link", "Confirmation with her start time and consultation call", "Delivery status for every email, right in her dashboard", "A daily health check that alerts us if anything drifts"]}
                    stage={<Stage wide><ConfirmationEmail /></Stage>}
                  />
                </div>

                <Timeline d={d} />

                {/* Bottom CTA */}
                <div className="cs-end">
                  <span className="display" style={{ fontSize: "clamp(1.5rem, 3vw, 2.3rem)", letterSpacing: "-0.03em" }}>See it live.</span>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="pill-solid" style={{ textDecoration: "none" }}>
                    Visit {p.client}
                    <span style={{ fontSize: "0.85rem" }}>↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: CS_CSS + ROKO_SCREENS_CSS }} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* Fade-and-rise on first view. */
function Reveal({ children, delay = 0, style, className }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -70px 0px" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function MetaBlock({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <span className="eyebrow" style={{ color: "var(--gray-light)" }}>{label}</span>
      <div style={{ marginTop: "0.6rem", display: "grid", gap: "0.25rem" }}>
        {values.map((v) => <span key={v} style={{ fontSize: "1rem", color: "var(--ink-soft)" }}>{v}</span>)}
      </div>
    </div>
  );
}

/* The whole booking played on a laptop, full width, with copy above it. */
function RokoPreview() {
  return (
    <div className="rk-walkwrap">
      <div className="rk-walkcopy">
        <div>
          <span className="eyebrow" style={{ color: "var(--gray)" }}>Live walkthrough</span>
          <h3 className="display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 3.2rem)", letterSpacing: "-0.035em", margin: "0.8rem 0 0", lineHeight: 1.02 }}>
            The whole booking,<br />start to finish.
          </h3>
        </div>
        <p style={{ fontSize: "clamp(1rem, 1.3vw, 1.1rem)", lineHeight: 1.6, color: "var(--gray)", maxWidth: "40ch" }}>
          One full booking on the real site: browse the services, pick a wedding date, fill in the details, sign the
          agreement, then get the email and upload the Zelle deposit. Recreated screen for screen. Tap a step to jump.
        </p>
      </div>
      <div className="rk-walkframe"><RokoFilm /></div>
    </div>
  );
}

/* Numbers that count up once, the first time they're seen. */
function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, value]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Ring({ score, label }: { score: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <div ref={ref} className="cs-ring">
      <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
        <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(26,135,82,0.14)" strokeWidth="4" />
        <motion.circle
          cx="32" cy="32" r={R} fill="none" stroke="var(--live)" strokeWidth="4" strokeLinecap="round"
          strokeDasharray={C}
          initial={reduce ? false : { strokeDashoffset: C }}
          animate={inView || reduce ? { strokeDashoffset: C * (1 - score / 100) } : undefined}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 32 32)"
        />
      </svg>
      <b>{inView || reduce ? <CountUp value={score} /> : 0}</b>
      <span>{label}</span>
    </div>
  );
}

/* "What we built it with": the carousel's build card, as a living block. */
function BuildBlock({ d }: { d: NonNullable<Project["detail"]> }) {
  return (
    <div className="cs-build">
      <Reveal className="cs-build-head">
        <span className="eyebrow" style={{ color: "var(--gray)" }}>The build</span>
        <h3 className="display">What we built it with.</h3>
        <p>End to end: design, frontend, backend and deployment.</p>
      </Reveal>
      <div className="cs-stats">
        {d.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="cs-stat">
            <b className="display"><CountUp value={s.value} suffix={s.suffix} /></b>
            <span>{s.label}</span>
          </Reveal>
        ))}
      </div>
      <Reveal className="cs-stack">
        {d.stack.map((r) => (
          <div key={r.label}>
            <span className="mono">{r.label}</span>
            <b>{r.name}</b>
            <em>{r.note}</em>
          </div>
        ))}
      </Reveal>
      <Reveal className="cs-lh">
        <div>
          <span className="mono">Lighthouse</span>
          <p>Google&rsquo;s desktop audit of the live site, out of 100</p>
        </div>
        <div className="cs-rings">
          {d.lighthouse.map((l) => <Ring key={l.label} score={l.score} label={l.label} />)}
        </div>
      </Reveal>
    </div>
  );
}

function Stage({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return <div className={`cs-stage ${wide ? "cs-stage--wide" : ""}`}>{children}</div>;
}

function Row({
  id, eyebrow, title, body, bullets, stage, after, flip = false,
}: {
  id: number; eyebrow: string; title: string; body: string; bullets?: string[];
  stage: React.ReactNode; after?: React.ReactNode; flip?: boolean;
}) {
  return (
    <section id={`cs-sec-${id}`} className="cs-rowwrap">
      <div className={`cs-row ${flip ? "cs-row--flip" : ""}`}>
        <Reveal className="cs-row__text">
          <span className="eyebrow" style={{ color: "var(--gray)" }}>{String(id + 1).padStart(2, "0")} · {eyebrow}</span>
          <h3 className="display">{title}</h3>
          <p className="cs-row__body">{body}</p>
          {bullets && (
            <ol className="cs-bullets">
              {bullets.map((b, i) => (
                <li key={b}><span className="mono">{String(i + 1).padStart(2, "0")}</span>{b}</li>
              ))}
            </ol>
          )}
        </Reveal>
        <Reveal delay={0.08} className="cs-row__stage">{stage}</Reveal>
      </div>
      {after}
    </section>
  );
}

function Steps({ items }: { items: { t: string; b: string }[] }) {
  return (
    <div className="cs-steps">
      {items.map((s, i) => (
        <Reveal key={s.t} delay={i * 0.07} className="cs-step">
          <span className="mono">{String(i + 1).padStart(2, "0")}</span>
          <b>{s.t}</b>
          <p>{s.b}</p>
        </Reveal>
      ))}
    </div>
  );
}

/* Roko's dashboard: the phone loops pending → one-tap confirm → confirmed,
   and the captions beside it light up in sync. */
function DashboardRow() {
  const [step, setStep] = useState(0);
  const onStep = useCallback((s: number) => setStep(s), []);
  const activeCap = step === 0 ? 0 : step === 3 ? 2 : 1;
  const caps = [
    { t: "New request", b: "Lands as pending until she reviews it." },
    { t: "One-tap confirm", b: "The client is notified automatically." },
    { t: "Always current", b: "Confirmed bookings on her home screen." },
  ];
  return (
    <section id="cs-sec-3" className="cs-rowwrap">
      <div className="cs-row cs-row--flip">
        <Reveal className="cs-row__text">
          <span className="eyebrow" style={{ color: "var(--gray)" }}>04 · The admin side</span>
          <h3 className="display">She runs it all from her phone.</h3>
          <p className="cs-row__body">
            A mobile-first admin dashboard with 7 tabs: Home, Clients, Calendar, Services, Reviews, Class Sign-Ups and
            Reports. Requests land as pending, Roko sets the start time and confirms in one tap, and the client is
            emailed on its own.
          </p>
          <div className="cs-caps">
            {caps.map((c, i) => (
              <div key={c.t} className={`cs-cap ${i === activeCap ? "cs-cap--on" : ""}`}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <div><b>{c.t}</b><p>{c.b}</p></div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.08} className="cs-row__stage">
          <Stage><div className="cs-ph cs-ph--hero"><AdminPhone onStep={onStep} /></div></Stage>
        </Reveal>
      </div>
    </section>
  );
}

/* The confirmation email the bride receives once Roko sets the time, matching
   the live template: system sans, a ✓ badge, the consultation call first,
   then the appointment. */
function ConfirmationEmail() {
  const reduce = useReducedMotion();
  const row = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 8 },
    whileInView: reduce ? undefined : { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.5 },
    transition: { duration: 0.4, delay, ease },
  });
  return (
    <div className="cs-mail">
      <div className="cs-mail-bar" aria-hidden>
        <span className="cs-mail-from"><i>R</i><span><b>Makeup by Roko</b><em>to {B.client}</em></span></span>
        <span className="mono">Inbox</span>
      </div>
      <div className="cs-mail-body">
        <span className="cs-mail-wm">Makeup by <em>Roko</em></span>
        <motion.span
          className="cs-mail-check"
          aria-hidden
          initial={reduce ? false : { opacity: 0, scale: 0.6 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 380, damping: 18 }}
        >
          ✓
        </motion.span>
        <h4>You&rsquo;re<br /><em>Confirmed!</em></h4>
        <p className="cs-mail-sub">Your appointment and consultation call are booked.</p>
        <p className="cs-mail-p">Hi <b>{B.client}</b>, we&rsquo;ll plan your look on a quick call first, then I&rsquo;ll see you on the day.</p>
        <div className="cs-mail-card">
          <span>First · Consultation call</span>
          <motion.div {...row(0.1)}><em>Date</em><b>{B.consultDate}</b></motion.div>
          <motion.div {...row(0.16)}><em>Time</em><b>{B.consultTime}</b></motion.div>
          <motion.div {...row(0.22)}><em>Type</em><b>Zoom</b></motion.div>
        </div>
        <div className="cs-mail-card">
          <span>Then · Your appointment</span>
          <motion.div {...row(0.28)}><em>Service</em><b>{B.service}</b></motion.div>
          <motion.div {...row(0.34)}><em>Date</em><b>{B.dateLong}</b></motion.div>
          <motion.div {...row(0.4)}><em>Time</em><b>{B.start}</b></motion.div>
        </div>
        <p className="cs-mail-love">With love, Roko</p>
      </div>
    </div>
  );
}

function Timeline({ d }: { d: NonNullable<Project["detail"]> }) {
  return (
    <div className="cs-time">
      <Reveal className="cs-build-head">
        <span className="eyebrow" style={{ color: "var(--gray)" }}>The process</span>
        <h3 className="display">How it came together.</h3>
      </Reveal>
      <div className="cs-time-list">
        {d.timeline.map((t, i) => (
          <Reveal key={t.title} delay={i * 0.06} className="cs-time-item">
            <span className="mono cs-time-no">{String(i + 1).padStart(2, "0")}</span>
            <div className="cs-time-main">
              <div className="cs-time-top">
                <b>{t.title}</b>
                <span className="mono cs-when">{t.when}</span>
              </div>
              <p>{t.body}</p>
              {t.note && <span className="mono cs-time-note">{t.note}</span>}
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="cs-time-chips">
        {d.timelineChips.map((c, i) => (
          <span key={c} className="cs-chip">{i === 0 && <i />}{c}</span>
        ))}
      </Reveal>
    </div>
  );
}

const CS_CSS = `
.cs-top {
  position: sticky; top: 0; z-index: 30;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 0.95rem clamp(1.25rem, 5vw, 5rem); padding-top: max(0.95rem, env(safe-area-inset-top));
  border-bottom: 1px solid var(--paper-line);
  background: rgba(242,241,237,0.78); backdrop-filter: blur(14px) saturate(1.2); -webkit-backdrop-filter: blur(14px) saturate(1.2);
}
.cs-back {
  flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--paper-line-strong); background: #fff; color: var(--paper-ink); cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
}
.cs-back:hover { background: var(--paper-ink); color: var(--paper); }
.cs-back:active { transform: scale(0.94); }
.cs-brand { background: none; border: none; padding: 0; cursor: pointer; color: var(--paper-ink); font-weight: 600; letter-spacing: 0.24em; font-size: 0.95rem; transition: opacity 0.3s ease; }
.cs-brand:hover { opacity: 0.6; }
.cs-crumb { font-size: 0.74rem; color: var(--paper-faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cs-nav-links { display: none; align-items: center; gap: clamp(1rem, 2.2vw, 2.25rem); }
.cs-navlink { background: none; border: none; cursor: pointer; padding: 0; font-size: 0.82rem; color: var(--paper-ink); white-space: nowrap; }
@media (min-width: 860px) { .cs-nav-links { display: flex; } }
@media (max-width: 520px) { .cs-crumb { display: none; } }

.cs-wrap { max-width: 1600px; margin: 0 auto; padding: clamp(2.5rem, 6vw, 5rem) clamp(1.25rem, 3.2vw, 3.5rem) clamp(4rem, 9vw, 7rem); }
.cs-title { display: grid; gap: 1.75rem; align-items: end; }
@media (min-width: 900px) { .cs-title { grid-template-columns: 1fr auto; } }
.cs-chip { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.55rem 1rem; border-radius: 100px; background: #fff; font-size: 0.86rem; color: var(--paper-ink); box-shadow: 0 0 0 1px var(--paper-line); }
.cs-chip i { width: 7px; height: 7px; border-radius: 50%; background: var(--live); display: block; }
.cs-tag {
  padding: 0.5rem 1.05rem; border-radius: 100px;
  border: 1px solid var(--paper-line-strong); background: transparent; color: var(--paper-ink-soft);
  font-size: 0.84rem; cursor: pointer; transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
.cs-tag:hover { background: var(--paper-ink); color: var(--paper); border-color: var(--paper-ink); }
.cs-hero {
  margin-top: clamp(3rem, 6vw, 5rem); padding-top: clamp(1.75rem, 3.5vw, 2.5rem); border-top: 1px solid var(--paper-line);
  display: grid; grid-template-columns: 1fr; gap: clamp(2rem, 4vw, 3rem);
}
.cs-meta { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(1.25rem, 3vw, 2rem); }
@media (min-width: 860px) { .cs-hero { grid-template-columns: 0.8fr 1.2fr; gap: clamp(3rem, 7vw, 7rem); align-items: start; } }

.rk-walkwrap { display: grid; gap: clamp(1.75rem, 3.5vw, 2.75rem); }
.rk-walkcopy { display: grid; gap: 1rem; align-items: end; }
@media (min-width: 900px) { .rk-walkcopy { grid-template-columns: 1fr auto; gap: 3rem; } }
.rk-walkframe { width: 100%; max-width: 1240px; margin: 0 auto; }

/* build card */
.cs-build { margin-top: clamp(4rem, 8vw, 7rem); padding-top: clamp(2rem, 4vw, 3rem); border-top: 1px solid var(--paper-line); }
.cs-build-head h3 { font-size: clamp(2rem, 4.2vw, 3.6rem); letter-spacing: -0.035em; margin-top: 0.8rem; }
.cs-build-head p { margin-top: 0.8rem; font-size: clamp(1rem, 1.4vw, 1.2rem); color: var(--paper-gray); }
.cs-stats { margin-top: clamp(1.75rem, 3.5vw, 2.75rem); display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(0.6rem, 1.4vw, 1rem); }
@media (min-width: 860px) { .cs-stats { grid-template-columns: repeat(4, 1fr); } }
.cs-stat { background: #fff; border-radius: 18px; padding: clamp(1.1rem, 2.6vw, 2rem); box-shadow: 0 0 0 1px var(--paper-line); }
.cs-stat b { display: block; font-size: clamp(2.6rem, 6.4vw, 5.4rem); letter-spacing: -0.05em; line-height: 1; font-variant-numeric: tabular-nums; }
.cs-stat > span { display: block; margin-top: 0.7rem; font-size: clamp(0.82rem, 1.2vw, 1rem); color: var(--paper-gray); }
.cs-stack { margin-top: clamp(0.6rem, 1.4vw, 1rem); background: #fff; border-radius: 18px; padding: 0.4rem clamp(1.1rem, 2.6vw, 2rem); box-shadow: 0 0 0 1px var(--paper-line); }
.cs-stack > div { display: grid; grid-template-columns: minmax(84px, 0.7fr) 1fr 1.6fr; gap: 1rem; align-items: baseline; padding: clamp(0.85rem, 1.6vw, 1.2rem) 0; border-bottom: 1px solid var(--paper-line); }
.cs-stack > div:last-child { border-bottom: none; }
.cs-stack span { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--paper-faint); }
.cs-stack b { font-size: clamp(1.05rem, 1.7vw, 1.4rem); font-weight: 500; letter-spacing: -0.01em; }
.cs-stack em { font-style: normal; font-size: clamp(0.86rem, 1.2vw, 1rem); color: var(--paper-gray); }
@media (max-width: 640px) { .cs-stack > div { grid-template-columns: 1fr 1.3fr; } .cs-stack em { grid-column: 2; } }
.cs-lh { margin-top: clamp(0.6rem, 1.4vw, 1rem); background: #fff; border-radius: 18px; padding: clamp(1.1rem, 2.6vw, 2rem); box-shadow: 0 0 0 1px var(--paper-line); display: grid; gap: 1.5rem; align-items: center; }
@media (min-width: 760px) { .cs-lh { grid-template-columns: 0.7fr 1.3fr; } }
.cs-lh .mono { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--paper-faint); }
.cs-lh p { margin-top: 0.4rem; font-size: 0.95rem; color: var(--paper-gray); max-width: 26ch; }
.cs-rings { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
.cs-ring { position: relative; display: flex; flex-direction: column; align-items: center; gap: 0.55rem; }
.cs-ring b { position: absolute; top: 32px; transform: translateY(-50%); font-size: 1.05rem; font-weight: 600; font-variant-numeric: tabular-nums; }
.cs-ring > span { font-size: 0.78rem; color: var(--paper-gray); text-align: center; }

/* section rows */
.cs-rows { margin-top: clamp(5rem, 10vw, 9rem); display: grid; gap: clamp(5.5rem, 11vw, 10rem); }
.cs-row { display: grid; grid-template-columns: 1fr; gap: clamp(2rem, 4vw, 3rem); align-items: center; }
.cs-row__text, .cs-row__stage { min-width: 0; }
.cs-row__text h3 { font-size: clamp(2rem, 3.8vw, 3.3rem); letter-spacing: -0.035em; margin-top: 0.85rem; max-width: 15ch; }
.cs-row__body { margin-top: 1.15rem; font-size: clamp(1.05rem, 1.5vw, 1.25rem); line-height: 1.6; color: var(--paper-gray); max-width: 44ch; }
.cs-bullets { list-style: none; margin-top: 1.6rem; border-top: 1px solid var(--paper-line); }
.cs-bullets li { display: flex; gap: 1.1rem; align-items: baseline; padding: 0.95rem 0; border-bottom: 1px solid var(--paper-line); font-size: clamp(1rem, 1.35vw, 1.15rem); }
.cs-bullets .mono { font-size: 0.74rem; color: var(--paper-faint); }
@media (min-width: 960px) {
  .cs-row { grid-template-columns: 0.75fr 1.25fr; gap: clamp(3rem, 6vw, 6rem); }
  .cs-row--flip { grid-template-columns: 1.25fr 0.75fr; }
  .cs-row--flip .cs-row__text { order: 2; }
  .cs-row--flip .cs-row__stage { order: 1; }
}
/* Phones sit straight on the paper: one clean background, no panel. */
.cs-stage {
  position: relative; display: flex; justify-content: center; align-items: center; gap: clamp(0.8rem, 2.6vw, 2.5rem);
  padding: clamp(0.5rem, 2vw, 1.5rem) 0;
}
.cs-stage--wide { padding: 0; }
.cs-ph { width: clamp(150px, 19vw, 290px); flex-shrink: 0; }
.cs-ph--low { margin-top: clamp(2rem, 5vw, 4.5rem); }
.cs-ph--hero { width: clamp(220px, 23vw, 320px); }
@media (max-width: 640px) { .cs-ph { width: 42vw; } .cs-ph--hero { width: 62vw; } .cs-ph--low { margin-top: 2.25rem; } }

.cs-steps { margin-top: clamp(1.5rem, 3vw, 2.5rem); display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(1.25rem, 2.5vw, 2rem); }
@media (min-width: 860px) { .cs-steps { grid-template-columns: repeat(4, 1fr); } }
.cs-step { padding-top: 1rem; border-top: 1px solid var(--paper-line-strong); }
.cs-step .mono { font-size: 0.74rem; color: var(--paper-faint); }
.cs-step b { display: block; margin-top: 0.5rem; font-size: clamp(1.05rem, 1.5vw, 1.3rem); font-weight: 500; }
.cs-step p { margin-top: 0.35rem; font-size: 0.92rem; line-height: 1.5; color: var(--paper-gray); }

.cs-caps { margin-top: 1.6rem; display: grid; border-top: 1px solid var(--paper-line); }
.cs-cap { display: flex; gap: 1.1rem; padding: 1rem 0; border-bottom: 1px solid var(--paper-line); opacity: 0.38; transition: opacity 0.5s ease; }
.cs-cap--on { opacity: 1; }
.cs-cap .mono { font-size: 0.74rem; color: var(--paper-faint); padding-top: 0.25rem; }
.cs-cap b { font-size: clamp(1.05rem, 1.4vw, 1.2rem); font-weight: 500; }
.cs-cap p { margin-top: 0.2rem; font-size: 0.94rem; color: var(--paper-gray); }

/* confirmation email in a mail window */
.cs-mail { width: 100%; max-width: 560px; margin: 0 auto; border-radius: 16px; overflow: hidden; background: #fff; box-shadow: 0 0 0 1px rgba(20,20,20,0.06), 0 40px 70px -40px rgba(20,20,20,0.45); }
.cs-mail-bar { display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.1rem; border-bottom: 1px solid #F1ECEE; }
.cs-mail-bar .mono { font-size: 0.7rem; color: var(--paper-faint); }
.cs-mail-from { display: flex; align-items: center; gap: 0.6rem; }
.cs-mail-from i { width: 30px; height: 30px; border-radius: 50%; background: #F7EEF2; color: #C4849A; font-style: normal; font-weight: 600; font-size: 0.8rem; display: inline-flex; align-items: center; justify-content: center; }
.cs-mail-from b { display: block; font-size: 0.86rem; font-weight: 600; }
.cs-mail-from em { display: block; font-style: normal; font-size: 0.74rem; color: #999; }
.cs-mail-body { text-align: center; padding: clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 2.5rem); background: #F1EAED; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", var(--font-inter), Roboto, Helvetica, Arial, sans-serif; color: #16110F; }
.cs-mail-wm { display: block; font-size: 1.05rem; letter-spacing: 0.01em; }
.cs-mail-wm em { color: #C4849A; }
.cs-mail-check { width: 48px; height: 48px; margin: 1.1rem auto 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #fff; background: #C4849A; box-shadow: 0 10px 24px -12px rgba(196,132,154,0.9); }
.cs-mail-body h4 { font-weight: 400; font-size: clamp(1.8rem, 3.2vw, 2.3rem); line-height: 1.16; margin-top: 0.8rem; }
.cs-mail-body h4 em { font-style: italic; color: #C4849A; }
.cs-mail-sub { color: #6E6058; font-size: 0.92rem; margin-top: 0.4rem; }
.cs-mail-p { margin-top: 1rem; font-size: 0.9rem; line-height: 1.6; color: #5A5258; }
.cs-mail-p b { color: #16110F; font-weight: 600; }
.cs-mail-card { margin-top: 0.9rem; text-align: left; background: #fff; border: 1px solid #EFE4E9; border-radius: 14px; padding: 0.95rem 1.1rem; }
.cs-mail-card > span { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #C4849A; }
.cs-mail-card > div { display: flex; justify-content: space-between; gap: 1rem; padding: 0.55rem 0; border-bottom: 1px solid #F5E8EF; font-size: 0.86rem; }
.cs-mail-card > div:last-child { border-bottom: none; }
.cs-mail-card em { font-style: normal; color: #8b8386; }
.cs-mail-card b { font-weight: 600; color: #16110F; text-align: right; }
.cs-mail-love { margin-top: 1.2rem; font-style: italic; color: #C4849A; font-size: 1.02rem; }

/* timeline */
.cs-time { margin-top: clamp(5rem, 10vw, 9rem); padding-top: clamp(2rem, 4vw, 3rem); border-top: 1px solid var(--paper-line); }
.cs-time-list { margin-top: clamp(1.75rem, 3.5vw, 2.75rem); border-top: 1px solid var(--paper-line); }
.cs-time-item { display: grid; grid-template-columns: clamp(2.5rem, 8vw, 7rem) 1fr; gap: 1rem; padding: clamp(1.4rem, 3vw, 2.2rem) 0; border-bottom: 1px solid var(--paper-line); }
.cs-time-no { font-size: clamp(0.95rem, 1.6vw, 1.3rem); color: var(--paper-faint); padding-top: 0.3rem; }
.cs-time-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem 1.5rem; }
.cs-time-top b { font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 500; letter-spacing: -0.03em; }
.cs-when { font-size: clamp(0.8rem, 1.1vw, 0.95rem); padding: 0.45rem 1rem; border-radius: 100px; background: #fff; box-shadow: 0 0 0 1px var(--paper-line); }
.cs-time-main p { margin-top: 0.6rem; font-size: clamp(1rem, 1.4vw, 1.2rem); line-height: 1.6; color: var(--paper-gray); max-width: 58ch; }
.cs-time-note { display: inline-block; margin-top: 0.8rem; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--live); }
.cs-time-chips { margin-top: clamp(1.5rem, 3vw, 2.25rem); display: flex; flex-wrap: wrap; gap: 0.6rem; }

.cs-end { margin-top: clamp(4.5rem, 9vw, 7.5rem); padding-top: clamp(2rem, 4vw, 3rem); border-top: 1px solid var(--paper-line); display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between; }
`;
