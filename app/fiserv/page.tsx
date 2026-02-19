import { SectionLayout } from "../components/SectionLayout";
import { Panel } from "../components/Panel";
import { WorkflowDiagram } from "./components/WorkflowDiagram";
import { DiscoverySteps } from "./components/DiscoverySteps";
import { ArchitectureDiagram } from "./components/ArchitectureDiagram";
import { EvalPillars } from "./components/EvalPillars";
import { TeamQuotes } from "./components/TeamQuotes";
import { RevealTransition } from "./components/RevealTransition";
import { ImpactMetrics } from "./components/ImpactMetrics";
import { IntroPanel } from "./components/IntroPanel";

const panels = [
  { id: "intro", title: "Reimagining Customer Service with AI" },
  { id: "problem", title: "The Old Way" },
  { id: "approach", title: "Discovery First" },
  { id: "architecture", title: "The System We Built" },
  { id: "eval", title: "Measuring Everything" },
  { id: "team", title: "Built With Them, Not For Them" },
  { id: "emerged", title: "What We Didn't Expect" },
  { id: "results", title: "The Impact" },
];

const panelContent: Record<string, React.ReactNode> = {
  intro: <IntroPanel />,
  problem: (
    <PanelShell number="02" title="The Old Way">
      <WorkflowDiagram />
    </PanelShell>
  ),
  approach: (
    <PanelShell number="03" title="Discovery First">
      <DiscoverySteps />
    </PanelShell>
  ),
  architecture: (
    <PanelShell number="04" title="The System We Built">
      <ArchitectureDiagram />
    </PanelShell>
  ),
  eval: (
    <PanelShell number="05" title="Measuring Everything" subtitle="Before building anything, we got their hardest questions.">
      <EvalPillars />
    </PanelShell>
  ),
  team: (
    <PanelShell number="06" title="Built With Them, Not For Them">
      <TeamQuotes />
    </PanelShell>
  ),
  emerged: (
    <PanelShell number="07" title="What We Didn't Expect">
      <RevealTransition />
    </PanelShell>
  ),
  results: (
    <PanelShell number="08" title="The Impact">
      <ImpactMetrics />
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
        <span className="font-mono text-accent/30 text-sm tracking-wider">
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

export default function FiservPage() {
  return (
    <SectionLayout title="Fiserv Deep Dive">
      {panels.map((p) => (
        <Panel key={p.id} id={p.id} title={p.title}>
          {panelContent[p.id]}
        </Panel>
      ))}
    </SectionLayout>
  );
}
