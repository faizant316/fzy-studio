"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fieldStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--line-strong)",
  padding: "0.85rem 0",
  fontSize: "1rem",
  fontFamily: "var(--font-inter)",
  color: "var(--ink)",
  outline: "none",
  transition: "border-color 0.3s ease",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  fontWeight: 500,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--gray)",
  marginBottom: "0.4rem",
};

export default function ContactReveal() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 55%"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);

  const [form, setForm] = useState({ name: "", email: "", project: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.project) { setStatus("error"); return; }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, projectType: form.project, description: form.message }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch { setStatus("error"); }
  };

  return (
    <motion.section
      id="contact"
      ref={ref}
      style={{
        y,
        position: "relative",
        zIndex: 3,
        marginTop: "clamp(-2rem, -4vw, -4rem)",
        background: "var(--bg-warm-2)",
        borderTopLeftRadius: "clamp(1.5rem, 4vw, 3rem)",
        borderTopRightRadius: "clamp(1.5rem, 4vw, 3rem)",
        padding: "clamp(4.5rem, 10vw, 8rem) clamp(1.25rem, 4vw, 3rem) clamp(3rem, 6vw, 5rem)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "clamp(2.5rem, 5vw, 5rem)" }} className="contact-grid">
        <div>
          <span className="eyebrow">Start a Project</span>
          <h2 className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", color: "var(--ink)", marginTop: "1rem", maxWidth: "12ch" }}>
            Let&rsquo;s build yours
          </h2>
          <p style={{ marginTop: "1.5rem", fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.6, color: "var(--gray)", maxWidth: "42ch" }}>
            Tell us what you&rsquo;re running and where it&rsquo;s getting stuck. We&rsquo;ll come back within 24 hours with a clear next step.
          </p>
          <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <a href="mailto:hello@fzystudio.dev" className="link-line" style={{ width: "fit-content", color: "var(--ink)", fontSize: "1.1rem" }}>hello@fzystudio.dev</a>
            <span className="eyebrow" style={{ color: "var(--gray)" }}>Sacramento, CA · Available worldwide</span>
          </div>
        </div>

        {status === "done" ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
            style={{ alignSelf: "center", borderTop: "1px solid var(--line-strong)", paddingTop: "2rem" }}>
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
                <input style={fieldStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name"
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ink)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line-strong)")} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" style={fieldStyle} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com"
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ink)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line-strong)")} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>What are you building?</label>
              <input style={fieldStyle} value={form.project} onChange={(e) => set("project", e.target.value)} placeholder="e.g. a booking platform"
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ink)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line-strong)")} />
            </div>
            <div>
              <label style={labelStyle}>Details</label>
              <textarea rows={3} style={{ ...fieldStyle, resize: "vertical" }} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="A sentence or two about the project."
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ink)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line-strong)")} />
            </div>
            {status === "error" && (
              <p style={{ fontSize: "0.85rem", color: "#b4453c" }}>Please add your name, email, and what you&rsquo;re building.</p>
            )}
            <button type="submit" disabled={status === "sending"} className="pill-solid" style={{ alignSelf: "flex-start", opacity: status === "sending" ? 0.6 : 1 }}>
              {status === "sending" ? "Sending…" : "Send request"}
              {status !== "sending" && <span style={{ fontSize: "0.85rem" }}>↗</span>}
            </button>
          </form>
        )}
      </div>

      <style>{`
        @media (min-width: 920px) { .contact-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </motion.section>
  );
}
