"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

/* ── Work with us: one detailed request form, right on the page. No packages,
   no tiers — you describe the build, set your budget, and send it. ── */
export default function ContactReveal() {
  const [form, setForm] = useState({ name: "", email: "", company: "", project: "", budget: "", timeline: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

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
      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative" }}>
        {/* Editorial header */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1.25rem" }}>
          <div>
            <span className="eyebrow" style={{ color: "var(--accent)" }}>— Work with us</span>
            <h2 className="display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", color: "var(--ink)", marginTop: "0.85rem", letterSpacing: "-0.03em" }}>
              Tell us what you&rsquo;re building
            </h2>
          </div>
          <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "var(--gray)", maxWidth: "40ch" }}>
            No packages, no menus — every build is scoped to you. Send the details and your budget, and we&rsquo;ll reply within 24 hours with a clear next step.
          </p>
        </div>

        <div className="req-shell">
          {/* Left: reassurance, sticky on desktop */}
          <aside className="req-aside">
            <p style={{ fontSize: "1.05rem", lineHeight: 1.65, color: "var(--gray)", maxWidth: "38ch" }}>
              A few details about what you&rsquo;re building and where it&rsquo;s getting stuck. The more you share, the sharper our first reply.
            </p>
            <div className="req-aside-foot">
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <span style={{ flexShrink: 0, width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 4px var(--accent-soft)" }} />
                <span style={{ fontSize: "0.92rem", color: "var(--ink-soft)" }}>We reply within 24 hours</span>
              </div>
              <a href="mailto:hello@fzydev.com" className="link-line" style={{ color: "var(--ink)", fontSize: "1rem", width: "max-content" }}>hello@fzydev.com</a>
              <span className="eyebrow" style={{ color: "var(--gray)" }}>Sacramento, CA · Available worldwide</span>
            </div>
          </aside>

          {/* Right: the request form */}
          <div style={{ position: "relative", minWidth: 0 }}>
            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }}
                  className="req-panel" style={{ justifyContent: "center", alignItems: "flex-start", minHeight: 420 }}>
                  <span className="eyebrow" style={{ color: "var(--accent)" }}>Request sent</span>
                  <h3 className="display" style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", color: "var(--ink)", marginTop: "0.9rem" }}>Got it.</h3>
                  <p style={{ marginTop: "1.1rem", fontSize: "1.05rem", lineHeight: 1.65, color: "var(--gray)", maxWidth: "42ch" }}>
                    Thanks, {form.name.split(" ")[0] || "there"}. Your request landed — we&rsquo;ll be in touch within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} className="req-panel" exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease }}>
                  <div className="req-row">
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

                  <div className="req-divider" />

                  <div>
                    <label style={labelStyle}>What do you need?</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.15rem" }}>
                      {projectTypes.map((p) => <Chip key={p} label={p} active={form.project === p} onClick={() => set("project", form.project === p ? "" : p)} />)}
                    </div>
                    <span style={hintStyle}>Pick the closest — we&rsquo;ll figure out the exact fit together.</span>
                  </div>

                  <div className="req-row">
                    <div>
                      <label style={labelStyle}>Budget *</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.15rem" }}>
                        {budgets.map((b) => <Chip key={b} label={b} active={form.budget === b} onClick={() => set("budget", b)} />)}
                      </div>
                      <span style={hintStyle}>A range is enough — it shapes what we propose.</span>
                    </div>
                    <div>
                      <label style={labelStyle}>Timeline</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.15rem" }}>
                        {timelines.map((t) => <Chip key={t} label={t} active={form.timeline === t} onClick={() => set("timeline", t)} />)}
                      </div>
                    </div>
                  </div>

                  <div className="req-divider" />

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
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .req-shell {
          margin-top: clamp(2.5rem, 5vw, 3.75rem);
          display: grid; grid-template-columns: 1fr; gap: clamp(2.25rem, 5vw, 3.5rem);
        }
        .req-aside-foot { margin-top: clamp(1.5rem, 3.5vw, 2.5rem); display: flex; flex-direction: column; gap: 1rem; }
        .req-panel {
          background: var(--surface); border: 1px solid var(--line); border-radius: 18px;
          padding: clamp(1.4rem, 3vw, 2.25rem);
          display: flex; flex-direction: column; gap: 1.5rem;
          box-shadow: 0 24px 60px rgba(0,0,0,0.3);
        }
        .req-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
        .req-divider { height: 1px; background: var(--line); margin: 0.15rem 0; }
        @media (min-width: 900px) {
          .req-shell { grid-template-columns: 0.72fr 1.28fr; gap: clamp(3rem, 6vw, 5rem); align-items: start; }
          .req-aside { position: sticky; top: clamp(4.5rem, 13vh, 7rem); }
        }
        @media (max-width: 600px) { .req-row { grid-template-columns: 1fr; } }
      ` }} />
    </section>
  );
}
