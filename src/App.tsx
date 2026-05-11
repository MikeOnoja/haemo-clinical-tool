import { useState } from "react";

export default function App() {

  const [mtpScenario, setMtpScenario] = useState("");
  const [mtpDecision, setMtpDecision] = useState("");

  const [inr, setInr] = useState("");
  const [bleedingInr, setBleedingInr] = useState(false);
  const [procedureUrgent, setProcedureUrgent] = useState(false);
  const [inrDecision, setInrDecision] = useState("");

  const [tab, setTab] = useState("factor8");

  // Factor VIII
  const [weight, setWeight] = useState("");
  const [rise, setRise] = useState("");
  const [factorDose, setFactorDose] = useState<number | null>(null);

  // Platelets
  const [plateletCount, setPlateletCount] = useState("");
  const [bleeding, setBleeding] = useState(false);
  const [decision, setDecision] = useState("");

  // FFP
  const [ffpWeight, setFfpWeight] = useState("");
  const [ffpResult, setFfpResult] = useState<number | null>(null);

  // --- FUNCTIONS ---

    function assessMTP() {
      const scenario = mtpScenario.toLowerCase();

      if (scenario.includes("trauma") || scenario.includes("massive")) {
        setMtpDecision(
          "Activate MTP: PRBC + FFP + Platelets in balanced ratio (1:1:1)."
        );
      }

      else if (scenario.includes("obstetric") || scenario.includes("pph")) {
        setMtpDecision(
          "PPH MTP: Start uterotonics + PRBC + FFP, consider tranexamic acid early."
        );
      }

      else if (scenario.includes("gi bleed")) {
        setMtpDecision(
          "GI bleed: PRBC first, then FFP guided by INR, consider endoscopic control."
        );
      }

      else {
        setMtpDecision("Select a valid bleeding scenario (trauma, PPH, GI bleed).");
      }
  }

  function assessINR() {
    const value = parseFloat(inr);

    if (isNaN(value)) {
      setInrDecision("Invalid INR value");
      return;
    }

    if (value > 20) {
      setInrDecision("CRITICAL ERROR: INR value unrealistic. Verify lab result.");
      return;
    }

    if (value >= 5 && bleedingInr) {
      setInrDecision("URGENT: PCC + Vitamin K required immediately");
    }

    else if (value >= 5) {
      setInrDecision("High INR: consider Vitamin K, hold anticoagulant");
    }

    else if (value >= 2 && procedureUrgent) {
      setInrDecision("Moderate risk: consider partial reversal");
    }

    else {
      setInrDecision("No reversal required");
    }
}

  function calcFactor8() {
    const w = parseFloat(weight);
    const r = parseFloat(rise);
    if (!w || !r) return;
    setFactorDose(w * r * 0.5);
  }

  function assessPlatelets() {
    const pl = parseFloat(plateletCount);

    if (isNaN(pl)) {
      setDecision("Invalid platelet count");
      return;
    }

    // Safety validation FIRST
    if (pl > 1000) {
      setDecision("ERROR: Platelet count not physiologically plausible");
      return;
    }

    if (pl < 10) {
      setDecision("URGENT transfusion recommended");
    } 
    
    else if (pl < 50 && bleeding) {
      setDecision("Transfusion recommended due to bleeding");
    } 
    
    else if (pl < 20) {
      setDecision("Consider transfusion based on context");
    } 
    
    else {
      setDecision("No transfusion required");
    }
  }

  function calcFFP() {
    const w = parseFloat(ffpWeight);
    if (!w) return;
    setFfpResult(w * 12);
  }

  // --- UI ---
  return (
    <div style={{
      fontFamily: "Arial",
      background: "#eef2f6",
      minHeight: "100vh",
      padding: 12,
      maxWidth: 500,
      margin: "0 auto"
    }}>

    {/* HEADER */}
    <div style={{
      background: "#0f172a",
      color: "white",
      padding: 18,
      borderRadius: 10
    }}>
      <h2 style={{ color: "white", margin: 0 }}>
        🧠 Clinical Hematology Decision System
      </h2>
      <p style={{ margin: 0, opacity: 0.8 }}>
        Emergency transfusion & coagulation support tool
      </p>
    </div>

    {/* NAVIGATION */}
    <div style={{
      marginTop: 15,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }}>
      <button
          onClick={() => setTab("factor8")}
          style={{
            padding: "10px",
            borderRadius: 8,
            border: "none",
            background: "#1e293b",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >Factor VIII
      </button>
      <button onClick={() => setTab("platelets")}
        style={{
          padding: "10px",
          borderRadius: 8,
          border: "none",
          background: "#1e293b",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >Platelets
      </button>
      <button onClick={() => setTab("ffp")}
          style={{
            padding: "10px",
            borderRadius: 8,
            border: "none",
            background: "#1e293b",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
      >FFP
      </button>
      <button onClick={() => setTab("inr")}
          style={{
            padding: "10px",
            borderRadius: 8,
            border: "none",
            background: "#1e293b",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
      >INR
      </button>
      <button onClick={() => setTab("mtp")}
          style={{
            padding: "10px",
            borderRadius: 8,
            border: "none",
            background: "#1e293b",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
      >MTP
      </button>
    </div>

    {/* MAIN PANEL */}
    <div style={{
      marginTop: 20,
      background: "white",
      padding: 25,
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    }}>

      {/* FACTOR VIII */}
      {tab === "factor8" && (
        <div>
          <h3>Factor VIII Dose Calculator</h3>

          <input
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={{ display: "block", width: "100%", padding: 12, marginBottom: 10, fontSize: 16, boxSizing: "border-box", borderRadius: 8, border: "1px solid #cbd5e1" }}
          />

          <input
            placeholder="Desired rise (%)"
            value={rise}
            onChange={(e) => setRise(e.target.value)}
            style={{ display: "block", width: "100%", padding: 12, marginBottom: 10, fontSize: 16, boxSizing: "border-box", borderRadius: 8, border: "1px solid #cbd5e1" }}
          />

          <button
            onClick={calcFactor8}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Calculate
          </button>
          

          {factorDose !== null && (
            <div style={{ marginTop: 15, padding: 12, borderRadius: 8, background: "#f1f5f9", fontWeight: "bold" }}>
              Required Dose: {factorDose} IU
            </div>
          )}
        </div>
      )}

      {/* PLATELETS */}
      {tab === "platelets" && (
        <div>
          <h3>Platelet Transfusion Decision</h3>

          <input
            placeholder="Platelet count (x10⁹/L)"
            value={plateletCount}
            onChange={(e) => setPlateletCount(e.target.value)}
            style={{ display: "block", width: "100%", padding: 12, marginBottom: 10, fontSize: 16, boxSizing: "border-box", borderRadius: 8, border: "1px solid #cbd5e1" }}
          />

          <label>
            <input
              type="checkbox"
              checked={bleeding}
              onChange={(e) => setBleeding(e.target.checked)}
            />
            Active bleeding
          </label>

          <br /><br />

          <button onClick={assessPlatelets}
            style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
          >
            Assess
          </button>

          {decision && (
            <div style={{ marginTop: 15, padding: 12, borderRadius: 8, background: "#f1f5f9", fontWeight: "bold" }}>
              {decision}
            </div>
          )}
        </div>
      )}

      {/* FFP */}
      {tab === "ffp" && (
        <div>
          <h3>FFP Dose Estimate</h3>

          <input
            placeholder="Weight (kg)"
            value={ffpWeight}
            onChange={(e) => setFfpWeight(e.target.value)}
            style={{ display: "block", width: "100%", padding: 12, marginBottom: 10, fontSize: 16, boxSizing: "border-box", borderRadius: 8, border: "1px solid #cbd5e1" }}
          />

          <button onClick={calcFFP}
            style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
          >
            Calculate
          </button>

          {ffpResult !== null && (
            <div style={{ marginTop: 15, padding: 12, borderRadius: 8, background: "#f1f5f9", fontWeight: "bold" }}>
              Required Volume: {ffpResult} mL
            </div>
          )}
        </div>
      )}

      {/* INR */}
      {tab === "inr" && (
        <div>
          <h3>INR / Warfarin Reversal Decision</h3>

          <input
            placeholder="INR value"
            value={inr}
            onChange={(e) => setInr(e.target.value)}
            style={{ display: "block", width: "100%", padding: 12, marginBottom: 10, fontSize: 16, boxSizing: "border-box", borderRadius: 8, border: "1px solid #cbd5e1" }}
          />

          <label>
            <input
              type="checkbox"
              checked={bleedingInr}
              onChange={(e) => setBleedingInr(e.target.checked)}
            />
            Active bleeding
          </label>

          <br /><br />

          <label>
            <input
              type="checkbox"
              checked={procedureUrgent}
              onChange={(e) => setProcedureUrgent(e.target.checked)}
            />
            Urgent procedure required
          </label>

          <br /><br />

          <button onClick={assessINR}
            style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
          >
            Assess INR
          </button>

          {inrDecision && (
            <div style={{ marginTop: 15, padding: 12, borderRadius: 8, background: "#f1f5f9", fontWeight: "bold" }}>
              {inrDecision}
            </div>
          )}
        </div>
      )}
      {/* MTP */}
      {tab === "mtp" && (
        <div>
          <h3>Massive Transfusion Protocol (MTP)</h3>

          <input
            placeholder="Enter scenario (trauma, PPH, GI bleed)"
            value={mtpScenario}
            onChange={(e) => setMtpScenario(e.target.value)}
            style={{ display: "block", width: "100%", padding: 12, marginBottom: 10, fontSize: 16, boxSizing: "border-box", borderRadius: 8, border: "1px solid #cbd5e1" }}
          />

          <button onClick={assessMTP}
            style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "none",
                      background: "#2563eb",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
          > 
            Activate Protocol
          </button>

          {mtpDecision && (
            <div style={{ marginTop: 15, padding: 12, borderRadius: 8, background: "#f1f5f9", fontWeight: "bold" }}>
              {mtpDecision}
            </div>
          )}
        </div>
      )}

    </div>
  </div>
);
}