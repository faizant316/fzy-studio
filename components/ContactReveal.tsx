"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { lenisStop, lenisStart } from "./lenis";

const ease = [0.22, 1, 0.36, 1] as const;

type Tier = {
  name: string;
  kind: "Marketing Site" | "Full Platform" | "Partnership";
  price: string;
  meta: string;
  best: string;
  bullets: string[];
  tagline: string;
  expect: string;
  includes: string[];
  budget: string;
  accent: string;
  accentSoft: string;
  variant: "site" | "app";
  featured?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Landing",
    kind: "Marketing Site",
    price: "from $2.5k",
    meta: "1–2 week build",
    best: "Best for launching fast and looking credible.",
    bullets: ["Custom design, mobile-first", "Up to ~5 sections, no templates", "Contact form + analytics"],
    tagline: "A fast, polished marketing site that earns trust and turns visitors into enquiries.",
    expect: "We start with your goals and content, design a site that reflects the brand, then build and deploy it live — usually in one to two weeks.",
    includes: ["Custom design, built mobile-first", "Up to ~5 sections, no templates", "Contact form + email notifications", "Basic SEO and analytics", "Deployed live on your domain", "~1–2 week turnaround"],
    budget: "$2k-$5k",
    accent: "#7aa2e3", accentSoft: "rgba(122,162,227,0.16)", variant: "site",
  },
  {
    name: "Platform",
    kind: "Full Platform",
    price: "from $6k",
    meta: "3–6 week build",
    best: "Best for replacing spreadsheets and DMs with one system.",
    bullets: ["Accounts + admin dashboard", "Booking / scheduling", "Payments + automated email"],
    tagline: "A full custom web app — booking, dashboards, accounts, and payments — built around how you actually work.",
    expect: "We scope your workflow, design the screens, and engineer a secure platform end to end, with a support window after launch.",
    includes: ["Everything in Landing", "User accounts + admin dashboard", "Booking / scheduling system", "Payment tracking + automated email", "Secure database + authentication", "Post-launch support window"],
    budget: "$5k-$10k",
    accent: "#e0786c", accentSoft: "rgba(224,120,108,0.16)", variant: "app", featured: true,
  },
  {
    name: "Custom",
    kind: "Partnership",
    price: "Let's talk",
    meta: "Ongoing",
    best: "Best for multi-feature products and ongoing builds.",
    bullets: ["Scoped to your exact workflow", "Multi-role, multi-feature", "Integrations + automations"],
    tagline: "Multi-feature platforms and ongoing product partnerships, scoped to exactly what you need.",
    expect: "We work as your build partner — scoping, shipping, and iterating over time as the product grows.",
    includes: ["Scoped to your exact workflow", "Multi-role, multi-feature platforms", "Third-party integrations + automations", "Ongoing iteration + maintenance", "A dedicated build partnership"],
    budget: "$10k+",
    accent: "#a896e0", accentSoft: "rgba(168,150,224,0.16)", variant: "app",
  },
];

// Per-package artwork: a single calm, front-facing product window floating on a
// dark tinted field with generous negative space. "site" renders a marketing
// layout, "app" a dashboard. Near-monochrome with one tier accent. Swap the
// inner screen for a real cropped screenshot later — the frame stays.
const G = "rgba(0,0,0,0.13)";
const GL = "rgba(0,0,0,0.07)";

function line(w: string | number, h = 4, c = G) {
  return <div style={{ width: w, height: h, borderRadius: 2, background: c }} />;
}

function SiteScreen({ accent }: { accent: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 22, height: 8, borderRadius: 2, background: accent }} />
        <div style={{ display: "flex", gap: 6 }}>{line(14)}{line(14)}{line(14)}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 4 }}>
        {line("82%", 7, "rgba(0,0,0,0.22)")}
        {line("62%", 7, "rgba(0,0,0,0.22)")}
        {line("44%", 5, GL)}
        <div style={{ marginTop: 5, width: 72, height: 16, borderRadius: 100, background: accent }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginTop: 2 }}>
        {[0, 1, 2].map((k) => <div key={k} style={{ height: 34, borderRadius: 5, background: GL, border: "1px solid rgba(0,0,0,0.04)" }} />)}
      </div>
    </div>
  );
}

