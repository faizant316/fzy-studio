"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { lenisScrollTo, lenisStart, lenisStop } from "./lenis";

const ease = [0.22, 1, 0.36, 1] as const;

/* The page glitch-dissolves (ombre + dither) between black (the sections above +
   below) and a deep near-black blue interlude that holds the Selected Work showcase. */
const BLACK = "#0a0a0b";
const BLUE = "#0a1326";

// Mirrors the site nav so the case study keeps the real header.
const NAV_LINKS = [
  { label: "Work", id: "work" },
  { label: "Capabilities", id: "capabilities" },
  { label: "Studio", id: "studio" },
  { label: "Start a Project", id: "contact" },
];

type CaseStudy = {
  projectType: string[];
  tech: string[];
  description: string;
  sections: { title: string; body: string; bullets?: string[]; image?: string }[];
};

type Project = {
  client: string;
  category: string;
  year: string;
  quote: string;
  services: string[];
  url: string;
  image?: string; // drop a screenshot in /public and set this to swap the placeholder
  detail?: CaseStudy;
};

// One flagship for now, the array is the seam: add objects here and the
// showcase grows into the same treatment, no layout rework.
const projects: Project[] = [
  {
    client: "Makeup by Roko",
    category: "Bridal booking platform",
    year: "2025",
    quote: "It took my whole business out of my DMs and built something that runs itself.",
    services: ["UI/UX design", "Booking & automation", "Full-stack development"],
    url: "https://makeupby-roko.vercel.app",
    detail: {
      projectType: ["Booking platform", "Website", "Automation"],
      tech: ["Next.js", "Supabase", "Stripe", "Automated email"],
      description:
        "FZY designed and engineered Makeup by Roko end to end, a full bridal booking platform that replaced a tangle of Instagram DMs, screenshots, and a paper calendar with one system: clients request a date and send a Zelle deposit, and Roko confirms the exact time from a single dashboard.",
      sections: [
        {
          title: "The problem",
          body: "Every inquiry, date, and deposit lived in the DMs. Double-bookings, forgotten deposits, no-shows, and hours each week retyping the same details across Instagram, texts, and a paper calendar.",
          bullets: ["Bookings scattered across DMs and texts", "No deposits, frequent no-shows", "Manual back-and-forth for every single date"],
        },
        {
          title: "Booking & scheduling",
          body: "A mobile-first request flow with a live availability calendar. Clients choose their preferred date and submit; Roko reviews and locks in the exact time, so the schedule is never double-booked.",
          bullets: ["Live calendar with real-time availability", "Service and add-on selection", "Roko confirms the time, no client self-scheduling"],
        },
        {
          title: "Deposits & payments",
          body: "Deposits are sent by Zelle to lock the date, with a one-tap screenshot upload for proof. Roko verifies and the date is secured, no more chasing payments in the DMs.",
          bullets: ["Zelle deposit locks the date", "One-tap screenshot upload + auto reminder if unpaid", "Remaining balance in cash on the day"],
        },
        {
          title: "Automation & confirmations",
          body: "Booking-request, deposit-reminder, and confirmation emails all send themselves, branded and automatic. Roko just approves from one dashboard.",
          bullets: ["Auto request-received email", "Auto Zelle deposit reminder", "Branded confirmation once Roko locks the time"],
        },
      ],
    },
  },
];

export default function Work() {
  const p = projects[0];

  return (
    <section id="work" style={{ background: BLACK }}>
      {/* black to blue (ombre glitch) */}
      <GlitchBand top={BLACK} bottom={BLUE} seedBase={1} />

      <div
        style={{
          background: BLUE,
          color: "var(--ink)",
          padding: "clamp(3rem, 6vw, 5.5rem) clamp(1.25rem, 4vw, 3rem) clamp(3.5rem, 7vw, 6rem)",
        }}
      >
        <div style={{ maxWidth: 1480, margin: "0 auto", position: "relative" }}>
          {/* Header */}
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
              <span className="eyebrow" style={{ color: "var(--accent)" }}>Selected Work</span>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  color: "var(--ink)",
                  marginTop: "0.9rem",
                  letterSpacing: "-0.035em",
                }}
              >
                Platforms we&rsquo;ve built
              </h2>
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--gray)", paddingBottom: "0.5rem" }}>
              Real platforms, live with real clients.
            </span>
          </motion.div>

          <div className="hairline" />

          <Feature p={p} index={0} />

          {/* More coming soon */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.8, ease }}
            style={{
              marginTop: "clamp(3rem, 6vw, 5rem)",
              paddingTop: "clamp(1.5rem, 3vw, 2rem)",
              borderTop: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.7rem",
            }}
          >
            <span className="work-soon-dot" aria-hidden />
            <span className="eyebrow" style={{ color: "var(--gray)" }}>
              More platforms in the studio, shipping soon
            </span>
          </motion.div>

          {/* Eye + laser overlay, sits high, tracks the cursor across the section */}
          <EyeLaser />
        </div>
      </div>

      {/* blue to black (ombre glitch) */}
      <GlitchBand top={BLUE} bottom={BLACK} seedBase={2} />

      <style dangerouslySetInnerHTML={{ __html: `
        .work-soon-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 0 rgba(122,162,227,0.5);
          animation: work-pulse 2.4s ease-out infinite;
        }
        @keyframes work-pulse {
          0% { box-shadow: 0 0 0 0 rgba(122,162,227,0.45); }
          70% { box-shadow: 0 0 0 9px rgba(122,162,227,0); }
          100% { box-shadow: 0 0 0 0 rgba(122,162,227,0); }
        }
        @media (prefers-reduced-motion: reduce) { .work-soon-dot { animation: none; } }
        /* The laser needs a real cursor, hide it on touch / small screens. */
        @media (hover: none), (max-width: 760px) { .work-laser { display: none !important; } }
      ` }} />
    </section>
  );
}

/* ── A single project: text + live link on the left, a big clickable preview on
   the right. "View details" opens the full case study. ── */
