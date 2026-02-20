"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, List, ExternalLink } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const prospects = [
  { company: "Datadog", score: 75, note: "Massive tool stack, 4-category overlap, KM hiring, C-level workplace leadership" },
  { company: "Metropolis Technologies", score: 67, note: "Large internal tooling org, enterprise presence" },
  { company: "Reltio", score: 58, note: "Master data management, enterprise focus" },
  { company: "Veeva Systems", score: 53, note: "Life sciences SaaS, regulated industry with heavy docs" },
  { company: "Nutanix", score: 51, note: "Hybrid cloud infra, known Moveworks customer" },
  { company: "HashiCorp", score: 49, note: "Developer tooling, large distributed engineering org" },
  { company: "MongoDB", score: 49, note: "Database company, heavy developer community" },
];

const datadogSignals = [
  { name: "Tool Count", score: 3, max: 3, detail: "19 confirmed tools" },
  { name: "Tool Overlap", score: 3, max: 3, detail: "Overlap in 4 categories" },
  { name: "Employee Count", score: 3, max: 3, detail: "~6,500 employees" },
  { name: "Headcount Growth", score: 2, max: 3, detail: "~25% YoY growth" },
  { name: "Distributed Workforce", score: 3, max: 3, detail: "21 offices, 16+ countries" },
  { name: "KM Hiring", score: 2, max: 3, detail: "Knowledge Systems program role" },
  { name: "Workplace Leadership", score: 3, max: 3, detail: "C-level CPO" },
  { name: "Competitor Tool", score: 0, max: 3, detail: "Not found" },
  { name: "Financial Capacity", score: 3, max: 3, detail: "NASDAQ: DDOG" },
  { name: "Enterprise SaaS", score: 3, max: 3, detail: "Comprehensive enterprise stack" },
];

const datadogTools = [
  "Slack", "Zoom", "Confluence", "Jira", "Asana", "Google Workspace",
  "Figma", "GitHub", "Salesforce", "HubSpot", "Looker", "Tableau",
  "Marketo", "Mailchimp", "DocuSign", "Canva", "Google Analytics",
  "Drift", "LinkedIn Sales Nav",
];

function ScoreDots({ score, max }: { score: number; max: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < score ? "bg-accent" : "bg-white/[0.08]"
          }`}
        />
      ))}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const barColor =
    score >= 60 ? "bg-accent" : score >= 45 ? "bg-accent/60" : "bg-white/[0.2]";
  const textColor =
    score >= 60 ? "text-accent" : score >= 45 ? "text-accent/70" : "text-secondary";
  const pct = Math.round((score / 80) * 100);
  return (
    <div className="flex items-center gap-2 w-full">
      <span className={`font-mono text-xs tabular-nums shrink-0 w-6 ${textColor}`}>
        {score}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ProspectListPanel() {
  const [expanded, setExpanded] = useState<"list" | "datadog">("list");

  const toggle = (section: "list" | "datadog") => {
    setExpanded((prev) => (prev === section ? section : section));
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Accordion 1: Prospect List */}
      <div
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
          expanded === "list"
            ? "bg-[#0A0A0A] border-white/[0.12] shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            : "bg-white/[0.02] border-white/[0.05] cursor-pointer hover:bg-white/[0.04]"
        }`}
      >
        <button
          className="w-full px-6 py-4 flex items-center justify-between cursor-pointer"
          onClick={() => toggle("list")}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                expanded === "list"
                  ? "bg-accent/20 text-accent border border-accent/20"
                  : "bg-white/[0.03] text-muted border border-white/[0.05]"
              }`}
            >
              <List size={16} />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Prospect List
              </span>
              <h3
                className={`text-base font-medium transition-colors ${
                  expanded === "list" ? "text-foreground" : "text-secondary"
                }`}
              >
                Top Non-Customer Companies by Score
              </h3>
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`text-muted transition-transform duration-300 ${
              expanded === "list" ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {expanded === "list" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="px-6 pb-5">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_120px_2fr] gap-x-4 px-3 py-2 border-b border-white/[0.06]">
                  <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Company</span>
                  <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Score</span>
                  <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Key Signals</span>
                </div>
                {prospects.map((p, i) => (
                  <div
                    key={p.company}
                    className={`grid grid-cols-[1fr_120px_2fr] gap-x-4 px-3 py-2 items-center border-b border-white/[0.03] ${
                      i === 0 ? "bg-accent/5 border-l-2 border-l-accent" : ""
                    }`}
                  >
                    <span className={`text-sm font-medium ${i === 0 ? "text-accent" : "text-foreground"}`}>
                      {p.company}
                    </span>
                    <ScoreBadge score={p.score} />
                    <span className="text-xs text-secondary">{p.note}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Accordion 2: Datadog Deep Dive */}
      <div
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
          expanded === "datadog"
            ? "bg-[#0A0A0A] border-accent/20 shadow-[0_0_40px_rgba(52,60,237,0.08)]"
            : "bg-white/[0.02] border-white/[0.05] cursor-pointer hover:bg-white/[0.04]"
        }`}
      >
        <button
          className="w-full px-6 py-4 flex items-center justify-between cursor-pointer"
          onClick={() => toggle("datadog")}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                expanded === "datadog"
                  ? "bg-accent/20 text-accent border border-accent/20"
                  : "bg-white/[0.03] text-muted border border-white/[0.05]"
              }`}
            >
              <ExternalLink size={16} />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Deep Dive
              </span>
              <h3
                className={`text-base font-medium transition-colors ${
                  expanded === "datadog" ? "text-foreground" : "text-secondary"
                }`}
              >
                Datadog (#1 scored, 75/100)
              </h3>
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`text-muted transition-transform duration-300 ${
              expanded === "datadog" ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {expanded === "datadog" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="px-6 pb-5">
                {/* Signal scores - compact 2-col */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mb-4">
                  {datadogSignals.map((signal) => (
                    <div
                      key={signal.name}
                      className="flex items-center justify-between py-1"
                    >
                      <span
                        className={`text-sm ${
                          signal.score === 0
                            ? "text-faint"
                            : signal.score === 3
                              ? "text-foreground"
                              : "text-secondary"
                        }`}
                      >
                        {signal.name}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-muted font-mono max-w-[140px] text-right truncate">
                          {signal.detail}
                        </span>
                        <ScoreDots score={signal.score} max={signal.max} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tools detected */}
                <div className="border-t border-white/[0.06] pt-3 mb-3">
                  <span className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2 block">
                    19 Tools Detected
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {datadogTools.map((tool) => (
                      <span
                        key={tool}
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-secondary"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
