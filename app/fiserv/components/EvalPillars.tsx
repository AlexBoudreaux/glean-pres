"use client";

import { motion } from "framer-motion";
import { FlaskConical, Scale, Activity } from "lucide-react";

const pillars = [
  {
    icon: FlaskConical,
    title: "Golden Q&A Pairs",
    desc: "Known-correct answers from actual agents. Our scorecard for every iteration.",
  },
  {
    icon: Scale,
    title: "LLM Judge",
    desc: "Automated scoring on faithfulness, relevance, completeness. Data-driven, not vibes.",
  },
  {
    icon: Activity,
    title: "Live Monitoring",
    desc: "Every question, follow-up, and thumbs up/down tracked in production.",
  },
];

export function EvalPillars() {
  return (
    <div className="flex flex-col gap-12">
      {/* Cards row */}
      <div className="grid grid-cols-3 gap-5">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-6 flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
          >
            <div className="w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center">
              <pillar.icon
                size={18}
                className="text-accent"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-foreground font-medium">{pillar.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{pillar.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom emphasis line */}
      <motion.p
        className="text-secondary text-center text-sm border-t border-white/[0.06] pt-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Every change was tested against the golden set before shipping.
      </motion.p>
    </div>
  );
}
