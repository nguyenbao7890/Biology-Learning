export default function Card({
  children,
  className = "",
  hover = false,
  padding = "p-5",
}) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${
        hover ? "transition duration-300 hover:-translate-y-1 hover:shadow-lg" : ""
      } ${padding} ${className}`}
    >
      {children}
    </div>
  );
}