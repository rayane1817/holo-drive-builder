import { useState } from "react";
import BuilderStep from "./BuilderStep";

export type Product = { id: string; name: string; url: string };
export interface Step {
  id: string;
  label: string;
  type: "choice-grid" | "choice-carousel" | "multi-select";
  products: Product[];
  isOptional?: boolean;
}
interface Props {
  steps: Step[];
  onComplete: (sel: Record<string, string | string[]>) => void;
}
export default function BuilderFlow({ steps, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [sel, setSel] = useState<Record<string, string | string[]>>({});
  const step = steps[index];
  const last = index === steps.length - 1;
  const canContinue = step.isOptional || sel[step.id] !== undefined;
  const onSelect = (id: string) => setSel({ ...sel, [step.id]: id });
  return (
    <div>
      <BuilderStep
        title={step.label}
        products={step.products}
        selectedId={sel[step.id] as string}
        onSelect={onSelect}
        layout={step.type === "choice-carousel" ? "carousel" : "grid"}
      />
      <div className="flex gap-4 mt-6">
        {index > 0 && (
          <button onClick={() => setIndex(index - 1)} className="px-4 py-2 rounded-lg border border-white/25">Back</button>
        )}
        <button
          disabled={!canContinue}
          onClick={() => (last ? onComplete(sel) : setIndex(index + 1))}
          className="px-4 py-2 rounded-lg bg-cyan-500 text-black disabled:opacity-40"
        >
          {last ? "Finish" : "Continue"}
        </button>
      </div>
    </div>
  );
}
