import Link from "next/link";

const cases = [
  {
    number: "01",
    title: "Reimagining Customer Service with AI",
    description: "How I embedded with a team at Fiserv and built an AI system that changed how they work",
    href: "/fiserv",
    label: "AI-First Workflow",
  },
  {
    number: "02",
    title: "Can AI Predict Your Next Customer?",
    description: "A data-driven experiment I built this week to predict Glean customers from public signals",
    href: "/experiment",
    label: "Data-Driven Experiment",
  },
];

export default function HubPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8">
      <div className="w-full max-w-[900px] mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-6xl tracking-tight mb-4">
            Glean × Alex
          </h1>
          <p className="text-muted text-lg">
            GTM Engineer Case Study Presentation
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-6 mb-20">
          {cases.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group relative block p-8 rounded-xl bg-surface border border-border
                         hover:border-border-hover hover:bg-surface/80
                         transition-all duration-300 ease-out
                         hover:shadow-[0_0_40px_rgba(59,130,246,0.06)]
                         hover:-translate-y-0.5"
            >
              <span className="text-accent/40 text-sm font-medium tracking-wider">
                {c.number}
              </span>

              <h2 className="text-2xl font-semibold mt-3 mb-3 leading-tight group-hover:text-foreground transition-colors">
                {c.title}
              </h2>

              <p className="text-muted text-base leading-relaxed mb-6">
                {c.description}
              </p>

              <span className="text-accent text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                {c.label}
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

        {/* Footer */}
        <div className="flex items-center justify-center gap-8 text-sm text-muted/50">
          <span className="hover:text-muted transition-colors cursor-pointer">
            GitHub
          </span>
          <span className="hover:text-muted transition-colors cursor-pointer">
            LinkedIn
          </span>
          <span className="hover:text-muted transition-colors cursor-pointer">
            Demo Video
          </span>
        </div>
      </div>
    </div>
  );
}
