"use client";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const featured = {
  client: "Makeup by Roko",
  category: "Bridal Booking Platform",
  year: "2025",
  summary:
    "Rokia ran her entire bridal business through DMs and spreadsheets. FZY replaced all of it with one full-stack platform: client booking, calendar management, Zelle deposit tracking, and automated confirmations. Built mobile-first and live with real clients.",
  stats: [
    { value: "100%", label: "Bookings moved off DMs" },
    { value: "8+", label: "Automated email triggers" },
    { value: "1", label: "Platform, two audiences" },
  ],
  tech: ["Next.js", "Supabase", "Resend", "Stripe", "Vercel"],
  url: "https://makeupbyroko.vercel.app",
  grad: "linear-gradient(135deg, #2a1620 0%, #3d1f2e 50%, #1a0f15 100%)",
  accent: "#d4a0b0",
};

const more = [
  { client: "HVAC Service Co.", category: "Operations Platform", grad: "linear-gradient(135deg, #0e2a33 0%, #134455 50%, #0a1a20 100%)", accent: "#5eb0c4" },
  { client: "Automotive", category: "Product Showcase", grad: "linear-gradient(135deg, #2a1a0e 0%, #45290f 50%, #1a1009 100%)", accent: "#c48a5e" },
  { client: "Tone Translator", category: "AI Writing Tool", grad: "linear-gradient(135deg, #1f1633 0%, #2e1f4d 50%, #120f1a 100%)", accent: "#9a7ec4" },
];

export default function Work() {
  return (
    <section
      id="work"
      style={{ padding: "clamp(5rem, 10vw, 9rem) clamp(1.25rem, 5vw, 3.5rem)", borderTop: "1px solid var(--line)" }}
    >
      <SectionHeading
        index="(02)"
        eyebrow="Selected work"
        title={<>Platforms that <span className="text-gold-grad">go to work.</span></>}
        intro="A look at what end-to-end delivery looks like. Every project below was designed, engineered, and shipped by the studio."
      />

      {/* Featured case study */}
      <Reveal delay={0.1}>
        <a
          href={featured.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block", textDecoration: "none", marginTop: "clamp(3rem, 6vw, 4.5rem)" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              border: "1px solid var(--line)",
              borderRadius: 22,
              overflow: "hidden",
              background: "#0c0c0c",
              transition: "border-color 0.4s ease",
            }}
            className="featured-card"
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,106,0.4)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
          >
            <div className="featured-grid" style={{ display: "grid", gridTemplateColumns: "1fr", alignItems: "stretch" }}>
              {/* Visual */}
              <div
                className="grain"
                style={{
                  position: "relative",
                  minHeight: 260,
                  background: featured.grad,
                  display: "flex", alignItems: "flex-end",
                  padding: "2rem",
                }}
              >
                <span
                  className="font-display"
                  style={{
                    fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 0.95,
                    color: "rgba(245,240,235,0.92)",
                    position: "relative", zIndex: 2,
                  }}
                >
                  Makeup<br />by Roko
                </span>
                <span
                  style={{
                    position: "absolute", top: "1.5rem", left: "1.5rem", zIndex: 2,
                    padding: "0.3rem 0.85rem", borderRadius: 100,
                    border: `1px solid ${featured.accent}55`, background: `${featured.accent}1a`,
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <span className="font-mono" style={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: featured.accent }}>
                    Flagship · Live
                  </span>
                </span>
              </div>

              {/* Copy */}
              <div style={{ padding: "clamp(1.75rem, 4vw, 3rem)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1.1rem" }}>
                  <span className="eyebrow">{featured.category}</span>
                  <span style={{ color: "var(--muted)", fontSize: "0.7rem" }}>·</span>
                  <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{featured.year}</span>
                </div>
                <p style={{ fontSize: "clamp(0.98rem, 1.3vw, 1.12rem)", lineHeight: 1.7, color: "rgba(245,240,235,0.66)", maxWidth: "60ch" }}>
                  {featured.summary}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(1.5rem, 4vw, 3rem)", marginTop: "2rem" }}>
                  {featured.stats.map((s) => (
                    <div key={s.label}>
                      <div className="font-display text-gold-grad" style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em" }}>{s.value}</div>
                      <div className="font-mono" style={{ fontSize: "0.66rem", letterSpacing: "0.06em", color: "var(--muted)", marginTop: "0.35rem", maxWidth: "16ch" }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginTop: "2.2rem", paddingTop: "1.6rem", borderTop: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {featured.tech.map((t) => (
                      <span key={t} className="font-mono" style={{ fontSize: "0.7rem", padding: "0.25rem 0.7rem", border: "1px solid var(--line)", borderRadius: 5, color: "rgba(245,240,235,0.45)" }}>{t}</span>
                    ))}
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: featured.accent, fontSize: "0.9rem", fontWeight: 500 }}>
                    View live site
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", border: `1px solid ${featured.accent}66`, fontSize: "0.7rem" }}>↗</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </Reveal>

      {/* More work */}
      <div
        style={{
          marginTop: "clamp(1.5rem, 3vw, 2rem)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "clamp(1rem, 2vw, 1.5rem)",
        }}
      >
        {more.map((m, i) => (
          <Reveal key={m.client} delay={i * 0.08}>
            <div
              style={{
                position: "relative",
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid var(--line)",
                aspectRatio: "4/3",
                background: m.grad,
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
                padding: "1.6rem",
                cursor: "default",
                transition: "transform 0.4s ease",
              }}
              className="grain"
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <span style={{ position: "absolute", top: "1.2rem", right: "1.2rem", zIndex: 2 }} className="font-mono">
                <span style={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: m.accent }}>Case study</span>
              </span>
              <div style={{ position: "relative", zIndex: 2 }}>
                <h4 className="font-display" style={{ fontSize: "1.45rem", fontWeight: 700, letterSpacing: "-0.02em", color: "rgba(245,240,235,0.92)" }}>{m.client}</h4>
                <p className="font-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.06em", color: "rgba(245,240,235,0.55)", marginTop: "0.4rem" }}>{m.category}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <style>{`
        @media (min-width: 900px) {
          .featured-grid { grid-template-columns: 0.85fr 1fr !important; }
          .featured-grid > .grain:first-child { min-height: 100% !important; }
        }
      `}</style>
    </section>
  );
}
