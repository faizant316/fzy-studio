"use client";
import Reveal from "./Reveal";

export default function Testimonial() {
  return (
    <section style={{ padding: "clamp(5rem, 10vw, 8rem) clamp(1.25rem, 5vw, 3.5rem)", borderTop: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <span className="font-display text-gold-grad" style={{ fontSize: "3rem", lineHeight: 1, display: "block" }}>&ldquo;</span>
        </Reveal>
        <Reveal delay={0.08}>
          <p
            className="font-display"
            style={{
              fontWeight: 600,
              fontSize: "clamp(1.5rem, 3.4vw, 2.6rem)",
              lineHeight: 1.32,
              letterSpacing: "-0.025em",
              color: "var(--cream)",
              marginTop: "1rem",
            }}
          >
            FZY took my whole business out of my DMs and built me something that
            looks and works like a real brand. Clients book themselves now.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <div style={{ marginTop: "2.2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.8rem" }}>
            <span style={{ width: 34, height: 1, background: "var(--gold)", opacity: 0.5 }} />
            <span className="font-mono" style={{ fontSize: "0.78rem", letterSpacing: "0.08em", color: "rgba(245,240,235,0.6)" }}>
              Rokia M. · Makeup by Roko
            </span>
            <span style={{ width: 34, height: 1, background: "var(--gold)", opacity: 0.5 }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
