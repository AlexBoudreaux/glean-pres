"use client";

import { motion } from "framer-motion";
import { Handshake, Eye, PenTool } from "lucide-react";

const steps = [
  {
    icon: Handshake,
    title: "Sales conversation surfaced the problem",
    desc: "Account team brought us in to find the highest-value AI use case",
  },
  {
    icon: Eye,
    title: "Sat with agents, watched them work",
    desc: "Understood their ServiceNow workflow, saw where time was lost",
  },
  {
    icon: PenTool,
    title: "Designed around their process",
    desc: "UI alongside their existing tools, not replacing them",
  },
];

export function DiscoverySteps() {
  return (
    <div className="flex flex-col gap-12">
      {/* Steps */}
      <div className="flex flex-col gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            className="flex items-start gap-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 shrink-0">
              <span className="font-mono text-accent/40 text-sm w-5">
                {i + 1}
              </span>
              <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <step.icon size={18} className="text-accent" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex flex-col gap-1 pt-1">
              <h3 className="text-foreground text-lg font-medium">
                {step.title}
              </h3>
              <p className="text-muted text-sm">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team callout */}
      <motion.div
        className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl px-6 py-4 flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
      >
        <span className="text-accent text-sm font-mono">Team of 5</span>
        <span className="text-faint">·</span>
        <span className="text-secondary text-sm">
          Alex led architecture
        </span>
        <span className="text-faint">·</span>
        <span className="text-secondary text-sm">
          4 AI engineers + 1 business lead
        </span>
      </motion.div>
    </div>
  );
}
