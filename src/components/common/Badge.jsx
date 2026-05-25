export default function Badge({
  label,
  color = "#10b981",
  className = "",
  size = "sm",
}) {
  const sizeClass =
    size === "xs"
      ? "px-2 py-0.5 text-[10px]"
      : size === "lg"
      ? "px-3.5 py-1.5 text-sm"
      : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClass} ${className}`}
      style={{
        background: `${color}15`,
        color,
        border: `1px solid ${color}25`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5)`,
      }}
    >
      {label}
    </span>
  );
}