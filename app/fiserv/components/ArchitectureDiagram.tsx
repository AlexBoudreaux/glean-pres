"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Search,
  Brain,
  MessageSquare,
} from "lucide-react";

type StageId = "ingestion" | "elasticsearch" | "retrieval" | "response";

interface Stage {
  id: StageId;
  label: string;
  icon: typeof Database;
  details: { heading: string; points: string[] };
}

const stages: Stage[] = [
  {
    id: "ingestion",
    label: "INGESTION",
    icon: Database,
    details: {
      heading: "Smart Chunking",
      points: [
        "API docs have natural structure. Naive chunking splits them apart. So we chunked by logical API unit.",
        "Parent-child relationships let a precise match pull in full context.",
        "Version metadata on every chunk so v1 and v2 never mix.",
      ],
    },
  },
  {
    id: "elasticsearch",
    label: "ELASTICSEARCH",
    icon: Search,
    details: {
      heading: "Unified Search",
      points: [
        "One store for text, vectors, and metadata.",
        "Keyword search AND semantic search hit the same index.",
        "No separate vector DB needed.",
      ],
    },
  },
  {
    id: "retrieval",
    label: "RETRIEVAL",
    icon: Brain,
    details: {
      heading: "Hybrid Retrieval",
      points: [
        "Semantic similarity for conceptual matches.",
        "Keyword search for exact API names and codes.",
        "Agentic reasoning: the agent decides if it has enough or needs another pass.",
      ],
    },
  },
  {
    id: "response",
    label: "RESPONSE",
    icon: MessageSquare,
    details: {
      heading: "Trustworthy Answers",
      points: [
        "Summarized answers + deep links to source docs.",
        "Agents can verify everything. Trust through transparency.",
        "Llama + Mistral via Watsonx.",
      ],
    },
  },
];

export function ArchitectureDiagram() {
  const [openStage, setOpenStage] = useState<StageId | null>(null);

  return (
    <div className="flex flex-col gap-8">
      {/* Pipeline row */}
      <div className="flex items-center justify-center gap-2">
        {stages.map((stage, i) => (
          <div key={stage.id} className="flex items-center gap-2">
            <motion.button
              onClick={() =>
                setOpenStage(openStage === stage.id ? null : stage.id)
              }
              className={`relative flex flex-col items-center gap-2 px-5 py-4 rounded-lg border font-mono text-xs tracking-wider transition-colors cursor-pointer ${
                openStage === stage.id
                  ? "bg-accent-muted border-accent/30 text-accent"
                  : "bg-white/[0.03] border-white/[0.08] text-secondary hover:border-white/[0.15] hover:text-foreground"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <stage.icon size={20} strokeWidth={1.5} />
              {stage.label}
            </motion.button>
            {i < stages.length - 1 && (
              <div className="flex items-center gap-1 text-faint">
                <div className="w-6 h-px bg-white/[0.1]" />
                <span className="text-[10px]">▸</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Expandable detail panel */}
      <AnimatePresence mode="wait">
        {openStage && (
          <motion.div
            key={openStage}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-xl p-6">
              <h4 className="font-mono text-accent text-sm tracking-wider mb-4">
                {stages.find((s) => s.id === openStage)?.details.heading}
              </h4>
              <div className="flex flex-col gap-3">
                {stages
                  .find((s) => s.id === openStage)
                  ?.details.points.map((point, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                    >
                      <span className="text-accent/40 mt-1 text-xs">▪</span>
                      <p
                        className={`text-sm leading-relaxed ${
                          openStage === "retrieval" && i === 2
                            ? "text-accent"
                            : "text-secondary"
                        }`}
                      >
                        {point}
                      </p>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      <motion.p
        className="text-center text-faint text-xs font-mono"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        Click a stage to explore
      </motion.p>
    </div>
  );
}
