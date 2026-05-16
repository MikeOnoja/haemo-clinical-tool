import type { ChangeEvent } from "react";

interface Props {
  label: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function ClinicalCheckbox({
  label,
  checked,
  onChange,
  disabled = false,
}: Props) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginTop: 12,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: 16,
          height: 16,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      />
      <span>{label}</span>
    </label>
  );
}