import { useState } from "react";
import { useFactor8 } from "../../hooks/useFactor8";

import { ClinicalInput } from "../clinical-ui/ClinicalInput";
import { ClinicalSelect } from "../clinical-ui/ClinicalSelect";
import { ClinicalButton } from "../clinical-ui/ClinicalButton";
import { ResultPanel } from "../clinical-ui/ResultPanel";
import { LoadingOverlay } from "../clinical-ui/LoadingOverlay";

export function Factor8Calculator({ patientId }: { patientId: string }) {
  const { result, loading, run } = useFactor8(patientId);

  const [weightKg, setWeightKg] = useState("");
  const [currentLevel, setCurrentLevel] = useState("");

  const [scenario, setScenario] = useState<
    "no_bleed" | "minor_bleed" | "major_bleed" | "minor_surgery" | "major_surgery"
  >("minor_bleed");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    run({
      weightKg: Number(weightKg),
      currentLevel: Number(currentLevel),
      scenario,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Factor VIII Clinical Dosing</h3>

      <ClinicalInput
        placeholder="Weight (kg)"
        value={weightKg}
        onChange={(e) => setWeightKg(e.target.value)}
      />

      <ClinicalInput
        placeholder="Current FVIII level (%)"
        value={currentLevel}
        onChange={(e) => setCurrentLevel(e.target.value)}
      />

      <ClinicalSelect
        value={scenario}
        onChange={(e) => setScenario(e.target.value as any)}
      >
        <option value="no_bleed">No bleeding / prophylaxis</option>
        <option value="minor_bleed">Minor bleeding</option>
        <option value="major_bleed">Major bleeding</option>
        <option value="minor_surgery">Minor surgery</option>
        <option value="major_surgery">Major surgery</option>
      </ClinicalSelect>

      <ClinicalButton type="submit" disabled={loading}>
        Calculate
      </ClinicalButton>

      {loading && <LoadingOverlay />}

      {result && (
        <ResultPanel>
          <h4>{result.message}</h4>
          <p>Target: {result.targetLevel}%</p>
          <p>Required rise: {result.requiredRise}%</p>

          {result.warning && (
            <p style={{ color: "red" }}>{result.warning}</p>
          )}
        </ResultPanel>
      )}
    </form>
  );
}