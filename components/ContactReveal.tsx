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

// Placeholder artwork for each package: a set of light "screens" laid out flat and
// viewed from above at an isometric angle (pages plopped on the ground, shot from
// the sky). Tinted per tier. Swap for real product screenshots later.
const G = "rgba(0,0,0,0.13)";
const GL = "rgba(0,0,0,0.07)";

function line(w: string | number, h = 4, c = G) {
  return <div style={{ width: w, height: h, borderRadius: 2, background: c }} />;
}

function PageContent({ kind, accent }: { kind: number; accent: string }) {
  switch (kind) {
    case 0: // landing
      return (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>{line(16, 4, accent)}<div style={{ display: "flex", gap: 3 }}>{line(8)}{line(8)}{line(8)}</div></div>
          <div style={{ flex: 1, borderRadius: 4, background: `linear-gradient(135deg, ${accent}44, ${accent}14)`, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, padding: "0 8px" }}>{line("70%", 5, "rgba(0,0,0,0.28)")}{line("48%", 5, GL)}<div style={{ marginTop: 2, width: 26, height: 9, borderRadius: 100, background: accent }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>{[0, 1, 2].map((k) => <div key={k} style={{ height: 16, borderRadius: 3, background: GL }} />)}</div>
        </>
      );
    case 1: // dashboard
      return (
        <>
          {line("40%", 5)}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>{[0, 1, 2].map((k) => <div key={k} style={{ height: 16, borderRadius: 3, background: k === 0 ? `${accent}55` : GL }} />)}</div>
          <div style={{ flex: 1, borderRadius: 4, background: GL, display: "flex", alignItems: "flex-end", gap: 3, padding: 6 }}>{[45, 70, 55, 85, 60, 75].map((h, k) => <div key={k} style={{ flex: 1, height: `${h}%`, borderRadius: 1.5, background: k % 2 ? accent : "rgba(0,0,0,0.18)" }} />)}</div>
        </>
      );
    case 2: // list
      return (
        <>
          {line("45%", 5)}
          {[0, 1, 2, 3].map((k) => <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: k === 0 ? `${accent}66` : GL }} />{line(`${60 - k * 6}%`)}</div>)}
        </>
      );
    case 3: // form
      return (
        <>
          {line("40%", 5)}
          {[0, 1, 2].map((k) => <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>{line("30%", 3, GL)}<div style={{ height: 9, borderRadius: 2, background: "rgba(0,0,0,0.05)", border: `1px solid ${GL}` }} /></div>)}
          <div style={{ marginTop: "auto", width: 30, height: 9, borderRadius: 100, background: accent }} />
        </>
      );
    case 4: // gallery
      return (
        <>
          {line("35%", 5)}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 4 }}>{[0, 1, 2, 3].map((k) => <div key={k} style={{ borderRadius: 3, background: k === 1 ? `${accent}40` : GL }} />)}</div>
        </>
      );
    default: // profile
      return (
        <>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginTop: 4 }}><div style={{ width: 22, height: 22, borderRadius: "50%", background: `${accent}55`, border: `1.5px solid ${accent}` }} />{line("55%", 4)}{line("35%", 3, GL)}</div>
          <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 2 }}>{line(14, 7, GL)}{line(14, 7, GL)}</div>
        </>
      );
  }
}