function AppScreen({ accent }: { accent: string }) {
  return (
    <div style={{ display: "flex", gap: 11, minHeight: 148 }}>
      <div style={{ width: 46, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ width: 18, height: 7, borderRadius: 2, background: accent }} />
        <div style={{ height: 14, borderRadius: 4, background: `${accent}26`, border: `1px solid ${accent}55` }} />
        {[0, 1, 2, 3].map((k) => <div key={k} style={{ height: 8, borderRadius: 3, background: GL }} />)}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {line("48%", 6)}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          <div style={{ height: 26, borderRadius: 5, background: `${accent}26`, border: `1px solid ${accent}44` }} />
          <div style={{ height: 26, borderRadius: 5, background: GL }} />
          <div style={{ height: 26, borderRadius: 5, background: GL }} />
        </div>
        <div style={{ flex: 1, minHeight: 54, borderRadius: 6, background: "rgba(0,0,0,0.035)", border: "1px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "flex-end", gap: 5, padding: 8 }}>
          {[45, 68, 52, 80, 60, 72].map((h, k) => <div key={k} style={{ flex: 1, height: `${h}%`, borderRadius: 2, background: k % 2 ? accent : "rgba(0,0,0,0.16)" }} />)}
        </div>
      </div>
    </div>
  );
}

function Preview({ accent, variant = "site" }: { accent: string; variant?: "site" | "app" }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "9%",
      background: `radial-gradient(125% 90% at 70% 8%, ${accent}22 0%, rgba(11,11,13,0) 55%), linear-gradient(160deg, #16161a 0%, #0b0b0d 100%)` }}>
      <div style={{ width: "100%", maxWidth: 360, maxHeight: "100%", background: "#f5f5f3", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 34px 64px rgba(0,0,0,0.5), 0 8px 18px rgba(0,0,0,0.3)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 12px", borderBottom: "1px solid rgba(0,0,0,0.07)", background: "#ececea" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(0,0,0,0.16)" }} />
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(0,0,0,0.11)" }} />
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(0,0,0,0.11)" }} />
          <div style={{ marginLeft: 8, height: 9, flex: 1, maxWidth: 120, borderRadius: 100, background: "rgba(0,0,0,0.05)" }} />
        </div>
        <div style={{ padding: 15 }}>
          {variant === "site" ? <SiteScreen accent={accent} /> : <AppScreen accent={accent} />}
        </div>
      </div>
    </div>
  );
}

export default function ContactReveal() {
  const [openTier, setOpenTier] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [presetBudget, setPresetBudget] = useState("");
  const [presetType, setPresetType] = useState("");

  const openForm = (budget: string, type = "") => { setPresetBudget(budget); setPresetType(type); setFormOpen(true); };

  return (
    <section
      id="contact"
      className="grain"
      style={{
        position: "relative", zIndex: 1, overflow: "hidden",
        background: "var(--tone-b)",
        borderTop: "1px solid var(--line)",
        borderTopLeftRadius: "clamp(1.75rem, 4.5vw, 3.5rem)",
        borderTopRightRadius: "clamp(1.75rem, 4.5vw, 3.5rem)",
        padding: "clamp(4.5rem, 10vw, 8rem) clamp(1.25rem, 4vw, 3rem) clamp(4rem, 8vw, 7rem)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
        {/* Left-aligned editorial header (mirrors the reference services section) */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1.25rem" }}>
          <div>
            <span className="eyebrow" style={{ color: "var(--accent)" }}>— Work with us</span>
            <h2 className="display" style={{ fontSize: "clamp(1.7rem, 3.2vw, 2.6rem)", color: "var(--ink)", marginTop: "0.85rem", letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
              Pick a starting point
            </h2>
          </div>
          <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "var(--gray)", maxWidth: "38ch" }}>
            Three ways to work together, from a fast launch to an ongoing build partnership. Tap any package for the full breakdown.
          </p>
        </div>

        {/* Category divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", margin: "clamp(2.25rem, 4vw, 3rem) 0 clamp(1.5rem, 3vw, 2rem)" }}>
          <span className="eyebrow" style={{ color: "var(--gray)", whiteSpace: "nowrap" }}>Packages</span>
          <div className="hairline" style={{ flex: 1 }} />
        </div>

        {/* Service-style cards */}
        <div className="svc-grid">
          {tiers.map((t, i) => (
            <button key={t.name} className="svc-card" onClick={() => setOpenTier(i)} style={{ borderColor: t.featured ? `${t.accent}66` : "var(--line)" }}>
              <div className="svc-img">
                <Preview accent={t.accent} variant={t.variant} />
                {t.featured && (
                  <span style={{ position: "absolute", top: "0.9rem", right: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: t.accent, background: "rgba(8,8,9,0.5)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${t.accent}40`, padding: "0.34rem 0.65rem", borderRadius: 100 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.accent }} />Most popular
                  </span>
                )}
              </div>

              <div className="svc-body">
                <span className="eyebrow" style={{ color: t.accent }}>{t.kind}</span>
                <h3 className="display" style={{ fontSize: "clamp(1.5rem, 2.4vw, 1.9rem)", color: "var(--ink)", letterSpacing: "-0.02em", marginTop: "0.5rem" }}>{t.name}</h3>
                <p style={{ marginTop: "0.4rem", fontSize: "0.9rem", color: "var(--gray)" }}>{t.price} · {t.meta}</p>

                <div style={{ marginTop: "1rem", padding: "0.7rem 0.9rem", borderRadius: 10, background: t.accentSoft, borderLeft: `2px solid ${t.accent}` }}>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "var(--ink-soft)" }}>{t.best}</p>
                </div>

                <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {t.bullets.map((b) => (
                    <div key={b} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start" }}>
                      <span aria-hidden style={{ color: t.accent, fontSize: "0.8rem", lineHeight: 1.5 }}>✦</span>
                      <span style={{ fontSize: "0.88rem", lineHeight: 1.5, color: "var(--ink-soft)" }}>{b}</span>
                    </div>
                  ))}
                </div>

                <span className="svc-link">
                  <span className="svc-link-label">View details</span>
                  <span className="svc-link-dot" aria-hidden>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3.5 8h9M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Subtle one-liner to the full form */}
        <div style={{ marginTop: "clamp(2.5rem, 5vw, 3.5rem)" }}>
          <button
            onClick={() => openForm("")}
            className="link-line"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "0.4rem 0", fontSize: "0.95rem", color: "var(--gray)", letterSpacing: "0.01em" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--gray)")}
          >
            Not sure which? Send a request →
          </button>
        </div>
      </div>

      <TierModal
        tier={openTier === null ? null : tiers[openTier]}
        onClose={() => setOpenTier(null)}
        onStart={(t) => { setOpenTier(null); openForm(t.budget, KIND_TO_TYPE[t.kind]); }}
      />
      <FormOverlay open={formOpen} presetBudget={presetBudget} presetType={presetType} onClose={() => setFormOpen(false)} />

      <style dangerouslySetInnerHTML={{ __html: `
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1rem, 1.8vw, 1.5rem);
        }
        .svc-card {
          display: flex;
          flex-direction: column;
          text-align: left;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          padding: 0;
          transition: border-color 0.45s ease, background 0.45s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        @media (hover: hover) {
          .svc-card:hover { border-color: var(--line-strong); background: var(--surface-2); transform: translateY(-5px); box-shadow: 0 26px 54px rgba(0,0,0,0.42); }
          .svc-card:hover .svc-link-label::after { transform: scaleX(1); transform-origin: left; }
          .svc-card:hover .svc-link-dot { background: var(--ink); color: var(--bg); border-color: var(--ink); }
        }
        .svc-img { position: relative; aspect-ratio: 16 / 10; overflow: hidden; border-bottom: 1px solid var(--line); }
        .svc-body { padding: clamp(1.1rem, 2vw, 1.5rem); display: flex; flex-direction: column; flex: 1; }
        .svc-link {
          margin-top: auto; padding-top: 1.5rem;
          display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
        }
        .svc-link-label { position: relative; font-size: 0.9rem; font-weight: 500; color: var(--ink); }
        .svc-link-label::after {
          content: ""; position: absolute; left: 0; bottom: -3px; width: 100%; height: 1px;
          background: currentColor; transform: scaleX(0); transform-origin: right;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .svc-link-dot {
          flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%;
          border: 1px solid var(--line-strong); color: var(--ink);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.4s ease, color 0.4s ease, border-color 0.4s ease;
        }

        @media (max-width: 900px) {
          .svc-grid { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; }
        }

        /* ── Two-column detail modal: fixed-height shell, internally scrolling body
           with an always-visible CTA footer the content fades behind. ── */
        .tier-modal { display: grid; grid-template-columns: 1.05fr 1fr; height: min(86vh, 660px); }
        .tier-modal-img { position: relative; overflow: hidden; border-right: 1px solid var(--line); }
        .tier-modal-body { display: flex; flex-direction: column; min-height: 0; min-width: 0; }
        .tier-modal-scroll {
          flex: 1; min-height: 0; overflow-y: auto;
          padding: clamp(1.6rem, 3vw, 2.5rem) clamp(1.6rem, 3vw, 2.5rem) 1.5rem;
          scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.14) transparent;
        }
        .tier-modal-scroll::-webkit-scrollbar { width: 7px; }
        .tier-modal-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 100px; }
        .tier-modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .tier-modal-foot {
          position: relative; flex-shrink: 0;
          padding: 1.1rem clamp(1.6rem, 3vw, 2.5rem) clamp(1.4rem, 2.4vw, 1.7rem);
          background: var(--surface); border-top: 1px solid var(--line);
        }
        .tier-modal-foot::before {
          content: ""; position: absolute; left: 0; right: 0; top: -44px; height: 44px;
          background: linear-gradient(to top, var(--surface) 12%, rgba(21,21,23,0));
          pointer-events: none;
        }
        .modal-icon-btn {
          width: 38px; height: 38px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          border: 1px solid var(--line-strong); background: rgba(10,10,11,0.55);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          color: var(--ink); cursor: pointer;
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }
        .modal-icon-btn:hover { background: rgba(255,255,255,0.1); border-color: var(--ink); }
        .modal-icon-btn:active { transform: scale(0.94); }
        @media (max-width: 760px) {
          .tier-modal { grid-template-columns: 1fr; grid-template-rows: auto minmax(0, 1fr); height: 88vh; }
          .tier-modal-img { aspect-ratio: 16 / 11; border-right: none; border-bottom: 1px solid var(--line); }
        }
      ` }} />
    </section>
  );
}

function Check({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden style={{ flexShrink: 0, marginTop: "0.28em" }}>
      <path d="M3.5 8.5l3 3 6-7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Locks page scroll behind overlays by stopping Lenis and hiding overflow — the
// scroll position is never moved, so closing returns you exactly where you were
// (no jump to the hero and glide back down).
function useScrollLock(active: boolean, onClose: () => void) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeRef.current(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!active) return;
    lenisStop();
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      lenisStart();
    };
  }, [active]);
}

function TierModal({ tier, onClose, onStart }: { tier: Tier | null; onClose: () => void; onStart: (t: Tier) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useScrollLock(Boolean(tier), onClose);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {tier && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease }} onClick={onClose} data-lenis-prevent
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(4,4,5,0.74)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(0.75rem, 3vw, 1.5rem)", overflowY: "auto", willChange: "opacity", WebkitTapHighlightColor: "transparent" }}>
          <motion.div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.99 }} transition={{ duration: 0.42, ease }}
            className="tier-modal"
            style={{ width: "100%", maxWidth: 940, margin: "auto", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 24, overflow: "hidden", position: "relative", willChange: "transform, opacity", boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }}>

            <button onClick={onClose} aria-label="Back to packages" className="modal-icon-btn" style={{ position: "absolute", top: "1rem", left: "1rem", zIndex: 3 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button onClick={onClose} aria-label="Close" className="modal-icon-btn" style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 3 }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>

            {/* Left: preview */}
            <div className="tier-modal-img">
              <Preview accent={tier.accent} variant={tier.variant} />
            </div>

            {/* Right: scrolling details + pinned CTA */}
            <div className="tier-modal-body">
              <div className="tier-modal-scroll" data-lenis-prevent>
                <span className="eyebrow" style={{ color: tier.accent }}>{tier.kind}</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.6rem" }}>
                  <span className="display" style={{ fontSize: "clamp(1.9rem, 4vw, 2.5rem)", color: "var(--ink)", letterSpacing: "-0.02em" }}>{tier.name}</span>
                  <span style={{ fontSize: "0.9rem", color: "var(--gray)" }}>{tier.price} · {tier.meta}</span>
                </div>

                <div style={{ marginTop: "1.2rem", display: "flex", gap: "0.65rem", alignItems: "center", padding: "0.75rem 0.95rem", borderRadius: 12, background: tier.accentSoft, border: `1px solid ${tier.accent}33` }}>
                  <span style={{ flexShrink: 0, width: 6, height: 6, borderRadius: "50%", background: tier.accent }} />
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.5, color: "var(--ink-soft)" }}>{tier.best}</p>
                </div>

                <p style={{ marginTop: "1.4rem", fontSize: "1rem", lineHeight: 1.6, color: "var(--ink-soft)" }}>{tier.tagline}</p>

                <p className="eyebrow" style={{ color: "var(--gray)", marginTop: "1.7rem", marginBottom: "0.6rem" }}>What to expect</p>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--gray)" }}>{tier.expect}</p>

                <p className="eyebrow" style={{ color: "var(--gray)", marginTop: "1.7rem", marginBottom: "1rem" }}>What&rsquo;s included</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {tier.includes.map((item) => (
                    <div key={item} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                      <Check color={tier.accent} /><span style={{ fontSize: "0.95rem", lineHeight: 1.45, color: "var(--ink-soft)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tier-modal-foot">
                <button onClick={() => onStart(tier)} className="pill-solid" style={{ width: "100%", justifyContent: "center" }}>
                  Start with {tier.name} <span style={{ fontSize: "0.85rem" }}>↗</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

const fieldStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.025)", border: "1px solid var(--line)",
  borderRadius: 10, padding: "0.8rem 0.95rem",
  fontSize: "0.98rem", fontFamily: "var(--font-inter)", color: "var(--ink)", outline: "none", transition: "border-color 0.3s ease, background 0.3s ease",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "0.55rem",
};
const hintStyle: React.CSSProperties = {
  display: "block", fontSize: "0.78rem", lineHeight: 1.4, color: "var(--gray-light)", marginTop: "0.5rem",
};
const projectTypes = ["Landing site", "Full platform", "Custom / ongoing", "Not sure yet"];
const budgets = ["< $2k", "$2k-$5k", "$5k-$10k", "$10k+"];
const timelines = ["ASAP", "1-3 months", "Just exploring"];

// Maps a package card to its matching project-type chip so "Start with …"
// arrives at the form with the type pre-selected.
const KIND_TO_TYPE: Record<Tier["kind"], string> = {
  "Marketing Site": "Landing site",
  "Full Platform": "Full platform",
  "Partnership": "Custom / ongoing",
};

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      style={{
        fontFamily: "var(--font-inter)", fontSize: "0.85rem", padding: "0.55rem 0.95rem", borderRadius: 9, cursor: "pointer",
        border: active ? "1px solid var(--accent)" : "1px solid var(--line)",
        background: active ? "var(--accent-soft)" : "transparent",
        color: active ? "var(--ink)" : "var(--gray)", transition: "border-color 0.25s ease, background 0.25s ease, color 0.25s ease",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = "var(--line-strong)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = "var(--line)"; }}>
      {label}
    </button>
  );
}

function FormOverlay({ open, presetBudget, presetType, onClose }: { open: boolean; presetBudget: string; presetType: string; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", project: "", budget: "", timeline: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  useEffect(() => setMounted(true), []);
  useScrollLock(open, onClose);
  useEffect(() => { if (open) { setForm((f) => ({ ...f, budget: presetBudget, project: presetType })); setStatus("idle"); } }, [open, presetBudget, presetType]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; };
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.project) { setStatus("error"); return; }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, company: form.company, projectType: form.project, budget: form.budget, timeline: form.timeline, description: form.message }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch { setStatus("error"); }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div data-lenis-prevent
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.5, ease }}
          style={{ position: "fixed", inset: 0, zIndex: 210, overflowY: "auto", willChange: "transform", WebkitOverflowScrolling: "touch",
            background: "radial-gradient(110% 70% at 85% 0%, rgba(122,162,227,0.10) 0%, rgba(10,10,11,0) 50%), linear-gradient(170deg, #101013 0%, #070708 100%)" }}
        >
          <button onClick={onClose} aria-label="Back" className="modal-icon-btn" style={{ position: "fixed", top: "max(1.25rem, env(safe-area-inset-top))", left: "clamp(1.25rem, 4vw, 3rem)", zIndex: 2, width: 44, height: 44 }}>
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none"><path d="M10 3l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button onClick={onClose} aria-label="Close" className="modal-icon-btn" style={{ position: "fixed", top: "max(1.25rem, env(safe-area-inset-top))", right: "clamp(1.25rem, 4vw, 3rem)", zIndex: 2, width: 44, height: 44 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>

          <div className="form-shell">
            {status === "done" ? (
              <motion.div className="form-done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
                <span className="eyebrow" style={{ color: "var(--accent)" }}>Start a Project</span>
                <h2 className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 3.8rem)", color: "var(--ink)", marginTop: "1rem" }}>Got it.</h2>
                <p style={{ marginTop: "1.25rem", fontSize: "1.1rem", lineHeight: 1.65, color: "var(--gray)", maxWidth: "44ch" }}>
                  Thanks, {form.name.split(" ")[0] || "there"}. Your request landed — we&rsquo;ll be in touch within 24 hours.
                </p>
                <button onClick={onClose} className="pill-solid" style={{ marginTop: "2rem" }}>Back to site</button>
              </motion.div>
            ) : (
              <>
                {/* Left: editorial intro + reassurance, sticky on desktop */}
                <aside className="form-aside">
                  <span className="eyebrow" style={{ color: "var(--accent)" }}>Start a Project</span>
                  <h2 className="display" style={{ fontSize: "clamp(2.3rem, 5vw, 3.4rem)", color: "var(--ink)", marginTop: "1rem" }}>Tell us about it</h2>
                  <p style={{ marginTop: "1.25rem", fontSize: "1.05rem", lineHeight: 1.65, color: "var(--gray)", maxWidth: "40ch" }}>
                    A few details about what you&rsquo;re building and where it&rsquo;s getting stuck. The more you share, the sharper our first reply.
                  </p>
                  <div className="form-aside-foot">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                      <span style={{ flexShrink: 0, width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 4px var(--accent-soft)" }} />
                      <span style={{ fontSize: "0.92rem", color: "var(--ink-soft)" }}>We reply within 24 hours</span>
                    </div>
                    <a href="mailto:hello@fzydev.com" className="link-line" style={{ color: "var(--ink)", fontSize: "1rem", width: "max-content" }}>hello@fzydev.com</a>
                    <span className="eyebrow" style={{ color: "var(--gray)" }}>Sacramento, CA · Available worldwide</span>
                  </div>
                </aside>

                {/* Right: the form, contained in a clean panel */}
                <form onSubmit={submit} className="form-panel">
                  <div className="form-row">
                    <div>
                      <label style={labelStyle}>Name *</label>
                      <input style={fieldStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" onFocus={focus} onBlur={blur} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email *</label>
                      <input type="email" style={fieldStyle} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" onFocus={focus} onBlur={blur} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Business <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--gray-light)" }}>(optional)</span></label>
                    <input style={fieldStyle} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company / brand" onFocus={focus} onBlur={blur} />
                  </div>

                  <div className="form-divider" />

                  <div>
                    <label style={labelStyle}>Project type *</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.15rem" }}>
                      {projectTypes.map((p) => <Chip key={p} label={p} active={form.project === p} onClick={() => set("project", p)} />)}
                    </div>
                    <span style={hintStyle}>Pick the closest — we&rsquo;ll figure out the exact fit together.</span>
                  </div>

                  <div className="form-row">
                    <div>
                      <label style={labelStyle}>Budget</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.15rem" }}>
                        {budgets.map((b) => <Chip key={b} label={b} active={form.budget === b} onClick={() => set("budget", b)} />)}
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Timeline</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.15rem" }}>
                        {timelines.map((t) => <Chip key={t} label={t} active={form.timeline === t} onClick={() => set("timeline", t)} />)}
                      </div>
                    </div>
                  </div>

                  <div className="form-divider" />

                  <div>
                    <label style={labelStyle}>Details</label>
                    <textarea rows={5} style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.6 }} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="What you're building, who it's for, and what success looks like. Links to anything you already have are welcome." onFocus={focus} onBlur={blur} />
                  </div>

                  {status === "error" && <p style={{ fontSize: "0.85rem", color: "var(--accent-red)" }}>Please add your name, email, and a project type.</p>}

                  <button type="submit" disabled={status === "sending"} className="pill-solid" style={{ alignSelf: "flex-start", opacity: status === "sending" ? 0.6 : 1 }}>
                    {status === "sending" ? "Sending…" : "Send request"}
                    {status !== "sending" && <span style={{ fontSize: "0.85rem" }}>↗</span>}
                  </button>
                </form>
              </>
            )}
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .form-shell {
              max-width: 1080px; margin: 0 auto;
              padding: clamp(5rem, 12vh, 7.5rem) clamp(1.25rem, 5vw, 3rem) clamp(3rem, 6vw, 5rem);
              display: grid; grid-template-columns: 1fr; gap: clamp(2.25rem, 5vw, 3.5rem);
            }
            .form-done { grid-column: 1 / -1; }
            .form-aside-foot { margin-top: clamp(1.75rem, 4vw, 2.75rem); display: flex; flex-direction: column; gap: 1rem; }
            .form-panel {
              background: var(--surface); border: 1px solid var(--line); border-radius: 18px;
              padding: clamp(1.4rem, 3vw, 2.25rem);
              display: flex; flex-direction: column; gap: 1.5rem;
              box-shadow: 0 24px 60px rgba(0,0,0,0.3);
            }
            .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
            .form-divider { height: 1px; background: var(--line); margin: 0.15rem 0; }
            @media (min-width: 900px) {
              .form-shell { grid-template-columns: 0.82fr 1.18fr; gap: clamp(3rem, 6vw, 5rem); align-items: start; }
              .form-aside { position: sticky; top: clamp(4.5rem, 13vh, 7rem); }
            }
            @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
          ` }} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
