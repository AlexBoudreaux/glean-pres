"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GleanMark } from "./GleanLogo";

export function SectionLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalPanels, setTotalPanels] = useState(0);
  const [currentTitle, setCurrentTitle] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const panels = container.querySelectorAll<HTMLElement>("[data-panel]");
    setTotalPanels(panels.length);

    if (panels.length > 0) {
      setCurrentTitle(panels[0].dataset.panelTitle || "");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const index = Array.from(panels).indexOf(el);
            if (index !== -1) {
              setCurrentIndex(index);
              setCurrentTitle(el.dataset.panelTitle || "");
            }
          }
        }
      },
      {
        root: container,
        threshold: 0.5,
      }
    );

    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, []);

  const scrollToPanel = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const panels = container.querySelectorAll("[data-panel]");
    const target = panels[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const container = containerRef.current;
      if (!container) return;
      const panels = container.querySelectorAll("[data-panel]");
      const total = panels.length;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          if (currentIndex < total - 1) {
            scrollToPanel(currentIndex + 1);
          }
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          if (currentIndex > 0) {
            scrollToPanel(currentIndex - 1);
          }
          break;
        case "Escape":
          e.preventDefault();
          router.push("/");
          break;
        case "Home":
          e.preventDefault();
          scrollToPanel(0);
          break;
        case "End":
          e.preventDefault();
          scrollToPanel(total - 1);
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, scrollToPanel, router]);

  const progress =
    totalPanels > 0 ? ((currentIndex + 1) / totalPanels) * 100 : 0;

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="h-full max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-muted hover:text-foreground transition-colors text-sm flex items-center gap-2.5 group"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="opacity-50 group-hover:opacity-100 transition-opacity"
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <GleanMark size={14} className="text-accent/60" />
            </Link>
            <div className="w-px h-4 bg-border" />
            <span className="text-foreground text-sm font-medium">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-muted text-xs max-w-[200px] truncate">
              {currentTitle}
            </span>
            <span className="font-mono text-faint text-xs tabular-nums">
              {currentIndex + 1}/{totalPanels}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border">
          <div
            className="h-full bg-accent/50 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Scroll-snap container */}
      <div ref={containerRef} className="snap-container">
        {children}
      </div>
    </div>
  );
}
