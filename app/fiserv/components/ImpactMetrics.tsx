"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

function AnimatedNumber({
  value,
  suffix = "",
  prefix = "~",
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

const metrics = [
  {
    label: "Level 1 Questions",
    before: "~2 hrs",
    afterValue: 2,
    afterSuffix: " min",
    afterPrefix: "~",
  },
  {
    label: "Complex Questions",
    before: "1 day",
    afterValue: 30,
    afterSuffix: " min",
    afterPrefix: "~",
  },
];

export function ImpactMetrics() {
  return (
    <div className="flex flex-col gap-12 w-full">
      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-8">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            className="bg-transparent border-t border-b border-white/[0.08] py-8 flex flex-col gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-xs text-muted tracking-widest uppercase">
              {m.label}
            </span>
            <div className="flex items-end gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-faint uppercase mb-1">Before</span>
                <span className="text-secondary text-2xl line-through decoration-secondary/40">
                  {m.before}
                </span>
              </div>
              <div className="text-accent text-xl mb-1 shrink-0">→</div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-accent uppercase mb-1">After</span>
                <span className="text-7xl font-serif font-medium text-foreground tracking-tighter leading-none">
                  <AnimatedNumber
                    value={m.afterValue}
                    suffix={m.afterSuffix}
                    prefix={m.afterPrefix}
                  />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fiserv Forum callout */}
      <motion.div
        className="relative bg-[#111] border border-white/[0.08] rounded-2xl p-8 flex items-center gap-6 overflow-hidden mt-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute top-0 right-0 w-[400px] h-full bg-gradient-to-l from-accent/10 to-transparent pointer-events-none" />
        
        <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(52,60,237,0.15)] relative z-10">
          <Award size={24} className="text-accent" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-1 relative z-10">
          <h4 className="text-xl font-medium tracking-tight text-foreground">
            Personally invited to demo at Fiserv Forum in Las Vegas
          </h4>
          <p className="text-secondary text-sm">
            <span className="font-mono text-xs">3,500+ attendees</span> · Demoed live to Fiserv&apos;s bank customers
          </p>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div 
        className="flex items-center justify-between pt-8 mt-4 border-t border-white/[0.08]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Link 
          href="/" 
          className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all"
        >
          <ArrowLeft size={16} className="text-secondary group-hover:text-foreground transition-colors" />
          <span className="text-sm font-medium text-secondary group-hover:text-foreground transition-colors">Back to Hub</span>
        </Link>
        
        <Link 
          href="/experiment" 
          className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/20 hover:border-accent/40 hover:shadow-[0_0_20px_rgba(52,60,237,0.2)] transition-all"
        >
          <span className="text-sm font-medium text-accent group-hover:text-white transition-colors">Next Case Study: Experiment</span>
          <ArrowRight size={16} className="text-accent group-hover:text-white transition-colors" />
        </Link>
      </motion.div>
    </div>
  );
}
