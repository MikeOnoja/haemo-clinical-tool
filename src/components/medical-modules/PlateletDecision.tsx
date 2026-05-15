import { useState, useCallback } from "react";
import { useSupabaseCRUD } from "../../hooks/useSupabaseCRUD";
import { useAlertContext } from "../AlertProvider";
import { useAuth } from "../AuthProvider";
import { VALIDATION, CONSTANTS } from "../../utils/constants";
import { primaryButton, inputStyle, resultStyle, spinnerStyle } from "../../styles/globals.css";

interface PlateletDecisionProps {
  patientId: string;
}

export function PlateletDecision({ patientId }: PlateletDecisionProps) {
  const [plateletCount, setPlateletCount] = useState("");
  const [bleeding, setBleeding] = useState(false);
  const [decision, setDecision] = useState("");

  const { loading, saveCase } = useSupabaseCRUD();
  const { addAlert } = useAlertContext();
  const { user } = useAuth();

  const assessPlatelets = useCallback(async () => {
    const pl = VALIDATION.parseNumeric(plateletCount);

    if (pl === null) {
      setDecision("❌ Invalid platelet count. Please enter a number.");
      return;
    }

    let result = "";

    if (pl > CONSTANTS.PLATELET_MAX_REALISTIC) {
      result = "❌ ERROR: Platelet count unrealistic";
    } else if (pl < CONSTANTS.PLATELET_URGENT) {
      result = "🚨 URGENT transfusion recommended";
    } else if (pl < CONSTANTS.PLATELET_TRANSFUSION_WITH_BLEEDING && bleeding) {
      result = "⚠️ Transfusion recommended due to bleeding";
    } else if (pl < CONSTANTS.PLATELET_CONSIDER_TRANSFUSION) {
      result = "⚠️ Consider transfusion";
    } else {
      result = "✅ No transfusion required";
    }

    setDecision(result);
    await saveCase(
      "Platelets",
      { plateletCount: pl, bleeding },
      result,
      user?.id || null,
      patientId || null,
      addAlert
    );
  }, [plateletCount, bleeding, addAlert, user?.id, patientId, saveCase]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); assessPlatelets(); }}>
      <h3>Platelet Decision</h3>

      <label style={{ display: "block", marginBottom: 8 }}>
        Platelet count (per µL):
        <input
          placeholder="e.g., 50000"
          value={plateletCount}
          onChange={(e) => setPlateletCount(e.target.value)}
          style={inputStyle}
          type="number"
          inputMode="numeric"
          aria-label="Platelet count"
          required
        />
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <input
          type="checkbox"
          checked={bleeding}
          onChange={(e) => setBleeding(e.target.checked)}
          aria-label="Patient has active bleeding"
        />
        Active bleeding
      </label>

      <button
        type="submit"
        style={{ ...primaryButton, opacity: loading ? 0.7 : 1 }}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <span style={spinnerStyle} />
            Saving...
          </>
        ) : (
          "Assess"
        )}
      </button>

      {decision && (
        <div style={resultStyle} role="status">
          {decision}
        </div>
      )}
    </form>
  );
}