function Preview({ accent }: { accent: string; variant?: "site" | "app" }) {
  const pages = [0, 1, 2, 3, 4, 5];
  const lift = [10, 30, 16, 26, 8, 20];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
      background: `radial-gradient(120% 95% at 68% 12%, ${accent}24 0%, rgba(11,11,13,0) 55%), linear-gradient(160deg, #141417 0%, #0b0b0d 100%)` }}>
      <div style={{ perspective: 1500, transform: "translateY(2%)" }}>
        <div style={{ transform: "rotateX(54deg) rotateZ(-46deg) scale(1.35)", transformStyle: "preserve-3d", display: "grid", gridTemplateColumns: "repeat(3, 80px)", gridAutoRows: "108px", gap: 26 }}>
          {pages.map((k, i) => (
            <div key={k} style={{ transform: `translateZ(${lift[i]}px)`, background: "#f4f4f2", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 7, padding: 7, display: "flex", flexDirection: "column", gap: 4, boxShadow: "0 26px 26px rgba(0,0,0,0.5)" }}>
              <PageContent kind={k} accent={accent} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ContactReveal() {
  const [openTier, setOpenTier] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [presetBudget, setPresetBudget] = useState("");

  const openForm = (budget: string) => { setPresetBudget(budget); setFormOpen(true); };

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
                  <span style={{ position: "absolute", top: "0.85rem", right: "0.85rem", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#160f0e", background: t.accent, padding: "0.3rem 0.65rem", borderRadius: 100 }}>Most popular</span>
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

                <span className="svc-link" style={{ color: "var(--ink)" }}>
                  View details <span aria-hidden style={{ transition: "transform 0.3s ease" }}>→</span>
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
        onStart={(t) => { setOpenTier(null); openForm(t.budget); }}
      />
      <FormOverlay open={formOpen} presetBudget={presetBudget} onClose={() => setFormOpen(false)} />

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
          transition: border-color 0.4s ease, background 0.4s ease;
        }
        @media (hover: hover) {
          .svc-card:hover { border-color: var(--line-strong); background: var(--surface-2); }
          .svc-card:hover .svc-link span { transform: translateX(5px); }
        }
        .svc-img { position: relative; aspect-ratio: 16 / 10; overflow: hidden; border-bottom: 1px solid var(--line); }
        .svc-body { padding: clamp(1.1rem, 2vw, 1.5rem); display: flex; flex-direction: column; flex: 1; }
        .svc-link {
          margin-top: auto; padding-top: 1.25rem;
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.9rem; font-weight: 500;
        }

        @media (max-width: 900px) {
          .svc-grid { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; }
        }

        /* Two-column detail modal */
        .tier-modal { display: grid; grid-template-columns: 1.04fr 1fr; height: min(86vh, 640px); }
        .tier-modal-img { position: relative; overflow: hidden; }
        .tier-modal-body {
          overflow-y: auto;
          padding: clamp(1.6rem, 3vw, 2.5rem);
          scrollbar-width: thin;
        }
        .tier-modal-body::-webkit-scrollbar { width: 8px; }
        .tier-modal-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 100px; }
        @media (max-width: 760px) {
          .tier-modal { grid-template-columns: 1fr; height: auto; max-height: 90vh; overflow-y: auto; }
          .tier-modal-img { aspect-ratio: 16 / 10; }
          .tier-modal-body { overflow: visible; }
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease }} onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(4,4,5,0.74)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(0.75rem, 3vw, 1.5rem)", overflowY: "auto", willChange: "opacity", WebkitTapHighlightColor: "transparent" }}>
          <motion.div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.99 }} transition={{ duration: 0.42, ease }}
            className="tier-modal"
            style={{ width: "100%", maxWidth: 940, margin: "auto", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 22, overflow: "hidden", position: "relative", willChange: "transform, opacity", boxShadow: "0 30px 80px rgba(0,0,0,0.55)" }}>

            <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 3, width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--line-strong)", background: "rgba(10,10,11,0.6)", backdropFilter: "blur(4px)", cursor: "pointer", fontSize: "1.1rem", color: "var(--ink)" }}>×</button>

            {/* Left: preview */}
            <div className="tier-modal-img">
              <Preview accent={tier.accent} variant={tier.variant} />
            </div>

            {/* Right: details */}
            <div className="tier-modal-body">
              <span className="eyebrow" style={{ color: tier.accent }}>{tier.kind}</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.6rem" }}>
                <span className="display" style={{ fontSize: "clamp(1.9rem, 4vw, 2.5rem)", color: "var(--ink)", letterSpacing: "-0.02em" }}>{tier.name}</span>
                <span style={{ fontSize: "0.9rem", color: "var(--gray)" }}>{tier.price} · {tier.meta}</span>
              </div>

              <div style={{ marginTop: "1.1rem", padding: "0.85rem 1rem", borderRadius: 10, background: tier.accentSoft, borderLeft: `2px solid ${tier.accent}` }}>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.55, color: "var(--ink-soft)" }}>{tier.best}</p>
              </div>

              <p style={{ marginTop: "1.25rem", fontSize: "1rem", lineHeight: 1.6, color: "var(--ink-soft)" }}>{tier.tagline}</p>

              <p className="eyebrow" style={{ color: "var(--gray)", marginTop: "1.6rem", marginBottom: "0.6rem" }}>What to expect</p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--gray)" }}>{tier.expect}</p>

              <p className="eyebrow" style={{ color: "var(--gray)", marginTop: "1.6rem", marginBottom: "1rem" }}>What&rsquo;s included</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {tier.includes.map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                    <Check color={tier.accent} /><span style={{ fontSize: "0.95rem", lineHeight: 1.45, color: "var(--ink-soft)" }}>{item}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => onStart(tier)} className="pill-solid" style={{ marginTop: "1.9rem", width: "100%", justifyContent: "center" }}>
                Start with {tier.name} <span style={{ fontSize: "0.85rem" }}>↗</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

const fieldStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)",
  borderRadius: 12, padding: "0.85rem 1rem",
  fontSize: "1rem", fontFamily: "var(--font-inter)", color: "var(--ink)", outline: "none", transition: "border-color 0.3s ease, background 0.3s ease",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "0.5rem",
};
const budgets = ["< $2k", "$2k-$5k", "$5k-$10k", "$10k+"];
const timelines = ["ASAP", "1-3 months", "Just exploring"];

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      style={{
        fontFamily: "var(--font-inter)", fontSize: "0.85rem", padding: "0.5rem 1.1rem", borderRadius: 100, cursor: "pointer",
        border: active ? "1px solid var(--accent)" : "1px solid var(--line-strong)",
        background: active ? "var(--accent-soft)" : "transparent",
        color: active ? "var(--ink)" : "var(--gray)", transition: "all 0.25s ease",
      }}>
      {label}
    </button>
  );
}

