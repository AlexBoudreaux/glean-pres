"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const ease = [0.16, 1, 0.3, 1] as const;

const signalContributions = [
  { signal: "KM Hiring", contribution: 2.37, strong: true },
  { signal: "Tool Count", contribution: 2.33, strong: true },
  { signal: "Tool Overlap", contribution: 1.5, strong: true },
  { signal: "Workplace Lead.", contribution: 1.32, strong: true },
  { signal: "Financial Cap.", contribution: 0.63 },
  { signal: "Enterprise SaaS", contribution: 0.61 },
  { signal: "Employee Count", contribution: 0.3 },
  { signal: "Competitor Tool", contribution: 0.26 },
  { signal: "Headcount Growth", contribution: 0.25 },
  { signal: "Distributed Workforce", contribution: 0.16 },
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { signal: string } }>;
}) {
  if (!active || !payload || !payload[0]) return null;
  return (
    <div className="bg-[#1e1e22] border border-white/[0.1] rounded-lg px-4 py-3 shadow-2xl">
      <p className="text-sm font-medium text-foreground mb-1">
        {payload[0].payload.signal}
      </p>
      <p className="font-mono text-xs text-accent">
        +{payload[0].value.toFixed(2)} contribution
      </p>
    </div>
  );
}

export function SignalAnalysisPanel() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Chart + top signal callouts side by side */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left: Horizontal bar chart */}
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="font-mono text-xs text-muted uppercase tracking-widest">
            Signal Contribution
          </span>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={signalContributions}
                layout="vertical"
                margin={{ top: 2, right: 20, left: 0, bottom: 2 }}
                barSize={16}
              >
                <XAxis
                  type="number"
                  tick={{ fill: "#71717A", fontSize: 10, fontFamily: "monospace" }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                  domain={[0, 2.5]}
                />
                <YAxis
                  type="category"
                  dataKey="signal"
                  tick={{ fill: "#A1A1AA", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                  {signalContributions.map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={entry.strong ? "#343CED" : "rgba(255,255,255,0.12)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right: Top signal callouts stacked */}
        <div className="flex flex-col gap-4 pt-6">
          {[
            {
              name: "KM Hiring",
              contribution: "+2.37",
              custAvg: "1.2",
              nonCustAvg: "0.4",
              insight: "Customers 3x more likely to be hiring for KM roles",
            },
            {
              name: "Tool Count",
              contribution: "+2.33",
              custAvg: "1.9",
              nonCustAvg: "0.7",
              insight: "Highest raw separation of any signal",
            },
          ].map((signal, i) => (
            <motion.div
              key={signal.name}
              className="bg-accent/5 border border-accent/15 rounded-xl p-4 flex flex-col gap-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-accent">
                  {signal.name}
                </span>
                <span className="font-mono text-xs text-accent/70">
                  {signal.contribution}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] text-muted uppercase">
                    Customers
                  </span>
                  <span className="text-xl font-serif text-foreground">
                    {signal.custAvg}
                  </span>
                </div>
                <span className="text-muted text-xs">vs</span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] text-muted uppercase">
                    Non-Cust.
                  </span>
                  <span className="text-xl font-serif text-secondary">
                    {signal.nonCustAvg}
                  </span>
                </div>
              </div>
              <p className="text-xs text-secondary">{signal.insight}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Findings, not failures - compact inline */}
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5, ease }}
      >
        <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
          Findings, Not Failures
        </span>
        <div className="flex gap-3">
          {[
            { name: "Competitor Tool", reason: "Only 5 matches in 220 companies, data too sparse" },
            { name: "Headcount Growth", reason: "No separation, growth rate too noisy from public data" },
            { name: "Distributed Workforce", reason: "Everyone's distributed in 2026, can't differentiate" },
          ].map((s, i) => (
            <motion.div
              key={s.name}
              className="flex-1 bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-2.5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.06, duration: 0.3, ease }}
            >
              <span className="font-mono text-[10px] text-faint block mb-1">
                {s.name}
              </span>
              <p className="text-xs text-secondary leading-snug">{s.reason}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