function Feature({ p, index }: { p: Project; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yMedia = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const [open, setOpen] = useState(false);

  return (
    <div ref={ref} className="work-feature" style={{ position: "relative" }}>
      {/* Left, index, services, CTAs, subtle quote */}
      <motion.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        transition={{ duration: 0.8, ease }}
        className="work-feature__info"
      >
        <span className="eyebrow" style={{ color: "var(--gray)" }}>
          {String(index + 1).padStart(2, "0")} · {p.category}
        </span>

        <ul style={{ listStyle: "none", margin: "clamp(1.5rem, 3vw, 2.25rem) 0 0", padding: 0, display: "grid", gap: "0.5rem" }}>
          {p.services.map((s) => (
            <li key={s} className="display" style={{ fontSize: "clamp(1.4rem, 2.4vw, 2.1rem)", color: "var(--ink)", letterSpacing: "-0.025em", lineHeight: 1.12 }}>
              {s}
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.85rem", marginTop: "clamp(1.9rem, 3.5vw, 2.6rem)" }}>
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

        <p style={{ marginTop: "clamp(1.6rem, 3vw, 2.2rem)", fontSize: "0.98rem", lineHeight: 1.6, color: "var(--gray)", maxWidth: "34ch" }}>
          &ldquo;{p.quote}&rdquo;
        </p>
      </motion.div>

      {/* Right, big clickable preview */}
      <motion.div
        initial={false}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        transition={{ duration: 0.9, ease }}
        className="work-feature__media"
      >
        <motion.a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${p.client}, open live site`}
          style={reduce ? { display: "block", height: "100%" } : { display: "block", height: "100%", y: yMedia }}
        >
          {p.image ? (
            <img src={p.image} alt={`${p.client} platform`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <Placeholder p={p} />
          )}
        </motion.a>
      </motion.div>

      {p.detail && <CaseStudy p={p} open={open} onClose={() => setOpen(false)} />}

      <style dangerouslySetInnerHTML={{ __html: `
        .work-feature {
          margin-top: clamp(2.5rem, 5vw, 4rem);
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2rem, 5vw, 3rem);
          align-items: stretch;
        }
        .work-feature__info { display: flex; flex-direction: column; justify-content: center; }
        .work-feature__media {
          position: relative;
          min-height: clamp(380px, 56vh, 660px);
          box-shadow: 0 50px 90px -50px rgba(0,0,0,0.8);
        }
        .work-outline {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.85rem 1.6rem; border-radius: 100px;
          border: 1px solid var(--line-strong); background: transparent; color: var(--ink);
          font-size: 0.92rem; font-weight: 500; cursor: pointer;
          transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
        .work-outline:hover { background: var(--ink); color: #0a0a0a; border-color: var(--ink); }
        @media (min-width: 920px) {
          .work-feature { grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.35fr); gap: clamp(2.5rem, 5vw, 5rem); }
        }
      ` }} />
    </div>
  );
}

/* Full case study, portals to <body> (above the nav), slides up, and scrolls
   with its own Lenis instance. Joonas-Sandell layout: meta on the left, big
   description + tags on the right, then alternating screenshot/text sections. ── */
function CaseStudy({ p, open, onClose }: { p: Project; open: boolean; onClose: () => void }) {
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

    // Give the overlay its own momentum scroll so it feels like the rest of the site.
    let raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wrap = wrapRef.current;
    const content = wrap?.firstElementChild as HTMLElement | undefined;
    if (!reduce && wrap && content) {
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
    { label: "Tech", values: d.tech },
  ];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.6, ease }}
          style={{ position: "fixed", inset: 0, zIndex: 200, color: "var(--ink)" }}
        >
          <div
            ref={wrapRef}
            className="no-scrollbar"
            style={{
              position: "absolute",
              inset: 0,
              overflowY: "auto",
              overflowX: "hidden",
              overscrollBehavior: "contain",
              background: "radial-gradient(120% 70% at 82% 0%, rgba(86,132,224,0.10) 0%, rgba(10,19,38,0) 55%), #0a1326",
            }}
          >
            <div>
              {/* Top bar, keeps the real site header, with a clean close */}
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  padding: "0.95rem clamp(1.25rem, 5vw, 5rem)",
                  paddingTop: "max(0.95rem, env(safe-area-inset-top))",
                  borderBottom: "1px solid var(--line)",
                  background: "rgba(10,19,38,0.62)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Breadcrumb, file-explorer style: where you are in the site */}
                <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "0.55rem", minWidth: 0, overflow: "hidden" }}>
                  <button
                    type="button"
                    onClick={() => { onClose(); setTimeout(() => lenisScrollTo(0), 80); }}
                    aria-label="FZY home"
                    className="cs-crumb"
                    style={{ color: "#fff", fontWeight: 600, letterSpacing: "0.24em" }}
                  >
                    FZY
                  </button>
                  <span className="cs-crumb-sep" aria-hidden>·</span>
                  <button
                    type="button"
                    onClick={() => { onClose(); setTimeout(() => lenisScrollTo("#work"), 80); }}
                    className="cs-crumb"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    Work
                  </button>
                  <span className="cs-crumb-sep" aria-hidden>·</span>
                  <span className="cs-crumb cs-crumb--current" aria-current="page" style={{ color: "var(--accent)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.client}
                  </span>
                </nav>
                <div style={{ display: "flex", alignItems: "center", gap: "clamp(1rem, 2.2vw, 2.25rem)" }}>
                  <div className="cs-nav-links" style={{ alignItems: "center", gap: "clamp(1rem, 2.2vw, 2.25rem)" }}>
                    {NAV_LINKS.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => { onClose(); setTimeout(() => lenisScrollTo("#" + l.id), 80); }}
                        className="link-line"
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "0.82rem", color: "var(--ink-soft)", whiteSpace: "nowrap" }}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={onClose} className="cs-close" aria-label="Close case study">
                    Close
                    <span aria-hidden style={{ fontSize: "1.05rem", lineHeight: 1 }}>✕</span>
                  </button>
                </div>
              </div>

              <div style={{ maxWidth: 1840, margin: "0 auto", padding: "clamp(2.5rem, 6vw, 5rem) clamp(1.25rem, 3.2vw, 3.5rem) clamp(4rem, 9vw, 7rem)" }}>
                <span className="eyebrow" style={{ color: "var(--gray)" }}>{p.category} · {p.year}</span>
                <h2 className="display" style={{ fontSize: "clamp(2.6rem, 7vw, 5.5rem)", letterSpacing: "-0.04em", marginTop: "0.7rem", color: "var(--ink)" }}>
                  {p.client}
                </h2>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="pill-solid" style={{ marginTop: "clamp(1.5rem, 3vw, 2rem)", textDecoration: "none" }}>
                  Visit live site
                  <span style={{ fontSize: "0.85rem" }}>↗</span>
                </a>

                {/* A peek into the real product, Makeup by Roko's own brand world */}
                <div style={{ marginTop: "clamp(2.5rem, 5vw, 4rem)" }}>
                  <RokoPreview />
                </div>

                {/* Hero: meta on the left, description + tags on the right */}
                <div className="cs-hero">
                  <div className="cs-meta">
                    <div style={{ display: "grid", gap: "clamp(1.5rem, 3vw, 2.25rem)", alignContent: "start" }}>
                      {metaPrimary.map((m) => (
                        <MetaBlock key={m.label} label={m.label} values={m.values} />
                      ))}
                    </div>
                    <div style={{ display: "grid", gap: "clamp(1.5rem, 3vw, 2.25rem)", alignContent: "start" }}>
                      {metaSecondary.map((m) => (
                        <MetaBlock key={m.label} label={m.label} values={m.values} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: "clamp(1.5rem, 2.7vw, 2.6rem)", lineHeight: 1.38, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                      {d.description}
                    </p>
                    <p style={{ marginTop: "clamp(1.4rem, 2.5vw, 2rem)", fontSize: "1.08rem", lineHeight: 1.6, color: "var(--gray)", maxWidth: "46ch" }}>
                      &ldquo;{p.quote}&rdquo;, {p.client}
                    </p>
                    <div style={{ marginTop: "clamp(1.75rem, 3vw, 2.25rem)", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                      {d.sections.map((s, i) => (
                        <button key={s.title} type="button" onClick={() => scrollToSec(i)} className="cs-tag">
                          {s.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sections, alternating screenshot / text */}
                <div style={{ marginTop: "clamp(4.5rem, 9vw, 8rem)", display: "grid", gap: "clamp(5rem, 10vw, 9rem)" }}>
                  {d.sections.map((s, i) => (
                    <motion.div
                      key={s.title}
                      id={`cs-sec-${i}`}
                      initial={{ opacity: 0, y: 32 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
                      transition={{ duration: 0.7, ease }}
                      className={`cs-sec ${i % 2 === 1 ? "cs-sec--flip" : ""} ${i % 2 === 0 ? "cs-sec--top" : "cs-sec--bottom"}`}
                    >
                      <div className="cs-sec__media">
                        <RokoTile section={s} index={i} />
                      </div>
                      <div className="cs-sec__text">
                        <span className="eyebrow" style={{ color: "var(--gray-light)" }}>{String(i + 1).padStart(2, "0")}</span>
                        <h3 className="display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 3.2rem)", letterSpacing: "-0.03em", color: "var(--ink)", margin: "0.8rem 0 0" }}>
                          {s.title}
                        </h3>
                        <p style={{ marginTop: "1.1rem", fontSize: "clamp(1.08rem, 1.6vw, 1.32rem)", lineHeight: 1.6, color: "var(--ink-soft)" }}>{s.body}</p>
                        {s.bullets && (
                          <ul style={{ listStyle: "none", margin: "1.4rem 0 0", padding: 0, display: "grid", gap: "0.7rem" }}>
                            {s.bullets.map((b) => (
                              <li key={b} style={{ display: "flex", gap: "0.7rem", alignItems: "baseline", color: "var(--ink-soft)", fontSize: "0.98rem" }}>
                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, transform: "translateY(-2px)" }} />
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div style={{ marginTop: "clamp(4rem, 8vw, 7rem)", paddingTop: "clamp(2rem, 4vw, 3rem)", borderTop: "1px solid var(--line)", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="display" style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", letterSpacing: "-0.03em", color: "var(--ink)" }}>See it live.</span>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="pill-solid" style={{ textDecoration: "none" }}>
                    Visit {p.client}
                    <span style={{ fontSize: "0.85rem" }}>↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .cs-close {
              display: inline-flex; align-items: center; gap: 0.5rem;
              padding: 0.55rem 1.1rem; border-radius: 100px;
              border: 1px solid var(--line-strong); background: transparent; color: var(--ink);
              font-size: 0.85rem; cursor: pointer;
              transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }
            .cs-close:hover { background: var(--ink); color: #0a0a0a; border-color: var(--ink); }
            .cs-tag {
              padding: 0.5rem 1.05rem; border-radius: 100px;
              border: 1px solid var(--line-strong); background: transparent; color: var(--ink-soft);
              font-size: 0.84rem; cursor: pointer;
              transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }
            .cs-tag:hover { background: var(--ink); color: #0a0a0a; border-color: var(--ink); }
            .cs-crumb { background: none; border: none; padding: 0; cursor: pointer; font-size: 0.82rem; }
            button.cs-crumb { position: relative; }
            button.cs-crumb::after {
              content: ""; position: absolute; left: 0; bottom: -3px; width: 100%; height: 1px;
              background: currentColor; transform: scaleX(0); transform-origin: right;
              transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
            }
            button.cs-crumb:hover::after { transform: scaleX(1); transform-origin: left; }
            .cs-crumb--current { cursor: default; font-size: 0.82rem; max-width: 42vw; }
            .cs-crumb-sep { color: var(--gray-light); font-size: 0.82rem; }
            .cs-nav-links { display: none; }
            @media (min-width: 860px) { .cs-nav-links { display: flex; } }
            .cs-hero {
              margin-top: clamp(2.5rem, 5vw, 3.5rem);
              padding-top: clamp(1.75rem, 3.5vw, 2.5rem);
              border-top: 1px solid var(--line);
              display: grid; grid-template-columns: 1fr; gap: clamp(2rem, 4vw, 3rem);
            }
            .cs-meta { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(1.25rem, 3vw, 2rem); }
            .cs-sec { display: grid; grid-template-columns: 1fr; gap: clamp(1.5rem, 3vw, 2.5rem); align-items: center; }
            .cs-sec__media { min-width: 0; }
            .cs-sec__text { min-width: 0; }
            @media (min-width: 860px) {
              .cs-hero { grid-template-columns: 0.8fr 1.2fr; gap: clamp(3rem, 7vw, 7rem); align-items: start; }
              /* Image always lands in the WIDE track, whichever side it's on. */
              .cs-sec { grid-template-columns: 1.25fr 0.75fr; gap: clamp(3rem, 6vw, 6rem); }
              .cs-sec--flip { grid-template-columns: 0.75fr 1.25fr; }
              .cs-sec--flip .cs-sec__media { order: 2; }
              .cs-sec--flip .cs-sec__text { order: 1; }
              .cs-sec--top { align-items: flex-start; }
              .cs-sec--bottom { align-items: flex-end; }
            }

            /* Makeup by Roko brand skin, dusty rose + plum + black on white */
            .rk {
              --rk-surface: #FBF5F7; --rk-surface-2: #F8F4F6;
              --rk-rose: #D4A0B0; --rk-rose-deep: #C4849A; --rk-plum: #B8A0D4; --rk-plum-text: #6B4055;
              --rk-ink: #111111; --rk-muted: #6E6058; --rk-faint: #B5A99A;
              --rk-border: #E2C4D2; --rk-border-2: #EDE6DF;
              color: var(--rk-ink);
              font-family: var(--font-inter), system-ui, sans-serif;
            }
            .rk-serif { font-family: var(--font-cormorant), 'Cormorant Garamond', Georgia, serif; font-weight: 300; }
            .rk-frame, .rk-tile {
              border-radius: 16px; overflow: hidden; background: #fff;
              box-shadow: 0 14px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(226,196,210,0.2);
            }
            .rk-bar { display: flex; align-items: center; gap: 0.8rem; padding: 0.62rem 0.95rem; background: var(--rk-surface-2); border-bottom: 1px solid var(--rk-border-2); }
            .rk-dots { display: flex; gap: 6px; }
            .rk-dots i { width: 9px; height: 9px; border-radius: 50%; background: #E6D4DC; display: block; }
            .rk-url { font-size: 0.72rem; color: var(--rk-muted); background: #fff; border: 1px solid var(--rk-border-2); border-radius: 100px; padding: 0.2rem 0.85rem; }
            .rk-canvas {
              position: relative; overflow: hidden; padding: clamp(1.75rem, 4vw, 3.5rem);
              background: radial-gradient(85% 60% at 90% 0%, rgba(212,160,176,0.16) 0%, rgba(212,160,176,0) 60%), var(--rk-surface);
            }
            .rk-preview { background: #080607; }
            .rk-preview .rk-bar { background: #0f0d0d; border-bottom-color: rgba(255,255,255,0.08); }
            .rk-preview .rk-url { background: rgba(255,255,255,0.04); border-color: rgba(212,160,176,0.25); color: rgba(255,255,255,0.66); }
            .rk-hero-shot { position: relative; min-height: clamp(360px, 50vw, 720px); overflow: hidden; background: #080607; }
            .rk-hero-shot-img { display: block; width: 100%; height: 100%; min-height: clamp(360px, 50vw, 720px); object-fit: cover; object-position: center top; }
            .rk-hero-shot::after { content: ""; position: absolute; inset: 0; pointer-events: none; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 -80px 100px rgba(0,0,0,0.22); }
            .rk-eyebrow { font-size: 0.66rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--rk-rose-deep); font-weight: 500; }
            .rk-headline { font-size: clamp(2.6rem, 6vw, 5rem); line-height: 0.96; color: var(--rk-ink); margin: 0.8rem 0 0; letter-spacing: -0.01em; }
            .rk-headline em { font-style: italic; color: var(--rk-plum-text); }
            .rk-lead { margin-top: 1rem; font-size: 1rem; line-height: 1.6; color: var(--rk-muted); max-width: 38ch; }
            .rk-grid { margin-top: clamp(1.75rem, 3.5vw, 2.75rem); display: grid; grid-template-columns: 1fr; gap: 1.1rem; position: relative; z-index: 1; }
            @media (min-width: 720px) { .rk-grid { grid-template-columns: 1.08fr 0.92fr; align-items: start; } }
            .rk-card { position: relative; background: #fff; border: 1px solid var(--rk-border); border-radius: 16px; padding: 1.3rem 1.4rem; box-shadow: 0 8px 40px rgba(0,0,0,0.08); }
            .rk-aura { position: absolute; inset: -45% -18% -12% -18%; z-index: 0; filter: blur(42px); opacity: 0.6; pointer-events: none;
              background: radial-gradient(40% 55% at 22% 38%, rgba(212,160,176,0.6), transparent 70%), radial-gradient(42% 55% at 74% 26%, rgba(184,160,212,0.55), transparent 70%), radial-gradient(50% 60% at 50% 84%, rgba(170,190,230,0.45), transparent 70%); }
            .rk-card > * { position: relative; z-index: 1; }
            .rk-row { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
            .rk-mini { font-size: 0.62rem; letter-spacing: 0.04em; color: var(--rk-muted); border: 1px solid var(--rk-border); border-radius: 100px; padding: 0.16rem 0.62rem; }
            .rk-tier { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; padding: 0.72rem 0; border-bottom: 1px solid var(--rk-border-2); }
            .rk-tier:last-child { border-bottom: none; }
            .rk-tier-name { font-size: 1.3rem; color: var(--rk-ink); }
            .rk-tier-price { font-size: 1.3rem; color: var(--rk-ink); }
            .rk-tier-dep { font-size: 0.66rem; letter-spacing: 0.04em; color: var(--rk-rose-deep); text-align: right; }
            .rk-btn { margin-top: 1.1rem; width: 100%; padding: 0.78rem 1rem; border: none; border-radius: 100px; background: var(--rk-ink); color: #fff; font-size: 0.86rem; font-weight: 500; cursor: default; }
            .rk-col { display: grid; gap: 0.85rem; align-content: start; }
            .rk-chip { display: inline-flex; align-items: center; gap: 0.5rem; background: #fff; border: 1px solid var(--rk-border); border-radius: 100px; padding: 0.5rem 0.95rem; font-size: 0.82rem; color: var(--rk-ink); width: max-content; }
            .rk-check { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: var(--rk-rose); color: #fff; font-size: 0.64rem; flex-shrink: 0; }
            .rk-badge { display: flex; align-items: center; gap: 0.75rem; background: var(--rk-surface); border: 1px solid var(--rk-border); border-radius: 14px; padding: 0.75rem 0.95rem; }
            .rk-badge-icon { width: 32px; height: 32px; border-radius: 50%; background: #F7EEF2; display: flex; align-items: center; justify-content: center; color: var(--rk-rose-deep); font-size: 0.9rem; flex-shrink: 0; }
            .rk-badge b { display: block; font-size: 1.15rem; color: var(--rk-ink); font-family: var(--font-cormorant), serif; font-weight: 400; }
            .rk-badge span { font-size: 0.6rem; color: var(--rk-muted); letter-spacing: 0.1em; text-transform: uppercase; }
            .rk-review { background: #fff; border: 1px solid var(--rk-border); border-radius: 14px; padding: 0.95rem 1.1rem; }
            .rk-stars { color: var(--rk-rose); font-size: 0.78rem; letter-spacing: 2px; }
            .rk-quote { font-style: italic; color: var(--rk-ink); margin: 0.4rem 0 0; font-size: 1.2rem; line-height: 1.32; }
            /* section tiles */
            .rk-tile-head { display: flex; align-items: center; justify-content: space-between; padding: 0.62rem 0.95rem; background: var(--rk-surface-2); border-bottom: 1px solid var(--rk-border-2); }
            .rk-tile-label { font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--rk-rose-deep); }
            .rk-tile-body { position: relative; padding: clamp(1.4rem, 3vw, 2.25rem); background: radial-gradient(75% 60% at 86% 0%, rgba(212,160,176,0.14), transparent 60%), var(--rk-surface); }
            /* DM list */
            .rk-msg { display: flex; align-items: center; gap: 0.8rem; padding: 0.78rem 0; border-bottom: 1px solid var(--rk-border-2); }
            .rk-msg:last-child { border-bottom: none; }
            .rk-msg-av { width: 36px; height: 36px; border-radius: 50%; background: #fff; border: 1px solid var(--rk-border); flex-shrink: 0; }
            .rk-msg b { font-size: 0.9rem; color: var(--rk-ink); font-weight: 600; }
            .rk-msg p { font-size: 0.8rem; color: var(--rk-muted); margin: 0.12rem 0 0; }
            .rk-msg-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--rk-rose); flex-shrink: 0; }
            /* calendar */
            .rk-cal-head { display: flex; align-items: center; justify-content: space-between; }
            .rk-cal-title { font-size: 1.45rem; color: var(--rk-ink); }
            .rk-cal-nav { color: var(--rk-faint); font-size: 1.1rem; padding: 0 0.4rem; }
            .rk-week { display: grid; grid-template-columns: repeat(7, 1fr); margin-top: 1rem; }
            .rk-week span { text-align: center; font-size: 0.55rem; letter-spacing: 0.08em; color: var(--rk-faint); text-transform: uppercase; padding-bottom: 0.5rem; }
            .rk-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
            .rk-day { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; font-size: 0.8rem; border-radius: 6px; color: #8a8a8a; }
            .rk-day i { width: 5px; height: 5px; border-radius: 50%; display: block; }
            .rk-day--open i { background: #34D399; }
            .rk-day--fill { color: #555; } .rk-day--fill i { background: #F0C27A; }
            .rk-day--booked { color: #FCA5A5; text-decoration: line-through; }
            .rk-day--sel { background: var(--rk-ink); color: #fff; border-radius: 4px; }
            .rk-day--today { color: var(--rk-rose); font-weight: 700; }
            .rk-legend { display: flex; flex-wrap: wrap; gap: 0.9rem; margin-top: 1rem; }
            .rk-legend span { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.64rem; color: var(--rk-muted); }
            .rk-legend i { width: 7px; height: 7px; border-radius: 50%; display: block; }
            .rk-legend i.sq { border-radius: 2px; background: var(--rk-ink); }
            .rk-req { margin-top: 1.1rem; border: 1px solid rgba(212,160,176,0.4); border-radius: 12px; padding: 0.8rem 1rem; background: linear-gradient(100deg, rgba(212,160,176,0.1), rgba(184,160,212,0.1)); }
            .rk-req span { font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--rk-rose-deep); }
            .rk-req b { display: block; font-family: var(--font-cormorant), serif; font-weight: 400; font-size: 1.4rem; color: var(--rk-ink); margin-top: 0.2rem; }
            .rk-times { display: flex; gap: 0.5rem; margin-top: 1rem; }
            .rk-time { flex: 1; text-align: center; font-size: 0.82rem; padding: 0.52rem 0; border: 1px solid var(--rk-border); border-radius: 8px; color: var(--rk-muted); background: #fff; }
            .rk-time--on { background: var(--rk-ink); color: #fff; border-color: var(--rk-ink); }
            /* receipt */
            .rk-receipt-row { display: flex; justify-content: space-between; align-items: baseline; font-size: 0.92rem; color: var(--rk-muted); padding: 0.5rem 0; }
            .rk-receipt-row b { color: var(--rk-ink); font-family: var(--font-cormorant), serif; font-size: 1.1rem; font-weight: 400; }
            .rk-receipt-total { display: flex; justify-content: space-between; align-items: baseline; padding-top: 0.75rem; margin-top: 0.3rem; border-top: 1px solid var(--rk-border); }
            .rk-receipt-total span { font-size: 0.92rem; color: var(--rk-ink); font-weight: 600; }
            .rk-receipt-total b { font-family: var(--font-cormorant), serif; font-weight: 500; font-size: 1.7rem; color: var(--rk-rose-deep); }
            /* DM list extras */
            .rk-msg-time { font-size: 0.66rem; color: var(--rk-faint); white-space: nowrap; }
            .rk-typing { display: inline-flex; gap: 3px; align-items: center; }
            .rk-typing i { width: 5px; height: 5px; border-radius: 50%; background: var(--rk-faint); display: block; animation: rk-type 1.2s infinite ease-in-out; }
            .rk-typing i:nth-child(2) { animation-delay: 0.18s; } .rk-typing i:nth-child(3) { animation-delay: 0.36s; }
            @keyframes rk-type { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-2px); } }
            @media (prefers-reduced-motion: reduce) { .rk-typing i { animation: none; } }
            .rk-collide { font-size: 0.6rem; color: #D98A8A; border: 1px solid #F2D4D4; background: #FDF4F4; border-radius: 100px; padding: 0.1rem 0.5rem; white-space: nowrap; }
            .rk-chaos-stack { margin-top: 0.7rem; overflow: hidden; border: 1px solid var(--rk-border); border-radius: 14px; background: rgba(255,255,255,0.72); box-shadow: 0 10px 34px rgba(17,17,17,0.06); }
            .rk-live-label { display: block; padding: 0.58rem 0.82rem; border-bottom: 1px solid var(--rk-border-2); color: var(--rk-rose-deep); font-size: 0.56rem; letter-spacing: 0.14em; text-transform: uppercase; }
            .rk-chaos-msg { display: grid; grid-template-columns: 34px 1fr; gap: 0.72rem; align-items: start; padding: 0.72rem 0.82rem; border-bottom: 1px solid var(--rk-border-2); }
            .rk-chaos-msg:last-child { border-bottom: none; }
            .rk-chaos-msg b { display: block; font-size: 0.82rem; color: var(--rk-ink); }
            .rk-chaos-msg p { min-height: 1.1rem; margin: 0.12rem 0 0; color: var(--rk-muted); font-size: 0.76rem; line-height: 1.45; }
            .rk-chaos-caret { display: inline-block; width: 1px; height: 0.85em; margin-left: 2px; background: var(--rk-rose-deep); transform: translateY(1px); }
            .rk-chaos-msg .rk-typing { margin-left: 0.34rem; }
            /* booking confirm-by-Roko row */
            .rk-confirmrow { display: flex; align-items: center; gap: 0.7rem; margin-top: 1.1rem; }
            .rk-confirmchip { display: inline-flex; align-items: center; gap: 0.45rem; background: #FDF8FA; border: 1px solid var(--rk-border); border-radius: 100px; padding: 0.45rem 0.85rem; font-size: 0.76rem; color: var(--rk-plum-text); white-space: nowrap; flex-shrink: 0; }
            .rk-confirmcap { font-size: 0.72rem; line-height: 1.4; color: var(--rk-muted); }
            .rk-request-sent { display: grid; grid-template-columns: auto 1fr; gap: 0.72rem; align-items: center; margin-top: 0.82rem; padding: 0.72rem 0.85rem; border: 1px solid #E8C4D0; border-radius: 13px; background: #FDF8FA; }
            .rk-request-check { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; color: #fff; background: var(--rk-rose-deep); font-size: 0.75rem; }
            .rk-request-sent b { display: block; color: var(--rk-ink); font-size: 0.8rem; }
            .rk-request-sent p { margin: 0.1rem 0 0; color: var(--rk-muted); font-size: 0.7rem; line-height: 1.42; }
            /* Zelle deposit */
            .rk-zelle { background: #FDF8FA; border: 1px solid #F0E0E9; border-radius: 12px; padding: 0.85rem 1rem; margin-top: 0.9rem; }
            .rk-zelle-row { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
            .rk-zelle-to { font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--rk-muted); }
            .rk-zelle-name { font-family: var(--font-cormorant), serif; font-size: 1.05rem; color: var(--rk-ink); }
            .rk-zelle-num { font-size: 0.85rem; color: var(--rk-plum-text); letter-spacing: 0.04em; }
            .rk-btn-rose { margin-top: 0.85rem; width: 100%; padding: 0.72rem 1rem; border: none; border-radius: 100px; background: var(--rk-rose-deep); color: #fff; font-size: 0.82rem; font-weight: 500; cursor: default; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; }
            .rk-paid { display: flex; align-items: center; gap: 0.7rem; background: #fff; border: 1px solid var(--rk-border); border-radius: 14px; padding: 0.85rem 1rem; }
            .rk-paid-val { font-family: var(--font-cormorant), serif; font-size: 1.2rem; color: var(--rk-rose-deep); }
            /* email, real confirmation design */
            .rk-email { text-align: center; }
            .rk-email-wm { font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--rk-rose-deep); }
            .rk-email-circle { width: 48px; height: 48px; border-radius: 50%; margin: 0.9rem auto 0; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: var(--rk-rose-deep); background: linear-gradient(135deg, #FDF0F5, #F7D8E5); }
            .rk-email-h { font-family: var(--font-cormorant), serif; font-weight: 300; font-size: clamp(1.9rem, 3vw, 2.6rem); color: var(--rk-ink); margin: 0.7rem 0 0; line-height: 1.05; }
            .rk-email-h em { font-style: italic; color: var(--rk-rose-deep); }
            .rk-email-sub { font-family: var(--font-cormorant), serif; font-style: italic; color: var(--rk-muted); font-size: 1.05rem; margin-top: 0.3rem; }
            .rk-email-body { font-size: 0.92rem; line-height: 1.6; color: #444; margin: 1.2rem 0 0; }
            .rk-email-card { text-align: left; background: var(--rk-surface); border: 1px solid var(--rk-border-2); border-radius: 12px; padding: 1rem 1.15rem; margin-top: 1.2rem; }
            .rk-email-label { font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--rk-rose-deep); }
            .rk-detail-row { display: flex; justify-content: space-between; gap: 1rem; padding: 0.55rem 0; border-bottom: 1px solid #F5E8EF; }
            .rk-detail-row:last-child { border-bottom: none; }
            .rk-detail-row span { font-size: 0.84rem; color: #888; }
            .rk-detail-row b { font-size: 0.84rem; color: #111; font-weight: 500; }
            .rk-note { text-align: left; background: #FDF8FA; border-left: 3px solid #E8C4D0; border-radius: 6px; padding: 0.75rem 0.9rem; margin-top: 1.1rem; font-size: 0.82rem; line-height: 1.5; color: #6E6058; }
            .rk-email-foot { margin-top: 1.2rem; }
            .rk-email-foot-love { font-family: var(--font-cormorant), serif; font-style: italic; color: var(--rk-rose-deep); font-size: 1.1rem; }
            .rk-email-foot-ig { font-size: 0.74rem; color: #999; margin-top: 0.2rem; }
            /* phone mock, full iPhone, side by side with the booking calendar */
            .rk-bookrow { display: block; }
            @media (min-width: 1025px) { .rk-bookrow { display: flex; align-items: center; gap: clamp(1.4rem, 2.4vw, 2.75rem); overflow: visible; } .rk-bookrow > .rk-tile { flex: 1; min-width: 0; } }
            .rk-phone-float { flex-shrink: 0; width: clamp(210px, 15vw, 270px); margin: 0.6rem clamp(0.9rem, 1.6vw, 1.5rem) 0.6rem 0; }
            .rk-phone {
              position: relative; width: 100%; transform: rotate(-6deg); border-radius: 18% / 8.4%;
              background: linear-gradient(145deg, #28282c 0%, #0d0d10 44%, #050506 100%);
              padding: 7px; box-shadow: 0 42px 86px -28px rgba(0,0,0,0.78), 0 18px 38px -24px rgba(196,132,154,0.7), inset 0 0 0 1px rgba(255,255,255,0.1);
            }
            .rk-phone::before { content: ""; position: absolute; left: -3px; top: 22%; width: 3px; height: 15%; border-radius: 3px 0 0 3px; background: linear-gradient(#303036, #0b0b0d); box-shadow: 0 42px 0 #111116; }
            .rk-phone::after { content: ""; position: absolute; right: -3px; top: 30%; width: 3px; height: 19%; border-radius: 0 3px 3px 0; background: linear-gradient(#303036, #0b0b0d); }
            .rk-phone-screen { position: relative; aspect-ratio: 390 / 844; background: var(--rk-surface); border-radius: 16.5% / 7.4%; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.22); }
            .rk-phone-screen::before { content: ""; position: absolute; z-index: 4; top: 10px; left: 50%; width: 31%; height: 21px; transform: translateX(-50%); border-radius: 999px; background: #09090a; box-shadow: inset 0 -1px 1px rgba(255,255,255,0.09), 0 1px 1px rgba(255,255,255,0.12); }
            .rk-phone-screen::after { content: ""; position: absolute; inset: 0; z-index: 3; pointer-events: none; background: linear-gradient(116deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 18%, rgba(255,255,255,0) 39%); mix-blend-mode: screen; }
            .rk-phone-screen-inner, .rk-phone-stage { position: absolute; inset: 0; }
            .rk-phone-stage { display: flex; flex-direction: column; padding: 2.55rem 1rem 1rem; }
            .rk-phone-home { color: #fff; background: radial-gradient(80% 52% at 28% 20%, rgba(212,160,176,0.4), transparent 64%), linear-gradient(158deg, #161116 0%, #251826 48%, #080607 100%); }
            .rk-phone-home-time { font-family: var(--font-cormorant), serif; font-size: 1.8rem; line-height: 1; }
            .rk-app-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.72rem 0.58rem; margin-top: 1rem; }
            .rk-app { position: relative; display: grid; justify-items: center; gap: 0.22rem; color: rgba(255,255,255,0.8); font-size: 0.45rem; }
            .rk-app i { width: 32px; height: 32px; border-radius: 9px; display: block; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.28); }
            .rk-phone-dock { position: relative; display: flex; justify-content: center; gap: 0.65rem; margin-top: auto; padding: 0.55rem; border-radius: 18px; background: rgba(255,255,255,0.13); backdrop-filter: blur(8px); }
            .rk-app--safari i { border-radius: 50%; background: radial-gradient(circle at 50% 50%, #fff 0 18%, #D4A0B0 19% 34%, #111 35% 38%, #FDF8FA 39% 100%); }
            .rk-phone-tap { position: absolute; left: 50%; bottom: 1.16rem; width: 38px; height: 38px; margin-left: -19px; border: 1px solid rgba(255,255,255,0.8); border-radius: 50%; pointer-events: none; }
            .rk-phone-safari { background: #F8F4F6; color: var(--rk-ink); }
            .rk-safari-top { height: 2rem; display: flex; align-items: center; justify-content: center; border-radius: 999px; background: #fff; border: 1px solid var(--rk-border-2); font-size: 0.54rem; color: var(--rk-muted); }
            .rk-phone-load { width: 100%; height: 2px; margin-top: 0.65rem; transform-origin: left; background: var(--rk-rose-deep); border-radius: 999px; }
            .rk-safari-card { margin-top: 1rem; padding: 0.9rem; border-radius: 14px; background: #fff; border: 1px solid var(--rk-border); box-shadow: 0 12px 24px rgba(17,17,17,0.05); }
            .rk-safari-mark { display: block; color: var(--rk-rose-deep); font-size: 0.48rem; letter-spacing: 0.16em; }
            .rk-safari-card b { display: block; margin-top: 0.45rem; font-family: var(--font-cormorant), serif; font-weight: 400; font-size: 1.05rem; line-height: 1.05; }
            .rk-mini-hero { padding: 0; justify-content: flex-end; overflow: hidden; color: #fff; background: #080607; }
            .rk-mini-hero img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 58% top; filter: saturate(0) brightness(0.72); }
            .rk-mini-hero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(8,6,7,0.88) 0%, rgba(8,6,7,0.12) 72%); }
            .rk-mini-hero-copy { position: relative; z-index: 1; padding: 0 1rem 1.05rem; }
            .rk-mini-hero-copy span { display: block; font-size: 0.48rem; letter-spacing: 0.16em; color: rgba(255,255,255,0.72); }
            .rk-mini-hero-copy b { display: block; margin-top: 0.4rem; font-family: var(--font-cormorant), serif; font-weight: 500; font-size: 2rem; line-height: 0.92; }
            .rk-mini-hero-copy em { color: var(--rk-rose); font-style: italic; }
            .rk-mini-hero-copy p { margin: 0.55rem 0 0; font-size: 0.58rem; color: rgba(255,255,255,0.66); }
            .rk-phone-body { background: var(--rk-surface); }
            .rk-phone-list { margin-top: 0.7rem; display: grid; gap: 0.1rem; }
            .rk-phone-tier { display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; padding: 0.55rem 0; border-bottom: 1px solid var(--rk-border-2); }
            .rk-phone-tier:last-child { border-bottom: none; }
            .rk-phone-tier--active { margin: 0 -0.45rem; padding-inline: 0.45rem; border-radius: 10px; background: #fff; box-shadow: 0 8px 18px rgba(17,17,17,0.06); }
            .rk-phone-tier b { font-family: var(--font-cormorant), serif; font-weight: 400; font-size: 0.9rem; color: var(--rk-ink); }
            .rk-phone-tier span { font-family: var(--font-cormorant), serif; font-size: 0.9rem; color: var(--rk-ink); }
            .rk-phone-tier em { display: block; font-style: normal; font-size: 0.52rem; color: var(--rk-rose-deep); text-align: right; }
            .rk-phone-cta { margin-top: auto; text-align: center; font-size: 0.6rem; color: #fff; background: var(--rk-ink); border-radius: 100px; padding: 0.6rem; }
            .rk-mini-booking { background: #fff; color: var(--rk-ink); }
            .rk-mini-booking > b { margin-top: 0.28rem; font-family: var(--font-cormorant), serif; font-weight: 400; font-size: 1.45rem; line-height: 1; }
            .rk-mini-date-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; margin-top: 1.05rem; }
            .rk-mini-date-grid span { aspect-ratio: 1; display: grid; place-items: center; color: var(--rk-muted); font-size: 0.64rem; border-radius: 5px; background: #FDF8FA; }
            .rk-mini-date-grid .is-selected { color: #fff; background: var(--rk-ink); }
            .rk-mini-sent { display: flex; align-items: flex-start; gap: 0.55rem; margin-top: auto; border: 1px solid var(--rk-border); border-radius: 14px; padding: 0.7rem; background: #FDF8FA; }
            .rk-mini-sent p { margin: 0; color: var(--rk-muted); font-size: 0.58rem; line-height: 1.45; }
            .rk-mini-sent p b { display: block; color: var(--rk-ink); font-size: 0.66rem; margin-bottom: 0.08rem; }
            @media (max-width: 1024px) { .rk-phone-float { display: none; } }
            @media (max-width: 760px) {
              .rk-hero-shot { min-height: clamp(420px, 118vw, 620px); }
              .rk-hero-shot-img { min-height: clamp(420px, 118vw, 620px); object-position: 45% top; }
              .rk-confirmrow { align-items: flex-start; flex-direction: column; }
              .rk-confirmchip { white-space: normal; }
              .rk-request-sent { grid-template-columns: auto 1fr; }
              .rk-chaos-msg { grid-template-columns: 30px 1fr; gap: 0.62rem; padding-inline: 0.72rem; }
            }
          ` }} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function MetaBlock({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <span className="eyebrow" style={{ color: "var(--gray-light)" }}>{label}</span>
      <div style={{ marginTop: "0.6rem", display: "grid", gap: "0.25rem" }}>
        {values.map((v) => (
          <span key={v} style={{ fontSize: "1rem", color: "var(--ink-soft)" }}>{v}</span>
        ))}
      </div>
    </div>
  );
}

const ROKO_TIERS = [
  { name: "Bridal Trial", price: "$500", dep: "$250 deposit" },
  { name: "Luxury Bridal Look", price: "$750", dep: "$375 deposit" },
  { name: "Full Day Service", price: "$1,700", dep: "$850 deposit" },
];

const ROKO_ASSETS = {
  heroShot: "/roko-hero-screenshot.png",
  heroPoster: "https://makeupby-roko.vercel.app/hero-poster.jpg",
  roko: "https://makeupby-roko.vercel.app/roko_pic.png",
  bridal: "https://makeupby-roko.vercel.app/bridal_trial.png",
};

const rkViewport = { once: false, amount: 0.45 };

function useReplaySequence(length: number, interval = 850) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? length - 1 : 0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const replay = () => {
    clear();
    if (reduce) {
      setStep(length - 1);
      return;
    }
    setStep(0);
    for (let i = 1; i < length; i++) {
      timers.current.push(setTimeout(() => setStep(i), i * interval));
    }
  };

  useEffect(() => () => clear(), []);

  return { step, reduce, replay };
}

/* The preview pane uses a real current hero capture so the case study leads with
   the live product instead of a recreated approximation. */
function RokoPreview() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="rk rk-frame rk-preview"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease }}
    >
      <div className="rk-bar">
        <span className="rk-dots" aria-hidden><i /><i /><i /></span>
        <span className="rk-url">makeupby-roko.vercel.app</span>
      </div>
      <div className="rk-hero-shot">
        <motion.img
          src={ROKO_ASSETS.heroShot}
          alt="Makeup by Roko homepage hero"
          className="rk-hero-shot-img"
          initial={reduce ? false : { opacity: 0, scale: 1.015 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.72, ease }}
        />
      </div>
    </motion.div>
  );
}

