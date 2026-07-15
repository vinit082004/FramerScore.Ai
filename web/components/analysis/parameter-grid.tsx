import type { ParameterResult } from "@/lib/types";
import { PARAMETER_ICONS } from "@/lib/scoring/parameter-icons";
import { ParameterGridCard } from "@/components/analysis/parameter-grid-card";

export function ParameterGrid({ parameters }: { parameters: ParameterResult[] }) {
  const detailParameters = parameters.filter((p) => p.id !== "overall_suitability");

  return (
    <div className="grid grid-cols-2 gap-5">
      {detailParameters.map((parameter) => (
        <ParameterGridCard key={parameter.id} parameter={parameter} icon={PARAMETER_ICONS[parameter.id]} />
      ))}
    </div>
  );
}
