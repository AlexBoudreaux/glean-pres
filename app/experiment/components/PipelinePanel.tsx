"use client";

import { motion } from "framer-motion";
import { Database, Code, Sparkles } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const nodeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" as const },
  }),
};

function ConnectingLine({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex-1 mx-4 relative h-[2px] flex items-center min-w-[40px] mt-7">
      <div className="absolute w-full border-t-2 border-dashed border-white/[0.08]" />
      <motion.div
        className="absolute left-0 border-t-2 border-solid border-accent"
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.7, ease: "easeInOut" }}
      />
      <div className="absolute right-0 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[7px] border-l-accent translate-x-[2px]" />
    </div>
  );
}

const steps = [
  {
    icon: Database,
    label: "Clay",
    title: "Company Discovery & Structured Data",
    subtitle:
      "Sourced 220 companies in batches, filtered by industry, size, geography",
  },
  {
    icon: Code,
    label: "Python",
    title: "Cleansing & Normalization",
    subtitle:
      "Merged, deduplicated, normalized employee counts and funding data",
  },
  {
    icon: Sparkles,
    label: "Claude Code",
    title: "AI Research & Enrichment",
    subtitle:
      "9 signals scored per company with structured rubrics and web research",
  },
];

export function PipelinePanel() {
  return (
    <div className="flex flex-col gap-12 w-full">
      {/* Pipeline diagram */}
      <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl px-10 py-12">
        {/* Dot grid */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="relative z-10 flex items-start justify-between">
          {steps.map((step, i) => (
            <div key={step.label} className="contents">
              {i > 0 && <ConnectingLine delay={0.4 + i * 0.4} />}
              <motion.div
                className="flex flex-col items-center gap-4 w-[200px] shrink-0"
                variants={nodeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                    i === 2
                      ? "bg-accent/10 border border-accent/25 shadow-[0_0_20px_rgba(52,60,237,0.15)]"
                      : "bg-white/[0.04] border border-white/[0.1]"
                  }`}
                >
                  <step.icon
                    className={i === 2 ? "text-accent" : "text-secondary"}
                    size={24}
                  />
                </div>
                <div className="text-center flex flex-col gap-1.5">
                  <span className="font-mono text-xs text-accent/60 uppercase tracking-widest">
                    {step.label}
                  </span>
                  <span className="text-sm font-medium text-foreground leading-tight">
                    {step.title}
                  </span>
                  <span className="text-xs text-muted leading-relaxed">
                    {step.subtitle}
                  </span>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
