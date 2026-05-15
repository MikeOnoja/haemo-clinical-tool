import { useState, useCallback } from "react";
import { useSupabaseCRUD } from "../../hooks/useSupabaseCRUD";
import { useAlertContext } from "../AlertProvider";
import { useAuth } from "../AuthProvider";
import { VALIDATION, CONSTANTS } from "../../utils/constants";
import { primaryButton, inputStyle, resultStyle, spinnerStyle } from "../../styles/globals.css";

interface Factor8CalculatorProps {
  patientId: string;
}

export function Factor8Calculator({ patientId }: Factor8CalculatorProps) {
  const [weight, setWeight] = useState("");
  const [rise, setRise] = useState("");
  const [factorDose, setFactorDose] = useState<number | null>(null);

  const { loading, saveCase } = useSupabaseCRUD();
  const { addAlert } = useAlertContext();
  const { user } = useAuth();

  const calcFactor8 = useCallback(async () => {
    const w = VALIDATION.parseNumeric(weight);
    const r = VALIDATION.parseNumeric(rise);

    if (w === null || r === null) {
      addAlert("❌ Invalid input. Please enter valid numbers.", "error", {
        dismissible: true,
        autoClose: false,
      });
      return;
    }

    const dose = w * r * CONSTANTS.FACTOR_VIII_CONSTANT;
    setFactorDose(dose);

    await saveCase(
      "Factor VIII",
      { weight: w, rise: r },
      `Required Dose: ${dose.toFixed(2)} IU`,
      user?.id || null,
      patientId || null,
      addAlert
    );
  }, [weight, rise, addAlert, user?.id, patientId, saveCase]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); calcFactor8(); }}>
      <h3>Factor VIII Dose Calculator</h3>

      <label style={{ display: "block", marginBottom: 8 }}>
        Weight (kg):
        <input
          placeholder="e.g., 70"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          style={inputStyle}
          type="number"
          inputMode="decimal"
          aria-label="Weight in kilograms"
          required
        />
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        Desired rise (%):
        <input
          placeholder="e.g., 100"
          value={rise}
          onChange={(e) => setRise(e.target.value)}
          style={inputStyle}
          type="number"
          inputMode="decimal"
          aria-label="Desired rise percentage"
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

      {factorDose !== null && (
        <div style={resultStyle} role="status">
          ✅ Required Dose: {factorDose.toFixed(2)} IU
        </div>
      )}
    </form>
  );
}

