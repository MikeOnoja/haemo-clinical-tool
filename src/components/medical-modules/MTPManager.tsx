import { useState, useCallback } from "react";
import { useSupabaseCRUD } from "../../hooks/useSupabaseCRUD";
import { useAlertContext } from "../AlertProvider";
import { useAuth } from "../AuthProvider";
import { primaryButton, inputStyle, resultStyle, spinnerStyle } from "../../styles/globals.css";

interface MTPManagerProps {
  patientId: string;
}

export function MTPManager({ patientId }: MTPManagerProps) {
  const [mtpScenario, setMtpScenario] = useState("");
  const [mtpDecision, setMtpDecision] = useState("");

  const { loading, saveCase } = useSupabaseCRUD();
  const { addAlert } = useAlertContext();
  const { user } = useAuth();

  const assessMTP = useCallback(async () => {
    const scenario = mtpScenario.trim().toLowerCase();

    if (!scenario) {
      addAlert("ℹ️ Please enter a bleeding scenario", "info", { dismissible: true, autoClose: true });
      return;
    }

    let result = "";

    if (scenario.includes("trauma") || scenario.includes("massive")) {
      result = "Activate MTP: PRBC + FFP + Platelets in balanced ratio (1:1:1).";
    } else if (scenario.includes("obstetric") || scenario.includes("pph")) {
      result = "PPH MTP: Start uterotonics + PRBC + FFP, consider tranexamic acid early.";
    } else if (scenario.includes("gi bleed")) {
      result = "GI bleed: PRBC first, then FFP guided by INR.";
    } else {
      addAlert("⚠️ Select a valid bleeding scenario (trauma, obstetric, GI bleed)", "warning", {
        dismissible: true,
        autoClose: true,
      });
      return;
    }

    setMtpDecision(result);
    await saveCase(
      "MTP",
      { scenario },
      result,
      user?.id || null,
      patientId || null,
      addAlert
    );
  }, [mtpScenario, addAlert, user?.id, patientId, saveCase]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); assessMTP(); }}>
      <h3>Massive Transfusion Protocol</h3>

      <label style={{ display: "block", marginBottom: 8 }}>
        Bleeding Scenario:
        <input
          placeholder="e.g., trauma, obstetric, GI bleed"
          value={mtpScenario}
          onChange={(e) => setMtpScenario(e.target.value)}
          style={inputStyle}
          aria-label="Describe the bleeding scenario"
          required
        />
      </label>

      <p style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
        Valid scenarios: trauma, massive, obstetric, PPH, GI bleed
      </p>

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
          "Activate MTP"
        )}
      </button>

      {mtpDecision && (
        <div style={resultStyle} role="status">
          {mtpDecision}
        </div>
      )}
    </form>
  );
}