/* Each case-study section gets a Roko-styled product fragment instead of a flat
   screenshot, so scrolling feels like flipping through the live platform. */
function RokoTile({ section, index }: { section: { title: string; image?: string }; index: number }) {
  if (section.image) {
    return <img src={section.image} alt={section.title} className="rk-tile" style={{ width: "100%", display: "block" }} />;
  }
  const tile = (
    <div className="rk rk-tile">
      <div className="rk-tile-head">
        <span className="rk-tile-label">{section.title}</span>
        <span className="rk-dots" aria-hidden><i /><i /><i /></span>
      </div>
      <div className="rk-tile-body">{rokoFragment(index)}</div>
    </div>
  );
  // The booking section gets a real iPhone mockup beside it (the site is mobile-first).
  if (index === 1) {
    return (
      <div className="rk rk-bookrow">
        {tile}
        <PhoneMock />
      </div>
    );
  }
  return tile;
}

const DM_ROWS = [
  { name: "Bride · Priya", msg: "hey!! is June 14 still open??", time: "2h", unread: true },
  { name: "Maria K.", msg: "wait where do I send the Zelle deposit again?", time: "5h", unread: true },
  { name: "Unknown", msg: "your work is unreal, are you free that weekend?", time: "Yesterday", unread: true },
  { name: "Bride · Sam", msg: "did we say 9 or 10am??", time: "Yesterday", collision: true },
];

