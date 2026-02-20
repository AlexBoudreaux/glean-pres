"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function RevealTransition() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {/* Background blur when revealed */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            className="absolute inset-0 bg-[#D8FD49]/5 rounded-3xl blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-4xl h-[320px] perspective-1000">
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateX: revealed ? 180 : 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Front (State 1) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden bg-[#111] border border-white/[0.08] rounded-3xl p-12 flex flex-col justify-center gap-8 shadow-xl cursor-pointer hover:border-white/[0.15] transition-colors"
            onClick={() => setRevealed(true)}
          >
            <div>
              <span className="font-mono text-xs text-muted tracking-widest uppercase">The Original Goal</span>
              <h3 className="font-serif text-4xl text-foreground mt-2 tracking-tight">Answer machine for Level 1 questions</h3>
            </div>
            
            <div className="flex items-center gap-4">
              {["Ticket", "Draft", "Review", "Send"].map((step, i) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="bg-white/[0.03] border border-white/[0.06] px-5 py-2.5 rounded-lg text-sm font-medium text-secondary">
                    {step}
                  </div>
                  {i < 3 && <ArrowRight size={16} className="text-white/20" />}
                </div>
              ))}
            </div>

            <div className="absolute bottom-6 right-8 text-xs font-mono text-muted flex items-center gap-2">
              Click to reveal <ArrowRight size={12} />
            </div>
          </div>

          {/* Back (State 2) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden bg-[#111] border border-[#D8FD49]/30 rounded-3xl p-12 flex flex-col justify-center gap-6 shadow-[0_0_50px_rgba(216,253,73,0.1)] overflow-hidden"
            style={{ transform: "rotateX(180deg)" }}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#D8FD49]/50 via-[#D8FD49] to-[#D8FD49]/50 rounded-t-3xl" />
            
            <div>
              <span className="font-mono text-xs text-[#D8FD49] tracking-widest uppercase flex items-center gap-2">
                <Sparkles size={14} /> What Users Actually Did
              </span>
              <h3 className="font-serif text-4xl text-foreground mt-2 tracking-tight">Thinking partner for everything</h3>
            </div>
            
            <div className="flex gap-12 mt-4">
              <blockquote className="border-l-2 border-[#D8FD49]/40 pl-6 py-1 w-1/2">
                <p className="font-serif text-xl text-foreground leading-relaxed italic">
                  &ldquo;We found using it as our personal search engine was extremely helpful.&rdquo;
                </p>
              </blockquote>
              
              <div className="w-1/2 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#D8FD49]" />
                  <span className="text-secondary text-sm">Navigate thousands of pages</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#D8FD49]" />
                  <span className="text-secondary text-sm">Synthesize complex answers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#D8FD49]" />
                  <span className="text-secondary text-sm">Draft customer responses</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Global styles for 3D flip since Tailwind doesn't have it built-in cleanly */}
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}} />
    </div>
  );
}