function FormOverlay({ open, presetBudget, onClose }: { open: boolean; presetBudget: string; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", project: "", budget: "", timeline: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  useEffect(() => setMounted(true), []);
  useScrollLock(open, onClose);
  useEffect(() => { if (open) { setForm((f) => ({ ...f, budget: presetBudget })); setStatus("idle"); } }, [open, presetBudget]);

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
        <motion.div
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.5, ease }}
          style={{ position: "fixed", inset: 0, zIndex: 210, overflowY: "auto", willChange: "transform", WebkitOverflowScrolling: "touch",
            background: "radial-gradient(110% 70% at 85% 0%, rgba(122,162,227,0.10) 0%, rgba(10,10,11,0) 50%), linear-gradient(170deg, #101013 0%, #070708 100%)" }}
        >
          <button onClick={onClose} aria-label="Close" style={{ position: "fixed", top: "max(1.25rem, env(safe-area-inset-top))", right: "clamp(1.25rem, 4vw, 3rem)", zIndex: 2, width: 44, height: 44, borderRadius: "50%", border: "1px solid var(--line-strong)", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(6px)", cursor: "pointer", fontSize: "1.2rem", color: "var(--ink)" }}>×</button>

          <div style={{ maxWidth: 680, margin: "0 auto", padding: "clamp(5rem, 12vh, 8rem) clamp(1.25rem, 5vw, 3rem) clamp(3rem, 6vw, 5rem)" }}>
            {status === "done" ? (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
                <span className="eyebrow" style={{ color: "var(--accent)" }}>Start a Project</span>
                <h2 className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 3.8rem)", color: "var(--ink)", marginTop: "1rem" }}>Got it.</h2>
                <p style={{ marginTop: "1.25rem", fontSize: "1.1rem", lineHeight: 1.65, color: "var(--gray)", maxWidth: "44ch" }}>
                  Thanks, {form.name.split(" ")[0] || "there"}. Your request landed, we&rsquo;ll be in touch within 24 hours.
                </p>
                <button onClick={onClose} className="pill-solid" style={{ marginTop: "2rem" }}>Back to site</button>
              </motion.div>
            ) : (
              <>
                <span className="eyebrow" style={{ color: "var(--accent)" }}>Start a Project</span>
                <h2 className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 3.8rem)", color: "var(--ink)", marginTop: "1rem" }}>Tell us about it</h2>
                <p style={{ marginTop: "1.25rem", fontSize: "1.05rem", lineHeight: 1.65, color: "var(--gray)", maxWidth: "48ch" }}>
                  What you&rsquo;re running and where it&rsquo;s getting stuck. We&rsquo;ll reply within 24 hours with a clear next step.
                </p>

                <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem", marginTop: "clamp(2.5rem, 5vw, 3.5rem)" }}>
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
                  <div className="form-row">
                    <div>
                      <label style={labelStyle}>Business <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--gray-light)" }}>(optional)</span></label>
                      <input style={fieldStyle} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company / brand" onFocus={focus} onBlur={blur} />
                    </div>
                    <div>
                      <label style={labelStyle}>What are you building? *</label>
                      <input style={fieldStyle} value={form.project} onChange={(e) => set("project", e.target.value)} placeholder="e.g. a booking platform" onFocus={focus} onBlur={blur} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Budget</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.3rem" }}>
                      {budgets.map((b) => <Chip key={b} label={b} active={form.budget === b} onClick={() => set("budget", b)} />)}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Timeline</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.3rem" }}>
                      {timelines.map((t) => <Chip key={t} label={t} active={form.timeline === t} onClick={() => set("timeline", t)} />)}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Details</label>
                    <textarea rows={4} style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.6 }} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="A sentence or two about the project, and what success looks like." onFocus={focus} onBlur={blur} />
                  </div>
                  {status === "error" && <p style={{ fontSize: "0.85rem", color: "var(--accent-red)" }}>Please add your name, email, and what you&rsquo;re building.</p>}
                  <button type="submit" disabled={status === "sending"} className="pill-solid" style={{ alignSelf: "flex-start", opacity: status === "sending" ? 0.6 : 1 }}>
                    {status === "sending" ? "Sending…" : "Send request"}
                    {status !== "sending" && <span style={{ fontSize: "0.85rem" }}>↗</span>}
                  </button>
                </form>

                <div style={{ marginTop: "clamp(2.5rem, 5vw, 3.5rem)", paddingTop: "2rem", borderTop: "1px solid var(--line)", display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "space-between" }}>
                  <a href="mailto:hello@fzydev.com" className="link-line" style={{ color: "var(--ink)", fontSize: "1rem" }}>hello@fzydev.com</a>
                  <span className="eyebrow" style={{ color: "var(--gray)" }}>Sacramento, CA · Available worldwide</span>
                </div>
              </>
            )}
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
            @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
          ` }} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
