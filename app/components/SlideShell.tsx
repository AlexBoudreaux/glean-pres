"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSlideNavigation } from "../hooks/useSlideNavigation";

const variants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? -300 : 300,
    opacity: 0,
  }),
};

function ProgressDots({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-50">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i === current
              ? "bg-foreground scale-125"
              : "bg-foreground/25 hover:bg-foreground/40"
          }`}
        />
      ))}
    </div>
  );
}

export function SlideShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentIndex, totalSlides, direction } = useSlideNavigation();

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.main
            key={pathname}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-[1000px] mx-auto px-8 py-16"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
      <ProgressDots current={currentIndex} total={totalSlides} />
    </>
  );
}
