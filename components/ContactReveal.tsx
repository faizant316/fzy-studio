"use client";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

type Tier = {
  name: string;
  price: string;
  tagline: string;
  budget: string;
  gradient: string;
  includes: string[];
  featured?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Landing",
    price: "from $1.5k",
    tagline: "A fast, polished marketing site that earns trust and converts.",
    budget: "< $2k",
    gradient: "linear-gradient(180deg, #cdd5cd 0%, #93a395 60%, #5d6c60 100%)",
    includes: [
      "Custom design, built mobile-first",
      "Up to ~5 sections, no templates",
      "Contact form + email notifications",
      "Basic SEO and analytics",
      "Deployed live, ~1-2 week turnaround",
    ],
  },
  {
    name: "Platform",
    price: "from $5k",
    tagline: "A full custom web app: booking, dashboards, auth, and payments.",
    budget: "$5k-$10k",
    featured: true,
    gradient: "linear-gradient(180deg, #ddcfc3 0%, #b1907d 60%, #79594c 100%)",
    includes: [
      "Everything in Landing",
      "User accounts + admin dashboard",
      "Booking / scheduling system",
      "Payment tracking + automated email",
      "Secure database and authentication",
      "Post-launch support window",
    ],
  },
  {
    name: "Custom",
    price: "Let's talk",
    tagline: "Multi-feature platforms and ongoing product partnerships.",
    budget: "$10k+",
    gradient: "linear-gradient(180deg, #ccd1d9 0%, #8b94a2 60%, #58616f 100%)",
    includes: [
      "Scoped to your exact workflow",
      "Multi-role, multi-feature platforms",
      "Third-party integrations + automations",
      "Ongoing iteration and maintenance",
      "A dedicated build partnership",
    ],
  },
];

const budgets = ["< $2k", "$2k-$5k", "$5k-$10k", "$10k+"];

const fieldStyle: React.CSSProperties = {
  width: "100%", background: "transparent", border: "none",
  borderBottom: "1px solid var(--line-strong)", padding: "0.85rem 0",
  fontSize: "1rem", fontFamily: "var(--font-inter)", color: "var(--ink)",
  outline: "none", transition: "border-color 0.3s ease",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.14em",
  textTransform: "uppercase", color: "var(--gray)", marginBottom: "0.4rem",
};
const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.currentTarget.style.borderColor = "var(--ink)");
const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.currentTarget.style.borderColor = "var(--line-strong)");

