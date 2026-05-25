export default function ProgressBar({
  value,
  max = 100,
  color = "#10b981",
  height = 8,
  className = "",
  trackClassName = "",
  barClassName = "",
  showGlow = true,
}) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div
      className={`relative overflow-hidden rounded-full bg-slate-200 ${className} ${trackClassName}`}
      style={{ height }}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${barClassName}`}
        style={{
          width: `${percentage}%`,
          background: color,
          boxShadow: showGlow ? `0 0 18px ${color}55` : "none",
        }}
      />
    </div>
  );
}