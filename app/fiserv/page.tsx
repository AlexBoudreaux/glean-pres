import { SectionLayout } from "../components/SectionLayout";
import { Panel } from "../components/Panel";

const panels = [
  { id: "intro", title: "Fiserv AI Documentation Agent" },
  { id: "problem", title: "The Problem" },
  { id: "approach", title: "The Approach" },
  { id: "architecture", title: "Architecture" },
  { id: "team", title: "Working With the Team" },
  { id: "emerged", title: "What Emerged" },
  { id: "results", title: "The Results" },
  { id: "takeaway", title: "Key Takeaway" },
];

export default function FiservPage() {
  return (
    <SectionLayout title="Fiserv Deep Dive">
      {panels.map((p, i) => (
        <Panel key={p.id} id={p.id} title={p.title}>
          {i === 0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <span className="text-accent/50 text-sm font-medium tracking-widest uppercase">
                Case Study 01
              </span>
              <h1 className="font-serif text-5xl tracking-tight leading-tight">
                {p.title}
              </h1>
              <p className="text-muted text-xl max-w-lg">
                Re-imagining customer service at a Fortune 500 fintech
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <span className="text-accent/30 text-sm font-medium tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="text-4xl font-semibold tracking-tight">
                {p.title}
              </h2>
              <p className="text-muted text-xl mt-2">
                Content coming soon
              </p>
            </div>
          )}
        </Panel>
      ))}
    </SectionLayout>
  );
}
