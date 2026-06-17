"use client";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
};

const letterV = {
  hidden: { y: "118%" },
  visible: { y: 0, transition: { duration: 1.0, ease } },
};

// Staggered mask-reveal of FZY. `frosted` renders filled, milky glass letters
// (used over the video hero) — the footage reads softly through them with a
// crisp rim and a soft halo; otherwise a filled wordmark with a slow sheen.
export default function Wordmark({ className, light = false, frosted = false }: { className?: string; light?: boolean; frosted?: boolean }) {
  const reduce = useReducedMotion();
  const letters = ["F", "Z", "Y"];

  const base = light ? "#ffffff" : "#0a0a0a";
  const sheen = light ? "#bdbdbd" : "#6a6a6a";

  const sizing: React.CSSProperties = {
    display: "inline-block",
    fontWeight: 600,
    letterSpacing: "-0.05em",
    lineHeight: 0.8,
    fontSize: "clamp(5rem, 16vw, 14rem)",
  };

  // Frosted glass: a translucent fill lets the video glow through, a faint rim
  // gives the glyphs definition, and a soft halo reads as blurred glass depth.
  const fillRGB = light ? "255,255,255" : "10,10,10";
  const frostedType: React.CSSProperties = {
    ...sizing,
    color: `rgba(${fillRGB},${light ? 0.2 : 0.14})`,
    WebkitTextFillColor: `rgba(${fillRGB},${light ? 0.2 : 0.14})`,
    WebkitTextStroke: `1px rgba(${fillRGB},${light ? 0.4 : 0.28})`,
    textShadow: light
      ? "0 0 1px rgba(255,255,255,0.55), 0 6px 38px rgba(255,255,255,0.22)"
      : "0 0 1px rgba(10,10,10,0.4), 0 6px 30px rgba(10,10,10,0.1)",
  };

  const fillType: React.CSSProperties = {
    ...sizing,
    backgroundImage: `linear-gradient(105deg, ${base} 0%, ${base} 40%, ${sheen} 50%, ${base} 60%, ${base} 100%)`,
    backgroundSize: "230% 100%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
    animation: "fzy-sheen 7s ease-in-out infinite",
  };

  const type = frosted ? frostedType : fillType;

  if (reduce) {
    const staticStyle = frosted ? frostedType : { ...sizing, color: base, WebkitTextFillColor: base };
    return (
      <div className={className} style={{ display: "flex", justifyContent: "center" }}>
        <span style={staticStyle}>FZY</span>
      </div>
    );
  }

  return (
    <motion.div className={className} variants={container} initial="hidden" animate="visible" style={{ display: "flex", justifyContent: "center" }}>
      {letters.map((l) => (
        <span key={l} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.14em" }}>
          <motion.span variants={letterV} style={type}>{l}</motion.span>
        </span>
      ))}
      <style>{`
        @keyframes fzy-sheen {
          0% { background-position: 135% 0; }
          55%, 100% { background-position: -35% 0; }
        }
      `}</style>
    </motion.div>
  );
}
