"use client";
import { useEffect, useState } from "react";
import { HERO_VIDEO } from "./heroConfig";
import { lenisScrollTo } from "./lenis";

// Intrinsic glyph geometry. The mark is authored once at this px size and scaled
// with a CSS transform, so the SVG mask coordinates never have to recompute.
const W = 156;
const H = 80;
const FS = 74;
const BASELINE = 64;
const TRACK = -3;

const glyphFont: React.CSSProperties = {
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: FS,
  letterSpacing: TRACK,
};

// FZY home button. Over the video hero it renders as a large liquid-glass mark:
// a backdrop-blur layer clipped to the letterforms (so the footage refracts
// through them) with a specular sheen and a bright rim. Once scrolled past the
// hero it crossfades down to the compact solid wordmark. The solid mark stays in
// flow and defines the button's size; the glass is an absolute overlay that
// overflows into the hero, so the nav bar height never changes.
export default function Brand() {
  const [overHero, setOverHero] = useState(Boolean(HERO_VIDEO));

  useEffect(() => {
    if (!HERO_VIDEO) return;
    const onScroll = () => setOverHero(window.scrollY < window.innerHeight * 0.82);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = (
    <span
      style={{
        fontWeight: 600,
        fontSize: "1rem",
        letterSpacing: "0.24em",
        whiteSpace: "nowrap",
        color: overHero ? "transparent" : "var(--ink)",
        transition: "color 0.4s ease",
      }}
    >
      FZY
    </span>
  );

  if (!HERO_VIDEO) {
    return (
      <button onClick={() => lenisScrollTo(0)} aria-label="FZY home" style={btn}>
        {solid}
      </button>
    );
  }

  return (
    <button onClick={() => lenisScrollTo(0)} aria-label="FZY home" style={{ ...btn, position: "relative", overflow: "visible" }}>
      {/* Zero-size SVG carrying the letter-shaped mask + sheen gradient. */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <mask id="fzy-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
            <text x="0" y={BASELINE} fill="#fff" style={glyphFont}>FZY</text>
          </mask>
          <linearGradient id="fzy-sheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="42%" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.04" />
          </linearGradient>
        </defs>
      </svg>

      {/* Solid mark — in flow, defines the box; invisible while over the hero. */}
      {solid}

      {/* Liquid glass — absolute overlay, grows down into the hero. */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          width: W,
          height: H,
          transformOrigin: "left center",
          transform: overHero ? "translateY(-50%) scale(1)" : "translateY(-50%) scale(0.3)",
          opacity: overHero ? 1 : 0,
          transition: "opacity 0.45s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.34))",
          pointerEvents: "none",
        }}
      >
        {/* Refraction: blurred, saturated backdrop clipped to the glyphs. */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(7px) saturate(195%) brightness(1.07)",
            WebkitBackdropFilter: "blur(7px) saturate(195%) brightness(1.07)",
            background: "rgba(255,255,255,0.10)",
            WebkitMaskImage: "url(#fzy-mask)",
            maskImage: "url(#fzy-mask)",
          }}
        />
        {/* Sheen fill + bright rim, same coords/font so they register exactly. */}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible" }} aria-hidden>
          <text x="0" y={BASELINE} fill="url(#fzy-sheen)" style={glyphFont}>FZY</text>
          <text x="0" y={BASELINE} fill="none" stroke="rgba(255,255,255,0.78)" strokeWidth="1" style={glyphFont}>FZY</text>
        </svg>
      </span>
    </button>
  );
}

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
};
