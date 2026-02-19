"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeftRight } from "lucide-react";

export function RevealTransition() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-6 min-h-[320px]">
        {/* State 1: What We Designed For */}
        <motion.div
          className={`bg-white/[0.03] backdrop-blur-sm border rounded-xl p-8 flex flex-col gap-6 transition-colors duration-500 ${
            revealed
              ? "border-white/[0.04] opacity-60"
              : "border-white/[0.08]"
          }`}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: revealed ? 0.6 : 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="font-mono text-xs text-muted tracking-wider uppercase">
            What We Designed For
          </span>
          <h3 className="text-xl font-medium text-secondary">
            Answer machine for Level 1 questions
          </h3>
          <div className="flex items-center gap-3 mt-2">
            {["Ticket", "Draft", "Review", "Send"].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded">
                  {step}
                </span>
                {i < 3 && (
                  <ArrowRight size={12} className="text-faint" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* State 2: What Users Actually Did */}
        <AnimatePresence>
          {revealed ? (
            <motion.div
              className="bg-white/[0.03] backdrop-blur-sm border border-lime/20 rounded-xl p-8 flex flex-col gap-6"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                boxShadow: "0 0 40px rgba(216, 253, 73, 0.06)",
              }}
            >
              <span className="font-mono text-xs text-lime tracking-wider uppercase">
                What Users Actually Did
              </span>
              <h3 className="text-xl font-medium text-foreground">
                Thinking partner for everything
              </h3>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs font-mono text-lime bg-lime-muted border border-lime/20 px-3 py-1.5 rounded">
                  Agent
                </span>
                <ArrowLeftRight size={16} className="text-lime/60" />
                <span className="text-xs font-mono text-lime bg-lime-muted border border-lime/20 px-3 py-1.5 rounded">
                  System
                </span>
              </div>
              <div className="flex flex-col gap-1.5 mt-1">
                {[
                  "Navigate thousands of pages",
                  "Synthesize complex answers",
                  "Formulate responses",
                ].map((item) => (
                  <span key={item} className="text-sm text-lime/70">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.button
              className="border border-dashed border-white/[0.08] rounded-xl flex items-center justify-center cursor-pointer hover:border-accent/30 hover:bg-accent-muted/30 transition-colors"
              onClick={() => setRevealed(true)}
              exit={{ opacity: 0 }}
            >
              <span className="text-muted text-sm font-mono">
                Click to reveal →
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Quote + kicker */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <blockquote className="border-l-2 border-lime/40 pl-6 py-1">
              <p className="font-serif text-lg text-foreground leading-relaxed italic">
                &ldquo;We&apos;ve started using it like a search engine rather
                than just relying on it to give us the answer right off the
                bat.&rdquo;
              </p>
            </blockquote>
            <p className="text-lime/70 text-sm font-medium">
              This wasn&apos;t in the spec. It emerged because we were there
              every day.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
