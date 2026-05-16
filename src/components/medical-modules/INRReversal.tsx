import { useINRReversal } from "../../hooks/useINRReversal";

import { ClinicalInput } from "../clinical-ui/ClinicalInput";
import { ClinicalButton } from "../clinical-ui/ClinicalButton";
import { ResultPanel } from "../clinical-ui/ResultPanel";
import { LoadingOverlay } from "../clinical-ui/LoadingOverlay";

interface Props {
  patientId: string;
}

export function INRReversal({ patientId }: Props) {
  const {
    inr,
    setInr,
    bleedingInr,
    setBleedingInr,
    procedureUrgent,
    setProcedureUrgent,
    result,
    loading,
    assessINR,
  } = useINRReversal(patientId);

  return (
    <div>
      <h3>Anticoagulant Reversal Engine</h3>

      <ClinicalInput
        placeholder="INR value"
        value={inr}
        onChange={(e) => setInr(e.target.value)}
        type="number"
      />

      <label>
        <input
          type="checkbox"
          checked={bleedingInr}
          onChange={(e) => setBleedingInr(e.target.checked)}
        />
        Active bleeding
      </label>

      <br />

      <label>
        <input
          type="checkbox"
          checked={procedureUrgent}
          onChange={(e) => setProcedureUrgent(e.target.checked)}
        />
        Urgent procedure
      </label>

      <br /><br />

      <ClinicalButton onClick={assessINR} disabled={loading}>
        Assess Anticoagulation Status
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

          <p>🧠 Risk: {result.riskLevel}</p>
          <p>⏱ Timing: {result.urgency}</p>

          <p>💊 Recommended action:</p>
          <ul>
            {result.actions?.map((a: string, i: number) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
            </>
          )}
        </ResultPanel>
      )}
    </div>
  );
}