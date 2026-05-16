import { usePlateletDecision } from "../../hooks/usePlateletDecision";
import { inputStyle, primaryButton, resultStyle } from "../../styles/globals.css";

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
      <h3>Platelet Transfusion Decision</h3>

      <input
        type="number"
        placeholder="Platelet count"
        value={plateletCount}
        onChange={(e) => setPlateletCount(e.target.value)}
        style={inputStyle}
      />

      <label>
        <input type="checkbox" checked={bleeding} onChange={(e) => setBleeding(e.target.checked)} />
        Active bleeding
      </label>

      <br />

      <label>
        <input type="checkbox" checked={procedure} onChange={(e) => setProcedure(e.target.checked)} />
        Planned procedure
      </label>

      <br />

      <label>
        <input type="checkbox" checked={oncology} onChange={(e) => setOncology(e.target.checked)} />
        Oncology patient
      </label>

      <br /><br />

      <button onClick={assess} style={primaryButton} disabled={loading}>
        {loading ? "Processing..." : "Assess Platelets"}
      </button>

      {result && <div style={resultStyle}>{result}</div>}
    </div>
  );
}