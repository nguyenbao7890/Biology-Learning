export default function StatCard({
  label,
  value,
  sub,
  color = "#10b981",
  icon,
  className = "",
}) {
  const Icon = icon;

  return (
    <div
      className={`group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-slate-500">{label}</div>
          <div
            className="mt-3 text-3xl font-extrabold tracking-tight"
            style={{ color }}
          >
            {value}
          </div>
        </div>

        {Icon && (
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl transition group-hover:scale-105"
            style={{ backgroundColor: `${color}15`, color }}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {sub && <div className="mt-3 text-sm text-slate-400">{sub}</div>}
    </div>
  );
}