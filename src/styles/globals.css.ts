export const inputStyle: React.CSSProperties = {
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

export const primaryButton: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  background: "rgb(10, 49, 133)",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.2s ease",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

export const buttonStyle: React.CSSProperties = {
  padding: "10px",
  borderRadius: 8,
  border: "none",
  background: "rgb(10, 49, 133)",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export const resultStyle: React.CSSProperties = {
  marginTop: 15,
  padding: 12,
  borderRadius: 8,
  background: "rgb(44, 110, 251)",
  fontWeight: "bold",
  color: "white",  
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const spinnerStyle: React.CSSProperties = {
  display: "inline-block",
  width: 14,
  height: 14,
  border: "2px solid rgba(255, 255, 255, 0.3)",
  borderTop: "2px solid white",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

export function injectGlobalStyles(): void {
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
}

