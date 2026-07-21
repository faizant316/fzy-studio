"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { lenisStop, lenisStart } from "./lenis";

const ease = [0.22, 1, 0.36, 1] as const;

const projectTypes = ["Website", "Web app / platform", "Booking / automation", "Not sure yet"];
const budgets = ["< $2k", "$2k-$5k", "$5k-$10k", "$10k+"];
const timelines = ["ASAP", "1-3 months", "Just exploring"];

// Monochrome selectable tag. Selected inverts to solid ink, so the choice reads
// at a glance without a colored fill.
function Option({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className="opt" data-active={active || undefined}>
      {label}
    </button>
  );
}

// Locks page scroll behind the overlay by stopping Lenis and hiding overflow.
// The scroll position never moves, so closing returns you exactly where you were.
function useScrollLock(active: boolean, onClose: () => void) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeRef.current(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!active) return;
    lenisStop();
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      lenisStart();
    };
  }, [active]);
}

/* ── Work with us: a calm invitation on the page, and one detailed request form
   that slides up when you're ready. No packages, no tiers: you describe the
   build, set your budget, and send it. ── */
export default function ContactReveal() {
  const [formOpen, setFormOpen] = useState(false);

  // The hero's "Get a quote" opens the form directly from anywhere on the page.
  useEffect(() => {
    const open = () => setFormOpen(true);
    window.addEventListener("fzy:quote", open);
    return () => window.removeEventListener("fzy:quote", open);
  }, []);

  return (
    <section
      id="contact"
      className="grain"
      style={{
        position: "relative", zIndex: 1, overflow: "hidden",
        background: "var(--tone-b)",
        borderTop: "1px solid var(--line)",
        borderTopLeftRadius: "clamp(1.75rem, 4.5vw, 3.5rem)",
        borderTopRightRadius: "clamp(1.75rem, 4.5vw, 3.5rem)",
        padding: "clamp(4.5rem, 10vw, 8rem) clamp(1.25rem, 4vw, 3rem) clamp(4rem, 8vw, 6.5rem)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.8, ease }}
        >
          {/* Editorial header: headline left, supporting copy right */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem 3rem" }}>
            <div>
              <span className="eyebrow" style={{ color: "var(--accent)" }}>Work with us</span>
              <h2 className="display" style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.6rem)", color: "var(--ink)", marginTop: "1rem", letterSpacing: "-0.035em", maxWidth: "13ch" }}>
                Tell us what you&rsquo;re building.
              </h2>
            </div>
            <p style={{ fontSize: "clamp(1rem, 1.4vw, 1.12rem)", lineHeight: 1.65, color: "var(--gray)", maxWidth: "38ch", paddingBottom: "0.4rem" }}>
              No packages, no menus. Every build is scoped to you: one detailed request with your budget, and you&rsquo;ll hear back within 24 hours with a clear next step.
            </p>
          </div>

          {/* The action row */}
          <div style={{ marginTop: "clamp(2.25rem, 4.5vw, 3.5rem)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.25rem 2.25rem" }}>
            <button
              onClick={() => setFormOpen(true)}
              className="pill-solid"
              style={{ padding: "1.1rem 2.4rem", fontSize: "1.02rem", fontWeight: 600 }}
            >
              Get a quote
            </button>
            <span style={{ fontSize: "0.92rem", color: "var(--gray)", letterSpacing: "0.01em" }}>
              Replies within 24 hours
            </span>
          </div>

          {/* Quiet trust row along the bottom */}
          <div style={{ marginTop: "clamp(2.75rem, 5.5vw, 4rem)", paddingTop: "1.4rem", borderTop: "1px solid var(--line)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.85rem 2rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.85rem 2rem" }}>
              <a href="mailto:hello@fzydev.com" className="link-line" style={{ color: "var(--ink)", fontSize: "0.95rem" }}>hello@fzydev.com</a>
              <a href="https://www.instagram.com/fzydev" target="_blank" rel="noopener noreferrer" className="link-line" style={{ color: "var(--ink-soft)", fontSize: "0.95rem" }}>@fzydev</a>
            </div>
            <span className="eyebrow" style={{ color: "var(--gray)" }}>Sacramento, CA · Available worldwide</span>
          </div>
        </motion.div>
      </div>

      <FormOverlay open={formOpen} onClose={() => setFormOpen(false)} />
    </section>
  );
}

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

function FormOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", project: "", budget: "", timeline: "", message: "" });
  const [missing, setMissing] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  useEffect(() => setMounted(true), []);
  useScrollLock(open, onClose);
  useEffect(() => { if (open) { setStatus("idle"); setMissing([]); } }, [open]);

  // Editing a flagged field clears its own flag, so the form stops nagging.
  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setMissing((m) => (m.includes(k) ? m.filter((x) => x !== k) : m));
  };
  const bad = (k: string) => (missing.includes(k) ? "field field-bad" : "field");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const gaps: string[] = [];
    if (!form.name.trim()) gaps.push("name");
    if (!emailOk(form.email)) gaps.push("email");
    if (!form.budget) gaps.push("budget");
    if (form.message.trim().length < 10) gaps.push("message");
    if (gaps.length) { setMissing(gaps); setStatus("error"); return; }

    setMissing([]);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email, company: form.company,
          projectType: form.project || "General request",
          budget: form.budget, timeline: form.timeline, description: form.message,
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch { setStatus("error"); }
  };

  // Tells the visitor exactly what is missing rather than a generic complaint.
  const errorText = () => {
    if (!missing.length) return "Something went wrong on our end. Email hello@fzydev.com and we'll pick it up there.";
    const labels: Record<string, string> = { name: "your name", email: "a valid email", budget: "a budget range", message: "a few details about the project" };
    const parts = missing.map((k) => labels[k]);
    const list = parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}` : parts[0];
    return `Still need ${list}.`;
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div data-lenis-prevent
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.55, ease }}
          style={{ position: "fixed", inset: 0, zIndex: 210, overflowY: "auto", willChange: "transform", WebkitOverflowScrolling: "touch", background: "#08080a" }}
        >
          <button onClick={onClose} aria-label="Close" className="modal-close">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </button>

          <div className="form-shell">
            {status === "done" ? (
              <motion.div className="form-done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
                <span className="eyebrow" style={{ color: "var(--gray)" }}>Request sent</span>
                <h2 className="display" style={{ fontSize: "clamp(2.6rem, 7vw, 4.2rem)", color: "var(--ink)", marginTop: "1.1rem" }}>Got it.</h2>
                <p style={{ marginTop: "1.5rem", fontSize: "1.08rem", lineHeight: 1.7, color: "var(--gray)", maxWidth: "42ch" }}>
                  Thanks, {form.name.trim().split(" ")[0] || "there"}. Your request is in and a confirmation is on its way to {form.email.trim()}. We&rsquo;ll come back to you within 24 hours.
                </p>
                <button onClick={onClose} className="pill-solid" style={{ marginTop: "2.25rem" }}>Back to site</button>
              </motion.div>
            ) : (
              <>
                {/* Left: editorial intro, sticky on desktop */}
                <aside className="form-aside">
                  <span className="eyebrow" style={{ color: "var(--gray)" }}>Get a quote</span>
                  <h2 className="display" style={{ fontSize: "clamp(2.5rem, 5vw, 3.6rem)", color: "var(--ink)", marginTop: "1.1rem" }}>Tell us<br />about it</h2>
                  <p style={{ marginTop: "1.4rem", fontSize: "1.02rem", lineHeight: 1.7, color: "var(--gray)", maxWidth: "34ch" }}>
                    A few details about the project and where it&rsquo;s getting stuck. The more you share, the sharper our first reply.
                  </p>
                </aside>

                {/* Right: the request, grouped into three quiet passes */}
                <form onSubmit={submit} className="form-body" noValidate>
                  <section className="grp">
                    <div className="grp-head"><span>01</span>About you</div>
                    <div className="pair">
                      <div>
                        <label htmlFor="q-name" className="lbl">Name</label>
                        <input id="q-name" className={bad("name")} value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
                      </div>
                      <div>
                        <label htmlFor="q-email" className="lbl">Email</label>
                        <input id="q-email" type="email" inputMode="email" className={bad("email")} value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="q-co" className="lbl">Business <span className="lbl-opt">optional</span></label>
                      <input id="q-co" className="field" value={form.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />
                    </div>
                  </section>

                  <section className="grp">
                    <div className="grp-head"><span>02</span>The project</div>
                    <div>
                      <span className="lbl">What do you need</span>
                      <div className="opts">
                        {projectTypes.map((p) => <Option key={p} label={p} active={form.project === p} onClick={() => set("project", form.project === p ? "" : p)} />)}
                      </div>
                    </div>
                    <div className="pair">
                      <div>
                        <span className="lbl">Budget</span>
                        <div className="opts" data-bad={missing.includes("budget") || undefined}>
                          {budgets.map((b) => <Option key={b} label={b} active={form.budget === b} onClick={() => set("budget", b)} />)}
                        </div>
                        <span className="hint">A range is enough.</span>
                      </div>
                      <div>
                        <span className="lbl">Timeline <span className="lbl-opt">optional</span></span>
                        <div className="opts">
                          {timelines.map((t) => <Option key={t} label={t} active={form.timeline === t} onClick={() => set("timeline", form.timeline === t ? "" : t)} />)}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="grp">
                    <div className="grp-head"><span>03</span>The request</div>
                    <div>
                      <label htmlFor="q-msg" className="lbl">What you&rsquo;re building</label>
                      <textarea id="q-msg" rows={5} className={bad("message")} value={form.message} onChange={(e) => set("message", e.target.value)}
                        placeholder={"Who it’s for, what it needs to do, and what success looks like. Links to anything you already have are welcome."} />
                    </div>
                  </section>

                  <div className="send">
                    <button type="submit" disabled={status === "sending"} className="pill-solid">
                      {status === "sending" ? "Sending" : "Send request"}
                    </button>
                    {status === "error" && <p className="err">{errorText()}</p>}
                  </div>
                </form>

                {/* Sits under the intro on desktop, and after the form on mobile,
                    so a phone drops straight into the fields. */}
                <div className="form-foot">
                  <a href="mailto:hello@fzydev.com" className="link-line" style={{ color: "var(--ink)", fontSize: "1rem", width: "max-content" }}>hello@fzydev.com</a>
                  <span style={{ fontSize: "0.9rem", color: "var(--gray)" }}>Replies within 24 hours</span>
                  <span className="eyebrow" style={{ color: "var(--gray-light)" }}>Sacramento, CA · Available worldwide</span>
                </div>
              </>
            )}
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .modal-close {
              position: fixed; z-index: 2;
              top: max(1.1rem, env(safe-area-inset-top)); right: clamp(1rem, 4vw, 2.5rem);
              width: 42px; height: 42px; border-radius: 50%;
              display: inline-flex; align-items: center; justify-content: center;
              border: 1px solid var(--line); background: transparent;
              color: var(--gray); cursor: pointer;
              transition: color 0.3s ease, border-color 0.3s ease;
            }
            .modal-close:hover { color: var(--ink); border-color: var(--line-strong); }

            .form-shell {
              max-width: 1120px; margin: 0 auto;
              padding: clamp(4.5rem, 11svh, 7rem) clamp(1.35rem, 5vw, 3rem) clamp(4rem, 8vw, 6rem);
              display: flex; flex-direction: column; gap: clamp(2.75rem, 6vw, 4rem);
            }
            .form-foot {
              padding-top: 1.6rem; border-top: 1px solid var(--line);
              display: flex; flex-direction: column; gap: 0.85rem;
            }

            .form-body { display: flex; flex-direction: column; gap: clamp(2.5rem, 5vw, 3.5rem); }
            .grp { display: flex; flex-direction: column; gap: 1.75rem; }
            .grp-head {
              display: flex; align-items: baseline; gap: 0.85rem;
              padding-bottom: 0.9rem; border-bottom: 1px solid var(--line);
              font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft);
            }
            .grp-head span { font-size: 0.7rem; letter-spacing: 0.12em; color: var(--gray-light); }

            .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 1.75rem; align-items: start; }

            .lbl {
              display: block; margin-bottom: 0.7rem;
              font-size: 0.7rem; font-weight: 500; letter-spacing: 0.14em;
              text-transform: uppercase; color: var(--gray);
            }
            .lbl-opt { text-transform: none; letter-spacing: 0.02em; font-size: 0.72rem; color: var(--gray-light); }
            .hint { display: block; margin-top: 0.7rem; font-size: 0.78rem; color: var(--gray-light); }

            /* Underline fields: no boxes, no fills, no shadows. */
            .field {
              width: 100%; display: block;
              background: transparent; border: 0; border-bottom: 1px solid var(--line-strong);
              border-radius: 0; padding: 0.55rem 0 0.7rem;
              font-family: var(--font-inter); font-size: 1rem; color: var(--ink);
              outline: none; transition: border-color 0.35s ease;
            }
            .field::placeholder { color: var(--gray-light); }
            .field:hover { border-bottom-color: rgba(255,255,255,0.28); }
            .field:focus { border-bottom-color: var(--ink); }
            .field-bad { border-bottom-color: var(--accent-red); }
            textarea.field { resize: vertical; min-height: 8.5rem; line-height: 1.65; }

            .opts { display: flex; flex-wrap: wrap; gap: 0.5rem; }
            .opt {
              font-family: var(--font-inter); font-size: 0.88rem; line-height: 1;
              padding: 0.7rem 1.05rem; border-radius: 6px; cursor: pointer;
              border: 1px solid var(--line); background: transparent; color: var(--gray);
              transition: border-color 0.25s ease, color 0.25s ease, background 0.25s ease;
            }
            @media (hover: hover) { .opt:hover { border-color: var(--line-strong); color: var(--ink-soft); } }
            .opt[data-active] { background: var(--ink); border-color: var(--ink); color: var(--bg); font-weight: 500; }
            .opts[data-bad] .opt { border-color: var(--accent-red); }

            .send { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem 1.5rem; }
            .err { font-size: 0.86rem; color: var(--accent-red); max-width: 34ch; line-height: 1.5; }

            @media (min-width: 900px) {
              .form-shell {
                display: grid; align-items: start;
                grid-template-columns: 0.78fr 1.22fr;
                grid-template-rows: auto 1fr;
                grid-template-areas: "aside form" "foot form";
                column-gap: clamp(3.5rem, 7vw, 6rem);
                row-gap: clamp(2rem, 4vw, 3rem);
              }
              .form-aside { grid-area: aside; }
              .form-body { grid-area: form; }
              .form-foot { grid-area: foot; }
              .form-done { grid-column: 1 / -1; grid-row: 1; }
            }
            @media (max-width: 640px) { .pair { grid-template-columns: 1fr; } }
          ` }} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
