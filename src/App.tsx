import { useState, useEffect } from "react";

import { AuthProvider } from "./components/AuthProvider";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { AlertProvider } from "./components/AlertProvider";

import { Header } from "./components/Header";
import { AlertContainer } from "./components/AlertContainer";
import { TabNavigation } from "./components/TabNavigation";

import { Factor8Calculator } from "./components/medical-modules/Factor8Calculator"
import { PlateletDecision } from "./components/medical-modules/PlateletDecision";
import { FFPDoseEstimator } from "./components/medical-modules/FFPDoseEstimator";
import { INRReversal } from "./components/medical-modules/INRReversal";
import { MTPManager } from "./components/medical-modules/MTPManager";

import type { TabType } from "./utils/constants";

import { injectGlobalStyles } from "./styles/globals.css";

// =========================================
// MODULE REGISTRY
// =========================================

const MODULE_REGISTRY: Record<
  TabType,
  React.ComponentType<{ patientId: string }>
> = {
  factor8: Factor8Calculator,
  platelets: PlateletDecision,
  ffp: FFPDoseEstimator,
  inr: INRReversal,
  mtp: MTPManager,
};

// =========================================
// APP CONTENT
// =========================================

function AppContent() {
  const [tab, setTab] = useState<TabType>("factor8");
  const [patientId, setPatientId] = useState("");

  const { themeColors } = useTheme();

  useEffect(() => {
    injectGlobalStyles();
  }, []);

  const ActiveModule = MODULE_REGISTRY[tab];
  
  if (!ActiveModule) {
  return <div>Module not found</div>;
}

  return (
    <div
      className="app-container"
      role="main"
      style={{
        background: themeColors.bg,
        color: themeColors.text,
        minHeight: "100vh",
        transition: "background-color 0.3s ease, color 0.3s ease",
        padding: "20px",
        boxSizing: "border-box",
      }}
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
          type="text"
          aria-label="Patient ID"
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
            border: "1px solid #313232",
            color: "#000000",
            fontSize: 16,
            boxSizing: "border-box",
            fontFamily: "inherit",
            background: "#faf8f8",
          }}
        />
      </label>

      {/* NAVIGATION */}
      <TabNavigation activeTab={tab} onTabChange={setTab} />

      {/* ACTIVE MODULE */}
      <section
        style={{
          marginTop: 20,
          background: themeColors.card,
          padding: 25,
          borderRadius: 12,
        }}
      >
        <ActiveModule patientId={patientId} />
      </section>
    </div>
  );
}

// =========================================
// ROOT APP
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