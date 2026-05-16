import { useINRReversal } from "../../hooks/useINRReversal";
import { inputStyle, primaryButton, resultStyle } from "../../styles/globals.css";

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
      <h3>INR Reversal Assessment</h3>

      <input
        placeholder="INR value"
        value={inr}
        onChange={(e) => setInr(e.target.value)}
        style={inputStyle}
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

      <button
        onClick={assessINR}
        style={primaryButton}
        disabled={loading}
      >
        {loading ? "Processing..." : "Assess INR"}
      </button>

      {result && (
        <div style={resultStyle}>
          {result}
        </div>
      )}
    </div>
  );
}