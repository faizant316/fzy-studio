"use client";
import { useEffect, useRef, useState } from "react";

/* A realistic iPhone (titanium rim, black bezel, Dynamic Island with a lens,
   9:41 status bar, side buttons, a faint glass glare), built in CSS so it stays
   crisp at any size. Screens are designed at the real logical resolution
   (390 × 844) and scaled to fit, so every mockup is pixel-true. */

export const SCREEN_W = 390;
export const SCREEN_H = 844;

export default function IPhone({
  children,
  dark = false,
  className = "",
  style,
  island,
}: {
  children: React.ReactNode;
  /** Light status-bar glyphs for dark screens. */
  dark?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Optional content that drops out of the Dynamic Island (e.g. a toast). */
  island?: React.ReactNode;
}) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / SCREEN_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`ip ${className}`} style={style}>
      <i className="ip-btn ip-btn--action" aria-hidden />
      <i className="ip-btn ip-btn--volup" aria-hidden />
      <i className="ip-btn ip-btn--voldown" aria-hidden />
      <i className="ip-btn ip-btn--power" aria-hidden />
      <div className="ip-bezel">
        <div className="ip-screen" ref={screenRef}>
          <div
            className="ip-canvas"
            style={{ transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}
          >
            <StatusBar dark={dark} />
            {children}
            {island}
            <span className="ip-island" aria-hidden>
              <i className="ip-lens" />
            </span>
            <span className="ip-home" style={{ background: dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.85)" }} aria-hidden />
          </div>
          <span className="ip-glare" aria-hidden />
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: IPHONE_CSS }} />
    </div>
  );
}

function StatusBar({ dark }: { dark: boolean }) {
  const c = dark ? "#fff" : "#000";
  return (
    <div className="ip-status" style={{ color: c }} aria-hidden>
      <span className="ip-time">9:41</span>
      <span className="ip-glyphs">
        <svg width="19" height="12" viewBox="0 0 19 12"><rect x="0" y="7.5" width="3.2" height="4.5" rx="0.9" fill={c} /><rect x="5.1" y="5.2" width="3.2" height="6.8" rx="0.9" fill={c} /><rect x="10.2" y="2.7" width="3.2" height="9.3" rx="0.9" fill={c} /><rect x="15.3" y="0" width="3.2" height="12" rx="0.9" fill={c} /></svg>
        <svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 2.3c2.4 0 4.6.9 6.3 2.5l1.2-1.2C14 1.6 11.4.6 8.5.6S3 1.6 1 3.6l1.2 1.2C3.9 3.2 6.1 2.3 8.5 2.3zm0 3.4c1.5 0 2.9.6 4 1.6l1.2-1.2C12.3 4.8 10.5 4 8.5 4s-3.8.8-5.2 2.1l1.2 1.2c1.1-1 2.5-1.6 4-1.6zm0 3.4c.6 0 1.2.2 1.6.6L8.5 11.4 6.9 9.7c.4-.4 1-.6 1.6-.6z" fill={c} /></svg>
        <svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.8" stroke={c} strokeOpacity="0.38" fill="none" /><rect x="2.2" y="2.2" width="19.6" height="8.6" rx="2.4" fill={c} /><path d="M25 4.4v4.2c.8-.3 1.4-1.1 1.4-2.1S25.8 4.7 25 4.4z" fill={c} fillOpacity="0.45" /></svg>
      </span>
    </div>
  );
}

const IPHONE_CSS = `
.ip {
  position: relative; aspect-ratio: 0.4905; width: 100%;
  border-radius: 15.5% / 7.6%;
  padding: 1.15%;
  /* brushed natural titanium rim */
  background:
    linear-gradient(90deg, rgba(255,255,255,0.55), rgba(255,255,255,0) 6%, rgba(255,255,255,0) 94%, rgba(255,255,255,0.45)),
    linear-gradient(160deg, #f4f4f2 0%, #c9c8c4 22%, #8f8e8a 48%, #d8d7d3 70%, #a7a6a2 100%);
  box-shadow:
    0 0 0 0.5px rgba(0,0,0,0.38),
    inset 0 0 0 0.6px rgba(255,255,255,0.75),
    inset 0 0 2px 1px rgba(0,0,0,0.25),
    0 50px 70px -38px rgba(20,20,20,0.5),
    0 22px 34px -22px rgba(20,20,20,0.38);
}
.ip-bezel {
  position: relative; width: 100%; height: 100%;
  border-radius: 14.6% / 7.1%;
  background: #050506;
  padding: 3.05%;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
}
.ip-screen {
  position: relative; width: 100%; height: 100%; overflow: hidden;
  border-radius: 12.4% / 5.8%;
  background: #fff;
  isolation: isolate;
}
.ip-canvas {
  position: absolute; left: 0; top: 0;
  width: ${SCREEN_W}px; height: ${SCREEN_H}px;
  transform-origin: 0 0;
  overflow: hidden;
  transition: opacity 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--font-inter), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.ip-status {
  position: absolute; z-index: 30; left: 0; right: 0; top: 0; height: 54px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 4px 30px 0 46px; pointer-events: none;
}
.ip-time { font-size: 17px; font-weight: 600; letter-spacing: -0.2px; }
.ip-glyphs { display: inline-flex; align-items: center; gap: 6px; }
.ip-island {
  position: absolute; z-index: 40; left: 50%; top: 11px; transform: translateX(-50%);
  width: 124px; height: 36px; border-radius: 20px; background: #000;
}
.ip-lens {
  position: absolute; right: 13px; top: 50%; width: 12px; height: 12px; margin-top: -6px; border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #3a4a78 0%, #141a2e 45%, #050508 75%);
  box-shadow: inset 0 0 0 1.5px #111421;
}
.ip-home {
  position: absolute; z-index: 30; left: 50%; bottom: 8px; transform: translateX(-50%);
  width: 139px; height: 5px; border-radius: 3px;
}
.ip-glare {
  position: absolute; inset: 0; z-index: 50; pointer-events: none;
  background: linear-gradient(118deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 26%, rgba(255,255,255,0) 42%);
  mix-blend-mode: screen;
}
.ip-btn {
  position: absolute; width: 0.9%; border-radius: 2px;
  background: linear-gradient(90deg, #8a8985, #d9d8d4 45%, #9b9a96);
  box-shadow: 0 0 0 0.5px rgba(0,0,0,0.3);
}
.ip-btn--action { left: -0.7%; top: 17.5%; height: 4.2%; }
.ip-btn--volup { left: -0.7%; top: 25%; height: 7.5%; }
.ip-btn--voldown { left: -0.7%; top: 34%; height: 7.5%; }
.ip-btn--power { right: -0.7%; top: 28%; height: 11%; }
`;
