"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  User,
  Server,
  Ticket,
  Cpu,
  Monitor,
  Send,
  FileText,
  Scissors,
  Database,
  MessageSquare,
  Search,
  Sparkles,
} from "lucide-react";

/* ─── Tooltip (portaled to body, fully opaque, nothing can cover it) ─── */

function Tooltip({
  children,
  visible,
  anchorRef,
  above = false,
}: {
  children: ReactNode;
  visible: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  above?: boolean;
}) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (visible && anchorRef.current) {
      const r = anchorRef.current.getBoundingClientRect();
      if (above) {
        // We need the tooltip height to position above. Use a reasonable estimate
        // then adjust after render via the ref.
        const estimatedHeight = 80;
        setPos({
          top: r.top - estimatedHeight - 12,
          left: r.left + r.width / 2,
        });
        // Refine after paint when we know the actual height
        requestAnimationFrame(() => {
          if (tipRef.current) {
            const h = tipRef.current.getBoundingClientRect().height;
            setPos({
              top: r.top - h - 12,
              left: r.left + r.width / 2,
            });
          }
        });
      } else {
        setPos({
          top: r.bottom + 12,
          left: r.left + r.width / 2,
        });
      }
    }
  }, [visible, anchorRef, above]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible && pos && (
        <motion.div
          ref={tipRef}
          initial={{ opacity: 0, y: above ? -4 : 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: above ? -4 : 4 }}
          transition={{ duration: 0.15 }}
          className="fixed -translate-x-1/2 w-56 rounded-lg p-3 shadow-2xl text-sm text-secondary leading-relaxed pointer-events-none border border-white/[0.1]"
          style={{
            top: pos.top,
            left: pos.left,
            zIndex: 99999,
            background: "#1e1e22",
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ─── Animated connecting line (horizontal) ─── */

function ConnectingLine({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex-1 mx-3 relative h-[2px] flex items-center min-w-[24px]">
      <div className="absolute w-full border-t-2 border-dashed border-white/[0.08]" />
      <motion.div
        className="absolute left-0 border-t-2 border-solid border-accent"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ delay, duration: 0.7, ease: "easeInOut" }}
      />
      <div className="absolute right-0 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[7px] border-l-accent translate-x-[2px]" />
    </div>
  );
}

/* ─── Dot grid (inside diagram containers only) ─── */

function DotGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
  );
}

/* ─── Staggered node variants ─── */

const nodeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
};

/* ─── Pulse keyframes ─── */

const pulseStyle = `
@keyframes softPulse {
  0%, 100% { box-shadow: 0 0 12px rgba(52,60,237,0.15); }
  50% { box-shadow: 0 0 24px rgba(52,60,237,0.3); }
}
`;

/* ─── Feedback loop arrow (SVG) ─── */

