import React from "react";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

export function ClinicalSelect(props: Props) {
  return (
    <select
      {...props}
      style={{
        display: "block",
        width: "100%",
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        border: "1px solid #ccc",
        fontSize: 16,
        ...props.style,
      }}
    />
  );
}