import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "./supabase";

// =========================================
// TYPES
// =========================================
interface User {
  id: string;
  email?: string;
}

type TabType = "factor8" | "platelets" | "ffp" | "inr" | "mtp";
type AlertType = "success" | "error" | "info" | "warning";

interface AlertState {
  id: string;
  message: string;
  type: AlertType;
  dismissible?: boolean;
  autoClose?: boolean;
}

// =========================================
// CONSTANTS
// =========================================
const CONSTANTS = {
  ALERT_TIMEOUT_MS: 5000,
  AUTO_CLOSE_ALERT_TIMEOUT_MS: 4000,
  FACTOR_VIII_CONSTANT: 0.5,
  FFP_MULTIPLIER: 12,
  INR_CRITICAL_THRESHOLD: 20,
  INR_HIGH_THRESHOLD: 5,
  INR_MODERATE_THRESHOLD: 2,
  PLATELET_MAX_REALISTIC: 1000,
  PLATELET_URGENT: 10,
  PLATELET_TRANSFUSION_WITH_BLEEDING: 50,
  PLATELET_CONSIDER_TRANSFUSION: 20,
} as const;

const ERROR_MESSAGES = {
  SAVE_FAILED: "Failed to save case. Please check your internet connection and try again.",
  UNEXPECTED_ERROR: "An unexpected error occurred. Please try again.",
  INVALID_INPUT: "Invalid input. Please enter valid numbers.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  AUTH_ERROR: "Authentication error. Please log in again.",
  VALIDATION_FAILED: "Validation failed. Please check your inputs.",
} as const;

const SUCCESS_MESSAGES = {
  SAVED: "Case saved successfully!",
  CALCULATED: "Calculation completed!",
} as const;

const VALIDATION = {
  isValidNumber: (value: string): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num);
  },
  parseNumeric: (value: string): number | null => {
    const num = parseFloat(value);
    return isNaN(num) || !isFinite(num) ? null : num;
  },
} as const;

