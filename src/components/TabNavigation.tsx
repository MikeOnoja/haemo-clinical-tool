import type { TabType } from "../utils/constants";
import { buttonStyle } from "../styles/globals.css";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: "factor8", label: "Factor VIII" },
    { id: "platelets", label: "Platelets" },
    { id: "ffp", label: "FFP" },
    { id: "inr", label: "INR" },
    { id: "mtp", label: "MTP" },
  ];

  return (
    <nav
      style={{
        marginTop: 15,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
      }}
      aria-label="Assessment modules"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            ...buttonStyle,
            background: activeTab === tab.id ? "rgb(44, 110, 251)" : buttonStyle.background,
          }}
          aria-pressed={activeTab === tab.id}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
