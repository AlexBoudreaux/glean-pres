"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Sales conversation surfaced the problem",
    desc: "Account team flagged a support bottleneck and brought us in",
  },
  {
    num: "02",
    title: "Sat with agents, watched them work",
    desc: "Understood their ServiceNow workflow, saw where time was lost",
  },
  {
    num: "03",
    title: "Designed around their process",
    desc: "UI alongside their existing tools, not replacing them",
  },
];

export function DiscoverySteps() {
  return (
    <div className="flex w-full gap-16">
      {/* Left side text */}
      <div className="w-1/3 flex flex-col justify-center">
        <h3 className="font-serif text-4xl text-foreground leading-tight mb-4">
          We started by watching
        </h3>
        <p className="text-secondary text-lg leading-relaxed mb-8">
          We didn&apos;t want to hand them a new tool to learn. So we spent time in their ServiceNow queues first and designed around what we saw.
        </p>

        <motion.div
          className="inline-flex flex-col p-5 rounded-xl border border-accent/20 bg-accent/5 shadow-[0_0_30px_rgba(52,60,237,0.1)] relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
          <span className="font-mono text-xs text-accent uppercase tracking-widest mb-2">The Team</span>
          <div className="flex flex-col gap-1">
            <span className="text-foreground font-medium text-lg">Alex led architecture</span>
            <span className="text-muted text-sm">4 AI engineers + 1 business lead</span>
          </div>
        </motion.div>
      </div>

      {/* Right side steps */}
      <div className="w-2/3 flex flex-col gap-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            className="flex items-start gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-3xl font-light text-accent/30 tabular-nums shrink-0 mt-1">
              {step.num}
            </span>
            <div className="flex flex-col gap-2">
              <h4 className="text-xl font-medium text-foreground tracking-tight">
                {step.title}
              </h4>
              <p className="text-secondary leading-relaxed">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
