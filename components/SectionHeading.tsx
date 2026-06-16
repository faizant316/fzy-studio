"use client";
import Reveal from "./Reveal";

export default function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
}) {
  return (
    <div style={{ maxWidth: 880 }}>
      <Reveal>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--gold)" }}>{index}</span>
          <span style={{ width: 28, height: 1, background: "var(--gold)", opacity: 0.5 }} />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className="font-display"
          style={{
            fontWeight: 700,
            fontSize: "clamp(2.1rem, 4.8vw, 3.8rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.012em",
            color: "var(--cream)",
          }}
        >
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.16}>
          <p
            style={{
              marginTop: "1.4rem",
              maxWidth: "52ch",
              fontSize: "clamp(0.98rem, 1.2vw, 1.1rem)",
              lineHeight: 1.7,
              color: "rgba(245,240,235,0.5)",
            }}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
