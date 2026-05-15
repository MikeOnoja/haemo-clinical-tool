import { useState, useCallback, useRef } from "react";
import type { AlertState, AlertType } from "../utils/constants";
import { CONSTANTS } from "../utils/constants";

export function useAlert() {
  const [alerts, setAlerts] = useState<AlertState[]>([]);
  const timeoutRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const generateId = useCallback(() => `alert-${Date.now()}-${Math.random()}`, []);

  const addAlert = useCallback(
    (
      message: string,
      type: AlertType = "info",
      options?: { dismissible?: boolean; autoClose?: boolean }
    ) => {
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

  const showAlert = useCallback(
    (message: string, type: AlertType = "info") => {
      addAlert(message, type, { dismissible: true, autoClose: type !== "error" });
    },
    [addAlert]
  );

  return { alerts, addAlert, removeAlert, clearAllAlerts, showAlert };
}
