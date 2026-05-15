import { useState, useCallback } from "react";
import { useSupabaseCRUD } from "../../hooks/useSupabaseCRUD";
import { useAlertContext } from "../AlertProvider";
import { useAuth } from "../AuthProvider";
import { VALIDATION, CONSTANTS } from "../../utils/constants";
import { primaryButton, inputStyle, resultStyle, spinnerStyle } from "../../styles/globals.css";

interface FFPDoseEstimatorProps {
  patientId: string;
}

export function FFPDoseEstimator({ patientId }: FFPDoseEstimatorProps) {
  const [ffpWeight, setFfpWeight] = useState("");
  const [ffpResult, setFfpResult] = useState<number | null>(null);

  const { loading, saveCase } = useSupabaseCRUD();
  const { addAlert } = useAlertContext();
  const { user } = useAuth();

  const calcFFP = useCallback(async () => {
    const w = VALIDATION.parseNumeric(ffpWeight);

    if (w === null) {
      addAlert("❌ Invalid input. Please enter a valid weight.", "error", {
        dismissible: true,
        autoClose: false,
      });
      return;
    }

    const volume = w * CONSTANTS.FFP_MULTIPLIER;
    setFfpResult(volume);

    await saveCase(
      "FFP",
      { weight: w },
      `Required Volume: ${volume.toFixed(0)} mL`,
      user?.id || null,
      patientId || null,
      addAlert
    );
  }, [ffpWeight, addAlert, user?.id, patientId, saveCase]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); calcFFP(); }}>
      <h3>FFP Volume Calculation</h3>

      <label style={{ display: "block", marginBottom: 8 }}>
        Weight (kg):
        <input
          placeholder="e.g., 70"
          value={ffpWeight}
          onChange={(e) => setFfpWeight(e.target.value)}
          style={inputStyle}
          type="number"
          inputMode="decimal"
          aria-label="Patient weight in kilograms"
          required
        />
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
          "Calculate"
        )}
      </button>

      {ffpResult !== null && (
        <div style={resultStyle} role="status">
          ✅ Required Volume: {ffpResult.toFixed(0)} mL
        </div>
      )}
    </form>
  );
}
