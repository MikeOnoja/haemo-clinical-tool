import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export function ClinicalInput(props: Props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: 12,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 8,
        border: "1px solid #ccc",
        fontSize: 14,
        outline: "none",
        ...props.style,
      }}
    />
  );
}