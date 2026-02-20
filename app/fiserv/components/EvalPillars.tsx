"use client";

import { motion } from "framer-motion";
import { FlaskConical, Scale, Activity } from "lucide-react";

const pillars = [
  {
    icon: FlaskConical,
    title: "Golden Q&A Pairs",
    desc: "Real questions with verified answers from Fiserv agents. We ran these after every change.",
    stat: "100+",
    statLabel: "Test Queries",
  },
  {
    icon: Scale,
    title: "LLM Judge",
    desc: "Automated scoring on faithfulness, relevance, and completeness. No manual review bottleneck.",
    stat: "3",
    statLabel: "Metrics Scored",
  },
  {
    icon: Activity,
    title: "Live Monitoring",
    desc: "Questions, follow-ups, and thumbs up/down tracked in production.",
    stat: "24/7",
    statLabel: "Telemetry",
  },
];

export function EvalPillars() {
  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="grid grid-cols-3 gap-6">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            className="relative flex flex-col bg-[#111] border border-white/[0.08] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Stat Area - visually like a dashboard widget */}
            <div className="h-32 bg-white/[0.02] border-b border-white/[0.05] p-6 flex flex-col justify-end relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute top-5 right-5 z-10">
                <pillar.icon size={18} className="text-accent/40" strokeWidth={1.5} />
              </div>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className="font-serif text-5xl text-foreground tracking-tighter">
                  {pillar.stat}
                </span>
              </div>
              <span className="font-mono text-[10px] text-accent uppercase tracking-widest mt-1 relative z-10">
                {pillar.statLabel}
              </span>
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col gap-2">
              <h3 className="text-lg font-medium text-foreground">{pillar.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{pillar.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-accent/10 border border-accent/20 shadow-[0_0_20px_rgba(52,60,237,0.15)]">
          <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#343CED]" />
          <span className="text-sm font-medium text-foreground">Every change was tested against the golden set before shipping.</span>
        </div>
      </motion.div>
    </div>
  );
}
