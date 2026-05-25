export default function Avatar({
  initials,
  size = 36,
  color = "#10b981",
  className = "",
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold shadow-sm ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}22, ${color}10)`,
        color,
        fontSize: size * 0.38,
        border: `1.5px solid ${color}33`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.65)`,
      }}
    >
      {initials}
    </div>
  );
}