"use client";

import { motion } from "framer-motion";
import { Hammer, Rocket, Users, Eye, Wrench } from "lucide-react";

const nodes = [
  {
    id: "build",
    label: "Build",
    desc: "Rapid prototyping",
    icon: Hammer,
    x: "25%",
    y: "20.588%",
    textPosition: "top" as const,
    delay: 0.1,
  },
  {
    id: "deploy",
    label: "Deploy",
    desc: "Ship to active users",
    icon: Rocket,
    x: "50%",
    y: "20.588%",
    textPosition: "top" as const,
    delay: 0.4,
  },
  {
    id: "sit",
    label: "Sit With Agents",
    desc: "Direct observation",
    icon: Users,
    x: "75%",
    y: "20.588%",
    textPosition: "top" as const,
    delay: 0.7,
  },
  {
    id: "observe",
    label: "Observe",
    desc: "Note friction points",
    icon: Eye,
    x: "62.5%",
    y: "79.412%",
    textPosition: "bottom" as const,
    delay: 1.2,
  },
  {
    id: "adjust",
    label: "Adjust",
    desc: "Iterate and improve",
    icon: Wrench,
    x: "37.5%",
    y: "79.412%",
    textPosition: "bottom" as const,
    delay: 1.5,
  },
];

const facts = [
  "On-site for every kickoff",
  "Daily iteration cycles",
  "Phase 2 extended at Fiserv's request"
];

export function TeamQuotes() {
  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto gap-12">
      {/* Visual Loop */}
      <div 
        className="relative w-full max-w-[800px]"
        style={{ aspectRatio: "800/340" }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 340">
          {/* Background path */}
          <rect 
            x="100" 
            y="70" 
            width="600" 
            height="200" 
            rx="100" 
            fill="none" 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth="2" 
            strokeDasharray="6 6"
          />
          {/* Animated path */}
          <motion.rect 
            x="100" 
            y="70" 
            width="600" 
            height="200" 
            rx="100" 
            fill="none" 
            stroke="#D8FD49" 
            strokeOpacity="0.5"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const Icon = node.icon;
          return (
            <motion.div
              key={node.id}
              className="absolute flex flex-col items-center justify-center z-10"
              style={{ left: node.x, top: node.y, x: "-50%", y: "-50%" }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: node.delay, duration: 0.5 }}
            >
              <div className="relative flex flex-col items-center">
                {node.textPosition === "top" && (
                  <div className="absolute bottom-full mb-4 flex flex-col items-center w-max">
                    <span className="font-mono text-sm text-foreground mb-0.5">{node.label}</span>
                    <span className="text-xs text-muted">{node.desc}</span>
                  </div>
                )}
                
                <div className="w-12 h-12 rounded-full bg-background border border-white/[0.1] shadow-xl flex items-center justify-center relative z-20">
                  <Icon className="text-secondary" size={20} />
                </div>

                {node.textPosition === "bottom" && (
                  <div className="absolute top-full mt-4 flex flex-col items-center w-max">
                    <span className="font-mono text-sm text-foreground mb-0.5">{node.label}</span>
                    <span className="text-xs text-muted">{node.desc}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Facts */}
      <div className="flex flex-col gap-3 items-center mt-4">
        {facts.map((fact, i) => (
          <motion.p
            key={i}
            className="text-lg text-secondary tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 2.2 + i * 0.15, duration: 0.5 }}
          >
            {fact}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
