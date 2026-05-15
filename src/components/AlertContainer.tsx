
import { useAlertContext } from "./AlertProvider";

export function AlertContainer() {
  const { alerts, removeAlert } = useAlertContext();

  return (
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
  );
}