const CHAOS_TYPERS = [
  { name: "Aaliyah", msg: "Can you hold June 14 for me? My venue just changed the ready-by plan." },
  { name: "Leena", msg: "I sent my deposit screenshot, did it come through on your end?" },
  { name: "Noura", msg: "My sister wants the same weekend too. Is there any opening left?" },
];

function rokoFragment(index: number) {
  switch (index) {
    case 0: // The problem, scattered, "alive" DMs
      return <RokoProblemFlow />;
    case 1: // Booking & scheduling, live availability calendar
      return <RokoCalendar />;
    case 2: // Deposits & payments, the real Zelle flow
      return <RokoDepositFlow />;
    default: // Automation, the real confirmation email
      return <RokoConfirmationEmail />;
  }
}

function RokoProblemFlow() {
  const reduce = useReducedMotion();
  const [typedMessages, setTypedMessages] = useState(() => (
    reduce ? CHAOS_TYPERS.map((t) => t.msg) : CHAOS_TYPERS.map(() => "")
  ));
  const [activeTyper, setActiveTyper] = useState(reduce ? CHAOS_TYPERS.length : 0);
  const typingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTyping = () => {
    typingTimers.current.forEach(clearTimeout);
    typingTimers.current = [];
  };

  const replayTyping = () => {
    clearTyping();
    if (reduce) {
      setTypedMessages(CHAOS_TYPERS.map((t) => t.msg));
      setActiveTyper(CHAOS_TYPERS.length);
      return;
    }

    setTypedMessages(CHAOS_TYPERS.map(() => ""));
    setActiveTyper(0);
    CHAOS_TYPERS.forEach((item, index) => {
      const start = 620 + index * 1180;
      typingTimers.current.push(setTimeout(() => setActiveTyper(index), start));
      Array.from(item.msg).forEach((_, charIndex) => {
        typingTimers.current.push(setTimeout(() => {
          setTypedMessages((current) => {
            const next = [...current];
            next[index] = item.msg.slice(0, charIndex + 1);
            return next;
          });
        }, start + charIndex * 18));
      });
    });
    typingTimers.current.push(setTimeout(() => setActiveTyper(CHAOS_TYPERS.length), 4300));
  };

  useEffect(() => () => clearTyping(), []);

  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={rkViewport}
      onViewportEnter={replayTyping}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {DM_ROWS.map((r, i) => (
        <motion.div
          className="rk-msg"
          key={r.name}
          variants={{
            hidden: { opacity: 0, x: i % 2 ? 14 : -14 },
            show: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.38, ease }}
        >
          <span className="rk-msg-av" aria-hidden />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <b>{r.name}</b>
              {r.collision && <span className="rk-collide">double-booked?</span>}
            </div>
            <p>{r.msg}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
            <span className="rk-msg-time">{r.time}</span>
            {r.unread && <span className="rk-msg-dot" aria-hidden />}
          </div>
        </motion.div>
      ))}
      <motion.div
        className="rk-chaos-stack"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={rkViewport}
        transition={{ duration: 0.36, delay: 0.44, ease }}
      >
        <span className="rk-live-label">Still coming in</span>
        <AnimatePresence>
          {CHAOS_TYPERS.map((item, index) => {
            const typed = typedMessages[index];
            const visible = reduce || typed || activeTyper >= index;
            const typing = activeTyper === index && typed.length < item.msg.length;
            if (!visible) return null;
            return (
              <motion.div
                className="rk-chaos-msg"
                key={item.name}
                initial={reduce ? false : { opacity: 0, x: -10 }}
                animate={reduce ? undefined : { opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.3, ease }}
              >
                <span className="rk-msg-av" aria-hidden />
                <div>
                  <b>{item.name}</b>
                  <p>
                    {typed}
                    {typing && <span className="rk-chaos-caret" aria-hidden />}
                    {typing && <span className="rk-typing" aria-hidden><i /><i /><i /></span>}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* Live availability calendar, the real request flow: the client picks a DATE
   only; Roko confirms the time. Emerald = open, amber = filling, red = booked. */
function RokoCalendar() {
  const reduce = useReducedMotion();
  const blanks = 1; // June 1 sits on Monday
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const klass = (d: number) => {
    if ([1, 2, 3, 4, 5, 6, 7, 8, 11, 20].includes(d)) return "rk-day rk-day--booked";
    if (d === 12) return "rk-day rk-day--today";
    if (d === 14) return "rk-day rk-day--sel";
    if ([10, 17, 24, 28].includes(d)) return "rk-day rk-day--fill";
    return "rk-day rk-day--open";
  };
  return (
    <motion.div
      className="rk-card"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.45, ease }}
    >
      <div className="rk-cal-head">
        <span className="rk-cal-nav" aria-hidden>‹</span>
        <span className="rk-serif rk-cal-title">June 2026</span>
        <span className="rk-cal-nav" aria-hidden>›</span>
      </div>
      <div className="rk-week">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="rk-days">
        {Array.from({ length: blanks }).map((_, i) => (
          <span key={`b${i}`} />
        ))}
        {days.map((d) => {
          const c = klass(d);
          const dot = c.includes("--open") || c.includes("--fill");
          return (
            <motion.span
              key={d}
              className={c}
              initial={reduce || d !== 14 ? false : { backgroundColor: "#ffffff", color: "#8a8a8a", scale: 0.94 }}
              whileInView={reduce || d !== 14 ? undefined : { backgroundColor: "#111111", color: "#ffffff", scale: [0.94, 1.08, 1] }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.38, delay: 0.42, ease }}
            >
              {d}
              {dot && <i aria-hidden />}
            </motion.span>
          );
        })}
      </div>
      <div className="rk-legend">
        <span><i style={{ background: "#34D399" }} aria-hidden />Open</span>
        <span><i style={{ background: "#F0C27A" }} aria-hidden />Filling</span>
        <span><i style={{ background: "#FCA5A5" }} aria-hidden />Booked</span>
        <span><i className="sq" aria-hidden />Selected</span>
      </div>
      <motion.div
        className="rk-req"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.38, delay: 0.78, ease }}
      >
        <span>Requested date</span>
        <b>Saturday, June 14</b>
      </motion.div>
      <div className="rk-confirmrow">
        <span className="rk-confirmchip"><span className="rk-check" style={{ width: 15, height: 15, fontSize: "0.55rem" }} aria-hidden>✓</span> Time confirmed by Roko</span>
        <span className="rk-confirmcap">You request the date, Roko confirms your exact time within 24–48 hrs.</span>
      </div>
      <motion.button
        type="button"
        className="rk-btn"
        tabIndex={-1}
        initial={false}
        whileInView={reduce ? undefined : { scale: [1, 0.97, 1] }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.28, delay: 1.15, ease }}
      >
        Request this date
      </motion.button>
      <motion.div
        className="rk-request-sent"
        initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.38, delay: 1.38, ease }}
      >
        <motion.span
          className="rk-request-check"
          aria-hidden
          initial={reduce ? false : { scale: 0.72, opacity: 0 }}
          whileInView={reduce ? undefined : { scale: [0.72, 1.12, 1], opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.36, delay: 1.5, ease }}
        >
          ✓
        </motion.span>
        <div>
          <b>Request sent to Roko</b>
          <p>She reviews the preferred date, then confirms the exact time within 24–48 hrs.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RokoDepositFlow() {
  const reduce = useReducedMotion();
  const [paid, setPaid] = useState(Boolean(reduce));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const replay = () => {
    if (timer.current) clearTimeout(timer.current);
    if (reduce) {
      setPaid(true);
      return;
    }
    setPaid(false);
    timer.current = setTimeout(() => setPaid(true), 900);
  };

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <motion.div
      style={{ display: "grid", gap: "0.9rem" }}
      viewport={{ once: false, amount: 0.5 }}
      onViewportEnter={replay}
    >
      <div className="rk-card">
        <div className="rk-row">
          <span className="rk-eyebrow">Deposit</span>
          <span className="rk-mini">{paid ? "Verified" : "Action required"}</span>
        </div>
        <h4 className="rk-serif" style={{ fontSize: "1.65rem", color: "var(--rk-rose-deep)", margin: "0.6rem 0 0.6rem" }}>Deposit to Book</h4>
        <div className="rk-receipt-row"><span>Bridal Trial</span><b>$500.00</b></div>
        <div className="rk-receipt-row"><span>Deposit (held)</span><b>$250.00</b></div>
        <div className="rk-receipt-total"><span>{paid ? "Paid · Zelle" : "Due now · Zelle"}</span><b>$250.00</b></div>
        <AnimatePresence mode="wait">
          {!paid ? (
            <motion.div
              key="zelle-due"
              className="rk-zelle"
              initial={reduce ? false : { opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease }}
            >
              <div className="rk-zelle-row">
                <div>
                  <div className="rk-zelle-to">Zelle to</div>
                  <div className="rk-zelle-name">Ruqia M.</div>
                </div>
                <div className="rk-zelle-num">(•••) •••-••97</div>
              </div>
              <motion.button
                type="button"
                className="rk-btn-rose"
                tabIndex={-1}
                animate={reduce ? undefined : { scale: [1, 0.97, 1] }}
                transition={{ duration: 0.28, delay: 0.48, ease }}
              >
                <span aria-hidden>⤒</span> Upload Zelle screenshot
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="zelle-paid"
              className="rk-paid"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.32, ease }}
            >
              <motion.span
                className="rk-check"
                style={{ width: 22, height: 22, fontSize: "0.72rem" }}
                aria-hidden
                initial={reduce ? false : { opacity: 0, scale: 0.65 }}
                animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.28, delay: 0.08, ease }}
              >
                ✓
              </motion.span>
              <div>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--rk-muted)" }}>Deposit paid · $250.00 · Zelle</div>
                <div className="rk-paid-val">Date secured</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <p style={{ marginTop: "0.7rem", fontSize: "0.72rem", color: "var(--rk-muted)" }}>Remaining balance due in cash on the day.</p>
      </div>
    </motion.div>
  );
}

