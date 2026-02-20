import { SectionLayout } from "../components/SectionLayout";
import { Panel } from "../components/Panel";
import { IntroPanel } from "./components/IntroPanel";
import { HypothesisPanel } from "./components/HypothesisPanel";
import { FrameworkPanel } from "./components/FrameworkPanel";
import { PipelinePanel } from "./components/PipelinePanel";
import { SignalsPanel } from "./components/SignalsPanel";
import { ResultsPanel } from "./components/ResultsPanel";
import { SignalAnalysisPanel } from "./components/SignalAnalysisPanel";
import { ProspectListPanel } from "./components/ProspectListPanel";
import { TakeawayPanel } from "./components/TakeawayPanel";

const panels = [
  { id: "intro", title: "Can AI Predict Your Next Customer?" },
  { id: "hypothesis", title: "The Hypothesis" },
  { id: "framework", title: "The Framework" },
  { id: "methodology", title: "The Pipeline" },
  { id: "signals", title: "The Signals" },
  { id: "results", title: "The Results" },
  { id: "signal-analysis", title: "Which Signals Mattered" },
  { id: "prospects", title: "Your Next Customers" },
  { id: "takeaway", title: "Key Takeaway" },
];

const panelContent: Record<string, React.ReactNode> = {
  intro: <IntroPanel />,
  hypothesis: (
    <PanelShell number="02" title="The Hypothesis" subtitle="The setup, the dataset, and the baseline to beat.">
      <HypothesisPanel />
    </PanelShell>
  ),
  framework: (
    <PanelShell number="03" title="The Framework" subtitle="How we thought about the problem before touching any tools.">
      <FrameworkPanel />
    </PanelShell>
  ),
  methodology: (
    <PanelShell number="04" title="The Pipeline" subtitle="Three steps, each using the right tool for the job.">
      <PipelinePanel />
    </PanelShell>
  ),
  signals: (
    <PanelShell number="05" title="The Signals" subtitle="10 observable data points, weighted by conviction.">
      <SignalsPanel />
    </PanelShell>
  ),
  results: (
    <PanelShell number="06" title="The Results" subtitle="Did the model beat 20%?">
      <ResultsPanel />
    </PanelShell>
  ),
  "signal-analysis": (
    <PanelShell number="07" title="Which Signals Mattered" subtitle="What worked, what didn't, and why.">
      <SignalAnalysisPanel />
    </PanelShell>
  ),
  prospects: (
    <PanelShell number="08" title="Your Next Customers" subtitle="The top non-customer companies the model flagged.">
      <ProspectListPanel />
    </PanelShell>
  ),
  takeaway: (
    <PanelShell number="09" title="Key Takeaway">
      <TakeawayPanel />
    </PanelShell>
  ),
};

function PanelShell({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-accent text-sm tracking-wider">
          {number}
        </span>
        <h2 className="text-4xl font-semibold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-secondary text-lg mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function ExperimentPage() {
  return (
    <SectionLayout title="Customer Prediction Experiment">
      {panels.map((p) => (
        <Panel key={p.id} id={p.id} title={p.title}>
          {panelContent[p.id]}
        </Panel>
      ))}
    </SectionLayout>
  );
}
