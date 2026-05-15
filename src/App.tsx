import { useState, useEffect } from "react";
import { AuthProvider } from "./components/AuthProvider";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { AlertProvider } from "./components/AlertProvider";
import { Header } from "./components/Header";
import { AlertContainer } from "./components/AlertContainer";
import { TabNavigation } from "./components/TabNavigation";
import { Factor8Calculator } from "./components/medical-modules/Factor8Calculator";
import { PlateletDecision } from "./components/medical-modules/PlateletDecision";
import { FFPDoseEstimator } from "./components/medical-modules/FFPDoseEstimator";
import { INRReversal } from "./components/medical-modules/INRReversal";
import { MTPManager } from "./components/medical-modules/MTPManager";
import type { TabType } from "./utils/constants";
import { injectGlobalStyles } from "./styles/globals.css";

// =========================================
// APP CONTENT
// =========================================

function AppContent() {
  console.log("AppContent rendering");
  const [tab, setTab] = useState<TabType>("factor8");
  const [patientId, setPatientId] = useState("");
  console.log("AppContent: accessing useTheme");
  const { themeColors } = useTheme();
  console.log("AppContent: got themeColors", themeColors);

  useEffect(() => {
    injectGlobalStyles();
  }, []);

  return (
    <div
      style={{
        background: themeColors.bg,
        color: themeColors.text,
        minHeight: "100vh",
        transition: "background-color 0.3s ease, color 0.3s ease",
        padding: "20px",
        boxSizing: "border-box",
      }}
      className="app-container" // Moved styles to CSS
      role="main"
    >
      {/* HEADER */}
      <Header />

      {/* ALERTS */}
      <AlertContainer />

      {/* PATIENT ID */}
      <label
        style={{
          display: "block",
          marginTop: 12,
          fontSize: 14,
          fontWeight: 500,
          color: themeColors.text,
        }}
      >
        Patient ID:
        <input
          placeholder="Enter patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          style={{
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
            background: "#faf8f8",
          }}
          aria-label="Patient ID"
          type="text"
        />
      </label>

      {/* NAVIGATION */}
      <TabNavigation activeTab={tab} onTabChange={setTab} />

      {/* MAIN PANEL */}
      <section
        style={{
          marginTop: 20,
          background: themeColors.card,
          padding: 25,
          borderRadius: 12,
        }}
      >
        {/* FACTOR VIII */}
        {tab === "factor8" && <Factor8Calculator patientId={patientId} />}

        {/* PLATELETS */}
        {tab === "platelets" && <PlateletDecision patientId={patientId} />}

        {/* FFP */}
        {tab === "ffp" && <FFPDoseEstimator patientId={patientId} />}

        {/* INR */}
        {tab === "inr" && <INRReversal patientId={patientId} />}

        {/* MTP */}
        {tab === "mtp" && <MTPManager patientId={patientId} />}
      </section>
    </div>
  );
}

// =========================================
// EXPORT APP
// =========================================

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AlertProvider>
          <AppContent />
        </AlertProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}