function RokoConfirmationEmail() {
  const reduce = useReducedMotion();
  const rowMotion = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 8 },
    whileInView: reduce ? undefined : { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.5 },
    transition: { duration: 0.32, delay, ease },
  });

  return (
    <div className="rk-card rk-email">
      <div className="rk-email-wm">Makeup by Roko</div>
      <motion.div
        className="rk-email-circle"
        aria-hidden
        initial={reduce ? false : { opacity: 0, scale: 0.72 }}
        whileInView={reduce ? undefined : { opacity: 1, scale: [0.72, 1.08, 1] }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.42, ease }}
      >
        ✓
      </motion.div>
      <h4 className="rk-email-h">
        You&rsquo;re <em>Confirmed!</em>
      </h4>
      <div className="rk-email-sub">Can&rsquo;t wait to see you ✦</div>
      <p className="rk-email-body">Hey Priya! Your Bridal Trial appointment on Saturday, June 14 at 10:30 AM is officially confirmed.</p>
      <div className="rk-email-card">
        <span className="rk-email-label">Appointment details</span>
        <div style={{ marginTop: "0.6rem" }}>
          <motion.div className="rk-detail-row" {...rowMotion(0.12)}><span>Service</span><b>Bridal Trial</b></motion.div>
          <motion.div className="rk-detail-row" {...rowMotion(0.2)}><span>Date</span><b>Saturday, June 14</b></motion.div>
          <motion.div className="rk-detail-row" {...rowMotion(0.28)}><span>Time</span><b>10:30 AM</b></motion.div>
          <motion.div className="rk-detail-row" {...rowMotion(0.36)}><span>Status</span><b style={{ color: "var(--rk-rose-deep)" }}>✓ Confirmed</b></motion.div>
        </div>
      </div>
      <div className="rk-note">Remaining balance is due in cash on the day of your appointment.</div>
      <div className="rk-email-foot">
        <div className="rk-email-foot-love">With love, Roko</div>
        <div className="rk-email-foot-ig">@makeupbyroko_</div>
      </div>
    </div>
  );
}

