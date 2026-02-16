"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const SLIDE_ORDER = ["/", "/fiserv", "/experiment", "/closing"];

export function useSlideNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [direction, setDirection] = useState(0);

  const currentIndex = SLIDE_ORDER.indexOf(pathname);

  const goNext = useCallback(() => {
    if (currentIndex < SLIDE_ORDER.length - 1) {
      setDirection(1);
      router.push(SLIDE_ORDER[currentIndex + 1]);
    }
  }, [currentIndex, router]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      router.push(SLIDE_ORDER[currentIndex - 1]);
    }
  }, [currentIndex, router]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  return {
    currentIndex,
    totalSlides: SLIDE_ORDER.length,
    direction,
    goNext,
    goPrev,
    isFirst: currentIndex === 0,
    isLast: currentIndex === SLIDE_ORDER.length - 1,
  };
}
