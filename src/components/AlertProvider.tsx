import { createContext, useContext } from "react";
import type React from "react";
import { useAlert } from "../hooks/useAlert";
import type { AlertState, AlertType } from "../utils/constants";

interface AlertContextType {
  alerts: AlertState[];
  addAlert: (
    message: string,
    type: AlertType,
    options?: { dismissible?: boolean; autoClose?: boolean }
  ) => void;
  removeAlert: (id: string) => void;
  clearAllAlerts: () => void;
  showAlert: (message: string, type: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const alertState = useAlert();

  return <AlertContext.Provider value={alertState}>{children}</AlertContext.Provider>;
}

export function useAlertContext() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlertContext must be used within AlertProvider");
  }
  return context;
}

