"use client";

const PORTFOLIO_URL = "https://faizantariq.dev";

export default function Footer() {
  return (
    <footer className="grain" style={{ position: "relative", zIndex: 2, background: "var(--tone-b)", padding: "clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem) 2.5rem" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ height: 1, background: "var(--line-strong)", marginBottom: "2.5rem" }} />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2rem", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontWeight: 600, letterSpacing: "0.22em", color: "var(--ink)" }}>FZY</span>
          </div>

          <div style={{ display: "flex", gap: "clamp(2rem, 5vw, 4rem)", flexWrap: "wrap" }}>
            <FooterCol title="Studio" links={[
              { label: "Work", href: "#work" },
              { label: "Process", href: "#process" },
              { label: "FAQ", href: "#faq" },
              { label: "Get a Quote", href: "#contact" },
            ]} />
            <FooterCol title="Elsewhere" links={[
              { label: "hello@fzydev.com", href: "mailto:hello@fzydev.com" },
              { label: "Instagram ↗", href: "https://www.instagram.com/fzydev", external: true },
              { label: "LinkedIn ↗", href: "https://www.linkedin.com/in/faizantariq916/", external: true },
              { label: "Founder's portfolio ↗", href: PORTFOLIO_URL, external: true },
            ]} />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem", marginTop: "3rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--gray)" }}>© {new Date().getFullYear()} FZY Dev. All rights reserved.</span>
          <span style={{ fontSize: "0.78rem", color: "var(--gray)" }}>Sacramento, CA</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string; external?: boolean }[] }) {
  return (
    <div>
      <p className="eyebrow" style={{ color: "var(--gray)", marginBottom: "1rem" }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {links.map((l) => (
          <a key={l.label} href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener noreferrer" : undefined}
            className="link-line" style={{ width: "fit-content", fontSize: "0.92rem", color: "var(--ink-soft)" }}>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
