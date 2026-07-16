"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { lenisStop, lenisStart } from "./lenis";

const ease = [0.22, 1, 0.36, 1] as const;

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

const projectTypes = ["Website", "Web app / platform", "Booking / automation", "Not sure yet"];
const budgets = ["< $2k", "$2k-$5k", "$5k-$10k", "$10k+"];
const timelines = ["ASAP", "1-3 months", "Just exploring"];

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

// Locks page scroll behind the overlay by stopping Lenis and hiding overflow.
// The scroll position never moves, so closing returns you exactly where you were.
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

/* ── Work with us: a calm invitation on the page, and one detailed request form
   that slides up when you're ready. No packages, no tiers: you describe the
   build, set your budget, and send it. ── */
export default function ContactReveal() {
  const [formOpen, setFormOpen] = useState(false);

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
        padding: "clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem) clamp(4.5rem, 9vw, 7.5rem)",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.8, ease }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <span className="eyebrow" style={{ color: "var(--accent)" }}>Work with us</span>
          <h2 className="display" style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)", color: "var(--ink)", marginTop: "1rem", letterSpacing: "-0.035em", maxWidth: "16ch" }}>
            Tell us what you&rsquo;re building.
          </h2>
          <p style={{ marginTop: "1.4rem", fontSize: "clamp(1.02rem, 1.5vw, 1.15rem)", lineHeight: 1.65, color: "var(--gray)", maxWidth: "46ch" }}>
            No packages, no menus. Every build is scoped to you: send one detailed request with your budget, and we&rsquo;ll reply within 24 hours with a clear next step.
          </p>

          <button
            onClick={() => setFormOpen(true)}
            className="pill-solid"
            style={{ marginTop: "clamp(2rem, 4vw, 2.75rem)", padding: "1.1rem 2.4rem", fontSize: "1.02rem" }}
          >
            Start your request
            <span style={{ fontSize: "0.88rem" }}>↗</span>
          </button>

          <div style={{ marginTop: "clamp(2.25rem, 4.5vw, 3.25rem)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "0.85rem 2rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", fontSize: "0.9rem", color: "var(--ink-soft)" }}>
              <span style={{ flexShrink: 0, width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 4px var(--accent-soft)" }} />
              We reply within 24 hours
            </span>
            <a href="mailto:hello@fzydev.com" className="link-line" style={{ color: "var(--ink)", fontSize: "0.95rem" }}>hello@fzydev.com</a>
            <span className="eyebrow" style={{ color: "var(--gray)" }}>Sacramento, CA · Available worldwide</span>
          </div>
        </motion.div>
      </div>

      <FormOverlay open={formOpen} onClose={() => setFormOpen(false)} />
    </section>
  );
}

function FormOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", project: "", budget: "", timeline: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  useEffect(() => setMounted(true), []);
  useScrollLock(open, onClose);
  useEffect(() => { if (open) setStatus("idle"); }, [open]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; };
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.budget || !form.message) { setStatus("error"); return; }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email, company: form.company,
          projectType: form.project || "General request",
          budget: form.budget, timeline: form.timeline, description: form.message,
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch { setStatus("error"); }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div data-lenis-prevent
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.55, ease }}
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
                <span className="eyebrow" style={{ color: "var(--accent)" }}>Request sent</span>
                <h2 className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 3.8rem)", color: "var(--ink)", marginTop: "1rem" }}>Got it.</h2>
                <p style={{ marginTop: "1.25rem", fontSize: "1.1rem", lineHeight: 1.65, color: "var(--gray)", maxWidth: "44ch" }}>
                  Thanks, {form.name.split(" ")[0] || "there"}. Your request landed and we&rsquo;ll be in touch within 24 hours.
                </p>
                <button onClick={onClose} className="pill-solid" style={{ marginTop: "2rem" }}>Back to site</button>
              </motion.div>
            ) : (
              <>
                {/* Left: editorial intro + reassurance, sticky on desktop */}
                <aside className="form-aside">
                  <span className="eyebrow" style={{ color: "var(--accent)" }}>Start your request</span>
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

                {/* Right: the request form in a clean panel */}
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
                    <label style={labelStyle}>What do you need?</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.15rem" }}>
                      {projectTypes.map((p) => <Chip key={p} label={p} active={form.project === p} onClick={() => set("project", form.project === p ? "" : p)} />)}
                    </div>
                    <span style={hintStyle}>Pick the closest. We&rsquo;ll figure out the exact fit together.</span>
                  </div>

                  <div className="form-row">
                    <div>
                      <label style={labelStyle}>Budget *</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.15rem" }}>
                        {budgets.map((b) => <Chip key={b} label={b} active={form.budget === b} onClick={() => set("budget", b)} />)}
                      </div>
                      <span style={hintStyle}>A range is enough. It shapes what we propose.</span>
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
                    <label style={labelStyle}>The request *</label>
                    <textarea rows={6} style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.6 }} value={form.message} onChange={(e) => set("message", e.target.value)}
                      placeholder="What you're building, who it's for, what it needs to do, and what success looks like. Links to anything you already have are welcome." onFocus={focus} onBlur={blur} />
                  </div>

                  {status === "error" && <p style={{ fontSize: "0.85rem", color: "var(--accent-red)" }}>Please add your name, email, a budget range, and a few details about the project.</p>}

                  <button type="submit" disabled={status === "sending"} className="pill-solid" style={{ alignSelf: "flex-start", opacity: status === "sending" ? 0.6 : 1 }}>
                    {status === "sending" ? "Sending…" : "Send request"}
                    {status !== "sending" && <span style={{ fontSize: "0.85rem" }}>↗</span>}
                  </button>
                </form>
              </>
            )}
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .modal-icon-btn {
              border-radius: 50%;
              display: inline-flex; align-items: center; justify-content: center;
              border: 1px solid var(--line-strong); background: rgba(10,10,11,0.55);
              backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
              color: var(--ink); cursor: pointer;
              transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
            }
            .modal-icon-btn:hover { background: rgba(255,255,255,0.1); border-color: var(--ink); }
            .modal-icon-btn:active { transform: scale(0.94); }
            .form-shell {
              max-width: 1080px; margin: 0 auto;
              padding: clamp(5rem, 12svh, 7.5rem) clamp(1.25rem, 5vw, 3rem) clamp(3rem, 6vw, 5rem);
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
              .form-aside { position: sticky; top: clamp(4.5rem, 13svh, 7rem); }
            }
            @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
          ` }} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