function FeedbackArrow() {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength());
    }
  }, []);

  return (
    <svg
      className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none"
      width="120"
      height="48"
      viewBox="0 0 120 48"
      fill="none"
    >
      <path
        d="M 90 44 C 90 10, 30 10, 30 44"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        fill="none"
      />
      <motion.path
        ref={pathRef}
        d="M 90 44 C 90 10, 30 10, 30 44"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        fill="none"
        initial={{ strokeDashoffset: length || 160 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ delay: 1.2, duration: 1.2, ease: "easeInOut" }}
        style={{ strokeDasharray: length || 160 }}
      />
      <motion.polygon
        points="26,40 34,40 30,47"
        fill="var(--color-accent)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.3 }}
      />
      <motion.text
        x="60"
        y="8"
        textAnchor="middle"
        fill="var(--color-muted)"
        fontSize="9"
        fontFamily="var(--font-mono)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.4 }}
      >
        needs more context?
      </motion.text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export function ArchitectureDiagram() {
  const [expandedCard, setExpandedCard] = useState<"ux" | "arch">("ux");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Anchor refs for portal tooltips
  const ref = {
    snQueue: useRef<HTMLDivElement>(null),
    aiBg: useRef<HTMLDivElement>(null),
    review: useRef<HTMLDivElement>(null),
    send: useRef<HTMLDivElement>(null),
    apiDocs: useRef<HTMLDivElement>(null),
    chunking: useRef<HTMLDivElement>(null),
    esIndex: useRef<HTMLDivElement>(null),
    qIn: useRef<HTMLDivElement>(null),
    agentic: useRef<HTMLDivElement>(null),
    gen: useRef<HTMLDivElement>(null),
    output: useRef<HTMLDivElement>(null),
  };

  const toggle = (card: "ux" | "arch") => {
    setExpandedCard(card);
    setHoveredNode(null);
  };

  return (
    <div className="w-full flex flex-col gap-5 relative">
      <style>{pulseStyle}</style>

      {/* ─── Card 1: User Flow ─── */}
      <div
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
          expandedCard === "ux"
            ? "bg-[#0A0A0A] border-white/[0.12] shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            : "bg-white/[0.02] border-white/[0.05] cursor-pointer hover:bg-white/[0.04]"
        }`}
      >
        <button
          className="w-full px-8 py-5 flex items-center justify-between"
          onClick={() => toggle("ux")}
        >
          <div className="flex items-center gap-5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                expandedCard === "ux"
                  ? "bg-accent/20 text-accent border border-accent/20"
                  : "bg-white/[0.03] text-muted border border-white/[0.05]"
              }`}
            >
              <User size={18} />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                The Experience
              </span>
              <h3
                className={`text-lg font-medium transition-colors ${
                  expandedCard === "ux" ? "text-foreground" : "text-secondary"
                }`}
              >
                User Flow
              </h3>
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`text-muted transition-transform duration-300 ${
              expandedCard === "ux" ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {expandedCard === "ux" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-8 pb-8 pt-1">
                <p className="text-secondary mb-6 leading-relaxed max-w-3xl text-[15px]">
                  Tickets get answered in the background. When an agent opens the
                  tool, the draft is already waiting.
                </p>

                <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl px-8 py-10">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <DotGrid />
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    {/* Node 1: ServiceNow Queue */}
                    <motion.div
                      ref={ref.snQueue}
                      className="flex flex-col items-center gap-3 w-[140px] shrink-0"
                      variants={nodeVariants}
                      initial="hidden"
                      animate="visible"
                      custom={0}
                      onMouseEnter={() => setHoveredNode("sn-queue")}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center backdrop-blur-sm">
                        <Ticket className="text-secondary" size={22} />
                      </div>
                      <span className="text-sm font-medium text-foreground text-center leading-tight">
                        ServiceNow Queue
                      </span>
                    </motion.div>
                    <Tooltip visible={hoveredNode === "sn-queue"} anchorRef={ref.snQueue}>
                      Tickets automatically pulled as they arrive. No manual
                      input needed.
                    </Tooltip>

                    <ConnectingLine delay={0.3} />

                    {/* Node 2: AI Processes in Background */}
                    <motion.div
                      ref={ref.aiBg}
                      className="flex flex-col items-center gap-3 w-[150px] shrink-0"
                      variants={nodeVariants}
                      initial="hidden"
                      animate="visible"
                      custom={1}
                      onMouseEnter={() => setHoveredNode("ai-bg")}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <div
                        className="w-14 h-14 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-center"
                        style={{ animation: "softPulse 3s ease-in-out infinite" }}
                      >
                        <Cpu className="text-accent" size={22} />
                      </div>
                      <span className="text-sm font-medium text-foreground text-center leading-tight">
                        AI Processes in Background
                      </span>
                    </motion.div>
                    <Tooltip visible={hoveredNode === "ai-bg"} anchorRef={ref.aiBg}>
                      Draft answer generated before the agent even opens the
                      tool. Retrieval and generation happen automatically.
                    </Tooltip>

                    <ConnectingLine delay={0.8} />

                    {/* Node 3: Agent Reviews (MAIN NODE) */}
                    <motion.div
                      ref={ref.review}
                      className="flex flex-col items-center gap-3 w-[170px] shrink-0"
                      variants={nodeVariants}
                      initial="hidden"
                      animate="visible"
                      custom={2}
                      onMouseEnter={() => setHoveredNode("review")}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <div className="w-[72px] h-[72px] rounded-xl bg-accent/5 border border-accent/30 flex items-center justify-center shadow-[0_0_20px_rgba(52,60,237,0.15)] backdrop-blur-sm">
                        <Monitor className="text-accent" size={26} />
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-accent block leading-tight">
                          Agent Reviews
                        </span>
                        <span className="text-xs text-muted mt-0.5 block">
                          Second Screen
                        </span>
                      </div>
                    </motion.div>
                    {/* Review tooltip with mini schematic */}
                    <Tooltip visible={hoveredNode === "review"} anchorRef={ref.review}>
                      <span className="block mb-2">
                        Second screen alongside ServiceNow. Shows the draft,
                        reasoning, and source links.
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <div className="px-2 py-1 bg-accent/10 border border-accent/20 rounded text-xs text-accent font-mono">
                          Answer
                        </div>
                        <div className="px-2 py-1 bg-white/[0.04] border border-white/[0.08] rounded text-xs text-secondary font-mono">
                          Reasoning
                        </div>
                        <div className="px-2 py-1 bg-white/[0.04] border border-white/[0.08] rounded text-xs text-secondary font-mono">
                          Sources
                        </div>
                      </div>
                    </Tooltip>

                    <ConnectingLine delay={1.3} />

                    {/* Node 4: Approve & Send */}
                    <motion.div
                      ref={ref.send}
                      className="flex flex-col items-center gap-3 w-[130px] shrink-0"
                      variants={nodeVariants}
                      initial="hidden"
                      animate="visible"
                      custom={3}
                      onMouseEnter={() => setHoveredNode("send")}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center backdrop-blur-sm">
                        <Send className="text-secondary" size={22} />
                      </div>
                      <span className="text-sm font-medium text-foreground text-center leading-tight">
                        Approve &amp; Send
                      </span>
                    </motion.div>
                    <Tooltip visible={hoveredNode === "send"} anchorRef={ref.send}>
                      One click sends the response back to the ServiceNow
                      ticket.
                    </Tooltip>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Card 2: System Architecture ─── */}
      <div
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
          expandedCard === "arch"
            ? "bg-[#0A0A0A] border-white/[0.12] shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            : "bg-white/[0.02] border-white/[0.05] cursor-pointer hover:bg-white/[0.04]"
        }`}
      >
        <button
          className="w-full px-8 py-5 flex items-center justify-between"
          onClick={() => toggle("arch")}
        >
          <div className="flex items-center gap-5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                expandedCard === "arch"
                  ? "bg-accent/20 text-accent border border-accent/20"
                  : "bg-white/[0.03] text-muted border border-white/[0.05]"
              }`}
            >
              <Server size={18} />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                The Backend
              </span>
              <h3
                className={`text-lg font-medium transition-colors ${
                  expandedCard === "arch" ? "text-foreground" : "text-secondary"
                }`}
              >
                System Architecture
              </h3>
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`text-muted transition-transform duration-300 ${
              expandedCard === "arch" ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {expandedCard === "arch" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-8 pb-8 pt-1">
                <p className="text-secondary mb-6 leading-relaxed max-w-3xl text-[15px]">
                  Two layers. Ingestion runs once when docs update. The RAG
                  pipeline runs for every question.
                </p>

                <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl px-8 py-8">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <DotGrid />
                  </div>

                  {/* ── Top Row: Ingestion (runs once) ── */}
                  <div className="relative z-10 mb-2">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted/60">
                        Runs Once
                      </span>
                      <div className="flex-1 border-t border-dashed border-white/[0.04]" />
                    </div>

                    <div className="flex items-center justify-center">
                      {/* Ingestion Node 1: API Documentation */}
                      <motion.div
                        ref={ref.apiDocs}
                        className="flex flex-col items-center gap-2.5 w-[150px] shrink-0"
                        variants={nodeVariants}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        onMouseEnter={() => setHoveredNode("api-docs")}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className="w-12 h-12 rounded-lg bg-white/[0.02] border border-dashed border-white/[0.08] flex items-center justify-center opacity-80">
                          <FileText className="text-muted" size={18} />
                        </div>
                        <span className="text-xs font-medium text-secondary text-center">
                          API Documentation
                        </span>
                      </motion.div>
                      <Tooltip visible={hoveredNode === "api-docs"} anchorRef={ref.apiDocs}>
                        Fiserv&apos;s full API documentation library.
                        Thousands of pages across multiple product lines and
                        versions.
                      </Tooltip>

                      <div className="flex-1 mx-2 relative h-[2px] flex items-center min-w-[24px]">
                        <div className="absolute w-full border-t border-dashed border-white/[0.06]" />
                        <motion.div
                          className="absolute left-0 border-t border-solid border-white/[0.15]"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        />
                      </div>

                      {/* Ingestion Node 2: Chunking */}
                      <motion.div
                        ref={ref.chunking}
                        className="flex flex-col items-center gap-2.5 w-[150px] shrink-0"
                        variants={nodeVariants}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                        onMouseEnter={() => setHoveredNode("chunking")}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className="w-12 h-12 rounded-lg bg-white/[0.02] border border-dashed border-white/[0.08] flex items-center justify-center opacity-80">
                          <Scissors className="text-muted" size={18} />
                        </div>
                        <span className="text-xs font-medium text-secondary text-center">
                          Chunking
                        </span>
                      </motion.div>
                      <Tooltip visible={hoveredNode === "chunking"} anchorRef={ref.chunking}>
                        Split by logical API endpoint, not arbitrary token
                        count. Parent-child relationships preserved so a match
                        pulls in full context.
                      </Tooltip>

                      <div className="flex-1 mx-2 relative h-[2px] flex items-center min-w-[24px]">
                        <div className="absolute w-full border-t border-dashed border-white/[0.06]" />
                        <motion.div
                          className="absolute left-0 border-t border-solid border-white/[0.15]"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                        />
                      </div>

                      {/* Ingestion Node 3: Elasticsearch Index */}
                      <motion.div
                        ref={ref.esIndex}
                        className="flex flex-col items-center gap-2.5 w-[150px] shrink-0"
                        variants={nodeVariants}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        onMouseEnter={() => setHoveredNode("es-index")}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className="w-12 h-12 rounded-lg bg-white/[0.02] border border-dashed border-white/[0.08] flex items-center justify-center opacity-80">
                          <Database className="text-muted" size={18} />
                        </div>
                        <span className="text-xs font-medium text-secondary text-center">
                          Elasticsearch Index
                        </span>
                      </motion.div>
                      <Tooltip visible={hoveredNode === "es-index"} anchorRef={ref.esIndex}>
                        Single unified store for text, vectors, and metadata.
                        No separate vector DB.
                      </Tooltip>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative z-10 my-5 flex items-center gap-3">
                    <div className="flex-1 border-t border-white/[0.04]" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent/40">
                      ▼
                    </span>
                    <div className="flex-1 border-t border-white/[0.04]" />
                  </div>

                  {/* ── Bottom Row: RAG Pipeline (runs per question) ── */}
                  <div className="relative z-10 mt-2">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-accent/60">
                        Runs Per Question
                      </span>
                      <div className="flex-1 border-t border-dashed border-accent/10" />
                    </div>

                    <div className="flex items-center justify-center">
                      {/* RAG Node 1: Question In */}
                      <motion.div
                        ref={ref.qIn}
                        className="flex flex-col items-center gap-2.5 w-[100px] shrink-0"
                        variants={nodeVariants}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        onMouseEnter={() => setHoveredNode("q-in")}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.1] flex items-center justify-center">
                          <MessageSquare className="text-secondary" size={16} />
                        </div>
                        <span className="text-xs font-medium text-secondary text-center">
                          Question In
                        </span>
                      </motion.div>
                      <Tooltip visible={hoveredNode === "q-in"} anchorRef={ref.qIn} above>
                        Incoming question from the ServiceNow ticket.
                      </Tooltip>

                      <ConnectingLine delay={0.3} />

                      {/* RAG Node 2: Agentic Search (KEY NODE) */}
                      <motion.div
                        ref={ref.agentic}
                        className="flex flex-col items-center gap-2.5 w-[160px] shrink-0 relative pt-10"
                        variants={nodeVariants}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                        onMouseEnter={() => setHoveredNode("agentic")}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <FeedbackArrow />
                        <div className="w-16 h-16 rounded-xl bg-accent/5 border border-accent/30 flex items-center justify-center shadow-[0_0_20px_rgba(52,60,237,0.15)]">
                          <Search className="text-accent" size={24} />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-medium text-accent block leading-tight">
                            Agentic Search
                          </span>
                          <span className="text-[11px] text-muted mt-0.5 block">
                            Multi-pass retrieval
                          </span>
                        </div>
                      </motion.div>
                      <Tooltip visible={hoveredNode === "agentic"} anchorRef={ref.agentic} above>
                        Semantic search driven by an AI agent. It formulates
                        queries, evaluates results, and runs additional passes
                        if the first results aren&apos;t enough.
                      </Tooltip>

                      <ConnectingLine delay={1.0} />

                      {/* RAG Node 3: Generation */}
                      <motion.div
                        ref={ref.gen}
                        className="flex flex-col items-center gap-2.5 w-[130px] shrink-0"
                        variants={nodeVariants}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        onMouseEnter={() => setHoveredNode("gen")}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center">
                          <Sparkles className="text-secondary" size={20} />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-medium text-foreground block leading-tight">
                            Generation
                          </span>
                          <span className="text-[11px] text-muted mt-0.5 block">
                            Open source models on Watsonx
                          </span>
                        </div>
                      </motion.div>
                      <Tooltip visible={hoveredNode === "gen"} anchorRef={ref.gen} above>
                        Open source models on IBM Watsonx. Orchestrated with
                        LangChain.
                      </Tooltip>

                      <ConnectingLine delay={1.5} />

                      {/* RAG Node 4: Output */}
                      <motion.div
                        ref={ref.output}
                        className="flex flex-col items-center gap-2.5 w-[130px] shrink-0"
                        variants={nodeVariants}
                        initial="hidden"
                        animate="visible"
                        custom={3}
                        onMouseEnter={() => setHoveredNode("output")}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-md text-xs text-accent font-medium text-center">
                            Answer
                          </div>
                          <div className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-md text-xs text-secondary font-medium text-center">
                            Reasoning
                          </div>
                          <div className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-md text-xs text-secondary font-medium text-center">
                            Source Links
                          </div>
                        </div>
                      </motion.div>
                      <Tooltip visible={hoveredNode === "output"} anchorRef={ref.output} above>
                        The agent sees the answer, why those sources were
                        chosen, and clickable deep links into the docs.
                      </Tooltip>
                    </div>
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
