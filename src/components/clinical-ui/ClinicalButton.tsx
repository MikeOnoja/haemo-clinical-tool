import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function ClinicalButton(props: Props) {
  return (
    <button
      {...props}
      style={{
        padding: "10px 16px",
        borderRadius: 8,
        border: "none",
        background: "#1f2937",
        color: "#fff",
        cursor: "pointer",
        fontSize: 14,
        marginTop: 12,
        ...props.style,
      }}
    />
  );
}