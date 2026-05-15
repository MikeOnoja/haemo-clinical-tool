import { useTheme } from "./ThemeProvider";
import { primaryButton } from "../styles/globals.css";

export function Header() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <header
      style={{
        background: "rgb(10, 49, 133)",
        color: "white",
        padding: 18,
        borderRadius: 10,
      }}
    >
      <h1 style={{ marginTop: 0, marginBottom: 12, fontSize: 20, color: "white" }}>
        🧠 Clinical Hematology Decision System
      </h1>

      <button
        onClick={() => setDarkMode(!darkMode)}
        style={primaryButton}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        title={darkMode ? "Light mode" : "Dark mode"}
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </header>
  );
}

