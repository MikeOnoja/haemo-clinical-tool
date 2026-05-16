import { useFFPDose } from "../../hooks/useFFPDose";

import { ClinicalInput } from "../clinical-ui/ClinicalInput";
import { ClinicalButton } from "../clinical-ui/ClinicalButton";
import { ClinicalCheckbox } from "../clinical-ui/ClinicalCheckbox";
import { ResultPanel } from "../clinical-ui/ResultPanel";
import { LoadingOverlay } from "../clinical-ui/LoadingOverlay";

interface Props {
  patientId: string;
}

export function FFPDoseEstimator({ patientId }: Props) {
  const {
    weight,
    setWeight,
    inr,
    setInr,
    bleeding,
    setBleeding,
    result,
    loading,
    assess,
  } = useFFPDose(patientId);

  return (
    <div>
      <h3>FFP Coagulation Intelligence Engine</h3>

      <ClinicalInput
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <ClinicalInput
        type="number"
        step="0.1"
        placeholder="INR"
        value={inr}
        onChange={(e) => setInr(e.target.value)}
      />

      <ClinicalCheckbox
        checked={bleeding}
        onChange={(e) => setBleeding(e.target.checked)}
        label="Active bleeding"
      />

      <ClinicalButton onClick={assess} disabled={loading}>
        Assess FFP Requirement
      </ClinicalButton>

      {loading && <LoadingOverlay />}

      {result && (
        <ResultPanel>
          {typeof result === "string" ? (
            <p>{result}</p>
          ) : (
            <>
              <h4>{result.title}</h4>
          <p>{result.message}</p>

          <hr />

          <p>🧠 Severity: {result.severity}</p>
          <p>📊 Indication: {result.indication}</p>

          <p>💉 Dose:</p>
          <ul>
            <li>Units: {result.units}</li>
            <li>Volume: {result.volumeMl} mL</li>
          </ul>

          <p>⏱ Urgency: {result.urgency}</p>
            </>
          )}
        </ResultPanel>
      )}
    </div>
  );
}