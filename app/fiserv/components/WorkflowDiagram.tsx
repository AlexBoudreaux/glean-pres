"use client";

import { motion } from "framer-motion";
import { Ticket, Clock, Send, FileWarning } from "lucide-react";

export function WorkflowDiagram() {
  return (
    <div className="flex flex-col gap-16 w-full max-w-5xl mx-auto">
      {/* Visual Metaphor Diagram */}
      <div className="relative w-full h-[300px] bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Start Node */}
        <motion.div
          className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
            <Ticket className="text-secondary" size={20} />
          </div>
          <span className="font-mono text-xs text-secondary">Ticket In</span>
        </motion.div>

        {/* Tangle of lines (The Bottleneck) */}
        <svg
          className="absolute left-[95px] right-[60px] top-0 bottom-0 w-[calc(100%-185px)] h-full -translate-y-[18px]"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <motion.path
            d="M 0 50 Q 20 30, 30 50 T 50 70 T 70 30 T 100 50"
            fill="none"
            stroke="rgba(255,100,100,0.3)"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="M 0 50 Q 25 70, 40 50 T 60 30 T 80 70 T 100 50"
            fill="none"
            stroke="rgba(255,100,100,0.2)"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
          <motion.path
            d="M 0 50 Q 30 25, 50 50 T 80 75 T 100 50"
            fill="none"
            stroke="rgba(255,100,100,0.4)"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        </svg>

        {/* The Problem / Bottleneck Box */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-10 bg-background/80 backdrop-blur-md px-8 py-6 rounded-xl border border-red-500/30 shadow-[0_0_40px_rgba(255,0,0,0.1)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <FileWarning size={20} />
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Clock size={20} />
            </div>
          </div>
          <div className="text-center">
            <p className="font-mono text-xs text-red-400 uppercase tracking-widest mb-1">The Bottleneck</p>
            <p className="text-sm text-secondary">Manual Search & Waiting</p>
          </div>
        </motion.div>

        {/* End Node */}
        <motion.div
          className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
            <Send className="text-secondary" size={20} />
          </div>
          <span className="font-mono text-xs text-secondary">Response</span>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: "Volume", value: "Hundreds", sub: "of API endpoints" },
          { label: "Density", value: "Thousands", sub: "of pages of docs" },
          { label: "Cost", value: "Hours", sub: "lost per question" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col gap-2 border-l-2 border-white/[0.08] pl-5"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 + i * 0.15, duration: 0.5 }}
          >
            <span className="font-mono text-xs text-muted uppercase tracking-wider">{stat.label}</span>
            <span className="font-serif text-3xl text-foreground">{stat.value}</span>
            <span className="text-sm text-secondary">{stat.sub}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
