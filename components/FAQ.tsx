"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const faqs = [
  {
    q: "How much does a build cost?",
    a: "It depends entirely on scope. A focused marketing site and a full platform with booking, accounts, and payments are very different pieces of work. Send a request describing what you need and we'll come back with a fixed scope and a firm price before anything starts.",
  },
  {
    q: "How long does it take?",
    a: "Most builds go from first call to live in two to six weeks. A focused marketing site sits at the short end; a full platform with bookings and payments at the long end. You get a clear timeline before we start.",
  },
  {
    q: "What do you need from me?",
    a: "Your goals, any content you already have (photos, copy, links to things you like), and honest answers about how you work today. We handle everything else, including hosting, domains, and deployment.",
  },
  {
    q: "Who owns the code and the site?",
    a: "You do. Everything ships on your domain under your own accounts, and you keep full ownership of the code, the content, and the data. Nothing is held hostage.",
  },
  {
    q: "What happens after launch?",
    a: "Every build includes a support window for fixes and tweaks. After that you can run it yourself, or keep us on for ongoing work as the product grows.",
  },
];

/* Pre-answers the questions every client asks before sending a request, so the
   form arrives with fewer unknowns and less back-and-forth. */
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" style={{ background: "var(--bg)", padding: "clamp(4rem, 9vw, 7.5rem) clamp(1.25rem, 4vw, 3rem)" }}>
      <div className="faq-grid" style={{ maxWidth: 1180, margin: "0 auto", width: "100%" }}>
        {/* Left: sticky editorial header, mirrors the Process section */}
        <div className="faq-head">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.8, ease }}
          >
            <span className="eyebrow" style={{ color: "var(--accent)" }}>FAQ</span>
            <h2 className="display" style={{ fontSize: "clamp(2rem, 4.4vw, 3.4rem)", color: "var(--ink)", marginTop: "1rem", maxWidth: "12ch" }}>
              Questions, answered
            </h2>
            <p style={{ marginTop: "1.5rem", fontSize: "clamp(1rem, 1.4vw, 1.1rem)", lineHeight: 1.65, color: "var(--gray)", maxWidth: "34ch" }}>
              What most clients ask before they send a request. Anything else, just ask in the form.
            </p>
          </motion.div>
        </div>

        {/* Right: the accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          style={{ borderTop: "1px solid var(--line)" }}
        >
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} style={{ borderBottom: "1px solid var(--line)" }}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="faq-q"
                >
                  <span style={{ fontSize: "clamp(1.02rem, 1.5vw, 1.18rem)", fontWeight: 500, color: isOpen ? "var(--ink)" : "var(--ink-soft)", transition: "color 0.3s ease", lineHeight: 1.4 }}>
                    {f.q}
                  </span>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.4, ease }}
                    style={{
                      flexShrink: 0, width: 30, height: 30, borderRadius: "50%",
                      border: "1px solid var(--line-strong)", color: "var(--ink)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1rem", fontWeight: 300, lineHeight: 1,
                    }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease }}
                      style={{ overflow: "hidden" }}
                    >
                      <p style={{ padding: "0 clamp(2.5rem, 5vw, 4rem) 1.4rem 0", fontSize: "0.98rem", lineHeight: 1.65, color: "var(--gray)", maxWidth: "58ch" }}>
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .faq-grid { display: grid; grid-template-columns: 1fr; gap: clamp(2.5rem, 5vw, 4rem); }
        .faq-q {
          width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1.25rem;
          background: none; border: none; cursor: pointer; text-align: left;
          padding: clamp(1.1rem, 2.2vw, 1.4rem) 0;
        }
        @media (hover: hover) {
          .faq-q:hover span:first-child { color: var(--ink); }
          .faq-q:hover span[aria-hidden] { border-color: var(--ink); }
        }
        @media (min-width: 900px) {
          .faq-grid { grid-template-columns: 0.82fr 1.18fr; gap: clamp(3rem, 6vw, 6rem); align-items: start; }
          .faq-head { position: sticky; top: clamp(5rem, 14vh, 8rem); top: clamp(5rem, 14svh, 8rem); }
        }
      ` }} />
    </section>
  );
}
