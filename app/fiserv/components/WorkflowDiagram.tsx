"use client";

import { motion } from "framer-motion";
import {
  Ticket,
  Search,
  MessageCircleQuestion,
  Clock,
  Send,
} from "lucide-react";

const steps = [
  { icon: Ticket, label: "Ticket Arrives", bottleneck: false },
  { icon: Search, label: "Search Docs", bottleneck: true },
  { icon: MessageCircleQuestion, label: "Ask Colleague", bottleneck: false },
  { icon: Clock, label: "Wait", bottleneck: true },
  { icon: Send, label: "Respond", bottleneck: false },
];

const stats = [
  "Hundreds of API endpoints",
  "Thousands of pages of docs",
  "Hours per question",
];

export function WorkflowDiagram() {
  return (
    <div className="flex flex-col gap-16">
      {/* Workflow nodes */}
      <div className="flex items-center justify-center gap-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
          >
            <div
              className={`flex flex-col items-center gap-3 ${
                step.bottleneck ? "relative" : ""
              }`}
            >
              <motion.div
                className={`w-16 h-16 rounded-xl flex items-center justify-center border ${
                  step.bottleneck
                    ? "bg-accent-muted border-accent/30"
                    : "bg-white/[0.03] border-white/[0.06]"
                }`}
                animate={
                  step.bottleneck
                    ? {
                        boxShadow: [
                          "0 0 0px rgba(52,60,237,0)",
                          "0 0 20px rgba(52,60,237,0.3)",
                          "0 0 0px rgba(52,60,237,0)",
                        ],
                      }
                    : {}
                }
                transition={
                  step.bottleneck
                    ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    : {}
                }
              >
                <step.icon
                  size={24}
                  className={
                    step.bottleneck ? "text-accent" : "text-secondary"
                  }
                  strokeWidth={1.5}
                />
              </motion.div>
              <span
                className={`text-xs font-mono tracking-wide ${
                  step.bottleneck ? "text-accent" : "text-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <motion.div
                className="w-8 h-px bg-white/[0.1] mt-[-20px]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  delay: i * 0.15 + 0.1,
                  duration: 0.3,
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat}
            className="text-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              delay: 0.8 + i * 0.12,
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <span className="text-secondary text-lg font-medium">{stat}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
