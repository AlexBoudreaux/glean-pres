"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const signals = [
  { name: "Tool Overlap", weight: 3, tier: "high" as const, short: "Redundant tools in same category" },
  { name: "KM Hiring", weight: 3, tier: "high" as const, short: "Hiring for knowledge management roles" },
  { name: "Competitor KM", weight: 3, tier: "high" as const, short: "Using competitor KM solutions" },
  { name: "Tool Count", weight: 2, tier: "medium" as const, short: "Total collaboration tools detected" },
  { name: "Headcount Growth", weight: 2, tier: "medium" as const, short: "Year-over-year growth rate" },
  { name: "Workplace Leadership", weight: 2, tier: "medium" as const, short: "VP/Director over workplace tech" },
  { name: "Employee Count", weight: 1, tier: "low" as const, short: "Total headcount" },
  { name: "Distributed Workforce", weight: 1, tier: "low" as const, short: "Multi-office or remote-first" },
  { name: "Financial Capacity", weight: 1, tier: "low" as const, short: "Funding or public company" },
  { name: "Enterprise SaaS", weight: 1, tier: "low" as const, short: "Enterprise-tier tools in stack" },
];

const tierColors = {
  high: "bg-accent",
  medium: "bg-accent/50",
  low: "bg-white/[0.15]",
};

const tierBadge = {
  high: "bg-accent/15 border-accent/30 text-accent",
  medium: "bg-accent/8 border-accent/15 text-accent/60",
  low: "bg-white/[0.04] border-white/[0.08] text-muted",
};

export function SignalsPanel() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <motion.p
        className="text-secondary text-[15px] leading-relaxed max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        10 signals across three weight tiers. Weights locked{" "}
        <span className="text-foreground font-medium">before</span> seeing
        results.
      </motion.p>

      {/* Compact signal grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
        {signals.map((signal, i) => (
          <motion.div
            key={signal.name}
            className="flex items-center gap-3 py-2.5 border-b border-white/[0.04]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.4, ease }}
          >
            {/* Weight bar */}
            <div className="flex items-center gap-0.5 shrink-0 w-10">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className={`h-4 w-2.5 rounded-sm ${
                    level <= signal.weight
                      ? tierColors[signal.tier]
                      : "bg-white/[0.04]"
                  }`}
                />
              ))}
            </div>

            {/* Badge */}
            <span
              className={`font-mono text-[10px] px-1.5 py-0.5 rounded border shrink-0 ${tierBadge[signal.tier]}`}
            >
              {signal.weight}x
            </span>

            {/* Name + short desc */}
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">
                {signal.name}
              </span>
              <span className="text-xs text-muted ml-2 hidden lg:inline">
                {signal.short}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tier legend */}
      <motion.div
        className="flex items-center gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.4, ease }}
      >
        {[
          { label: "High conviction", tier: "high" as const, count: 3 },
          { label: "Medium", tier: "medium" as const, count: 3 },
          { label: "Baseline", tier: "low" as const, count: 4 },
        ].map((t) => (
          <div key={t.label} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-sm ${tierColors[t.tier]}`} />
            <span className="text-xs text-muted">
              {t.label} ({t.count})
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