function PhoneHomeScreen() {
  const apps = ["Photos", "Mail", "Calendar", "Camera", "Notes", "Maps"];
  return (
    <div className="rk-phone-stage rk-phone-home">
      <div className="rk-phone-home-time">9:41</div>
      <div className="rk-app-grid">
        {apps.map((app, i) => (
          <span className="rk-app" key={app}>
            <i style={{ background: i % 2 ? "#F7D8E5" : "#FDF8FA" }} />
            <b>{app}</b>
          </span>
        ))}
      </div>
      <div className="rk-phone-dock">
        <span className="rk-app rk-app--safari">
          <i />
          <b>Safari</b>
        </span>
        <motion.span
          className="rk-phone-tap"
          aria-hidden
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 1.45] }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
        />
      </div>
    </div>
  );
}

function PhoneSafariScreen() {
  return (
    <div className="rk-phone-stage rk-phone-safari">
      <div className="rk-safari-top">
        <span>makeupby-roko.vercel.app</span>
      </div>
      <motion.div
        className="rk-phone-load"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.62, ease }}
      />
      <div className="rk-safari-card">
        <span className="rk-safari-mark">MAKEUP BY ROKO</span>
        <b>Loading bridal booking platform</b>
      </div>
    </div>
  );
}

function PhoneHeroScreen() {
  return (
    <div className="rk-phone-stage rk-mini-hero">
      <img src={ROKO_ASSETS.heroPoster} alt="" />
      <div className="rk-mini-hero-copy">
        <span>MAKEUP BY ROKO</span>
        <b>Roqia <em>Moshref</em></b>
        <p>Bay Area, California</p>
      </div>
    </div>
  );
}

