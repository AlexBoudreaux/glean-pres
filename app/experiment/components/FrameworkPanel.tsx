"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Shield } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

interface Signal {
  name: string;
  weight: string;
  description: string;
}

interface Assumption {
  text: string;
  signals: Signal[];
}

interface Condition {
  id: number;
  title: string;
  isFilter?: boolean;
  defaultOpen?: boolean;
  assumptions: Assumption[];
}

const conditions: Condition[] = [
  {
    id: 1,
    title: "Knowledge is scattered across too many tools",
    defaultOpen: true,
    assumptions: [
      {
        text: "Companies using many SaaS collaboration tools have more fragmented knowledge",
        signals: [
          {
            name: "Tool Count",
            weight: "2x",
            description: "Count of collaboration/productivity tools in tech stack",
          },
        ],
      },
      {
        text: "Overlapping tools in the same category means they're already feeling the pain",
        signals: [
          {
            name: "Tool Overlap",
            weight: "3x",
            description:
              "Redundant tools in the same category (e.g., Notion AND Confluence)",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Big enough for it to hurt",
    assumptions: [
      {
        text: "Past ~500 employees, knowledge discovery becomes a real productivity drain",
        signals: [
          {
            name: "Employee Count",
            weight: "1x",
            description: "Total employee headcount",
          },
        ],
      },
      {
        text: "Fast-growing companies feel the pain more acutely",
        signals: [
          {
            name: "Headcount Growth",
            weight: "2x",
            description: "Year-over-year headcount growth rate",
          },
        ],
      },
      {
        text: "Multi-office or remote-first companies experience worse fragmentation",
        signals: [
          {
            name: "Distributed Workforce",
            weight: "1x",
            description: "Number of offices, remote-first indicators",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Actively feeling the knowledge management pain",
    defaultOpen: true,
    assumptions: [
      {
        text: "Companies hiring for KM or DevEx roles are signaling they have this pain",
        signals: [
          {
            name: "KM Hiring",
            weight: "3x",
            description:
              'Job titles containing "Knowledge Management," "Developer Experience," "Workplace Technology"',
          },
        ],
      },
      {
        text: "VP/Director-level over workplace tech means the pain warrants org investment",
        signals: [
          {
            name: "Workplace Leadership",
            weight: "2x",
            description:
              'Leadership titles containing "Workplace," "Employee Experience," "Productivity"',
          },
        ],
      },
      {
        text: "Employees reviewing competitor KM tools means they're actively shopping",
        signals: [
          {
            name: "Competitor KM Customer",
            weight: "3x",
            description:
              "Evidence of using competitor solutions (Guru, Coveo, Moveworks)",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Workforce is primarily knowledge workers",
    isFilter: true,
    assumptions: [
      {
        text: "Industry classification proxies for knowledge worker density",
        signals: [
          {
            name: "Industry Filter",
            weight: "filter",
            description:
              "Software, fintech, media, healthcare IT, cybersecurity, dev tools",
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Can afford enterprise software",
    isFilter: true,
    assumptions: [
      {
        text: "Funding or revenue indicates financial capacity",
        signals: [
          {
            name: "Financial Capacity",
            weight: "1x",
            description: "Total funding raised or estimated revenue",
          },
        ],
      },
      {
        text: "Already paying for enterprise SaaS demonstrates willingness to spend",
        signals: [
          {
            name: "Enterprise SaaS",
            weight: "1x",
            description:
              "Enterprise-tier tools in stack (Salesforce Enterprise, Slack Enterprise Grid)",
          },
        ],
      },
    ],
  },
];

function WeightBadge({ weight }: { weight: string }) {
  if (weight === "filter") {
    return (
      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-muted uppercase tracking-wider">
        Filter
      </span>
    );
  }
  const colors: Record<string, string> = {
    "3x": "bg-accent/15 border-accent/30 text-accent",
    "2x": "bg-accent/8 border-accent/15 text-accent/70",
    "1x": "bg-white/[0.04] border-white/[0.08] text-muted",
  };
  return (
    <span
      className={`font-mono text-[10px] px-2 py-0.5 rounded border ${colors[weight] || colors["1x"]} tracking-wider`}
    >
      {weight}
    </span>
  );
}

export function FrameworkPanel() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (id: number) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Intro */}
      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <p className="text-secondary text-[15px] leading-relaxed max-w-3xl">
          We asked: <span className="text-foreground font-medium">why would a company buy Glean?</span>{" "}
          Then turned that into conditions, made assumptions about each condition,
          and found signals that would tell us if those conditions were met.
        </p>

        {/* Three-layer explanation */}
        <div className="flex items-center gap-3 mt-2">
          {["Conditions", "Assumptions", "Signals"].map((layer, i) => (
            <div key={layer} className="flex items-center gap-3">
              {i > 0 && <span className="text-accent/40 text-sm">→</span>}
              <span className="font-mono text-xs text-secondary bg-white/[0.03] border border-white/[0.06] px-3 py-1 rounded">
                {layer}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Conditions accordion */}
      <div className="flex flex-col gap-3">
        {conditions.map((condition, i) => {
          const isOpen = expanded === condition.id;
          return (
            <motion.div
              key={condition.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "bg-[#0A0A0A] border-white/[0.12] shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                  : condition.isFilter
                    ? "bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.03]"
                    : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]"
              }`}
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggle(condition.id)}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`font-mono text-sm w-6 ${
                      isOpen ? "text-accent" : "text-accent/70"
                    }`}
                  >
                    {condition.id}
                  </span>
                  <h3
                    className={`text-left font-medium transition-colors ${
                      isOpen
                        ? "text-foreground"
                        : condition.isFilter
                          ? "text-secondary"
                          : "text-foreground/80"
                    }`}
                  >
                    {condition.title}
                  </h3>
                  {condition.isFilter && (
                    <span className="flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-secondary uppercase tracking-wider">
                      <Shield size={10} />
                      Qualifying Filter
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted transition-transform duration-300 shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <div className="px-6 pb-5 pt-0">
                      <div className="flex flex-col gap-4 pl-10">
                        {condition.assumptions.map((assumption, ai) => (
                          <div
                            key={ai}
                            className="flex flex-col gap-2.5"
                          >
                            <p className="text-secondary text-sm leading-relaxed">
                              {assumption.text}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {assumption.signals.map((signal) => (
                                <div
                                  key={signal.name}
                                  className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-lg px-4 py-2.5"
                                >
                                  <WeightBadge weight={signal.weight} />
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-foreground">
                                      {signal.name}
                                    </span>
                                    <span className="text-xs text-muted">
                                      {signal.description}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {ai < condition.assumptions.length - 1 && (
                              <div className="border-t border-white/[0.03] mt-1" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
