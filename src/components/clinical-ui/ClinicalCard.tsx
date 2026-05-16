import React from "react";

export function ClinicalCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        background: "#ffffff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        marginTop: 12,
      }}
    >
      {children}
    </div>
  );
}