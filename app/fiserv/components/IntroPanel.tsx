"use client";

import { motion } from "framer-motion";

export function IntroPanel() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6">
      <motion.span
        className="font-mono text-accent text-sm tracking-widest uppercase"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Case Study 01
      </motion.span>
      <motion.h1
        className="font-serif text-6xl tracking-tight leading-tight"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.12, duration: 0.5, ease: "easeOut" }}
      >
        Reimagining Customer Service with AI
      </motion.h1>
      <motion.p
        className="text-secondary text-xl max-w-lg"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.24, duration: 0.5, ease: "easeOut" }}
      >
        Fiserv × IBM Client Engineering
      </motion.p>
      <motion.div
        className="flex items-center gap-4 mt-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {["4-month engagement", "Led architecture", "Team of 5"].map(
          (chip) => (
            <span
              key={chip}
              className="text-xs font-mono text-muted bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-full"
            >
              {chip}
            </span>
          )
        )}
      </motion.div>
      <motion.div
        className="w-16 h-px mt-2 bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
    </div>
  );
}
