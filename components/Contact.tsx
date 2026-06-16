"use client";
import { useState } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const projectTypes = ["Booking platform", "Client dashboard", "Business website", "Something else"];
const budgets = ["< $2k", "$2k – $5k", "$5k – $10k", "$10k +"];

const fieldStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(245,240,235,0.16)",
  padding: "0.85rem 0",
  fontSize: "1rem",
  fontFamily: "var(--font-inter)",
  color: "var(--cream)",
  outline: "none",
  transition: "border-color 0.3s ease",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-jetbrains-mono)",
  fontSize: "0.66rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginBottom: "0.4rem",
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", projectType: "", budget: "", description: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.projectType) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      style={{ padding: "clamp(5rem, 10vw, 9rem) clamp(1.25rem, 5vw, 3.5rem)", borderTop: "1px solid var(--line)", background: "#0c0c0c", position: "relative", overflow: "hidden" }}
    >
      <div className="glow-gold" style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "50vw", height: "50vw", maxWidth: 700, maxHeight: 700, zIndex: 0, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "clamp(2.5rem, 5vw, 4rem)" }} className="contact-grid">
        <div>
          <SectionHeading
            index="(04)"
            eyebrow="Start a project"
            title={<>Let&rsquo;s build the <span className="text-gold-grad serif-italic">real version.</span></>}
            intro="Tell us what you're running and where it's getting stuck. We'll come back within 24 hours with a clear next step."
          />
          <Reveal delay={0.2}>
            <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <a href="mailto:hello@fzystudio.dev" className="link-sweep" style={{ width: "fit-content", color: "var(--cream)", fontSize: "1.1rem", fontFamily: "var(--font-jetbrains-mono)" }}>
                hello@fzystudio.dev
              </a>
              <span className="font-mono" style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Sacramento, CA · Available worldwide</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          {status === "done" ? (
            <div
              style={{
                border: "1px solid rgba(201,169,106,0.35)",
                borderRadius: 18,
                padding: "clamp(2rem, 4vw, 3rem)",
                background: "linear-gradient(180deg, rgba(201,169,106,0.06), rgba(201,169,106,0))",
              }}
            >
              <span className="font-display text-gold-grad" style={{ fontSize: "1.8rem", fontWeight: 800 }}>Got it.</span>
              <p style={{ marginTop: "1rem", lineHeight: 1.7, color: "rgba(245,240,235,0.66)" }}>
                Thanks, {form.name.split(" ")[0] || "there"}. Your request landed. We&rsquo;ll be in touch within 24 hours, keep an eye on your inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="glass" style={{ display: "flex", flexDirection: "column", gap: "1.8rem", padding: "clamp(1.5rem, 3.5vw, 2.6rem)", borderRadius: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input style={fieldStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name"
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(245,240,235,0.16)")} />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" style={fieldStyle} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com"
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(245,240,235,0.16)")} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Project type *</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {projectTypes.map((t) => (
                    <Chip key={t} active={form.projectType === t} onClick={() => set("projectType", t)}>{t}</Chip>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Budget</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {budgets.map((b) => (
                    <Chip key={b} active={form.budget === b} onClick={() => set("budget", b)}>{b}</Chip>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Tell us about it</label>
                <textarea
                  rows={3}
                  style={{ ...fieldStyle, resize: "vertical" }}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="What are you building, and what's getting in the way?"
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(245,240,235,0.16)")}
                />
              </div>

              {status === "error" && (
                <p className="font-mono" style={{ fontSize: "0.78rem", color: "#e0908a" }}>
                  Please add your name, email, and a project type, then try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  alignSelf: "flex-start",
                  display: "inline-flex", alignItems: "center", gap: "0.7rem",
                  background: "var(--cream)", color: "var(--ink)",
                  border: "none", borderRadius: "100px",
                  padding: "1rem 2.2rem", fontSize: "0.95rem", fontWeight: 500,
                  cursor: status === "sending" ? "default" : "pointer",
                  opacity: status === "sending" ? 0.6 : 1,
                  transition: "transform 0.25s ease, background 0.25s ease",
                }}
                onMouseEnter={(e) => { if (status !== "sending") { e.currentTarget.style.background = "var(--gold-soft)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--cream)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {status === "sending" ? "Sending…" : "Send request"}
                {status !== "sending" && (
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: "var(--ink)", color: "var(--cream)", fontSize: "0.75rem" }}>→</span>
                )}
              </button>
            </form>
          )}
        </Reveal>
      </div>

      <style>{`
        @media (min-width: 920px) {
          .contact-grid { grid-template-columns: 0.9fr 1.1fr !important; }
        }
      `}</style>
    </section>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: "var(--font-inter)",
        fontSize: "0.85rem",
        padding: "0.5rem 1.1rem",
        borderRadius: "100px",
        cursor: "pointer",
        border: active ? "1px solid var(--gold)" : "1px solid rgba(245,240,235,0.16)",
        background: active ? "rgba(201,169,106,0.14)" : "transparent",
        color: active ? "var(--gold-soft)" : "rgba(245,240,235,0.6)",
        transition: "all 0.25s ease",
      }}
    >
      {children}
    </button>
  );
}
