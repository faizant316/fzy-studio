"use client";

const PORTFOLIO_URL = "https://faizantariq.dev";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "clamp(3rem, 6vw, 5rem) clamp(1.25rem, 5vw, 3.5rem) 2.5rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2.5rem", alignItems: "flex-start" }}>
        <div style={{ maxWidth: "32ch" }}>
          <span className="font-display" style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--cream)" }}>FZY</span>
          <p style={{ marginTop: "1rem", fontSize: "0.9rem", lineHeight: 1.65, color: "rgba(245,240,235,0.42)" }}>
            A web development studio building custom platforms for real businesses. Founded by Faizan Tariq in Sacramento, CA.
          </p>
        </div>

        <div style={{ display: "flex", gap: "clamp(2rem, 5vw, 4rem)", flexWrap: "wrap" }}>
          <FooterCol
            title="Studio"
            links={[
              { label: "Work", href: "#work" },
              { label: "Services", href: "#services" },
              { label: "Process", href: "#process" },
              { label: "Start a project", href: "#contact" },
            ]}
          />
          <FooterCol
            title="Elsewhere"
            links={[
              { label: "hello@fzystudio.dev", href: "mailto:hello@fzystudio.dev" },
              { label: "Founder's portfolio ↗", href: PORTFOLIO_URL, external: true },
            ]}
          />
        </div>
      </div>

      <div className="hairline" style={{ margin: "2.5rem 0 1.5rem" }} />

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem" }}>
        <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--muted)" }}>© {new Date().getFullYear()} FZY Studio. All rights reserved.</span>
        <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Designed & built in-house.</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string; external?: boolean }[] }) {
  return (
    <div>
      <p className="eyebrow" style={{ color: "var(--muted)", marginBottom: "1rem" }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.external ? "_blank" : undefined}
            rel={l.external ? "noopener noreferrer" : undefined}
            className="link-sweep"
            style={{ width: "fit-content", fontSize: "0.9rem", color: "rgba(245,240,235,0.62)" }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
