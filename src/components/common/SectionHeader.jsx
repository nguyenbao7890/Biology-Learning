export default function SectionHeader({ title, desc, className = "", maxWidth = "max-w-3xl" }) {
  return (
    <div className={`mb-6 ${maxWidth} ${className}`}>
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
      {desc ? <p className="mt-2 text-slate-600">{desc}</p> : null}
    </div>
  );
}