function PhoneServicesScreen() {
  return (
    <div className="rk-phone-stage rk-phone-body">
      <span className="rk-eyebrow" style={{ fontSize: "0.52rem" }}>Choose your service</span>
      <div className="rk-phone-list">
        {ROKO_TIERS.map((t, index) => (
          <motion.div
            className={`rk-phone-tier ${index === 1 ? "rk-phone-tier--active" : ""}`}
            key={t.name}
            initial={false}
            animate={index === 1 ? { scale: [1, 0.985, 1] } : undefined}
            transition={{ duration: 0.32, delay: 0.28, ease }}
          >
            <b>{t.name}</b>
            <span>
              {t.price}
              <em>{t.dep}</em>
            </span>
          </motion.div>
        ))}
      </div>
      <div className="rk-phone-cta">Request your date</div>
    </div>
  );
}

function PhoneRequestScreen() {
  return (
    <div className="rk-phone-stage rk-mini-booking">
      <span className="rk-eyebrow">Preferred date</span>
      <b>Saturday, June 14</b>
      <div className="rk-mini-date-grid">
        {[9, 10, 13, 14, 15, 16, 17].map((day) => (
          <span className={day === 14 ? "is-selected" : ""} key={day}>{day}</span>
        ))}
      </div>
      <div className="rk-mini-sent">
        <span className="rk-check" aria-hidden>✓</span>
        <p><b>Request sent</b>Roko confirms your exact time within 24–48 hrs.</p>
      </div>
    </div>
  );
}

