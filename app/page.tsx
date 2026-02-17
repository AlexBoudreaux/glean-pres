import Link from "next/link";
import Image from "next/image";
import { GleanLogo } from "./components/GleanLogo";

const cases = [
  {
    number: "01",
    title: "Reimagining Customer Service with AI",
    description:
      "How I embedded with a team at Fiserv and built an AI system that changed how they work",
    href: "/fiserv",
    label: "AI-First Workflow",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h.01" />
        <path d="M12 10h.01" />
        <path d="M16 10h.01" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Can AI Predict Your Next Customer?",
    description:
      "A data-driven experiment I built this week to predict Glean customers from public signals",
    href: "/experiment",
    label: "Data-Driven Experiment",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-8 4 4 6-10" />
      </svg>
    ),
  },
];

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ProfilePhoto() {
  return (
    <div className="relative inline-block">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-25"
        style={{
          background: "linear-gradient(135deg, #343CED, #D8FD49)",
        }}
      />
      {/* Gradient ring */}
      <div
        className="relative rounded-full p-[2px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(52,60,237,0.6), rgba(52,60,237,0.1) 50%, rgba(216,253,73,0.3))",
        }}
      >
        <Image
          src="/profile-pic.png"
          alt="Alex Boudreaux"
          width={80}
          height={80}
          className="w-20 h-20 rounded-full object-cover border-2 border-background"
          priority
        />
      </div>
    </div>
  );
}

export default function HubPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 relative">
      {/* Radial glow behind hero */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(52, 60, 237, 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-[900px] mx-auto relative z-10">
        {/* Profile + Title */}
        <div className="flex flex-col items-center gap-6 mb-14">
          <ProfilePhoto />

          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-3">
              <GleanLogo height={36} className="text-foreground" />
              <span className="text-faint text-3xl font-light">×</span>
              <span className="font-serif text-4xl tracking-tight">Alex</span>
            </div>
            <p className="text-secondary text-base">
              GTM Engineer Case Study Presentation
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-6 mb-16">
          {cases.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="card-glow group flex flex-col p-8 rounded-xl bg-surface border border-border"
            >
              {/* Header: icon container + number */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-lg bg-accent-muted flex items-center justify-center text-accent">
                  {c.icon}
                </div>
                <span className="font-mono text-faint text-2xl tracking-tight">
                  {c.number}
                </span>
              </div>

              {/* Label tag */}
              <span className="inline-flex self-start px-2.5 py-1 rounded-md bg-surface-raised text-secondary text-xs font-medium tracking-wide mb-4">
                {c.label}
              </span>

              {/* Title (min-height for alignment across cards) */}
              <h2 className="text-[22px] font-semibold leading-snug min-h-[60px] mb-3 group-hover:text-foreground transition-colors">
                {c.title}
              </h2>

              {/* Description */}
              <p className="text-muted text-[15px] leading-relaxed mb-6">
                {c.description}
              </p>

              {/* Spacer to push CTA to bottom */}
              <div className="flex-grow" />

              {/* CTA */}
              <span className="text-accent text-sm font-medium flex items-center gap-2 group-hover:gap-3.5 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                Explore case study
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M1 7H13M13 7L7 1M13 7L7 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        {/* Gradient divider */}
        <div className="w-24 h-px mx-auto mb-8 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        {/* Footer links */}
        <div className="flex items-center justify-center gap-3">
          <a
            href="https://github.com/AlexBoudreaux"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted
                       bg-surface border border-border
                       hover:text-foreground hover:border-border-hover hover:bg-surface-hover
                       transition-all duration-200"
          >
            <GitHubIcon />
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/alexboudreaux"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted
                       bg-surface border border-border
                       hover:text-foreground hover:border-border-hover hover:bg-surface-hover
                       transition-all duration-200"
          >
            <LinkedInIcon />
            LinkedIn
          </a>
          <a
            href="https://cap.link/1g8qw2ysqv9aywn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted
                       bg-surface border border-border
                       hover:text-foreground hover:border-border-hover hover:bg-surface-hover
                       transition-all duration-200"
          >
            <PlayIcon />
            Demo Video
          </a>
        </div>
      </div>
    </div>
  );
}
