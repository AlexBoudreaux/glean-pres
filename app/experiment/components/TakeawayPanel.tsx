"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1] as const;

function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * value;
      setDisplay(
        decimals > 0
          ? current.toFixed(decimals)
          : Math.round(current).toString()
      );
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, value, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function TakeawayPanel() {
  return (
    <div className="flex flex-col gap-12 w-full">
      {/* Recap metrics */}
      <div className="grid grid-cols-3 gap-10">
        {[
          { value: 2.75, suffix: "x", label: "Lift", sub: "top quartile vs random", decimals: 2 },
          { value: 17, suffix: "pt", label: "Score Gap", sub: "customers vs non-customers", decimals: 0 },
          { value: 65, suffix: "%", label: "Precision", sub: "at score threshold of 45", decimals: 0 },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col gap-4 border-l-2 border-accent pl-8 py-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.15, duration: 0.6, ease }}
          >
            <span className="font-mono text-sm text-secondary uppercase tracking-widest">
              {stat.label}
            </span>
            <span className="text-7xl font-serif font-medium text-foreground tracking-tighter leading-none">
              <AnimatedNumber
                value={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals}
              />
            </span>
            <span className="text-base text-secondary">{stat.sub}</span>
          </motion.div>
        ))}
      </div>

      {/* Gradient divider */}
      <div className="w-36 h-px mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Navigation */}
      <motion.div
        className="flex items-center justify-center pt-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Link
          href="/"
          className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all"
        >
          <ArrowLeft
            size={16}
            className="text-secondary group-hover:text-foreground transition-colors"
          />
          <span className="text-sm font-medium text-secondary group-hover:text-foreground transition-colors">
            Back to Hub
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
