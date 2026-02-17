import { SectionLayout } from "../components/SectionLayout";
import { Panel } from "../components/Panel";

const panels = [
  { id: "intro", title: "Can AI Predict Your Next Customer?" },
  { id: "hypothesis", title: "The Hypothesis" },
  { id: "framework", title: "The Framework" },
  { id: "methodology", title: "Methodology" },
  { id: "signals", title: "The Signals" },
  { id: "results", title: "Results" },
  { id: "signal-analysis", title: "Which Signals Mattered" },
  { id: "prospects", title: "Your Next Customers" },
  { id: "with-your-data", title: "With Your Data" },
  { id: "takeaway", title: "Key Takeaway" },
];

export default function ExperimentPage() {
  return (
    <SectionLayout title="Customer Prediction Experiment">
      {panels.map((p, i) => (
        <Panel key={p.id} id={p.id} title={p.title}>
          {i === 0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-5">
              <span className="font-mono text-accent text-sm tracking-widest uppercase">
                Case Study 02
              </span>
              <h1 className="font-serif text-6xl tracking-tight leading-tight">
                {p.title}
              </h1>
              <p className="text-secondary text-xl max-w-lg">
                A data-driven experiment predicting Glean customers from public signals
              </p>
              <div className="w-16 h-px mt-4 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <span className="font-mono text-accent/30 text-sm tracking-wider">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="text-5xl font-semibold tracking-tight">
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
