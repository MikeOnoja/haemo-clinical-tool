import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function ResultPanel({ children }: Props) {
  return (
    <div
      style={{
        marginTop: 16,
        padding: 16,
        borderRadius: 10,
        background: "var(--surface)",
        color: "var(--surface-text)",
        border: "1px solid var(--surface-border)",
        fontSize: 14,
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
}