// =========================================
// CUSTOM HOOKS
// =========================================
function useAlert() {
  const [alerts, setAlerts] = useState<AlertState[]>([]);
  const timeoutRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const generateId = useCallback(() => `alert-${Date.now()}-${Math.random()}`, []);

  const addAlert = useCallback(
    (message: string, type: AlertType = "info", options?: { dismissible?: boolean; autoClose?: boolean }) => {
      const id = generateId();
      const dismissible = options?.dismissible !== false;
      const autoClose = options?.autoClose !== false;

      setAlerts((prev) => [...prev, { id, message, type, dismissible, autoClose }]);

      if (autoClose) {
        const timeout = setTimeout(() => {
          removeAlert(id);
        }, type === "error" ? CONSTANTS.ALERT_TIMEOUT_MS : CONSTANTS.AUTO_CLOSE_ALERT_TIMEOUT_MS);

        timeoutRef.current.set(id, timeout);
      }
    },
    [generateId]
  );

  const removeAlert = useCallback((id: string) => {
    const timeout = timeoutRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRef.current.delete(id);
    }
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const clearAllAlerts = useCallback(() => {
    timeoutRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutRef.current.clear();
    setAlerts([]);
  }, []);

  // Legacy interface for compatibility
  const showAlert = useCallback(
    (message: string, type: AlertType = "info") => {
      addAlert(message, type, { dismissible: true, autoClose: type !== "error" });
    },
    [addAlert]
  );

  return { alerts, addAlert, removeAlert, clearAllAlerts, showAlert };
}

export default function App() {

  // =========================================
  // AUTH
  // =========================================
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();
  }, []);

  // =========================================
  // GLOBAL UI
  // =========================================
  const [tab, setTab] = useState<TabType>("factor8");
  const [darkMode, setDarkMode] = useState(false);
  const { alerts, addAlert, removeAlert } = useAlert();

  // =========================================
  // PATIENT
  // =========================================
  const [patientId, setPatientId] = useState("");

  // =========================================
  // LOADING
  // =========================================
  const [loading, setLoading] = useState(false);

  // =========================================
  // MTP
  // =========================================
  const [mtpScenario, setMtpScenario] = useState("");
  const [mtpDecision, setMtpDecision] = useState("");

  // =========================================
  // INR
  // =========================================
  const [inr, setInr] = useState("");
  const [bleedingInr, setBleedingInr] = useState(false);
  const [procedureUrgent, setProcedureUrgent] = useState(false);
  const [inrDecision, setInrDecision] = useState("");

  // =========================================
  // FACTOR VIII
  // =========================================
  const [weight, setWeight] = useState("");
  const [rise, setRise] = useState("");
  const [factorDose, setFactorDose] = useState<number | null>(null);

  // =========================================
  // PLATELETS
  // =========================================
  const [plateletCount, setPlateletCount] = useState("");
  const [bleeding, setBleeding] = useState(false);
  const [decision, setDecision] = useState("");

  // =========================================
  // FFP
  // =========================================
  const [ffpWeight, setFfpWeight] = useState("");
  const [ffpResult, setFfpResult] = useState<number | null>(null);

  // =========================================
  // SAVE TO SUPABASE
  // =========================================
  const saveCase = useCallback(
    async (module: string, inputData: Record<string, any>, result: string) => {
      try {
        setLoading(true);

        const { error } = await supabase.from("clinical_cases").insert([
          {
            user_id: user?.id || null,
            patient_id: patientId || null,
            module,
            input_data: inputData,
            result,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) {
          console.error("Supabase error:", error.message);
          let errorMsg: string = ERROR_MESSAGES.SAVE_FAILED;
          
          if (error.message.includes("ForeignKeyViolation")) {
            errorMsg = "Invalid patient ID. Please verify and try again.";
          } else if (error.message.includes("connection")) {
            errorMsg = ERROR_MESSAGES.NETWORK_ERROR;
          } else if (error.message.includes("permission")) {
            errorMsg = ERROR_MESSAGES.AUTH_ERROR;
          }
          
          addAlert(`❌ ${errorMsg}`, "error", { dismissible: true, autoClose: false });
        } else {
          addAlert(`✅ ${SUCCESS_MESSAGES.SAVED}`, "success", { dismissible: true, autoClose: true });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("Error saving case:", errorMessage);
        
        let errorMsg: string = ERROR_MESSAGES.UNEXPECTED_ERROR;
        if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
          errorMsg = ERROR_MESSAGES.NETWORK_ERROR;
        }
        
        addAlert(`❌ ${errorMsg}`, "error", { dismissible: true, autoClose: false });
      } finally {
        setLoading(false);
      }
    },
    [user?.id, patientId, addAlert]
  );

  // =========================================
  // MTP
  // =========================================
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
      addAlert("⚠️ Select a valid bleeding scenario (trauma, obstetric, GI bleed)", "warning", { dismissible: true, autoClose: true });
      return;
    }

    setMtpDecision(result);
    await saveCase("MTP", { scenario }, result);
  }, [mtpScenario, addAlert, saveCase]);

  // =========================================
  // INR
  // =========================================
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
      result
    );
  }, [inr, bleedingInr, procedureUrgent, saveCase]);

  // =========================================
  // FACTOR VIII
  // =========================================
  const calcFactor8 = useCallback(async () => {
    const w = VALIDATION.parseNumeric(weight);
    const r = VALIDATION.parseNumeric(rise);

    if (w === null || r === null) {
      addAlert("❌ Invalid input. Please enter valid numbers.", "error", { dismissible: true, autoClose: false });
      return;
    }

    const dose = w * r * CONSTANTS.FACTOR_VIII_CONSTANT;
    setFactorDose(dose);

    await saveCase(
      "Factor VIII",
      { weight: w, rise: r },
      `Required Dose: ${dose.toFixed(2)} IU`
    );
  }, [weight, rise, addAlert, saveCase]);

  // =========================================
  // PLATELETS
  // =========================================
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
      result
    );
  }, [plateletCount, bleeding, saveCase]);

  // =========================================
  // FFP
  // =========================================
  const calcFFP = useCallback(async () => {
    const w = VALIDATION.parseNumeric(ffpWeight);

    if (w === null) {
      addAlert("❌ Invalid input. Please enter a valid weight.", "error", { dismissible: true, autoClose: false });
      return;
    }

    const volume = w * CONSTANTS.FFP_MULTIPLIER;
    setFfpResult(volume);

    await saveCase(
      "FFP",
      { weight: w },
      `Required Volume: ${volume.toFixed(0)} mL`
    );
  }, [ffpWeight, addAlert, saveCase]);

  // =========================================
  // THEME
  // =========================================
  const themeColors = useMemo(() => ({
    bg: darkMode ? "#0f172a" : "#eef2f6",
    card: darkMode ? "#1e293b" : "white",
    text: darkMode ? "white" : "black",
  }), [darkMode]);

  // =========================================
  // UI
  // =========================================
  return (
    <div
      style={{
        fontFamily: "Arial",
        background: themeColors.bg,
        color: themeColors.text,
        minHeight: "100vh",
        padding: 12,
        maxWidth: 500,
        margin: "0 auto"
      }}
      role="main"
    >

      {/* HEADER */}
      <header
        style={{
          background: "#2563eb",
          color: "white",
          padding: 18,
          borderRadius: 10
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>🧠 Clinical Hematology Decision System</h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={primaryButton}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      {/* ALERTS CONTAINER */}
      <div
        style={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {alerts.map((alert) => {
          const alertConfig = {
            error: { bg: "#fee2e2", text: "#991b1b", border: "#dc2626" },
            success: { bg: "#dcfce7", text: "#166534", border: "#22c55e" },
            warning: { bg: "#fef3c7", text: "#92400e", border: "#f59e0b" },
            info: { bg: "#dbeafe", text: "#1e40af", border: "#2563eb" },
          }[alert.type];

          return (
            <div
              key={alert.id}
              role="alert"
              style={{
                padding: 12,
                borderRadius: 8,
                background: alertConfig.bg,
                fontWeight: "bold",
                color: alertConfig.text,
                borderLeft: `4px solid ${alertConfig.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                animation: "slideIn 0.3s ease-out",
              }}
            >
              <span style={{ flex: 1 }}>{alert.message}</span>
              {alert.dismissible && (
                <button
                  onClick={() => removeAlert(alert.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: alertConfig.text,
                    cursor: "pointer",
                    fontSize: 18,
                    padding: "0 4px",
                    lineHeight: 1,
                  }}
                  aria-label="Close alert"
                  title="Close"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* PATIENT ID */}
      <label style={{ display: "block", marginTop: 12 }}>
        Patient ID:
        <input
          placeholder="Enter patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          style={inputStyle}
          aria-label="Patient ID"
          type="text"
        />
      </label>

      {/* NAVIGATION */}
      <nav
        style={{
          marginTop: 15,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8
        }}
        aria-label="Assessment modules"
      >
        <button 
          onClick={() => setTab("factor8")} 
          style={{...buttonStyle, background: tab === "factor8" ? "#0f766e" : buttonStyle.background}}
          aria-pressed={tab === "factor8"}
        >
          Factor VIII
        </button>

        <button 
          onClick={() => setTab("platelets")} 
          style={{...buttonStyle, background: tab === "platelets" ? "#0f766e" : buttonStyle.background}}
          aria-pressed={tab === "platelets"}
        >
          Platelets
        </button>

        <button 
          onClick={() => setTab("ffp")} 
          style={{...buttonStyle, background: tab === "ffp" ? "#0f766e" : buttonStyle.background}}
          aria-pressed={tab === "ffp"}
        >
          FFP
        </button>

        <button 
          onClick={() => setTab("inr")} 
          style={{...buttonStyle, background: tab === "inr" ? "#0f766e" : buttonStyle.background}}
          aria-pressed={tab === "inr"}
        >
          INR
        </button>

        <button 
          onClick={() => setTab("mtp")} 
          style={{...buttonStyle, background: tab === "mtp" ? "#0f766e" : buttonStyle.background}}
          aria-pressed={tab === "mtp"}
        >
          MTP
        </button>
      </nav>

      {/* MAIN PANEL */}
      <section
        style={{
          marginTop: 20,
          background: themeColors.card,
          padding: 25,
          borderRadius: 12
        }}
      >

        {/* FACTOR VIII */}
        {tab === "factor8" && (
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
              style={{...primaryButton, opacity: loading ? 0.7 : 1}}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? <>
                <span style={spinnerStyle} />
                Saving...
              </> : "Calculate"}
            </button>

            {factorDose !== null && (
              <div style={resultStyle} role="status">
                ✅ Required Dose: {factorDose.toFixed(2)} IU
              </div>
            )}
          </form>
        )}

        {/* PLATELETS */}
        {tab === "platelets" && (
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
              style={{...primaryButton, opacity: loading ? 0.7 : 1}}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? <>
                <span style={spinnerStyle} />
                Saving...
              </> : "Assess"}
            </button>

            {decision && (
              <div style={resultStyle} role="status">
                {decision}
              </div>
            )}
          </form>
        )}

        {/* FFP */}
        {tab === "ffp" && (
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
              style={{...primaryButton, opacity: loading ? 0.7 : 1}}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? <>
                <span style={spinnerStyle} />
                Saving...
              </> : "Calculate"}
            </button>

            {ffpResult !== null && (
              <div style={resultStyle} role="status">
                ✅ Required Volume: {ffpResult.toFixed(0)} mL
              </div>
            )}
          </form>
        )}

        {/* INR */}
        {tab === "inr" && (
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
              style={{...primaryButton, opacity: loading ? 0.7 : 1}}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? <>
                <span style={spinnerStyle} />
                Saving...
              </> : "Assess INR"}
            </button>

            {inrDecision && (
              <div style={resultStyle} role="status">
                {inrDecision}
              </div>
            )}
          </form>
        )}

        {/* MTP */}
        {tab === "mtp" && (
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
              style={{...primaryButton, opacity: loading ? 0.7 : 1}}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? <>
                <span style={spinnerStyle} />
                Saving...
              </> : "Activate MTP"}
            </button>

            {mtpDecision && (
              <div style={resultStyle} role="status">
                {mtpDecision}
              </div>
            )}
          </form>
        )}

      </section>
    </div>
  );
}

// =========================================
// STYLES
// =========================================

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: 12,
  marginTop: 10,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  fontSize: 16,
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const primaryButton: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.2s ease",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

const buttonStyle: React.CSSProperties = {
  padding: "10px",
  borderRadius: 8,
  border: "none",
  background: "#1e293b",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const resultStyle: React.CSSProperties = {
  marginTop: 15,
  padding: 12,
  borderRadius: 8,
  background: "#dbeafe",
  fontWeight: "bold",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const spinnerStyle: React.CSSProperties = {
  display: "inline-block",
  width: 14,
  height: 14,
  border: "2px solid rgba(255, 255, 255, 0.3)",
  borderTop: "2px solid white",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

// Global animation styles (injected into page)
if (typeof document !== "undefined" && !document.getElementById("spinner-styles")) {
  const style = document.createElement("style");
  style.id = "spinner-styles";
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes slideIn {
      from { 
        opacity: 0;
        transform: translateY(-10px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}