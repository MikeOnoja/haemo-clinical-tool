export function LoadingOverlay() {
  return (
    <div
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 8,
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        fontSize: 13,
        color: "#9a3412",
      }}
    >
      Processing clinical calculation...
    </div>
  );
}