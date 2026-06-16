"use client";

const PORTFOLIO_URL = "https://faizantariq.dev";

export default function Footer() {
  return (
    <footer className="grain" style={{ background: "var(--bg-warm-2)", padding: "clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem) 2.5rem" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div className="hairline" style={{ background: "var(--line-strong)", marginBottom: "2.5rem" }} />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2rem", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            <svg width="26" height="14" viewBox="0 0 26 14" fill="none" aria-hidden>
              <path d="M1 7 H6 L9 1 L13 13 L17 7 H25" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontWeight: 600, letterSpacing: "0.22em", color: "var(--ink)" }}>FZY</span>
          </div>

          <div style={{ display: "flex", gap: "clamp(2rem, 5vw, 4rem)", flexWrap: "wrap" }}>
            <FooterCol title="Studio" links={[
              { label: "Work", href: "#work" },
              { label: "Capabilities", href: "#capabilities" },
              { label: "Start a Project", href: "#contact" },
            ]} />
            <FooterCol title="Elsewhere" links={[
              { label: "hello@fzystudio.dev", href: "mailto:hello@fzystudio.dev" },
              { label: "Founder's portfolio ↗", href: PORTFOLIO_URL, external: true },
            ]} />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem", marginTop: "3rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--gray)" }}>© {new Date().getFullYear()} FZY Studio. All rights reserved.</span>
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
