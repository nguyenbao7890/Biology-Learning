export default function StatsGrid({
  items = [],
  columns = "sm:grid-cols-3",
  className = "",
}) {
  return (
    <div className={`grid gap-4 ${columns} ${className}`}>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className={`rounded-3xl border p-4 shadow-sm ${item.card || "border-slate-200 bg-white"}`}
          >
            {Icon ? (
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white ${item.iconWrap || "bg-slate-900"}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            ) : null}

            <div className={`${Icon ? "mt-4" : ""} text-2xl font-bold text-slate-900`}>
              {item.value}
            </div>
            <div className="mt-1 text-sm text-slate-600">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}