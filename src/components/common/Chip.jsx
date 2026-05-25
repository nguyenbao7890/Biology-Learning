export default function Chip({
  label,
  active,
  onClick,
  color = "#10b981",
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
        active
          ? "shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
      } ${className}`}
      style={
        active
          ? {
              borderColor: color,
              background: `${color}15`,
              color,
              boxShadow: `0 4px 14px ${color}18`,
            }
          : {}
      }
    >
      {label}
    </button>
  );
}