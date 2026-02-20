"use client";

import { motion } from "framer-motion";

export function IntroPanel() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center gap-8 w-full h-full">
      {/* Background ambient effect */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div
          className="w-[800px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{
            background: "radial-gradient(circle, #343CED 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:24px_24px]"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="font-mono text-accent text-sm tracking-[0.2em] uppercase mb-8 border border-accent/20 px-4 py-1.5 rounded-full bg-accent/5 backdrop-blur-md">
          Case Study 02 / Data-Driven Experiment
        </span>
        <h1 className="font-serif text-[5.5rem] tracking-tight leading-[1.05] max-w-4xl text-balance">
          Can AI Predict Your Next Customer?
        </h1>
      </motion.div>

      <motion.p
        className="text-secondary text-xl max-w-2xl relative z-10 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        A data-driven experiment using public signals to identify Glean
        customers from a pool of lookalike companies
      </motion.p>

      <motion.div
        className="flex items-center gap-6 mt-4 relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {["Built in 1 week", "220 companies scored", "Public data only"].map(
          (chip) => (
            <div
              key={chip}
              className="flex items-center gap-3 text-sm font-mono text-muted bg-white/[0.02] border border-white/[0.08] px-5 py-2.5 rounded-md backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.2)]"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
              {chip}
            </div>
          )
        )}
      </motion.div>
    </div>
  );
}