export default function ContactReveal() {
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: "", email: "", project: "", budget: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [openTier, setOpenTier] = useState<number | null>(null);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const startWith = (t: Tier) => {
    setForm((f) => ({ ...f, budget: t.budget }));
    setOpenTier(null);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.project) { setStatus("error"); return; }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, projectType: form.project, budget: form.budget, description: form.message }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch { setStatus("error"); }
  };

  return (
    <section
      id="contact"
      className="grain"
      style={{
        position: "relative", zIndex: 1, overflow: "hidden",
        background: "var(--bg-warm-2)",
        borderTopLeftRadius: "clamp(1.75rem, 4.5vw, 3.5rem)",
        borderTopRightRadius: "clamp(1.75rem, 4.5vw, 3.5rem)",
        boxShadow: "0 -26px 60px -34px rgba(0,0,0,0.22)",
        padding: "clamp(4.5rem, 10vw, 8rem) clamp(1.25rem, 4vw, 3rem) clamp(3rem, 6vw, 5rem)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Minimal heading */}
        <h2 className="display" style={{ textAlign: "center", fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "var(--ink)", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
          Let&rsquo;s build
        </h2>

        {/* Large gradient tier cards */}
        <div className="tiers" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(0.85rem, 1.6vw, 1.4rem)", marginBottom: "clamp(3.5rem, 7vw, 6rem)" }}>
          {tiers.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setOpenTier(i)}
              style={{
                position: "relative", overflow: "hidden", border: "none", padding: 0, cursor: "pointer",
                borderRadius: 22, minHeight: "clamp(420px, 56vh, 600px)",
                background: t.gradient,
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
                textAlign: "left", outline: t.featured ? "2px solid var(--ink)" : "none", outlineOffset: "-2px",
                transition: "transform 0.45s ease, box-shadow 0.45s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 36px 70px -34px rgba(0,0,0,0.45)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* legibility scrim */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.42) 100%)" }} />
              <span style={{ position: "absolute", top: "1.5rem", left: "1.5rem", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.82)" }}>{t.price}</span>

              <div style={{ position: "relative", zIndex: 1, padding: "clamp(1.5rem, 3vw, 2.25rem)" }}>
                <h3 className="display" style={{ fontSize: "clamp(1.9rem, 3.2vw, 2.8rem)", color: "#fff", letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>{t.name}</h3>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.3rem", borderRadius: 100, border: "1px solid rgba(255,255,255,0.6)", color: "#fff", fontSize: "0.9rem", fontWeight: 500 }}>
                  View details <span aria-hidden>↗</span>
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Form + details */}
        <div ref={formRef} className="contact-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "clamp(2.5rem, 5vw, 4rem)", alignItems: "start" }}>
          <div>
            <p style={{ fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)", lineHeight: 1.6, color: "var(--ink-soft)", maxWidth: "34ch" }}>
              Tell us what you&rsquo;re running and where it&rsquo;s getting stuck. We&rsquo;ll reply within 24 hours with a clear next step.
            </p>
            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <a href="mailto:hello@fzystudio.dev" className="link-line" style={{ width: "fit-content", color: "var(--ink)", fontSize: "1.1rem" }}>hello@fzystudio.dev</a>
              <span className="eyebrow" style={{ color: "var(--gray)" }}>Sacramento, CA · Available worldwide</span>
            </div>
          </div>

          {status === "done" ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} style={{ borderTop: "1px solid var(--line-strong)", paddingTop: "2rem" }}>
              <h3 className="display" style={{ fontSize: "2rem", color: "var(--ink)" }}>Got it.</h3>
              <p style={{ marginTop: "1rem", lineHeight: 1.6, color: "var(--gray)", maxWidth: "40ch" }}>
                Thanks, {form.name.split(" ")[0] || "there"}. Your request landed, we&rsquo;ll be in touch within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input style={fieldStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" style={fieldStyle} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" onFocus={focus} onBlur={blur} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>What are you building?</label>
                <input style={fieldStyle} value={form.project} onChange={(e) => set("project", e.target.value)} placeholder="e.g. a booking platform" onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelStyle}>Budget</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.3rem" }}>
                  {budgets.map((b) => (
                    <button type="button" key={b} onClick={() => set("budget", b)}
                      style={{
                        fontFamily: "var(--font-inter)", fontSize: "0.85rem", padding: "0.5rem 1.1rem", borderRadius: 100, cursor: "pointer",
                        border: form.budget === b ? "1px solid var(--ink)" : "1px solid var(--line-strong)",
                        background: form.budget === b ? "var(--ink)" : "transparent",
                        color: form.budget === b ? "#fff" : "var(--gray)",
                        transition: "all 0.25s ease",
                      }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Details</label>
                <textarea rows={3} style={{ ...fieldStyle, resize: "vertical" }} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="A sentence or two about the project." onFocus={focus} onBlur={blur} />
              </div>
              {status === "error" && <p style={{ fontSize: "0.85rem", color: "#b4453c" }}>Please add your name, email, and what you&rsquo;re building.</p>}
              <button type="submit" disabled={status === "sending"} className="pill-solid" style={{ alignSelf: "flex-start", opacity: status === "sending" ? 0.6 : 1 }}>
                {status === "sending" ? "Sending…" : "Send request"}
                {status !== "sending" && <span style={{ fontSize: "0.85rem" }}>↗</span>}
              </button>
            </form>
          )}
        </div>
      </div>

      <TierModal tier={openTier === null ? null : tiers[openTier]} onClose={() => setOpenTier(null)} onStart={startWith} />

      <style>{`
        @media (min-width: 920px) { .contact-grid { grid-template-columns: 0.6fr 1fr !important; } }
        @media (max-width: 720px) { .tiers { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden style={{ flexShrink: 0, marginTop: "0.28em" }}>
      <path d="M3.5 8.5l3 3 6-7" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TierModal({ tier, onClose, onStart }: { tier: Tier | null; onClose: () => void; onStart: (t: Tier) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = tier ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [tier, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {tier && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,10,10,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
        >
          <motion.div
            role="dialog" aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease }}
            style={{ width: "100%", maxWidth: 540, background: "var(--bg)", borderRadius: 22, padding: "clamp(1.75rem, 4vw, 2.75rem)", position: "relative", boxShadow: "0 40px 90px -30px rgba(0,0,0,0.4)" }}
          >
            <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: "1.25rem", right: "1.25rem", width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--line-strong)", background: "transparent", cursor: "pointer", fontSize: "1rem", color: "var(--ink)" }}>×</button>

            <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
              <span className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: "var(--ink)", letterSpacing: "-0.02em" }}>{tier.name}</span>
              <span className="eyebrow" style={{ color: "var(--gray)" }}>{tier.price}</span>
            </div>
            <p style={{ marginTop: "0.85rem", fontSize: "1.02rem", lineHeight: 1.6, color: "var(--gray)" }}>{tier.tagline}</p>

            <div className="hairline" style={{ background: "var(--line-strong)", margin: "1.75rem 0" }} />

            <p className="eyebrow" style={{ color: "var(--gray)", marginBottom: "1.1rem" }}>What&rsquo;s included</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {tier.includes.map((item) => (
                <div key={item} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                  <Check />
                  <span style={{ fontSize: "0.98rem", lineHeight: 1.45, color: "var(--ink-soft)" }}>{item}</span>
                </div>
              ))}
            </div>

            <button onClick={() => onStart(tier)} className="pill-solid" style={{ marginTop: "2rem", width: "100%", justifyContent: "center" }}>
              Start with {tier.name}
              <span style={{ fontSize: "0.85rem" }}>↗</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
