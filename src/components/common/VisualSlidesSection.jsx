import { Layers3 } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function VisualSlidesSection({
  title,
  desc,
  items = [],
  metaLabel = "Slide học tập",
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-14 lg:px-10 xl:px-12">
      <SectionHeader title={title} desc={desc} />

      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className={`overflow-hidden rounded-[30px] border shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${item.card}`}
          >
            <div className="relative h-56">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
              <div
                className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${item.badgeClass}`}
              >
                {item.badge}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Layers3 className="h-4 w-4" />
                {metaLabel}
              </div>

              <h3 className="mt-3 text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}