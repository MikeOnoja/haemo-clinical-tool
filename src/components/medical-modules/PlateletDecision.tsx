import { usePlateletDecision } from "../../hooks/usePlateletDecision";

import { ClinicalInput } from "../clinical-ui/ClinicalInput";
import { ClinicalButton } from "../clinical-ui/ClinicalButton";
import { ClinicalCheckbox } from "../clinical-ui/ClinicalCheckbox";
import { ResultPanel } from "../clinical-ui/ResultPanel";
import { LoadingOverlay } from "../clinical-ui/LoadingOverlay";

interface Props {
  patientId: string;
}

export function PlateletDecision({ patientId }: Props) {
  const {
    plateletCount,
    setPlateletCount,
    bleeding,
    setBleeding,
    procedure,
    setProcedure,
    oncology,
    setOncology,
    result,
    loading,
    assess,
  } = usePlateletDecision(patientId);

  return (
    <div>
      <h3>Platelet Transfusion Decision Engine</h3>

      <ClinicalInput
        type="number"
        placeholder="Platelet count"
        value={plateletCount}
        onChange={(e) => setPlateletCount(e.target.value)}
      />

      <ClinicalCheckbox
        label="Active bleeding"
        checked={bleeding}
        onChange={(e) => setBleeding(e.target.checked)}
      />

      <ClinicalCheckbox
        label="Planned procedure"
        checked={procedure}
        onChange={(e) => setProcedure(e.target.checked)}
      />

      <ClinicalCheckbox
        label="Oncology patient"
        checked={oncology}
        onChange={(e) => setOncology(e.target.checked)}
      />

      <ClinicalButton onClick={assess} disabled={loading}>
        Assess Platelet Requirement
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

              <p>💉 Recommendation:</p>
              <ul>
                {result.actions?.map((a: string, i: number) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>

              {result.warning && (
                <p style={{ color: "red" }}>{result.warning}</p>
              )}
            </>
          )}
        </ResultPanel>
      )}
    </div>
  );
}