/* Mobile mockup, full iPhone, showing the real mobile-first request flow. */
function PhoneMock() {
  const { step, reduce, replay } = useReplaySequence(5, 760);
  const activeStep = reduce ? 4 : step;
  const screens = [
    <PhoneHomeScreen key="home" />,
    <PhoneSafariScreen key="safari" />,
    <PhoneHeroScreen key="hero" />,
    <PhoneServicesScreen key="services" />,
    <PhoneRequestScreen key="request" />,
  ];

  return (
    <motion.div
      className="rk-phone-float"
      aria-hidden
      animate={reduce ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      onViewportEnter={replay}
      viewport={{ once: false, amount: 0.5 }}
    >
      <div className="rk-phone">
        <div className="rk-phone-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              className="rk-phone-screen-inner"
              initial={reduce ? false : { opacity: 0, y: 10, scale: 0.985 }}
              animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: -8, scale: 0.99 }}
              transition={{ duration: 0.36, ease }}
            >
              {screens[activeStep]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* Refined light "preview card" placeholder so the feature reads as intentional
   until a real screenshot lands. Sharp corners, warm wash that nods to the brand. */
function Placeholder({ p }: { p: Project }) {
  const host = p.url.replace(/^https?:\/\//, "");
  return (
    <div
      className="grain-cream"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background:
          "radial-gradient(90% 80% at 80% 12%, rgba(216,98,79,0.30) 0%, rgba(216,98,79,0) 60%), linear-gradient(155deg, #f2ece5 0%, #e8dad3 52%, #e0c8c0 100%)",
      }}
    >
      <span className="eyebrow" style={{ position: "absolute", top: "1.6rem", left: "1.6rem", color: "var(--cream-ink-soft)" }}>
        {p.category}
      </span>
      <span style={{ position: "absolute", top: "1.6rem", right: "1.6rem", fontSize: "0.76rem", letterSpacing: "0.04em", color: "var(--cream-ink-soft)" }}>
        {host} ↗
      </span>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <span className="display" style={{ fontSize: "clamp(1.9rem, 4.4vw, 3.4rem)", color: "var(--cream-ink)", letterSpacing: "-0.035em" }}>
          {p.client}
        </span>
        <span style={{ width: 44, height: 1, background: "var(--cream-line-strong)" }} />
        <span className="eyebrow" style={{ color: "var(--cream-ink-soft)" }}>Live preview</span>
      </div>

      <span
        className="display"
        aria-hidden
        style={{ position: "absolute", right: "1.4rem", bottom: "-1.8rem", fontSize: "clamp(5rem, 14vw, 11rem)", color: "rgba(23,20,15,0.06)", letterSpacing: "-0.04em" }}
      >
        {p.year}
      </span>
    </div>
  );
}

/* ── The eye + red laser. The eye sleeps (closed) until the cursor stirs, then
   blinks open, tracks the cursor, and fires a detailed red beam at it. ── */
function EyeLaser() {
  const reduce = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });
  const eyeRest = useRef({ x: 0, y: 0 });
  const raf = useRef<number>();
  const awakeRef = useRef(false);
  const lastMove = useRef(0);

  const [eye, setEye] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [awake, setAwake] = useState(false);
  const [lid, setLid] = useState(0); // 0 = closed/asleep, 1 = open

  // Measure the eye pupil within the overlay.
  useEffect(() => {
    const measure = () => {
      const ov = overlayRef.current;
      const ey = eyeRef.current;
      if (!ov || !ey) return;
      const o = ov.getBoundingClientRect();
      const e = ey.getBoundingClientRect();
      const ex = e.left - o.left + e.width / 2;
      const ey2 = e.top - o.top + e.height / 2;
      setEye({ x: ex, y: ey2 });
      eyeRest.current = { x: ex, y: ey2 };
      target.current = { x: ex, y: ey2 };
      cur.current = { x: ex, y: ey2 };
      setPos({ x: ex, y: ey2 });
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 400);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  // Reduced motion: just hold the eye open, no laser, no blinking.
  useEffect(() => {
    if (reduce) {
      awakeRef.current = true;
      setAwake(true);
      setLid(1);
    }
  }, [reduce]);

  // Track the cursor; wake + open the eye on first stir.
  useEffect(() => {
    if (reduce) return;
    const onMove = (ev: MouseEvent) => {
      const ov = overlayRef.current;
      if (!ov) return;
      const r = ov.getBoundingClientRect();
      const x = ev.clientX - r.left;
      const y = ev.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      setActive(inside);
      target.current = inside ? { x, y } : eyeRest.current;
      lastMove.current = performance.now();
      if (!awakeRef.current) {
        awakeRef.current = true;
        setAwake(true);
        setLid(1); // wake = eye opens
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  // Doze off after a few seconds of stillness (eye closes).
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (awakeRef.current && performance.now() - lastMove.current > 3600) {
        awakeRef.current = false;
        setAwake(false);
        setLid(0);
      }
    }, 500);
    return () => clearInterval(id);
  }, [reduce]);

  // Occasional blink while awake.
  useEffect(() => {
    if (reduce || !awake) return;
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t = setTimeout(() => {
        setLid(0);
        setTimeout(() => { if (awakeRef.current) setLid(1); }, 115);
        schedule();
      }, 3800 + Math.random() * 3600);
    };
    schedule();
    return () => clearTimeout(t);
  }, [reduce, awake]);

  // Smooth follow.
  useEffect(() => {
    if (reduce) return;
    const loop = () => {
      const t = target.current;
      const c = cur.current;
      const nx = c.x + (t.x - c.x) * 0.16;
      const ny = c.y + (t.y - c.y) * 0.16;
      if (Math.abs(nx - c.x) > 0.05 || Math.abs(ny - c.y) > 0.05) {
        c.x = nx;
        c.y = ny;
        setPos({ x: nx, y: ny });
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [reduce]);

  const dx = pos.x - eye.x;
  const dy = pos.y - eye.y;
  const dist = Math.hypot(dx, dy) || 1;
  const pmag = Math.min(dist / 16, 2.8);
  const px = awake ? (dx / dist) * pmag : 0;
  const py = awake ? (dy / dist) * pmag : 0;
  const laserOn = active && awake && !reduce;

  return (
    <div ref={overlayRef} aria-hidden className="work-laser" style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none", overflow: "visible" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g style={{ opacity: laserOn ? 1 : 0, transition: "opacity 0.35s ease" }}>
          <line x1={eye.x} y1={eye.y} x2={pos.x} y2={pos.y} stroke="#ff3b30" strokeWidth={5} strokeLinecap="round" opacity={0.12} />
          <line x1={eye.x} y1={eye.y} x2={pos.x} y2={pos.y} stroke="#ff4d3d" strokeWidth={1.7} strokeLinecap="round" opacity={0.55} />
          <line x1={eye.x} y1={eye.y} x2={pos.x} y2={pos.y} stroke="#ffd7cf" strokeWidth={0.7} strokeLinecap="round" opacity={0.95} />
          <circle cx={pos.x} cy={pos.y} r={7} fill="#ff3b30" opacity={0.14} />
          <circle cx={pos.x} cy={pos.y} r={2.4} fill="#ff5446" />
          <circle cx={pos.x} cy={pos.y} r={0.9} fill="#fff" />
        </g>
      </svg>

      <div ref={eyeRef} className="work-eye" style={{ position: "absolute", top: "clamp(-6px, -0.5vw, 4px)", right: "clamp(-2px, 0.4vw, 8px)" }}>
        <svg viewBox="0 0 48 32" width="100%" height="100%" style={{ display: "block", overflow: "visible" }}>
          <defs>
            <clipPath id="eyeClip">
              <path d="M3,16 Q24,3 45,16 Q24,29 3,16 Z" />
            </clipPath>
            <radialGradient id="irisGrad" cx="0.5" cy="0.4" r="0.62">
              <stop offset="0" stopColor="#ff8a78" />
              <stop offset="0.55" stopColor="#ff3b30" />
              <stop offset="1" stopColor="#a51c10" />
            </radialGradient>
          </defs>

          {/* lashes */}
          <g stroke="rgba(244,244,242,0.5)" strokeWidth={1.3} strokeLinecap="round">
            <line x1={24} y1={6} x2={24} y2={0.5} />
            <line x1={15} y1={7.5} x2={12.5} y2={2.5} />
            <line x1={33} y1={7.5} x2={35.5} y2={2.5} />
            <line x1={7.5} y1={11} x2={3.5} y2={7.5} />
            <line x1={40.5} y1={11} x2={44.5} y2={7.5} />
          </g>

          {/* open eyeball, vertical aperture follows `lid` */}
          <g style={{ transform: `scaleY(${lid})`, transformBox: "fill-box", transformOrigin: "center", transition: "transform 0.13s ease" }}>
            <g clipPath="url(#eyeClip)">
              <path d="M3,16 Q24,3 45,16 Q24,29 3,16 Z" fill="#f4f4f2" opacity={0.94} />
              <g style={{ transform: `translate(${px}px, ${py}px)` }}>
                <circle cx={24} cy={16} r={7.4} fill="url(#irisGrad)" />
                <circle cx={24} cy={16} r={7.4} fill="none" stroke="#7d160b" strokeWidth={0.6} opacity={0.55} />
                <circle cx={24} cy={16} r={3.1} fill="#0c0908" />
                <circle cx={22.1} cy={14.1} r={1.25} fill="#fff" />
                <circle cx={25.4} cy={17.4} r={0.6} fill="#fff" opacity={0.7} />
              </g>
            </g>
          </g>

          {/* socket outline + closed lid line */}
          <path d="M3,16 Q24,3 45,16 Q24,29 3,16 Z" fill="none" stroke="rgba(244,244,242,0.7)" strokeWidth={1.4} opacity={0.45 + 0.3 * lid} style={{ transition: "opacity 0.13s ease" }} />
          <path d="M4,16 Q24,20.5 44,16" fill="none" stroke="rgba(244,244,242,0.72)" strokeWidth={1.4} strokeLinecap="round" opacity={(1 - lid) * 0.9} style={{ transition: "opacity 0.13s ease" }} />
        </svg>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `.work-eye { width: clamp(52px, 5.8vw, 76px); }` }} />
    </div>
  );
}

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
        height: "clamp(170px, 24vh, 320px)",
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
