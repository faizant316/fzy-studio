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

// Staggered mask-reveal of the FZY letters, plus a slow light sheen that sweeps
// across the type so the mark feels alive instead of static. Minimal + premium.
export default function Wordmark({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const letters = ["F", "Z", "Y"];

  const type: React.CSSProperties = {
    display: "inline-block",
    fontWeight: 600,
    letterSpacing: "-0.05em",
    lineHeight: 0.8,
    fontSize: "clamp(5rem, 17vw, 15rem)",
    backgroundImage: "linear-gradient(105deg, #0a0a0a 0%, #0a0a0a 40%, #6a6a6a 50%, #0a0a0a 60%, #0a0a0a 100%)",
    backgroundSize: "230% 100%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
    animation: "fzy-sheen 7s ease-in-out infinite",
  };

  if (reduce) {
    return (
      <div className={className} style={{ display: "flex", justifyContent: "center" }}>
        <span style={{ ...type, animation: "none", backgroundImage: "none", color: "var(--ink)", WebkitTextFillColor: "var(--ink)" }}>FZY</span>
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
        @media (prefers-reduced-motion: reduce) {
          [data-fzy-sheen] { animation: none !important; }
        }
      `}</style>
    </motion.div>
  );
}
