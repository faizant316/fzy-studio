"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -80px 0px" },
  transition: { duration: 0.8, delay, ease },
});

const WORDS = ["platforms.", "dashboards.", "bookings.", "automations."];

export default function Statement() {
  return (
    <section id="studio" style={{ background: "var(--bg)", padding: "clamp(5rem, 12vw, 10rem) clamp(1.25rem, 4vw, 3rem)" }}>
      <div className="statement-grid" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "clamp(2.5rem, 5vw, 5rem)" }}>
        <motion.h2 {...fade(0)} className="display" style={{ fontSize: "clamp(2rem, 4.4vw, 3.7rem)", color: "var(--ink)", maxWidth: "20ch" }}>
          <span style={{ display: "block" }}>We design and build</span>
          <Typewriter words={WORDS} />
        </motion.h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem", maxWidth: "42ch" }}>
          <motion.p {...fade(0.1)} style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)", lineHeight: 1.65, color: "var(--ink-soft)" }}>
            FZY is a web development studio. We design and engineer custom platforms end to end.
          </motion.p>
          <motion.p {...fade(0.18)} style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)", lineHeight: 1.65, color: "var(--gray)" }}>
            One considered product that replaces the spreadsheets and DMs a business outgrows, and runs without you.
          </motion.p>

          {/* Who's behind it: a face on the studio, in the studio's voice. */}
          <motion.div {...fade(0.26)} style={{ marginTop: "0.8rem", paddingTop: "1.75rem", borderTop: "1px solid var(--line)" }}>
            <span className="eyebrow" style={{ color: "var(--accent)" }}>Behind the studio</span>
            <div style={{ marginTop: "1.15rem", display: "flex", alignItems: "center", gap: "0.95rem" }}>
              {/* Monogram avatar; swap for a real photo when there is one. */}
              <span aria-hidden style={{
                flexShrink: 0, width: 48, height: 48, borderRadius: "50%",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: "var(--accent-soft)", border: "1px solid rgba(122,162,227,0.35)",
                color: "var(--accent)", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.08em",
              }}>FT</span>
              <div>
                <p style={{ fontSize: "1.08rem", fontWeight: 500, color: "var(--ink)" }}>Faizan Tariq</p>
                <p style={{ marginTop: "0.15rem", fontSize: "0.85rem", color: "var(--gray)" }}>Founder &amp; lead engineer</p>
              </div>
            </div>
            <p style={{ marginTop: "1rem", fontSize: "0.98rem", lineHeight: 1.65, color: "var(--gray)" }}>
              FZY is a small studio that designs, engineers, and ships every build in-house. No handoffs and no account managers: you work directly with the team building your product, from first call to launch.
            </p>
            <div style={{ marginTop: "1.1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem 1.5rem" }}>
              <a href="https://faizantariq.dev" target="_blank" rel="noopener noreferrer" className="link-line" style={{ fontSize: "0.88rem", color: "var(--ink-soft)" }}>Portfolio ↗</a>
              <a href="https://www.linkedin.com/in/faizantariq916/" target="_blank" rel="noopener noreferrer" className="link-line" style={{ fontSize: "0.88rem", color: "var(--ink-soft)" }}>LinkedIn ↗</a>
              <a href="https://www.instagram.com/fzydev" target="_blank" rel="noopener noreferrer" className="link-line" style={{ fontSize: "0.88rem", color: "var(--ink-soft)" }}>@fzydev ↗</a>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) { .statement-grid { grid-template-columns: 1.1fr 1fr !important; align-items: start; } }
      `}</style>
    </section>
  );
}

function Typewriter({ words }: { words: string[] }) {
  const reduce = useReducedMotion();
  const [wordIdx, setWordIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (reduce) { setText(words[0]); return; }
    const full = words[wordIdx];
    if (!deleting && text === full) {
      timer.current = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && text === "") {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    } else {
      timer.current = setTimeout(() => {
        setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1));
      }, deleting ? 58 : 72);
    }
    return () => clearTimeout(timer.current);
  }, [text, deleting, wordIdx, words, reduce]);

  return (
    <span style={{ color: "var(--ink)", display: "block", minHeight: "1em" }}>
      {text}
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "0.06em",
          height: "0.82em",
          marginLeft: "0.06em",
          background: "var(--ink)",
          transform: "translateY(0.08em)",
          animation: reduce ? "none" : "tw-blink 1s step-end infinite",
        }}
      />
      <style>{`@keyframes tw-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </span>
  );
}
