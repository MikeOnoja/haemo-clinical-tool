import { useState, useCallback } from "react";
import { useSupabaseCRUD } from "../../hooks/useSupabaseCRUD";
import { useAlertContext } from "../AlertProvider";
import { useAuth } from "../AuthProvider";
import { VALIDATION, CONSTANTS } from "../../utils/constants";
import { primaryButton, inputStyle, resultStyle, spinnerStyle } from "../../styles/globals.css";

interface INRReversalProps {
  patientId: string;
}

export function INRReversal({ patientId }: INRReversalProps) {
  const [inr, setInr] = useState("");
  const [bleedingInr, setBleedingInr] = useState(false);
  const [procedureUrgent, setProcedureUrgent] = useState(false);
  const [inrDecision, setInrDecision] = useState("");

  const { loading, saveCase } = useSupabaseCRUD();
  const { addAlert } = useAlertContext();
  const { user } = useAuth();

  const assessINR = useCallback(async () => {
    const parsedValue = VALIDATION.parseNumeric(inr);

    if (parsedValue === null) {
      setInrDecision("❌ Invalid INR value. Please enter a number.");
      return;
    }

    let result = "";

    if (parsedValue > CONSTANTS.INR_CRITICAL_THRESHOLD) {
      result = "🚨 CRITICAL ERROR: INR unrealistic";
    } else if (parsedValue >= CONSTANTS.INR_HIGH_THRESHOLD && bleedingInr) {
      result = "🚨 URGENT: PCC + Vitamin K required";
    } else if (parsedValue >= CONSTANTS.INR_HIGH_THRESHOLD) {
      result = "⚠️ High INR: hold anticoagulant";
    } else if (parsedValue >= CONSTANTS.INR_MODERATE_THRESHOLD && procedureUrgent) {
      result = "⚠️ Moderate risk: consider reversal";
    } else {
      result = "✅ No reversal required";
    }

    setInrDecision(result);
    await saveCase(
      "INR",
      { inr: parsedValue, bleeding: bleedingInr, urgentProcedure: procedureUrgent },
      result,
      user?.id || null,
      patientId || null,
      addAlert
    );
  }, [inr, bleedingInr, procedureUrgent, addAlert, user?.id, patientId, saveCase]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); assessINR(); }}>
      <h3>INR Reversal Assessment</h3>

      <label style={{ display: "block", marginBottom: 8 }}>
        INR value:
        <input
          placeholder="e.g., 3.5"
          value={inr}
          onChange={(e) => setInr(e.target.value)}
          style={inputStyle}
          type="number"
          inputMode="decimal"
          step="0.1"
          aria-label="INR value"
          required
        />
      </label>

      <fieldset style={{ border: "none", padding: 0, marginBottom: 12 }}>
        <legend style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8 }}>Clinical Status:</legend>

        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={bleedingInr}
            onChange={(e) => setBleedingInr(e.target.checked)}
            aria-label="Patient has active bleeding"
          />
          Active bleeding
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={procedureUrgent}
            onChange={(e) => setProcedureUrgent(e.target.checked)}
            aria-label="Urgent procedure planned"
          />
          Urgent procedure
        </label>
      </fieldset>

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
          "Assess INR"
        )}
      </button>

      {inrDecision && (
        <div style={resultStyle} role="status">
          {inrDecision}
        </div>
      )}
    </form>
  );
}
