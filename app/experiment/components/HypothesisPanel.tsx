"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

const ease = [0.16, 1, 0.3, 1] as const;

export function HypothesisPanel() {
  return (
    <div className="flex flex-col gap-12 w-full">
      {/* Hypothesis callout */}
      <motion.div
        className="relative border-l-2 border-accent pl-8 py-4"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent/60 mb-3 block">
          The Hypothesis
        </span>
        <p className="font-serif text-2xl text-foreground leading-relaxed italic">
          &ldquo;An AI scoring model using only public signals can identify
          Glean customers from a pool of lookalike companies at a rate
          significantly better than the 20% base rate.&rdquo;
        </p>
      </motion.div>

      {/* Three big numbers */}
      <div className="grid grid-cols-3 gap-8">
        {[
          {
            value: 220,
            label: "Companies",
            sub: "in Glean's addressable market",
          },
          {
            value: 44,
            label: "Known Customers",
            sub: "from case studies & logo wall",
          },
          {
            value: 20,
            suffix: "%",
            label: "Base Rate",
            sub: "what random guessing gets you",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col gap-3 border-t border-b border-white/[0.08] py-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.15, duration: 0.6, ease }}
          >
            <span className="font-mono text-xs text-muted uppercase tracking-widest">
              {stat.label}
            </span>
            <span className="text-7xl font-serif font-medium text-foreground tracking-tighter leading-none">
              <AnimatedNumber
                value={stat.value}
                suffix={stat.suffix || ""}
              />
            </span>
            <span className="text-sm text-secondary">{stat.sub}</span>
          </motion.div>
        ))}
      </div>

      {/* Explanation */}
      <motion.p
        className="text-secondary text-[15px] leading-relaxed max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6, ease }}
      >
        Scraped 44 confirmed customers from Glean&apos;s case studies and logo
        wall. Built a comparison set of 176 lookalike companies using Clay.
        The question: can a model using only publicly available signals beat
        random?
      </motion.p>

      {/* Challenge callout */}
      <motion.div
        className="flex items-center gap-4 bg-accent/5 border border-accent/15 rounded-xl px-6 py-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.5, ease }}
      >
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-accent font-medium text-lg">
          Can the model beat 20%?
        </span>
      </motion.div>
    </div>
  );
}
