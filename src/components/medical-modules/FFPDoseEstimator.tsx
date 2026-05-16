import { useFFPDose } from "../../hooks/useFFPDose";

import {
  inputStyle,
  primaryButton,
  resultStyle,
} from "../../styles/globals.css";

interface Props {
  patientId: string;
}

export function FFPDoseEstimator({
  patientId,
}: Props) {
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
      <h3>FFP Dose Estimator</h3>

      <label>
        Weight (kg)

        <input
          type="number"
          placeholder="e.g. 70"
          value={weight}
          onChange={(e) =>
            setWeight(e.target.value)
          }
          style={inputStyle}
        />
      </label>

      <label>
        INR

        <input
          type="number"
          step="0.1"
          placeholder="e.g. 2.5"
          value={inr}
          onChange={(e) =>
            setInr(e.target.value)
          }
          style={inputStyle}
        />
      </label>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 12,
        }}
      >
        <input
          type="checkbox"
          checked={bleeding}
          onChange={(e) =>
            setBleeding(e.target.checked)
          }
        />

        Active bleeding
      </label>

      <br />

      <button
        onClick={assess}
        style={primaryButton}
        disabled={loading}
      >
        {loading
          ? "Processing..."
          : "Assess FFP"}
      </button>

      {result && (
        <div style={resultStyle}>
          {result}
        </div>
      )}
    </div>
  );
}