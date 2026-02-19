"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award } from "lucide-react";

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
    <div className="flex flex-col gap-10">
      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-6">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-8 flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
          >
            <span className="font-mono text-xs text-muted tracking-wider uppercase">
              {m.label}
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-muted text-lg line-through decoration-muted/40">
                {m.before}
              </span>
              <span className="text-accent text-xs">→</span>
              <span className="text-4xl font-semibold text-foreground">
                <AnimatedNumber
                  value={m.afterValue}
                  suffix={m.afterSuffix}
                  prefix={m.afterPrefix}
                />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fiserv Forum callout */}
      <motion.div
        className="bg-white/[0.03] backdrop-blur-sm border border-accent/20 rounded-xl p-6 flex items-start gap-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
        style={{ boxShadow: "0 0 30px rgba(52, 60, 237, 0.06)" }}
      >
        <div className="w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center shrink-0">
          <Award size={18} className="text-accent" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-foreground font-medium">
            Personally invited to demo at Fiserv Forum in Las Vegas
          </h4>
          <p className="text-muted text-sm">
            3,500+ attendees · Center demo location · One of two AI
            representatives
          </p>
          <p className="text-secondary text-sm">
            Demoed live to Fiserv&apos;s bank customers
          </p>
        </div>
      </motion.div>

      {/* Badge */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <span className="font-mono text-xs text-accent/60 bg-accent-muted px-4 py-2 rounded-full">
          Pilot extended: 2 × 8-week phases
        </span>
      </motion.div>
    </div>
  );
}
