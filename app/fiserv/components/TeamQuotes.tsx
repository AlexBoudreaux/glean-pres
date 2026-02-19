"use client";

import { motion } from "framer-motion";

const quotes = [
  "We'd push an update and the next day sit down with them and ask how it went.",
  "We built around their current process rather than giving them a whole new thing to learn.",
];

export function TeamQuotes() {
  return (
    <div className="flex flex-col gap-12">
      {/* Quotes */}
      <div className="flex flex-col gap-8">
        {quotes.map((quote, i) => (
          <motion.blockquote
            key={i}
            className="border-l-2 border-accent/40 pl-6 py-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
          >
            <p className="font-serif text-2xl text-foreground leading-relaxed italic">
              &ldquo;{quote}&rdquo;
            </p>
          </motion.blockquote>
        ))}
      </div>

      {/* Timeline */}
      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="relative h-8 flex items-center">
          <div className="w-full h-px bg-white/[0.06]" />
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-gradient-to-r from-accent to-accent/40"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
          />
          {/* Phase markers */}
          <div className="absolute left-0 top-0 text-[10px] font-mono text-muted">
            Phase 1
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-0 text-[10px] font-mono text-muted">
            |
          </div>
          <div className="absolute right-0 top-0 text-[10px] font-mono text-muted">
            Phase 2
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted">
          <span>8 weeks</span>
          <span className="text-accent/60 italic">
            Extended because they wanted more
          </span>
          <span>8 weeks</span>
        </div>
      </motion.div>

      {/* Detail */}
      <motion.p
        className="text-muted text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        Physically at Fiserv for kickoffs. Daily feedback loops.
      </motion.p>
    </div>
  );
}
