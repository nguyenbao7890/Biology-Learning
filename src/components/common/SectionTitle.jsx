export default function SectionTitle({ title, sub, align = "left", className = "" }) {
  const alignClass =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  return (
    <div className={`mb-4 ${alignClass} ${className}`}>
      <h2 className="m-0 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
        {title}
      </h2>
      {sub && <p className="mt-1 text-sm leading-6 text-slate-500">{sub}</p>}
    </div>
  );
}