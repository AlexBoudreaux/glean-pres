"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
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

function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * value;
      setDisplay(
        decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString()
      );
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, value, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

const scoreDistribution = [
  { range: "0-20", customers: 4, nonCustomers: 63 },
  { range: "21-40", customers: 13, nonCustomers: 93 },
  { range: "41-60", customers: 24, nonCustomers: 18 },
  { range: "61-80", customers: 3, nonCustomers: 2 },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#1e1e22] border border-white/[0.1] rounded-lg px-4 py-3 shadow-2xl">
      <p className="font-mono text-xs text-muted mb-2">Score: {label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
          {entry.dataKey === "customers" ? "Customers" : "Non-Customers"}:{" "}
          <span className="font-medium">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export function ResultsPanel() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Hero metrics */}
      <div className="grid grid-cols-2 gap-6">
        {[
          {
            label: "Top Quartile",
            sublabel: "55 companies",
            value: 55,
            suffix: "%",
            lift: "2.75",
            description: "are known Glean customers",
          },
          {
            label: "Top Decile",
            sublabel: "22 companies",
            value: 68,
            suffix: "%",
            lift: "3.4",
            description: "are known Glean customers",
          },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            className="flex flex-col gap-3 border-t border-b border-white/[0.08] py-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.15, duration: 0.6, ease }}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted uppercase tracking-widest">
                {metric.label}
              </span>
              <span className="font-mono text-[10px] text-faint">
                {metric.sublabel}
              </span>
            </div>
            <div className="flex items-end gap-4">
              <span className="text-6xl font-serif font-medium text-foreground tracking-tighter leading-none">
                <AnimatedNumber
                  value={metric.value}
                  suffix={metric.suffix}
                />
              </span>
              <div className="flex flex-col gap-0.5 pb-1">
                <span className="text-sm text-secondary">
                  {metric.description}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-lime">
                    {metric.lift}x lift
                  </span>
                  <span className="font-mono text-xs text-faint">
                    vs 20% random
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Score distribution chart */}
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6, ease }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted uppercase tracking-widest">
            Score Distribution
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-accent" />
              <span className="text-xs text-secondary">Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-white/[0.15]" />
              <span className="text-xs text-secondary">Non-Customers</span>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={scoreDistribution}
              barGap={4}
              margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
            >
              <XAxis
                dataKey="range"
                tick={{ fill: "#71717A", fontSize: 12, fontFamily: "monospace" }}
                axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#71717A", fontSize: 12, fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="customers" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {scoreDistribution.map((_, index) => (
                  <Cell
                    key={`customer-${index}`}
                    fill="#343CED"
                  />
                ))}
              </Bar>
              <Bar dataKey="nonCustomers" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {scoreDistribution.map((_, index) => (
                  <Cell
                    key={`noncustomer-${index}`}
                    fill="rgba(255,255,255,0.15)"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Average score comparison */}
      <motion.div
        className="flex items-center justify-center gap-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5, ease }}
      >
        <div className="flex flex-col gap-1 items-end">
          <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
            Non-Customer Avg
          </span>
          <span className="text-3xl font-serif text-secondary">
            <AnimatedNumber value={25.8} decimals={1} />
          </span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-mono text-[10px] font-bold text-lime">
            +17pt
          </span>
          <span className="text-accent text-lg">→</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] text-accent uppercase tracking-widest">
            Customer Avg
          </span>
          <span className="text-3xl font-serif text-foreground">
            <AnimatedNumber value={42.8} decimals={1} />
          </span>
        </div>
      </motion.div>
    </div>
  );
}
