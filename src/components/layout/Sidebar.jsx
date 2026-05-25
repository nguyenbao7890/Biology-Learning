import {
  BellRing,
  LogOut,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { NAV_ITEMS, ROLE_LABELS, ROLE_THEMES } from "../../data/nav";

export default function Sidebar({ role, activePage, onNav, onLogout }) {
  const items = NAV_ITEMS[role] || [];
  const theme = ROLE_THEMES[role] || ROLE_THEMES.student;

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-white/70 bg-white/70 backdrop-blur xl:block">
      <div className="flex h-full flex-col px-4 py-5">
        <div className="flex h-full flex-col rounded-[30px] border border-white/70 bg-gradient-to-b from-white via-white to-slate-50 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3 px-2">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${theme.gradient}`}
            >
              <BellRing className="h-5 w-5" />
            </div>

            <div>
              <div className="text-lg font-extrabold tracking-tight text-slate-900">
                BioSphere
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {ROLE_LABELS[role]}
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className={`h-1.5 w-full bg-gradient-to-r ${theme.gradient}`} />
            <div className="p-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                <Sparkles className="h-3.5 w-3.5" />
                Learning OS
              </div>

              <div className="mt-3 text-sm leading-6 text-slate-600">
                Dashboard sinh học theo phong cách SaaS hiện đại, tập trung vào
                điều hướng rõ ràng và trải nghiệm học tập trực quan.
              </div>
            </div>
          </div>

          <nav className="mt-6 flex-1 space-y-2 overflow-y-auto pr-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNav(item.id)}
                  className={`group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-all duration-200 ${
                    active
                      ? "text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  style={
                    active
                      ? {
                          background: `linear-gradient(135deg, ${theme.primary}, ${theme.ring})`,
                        }
                      : {}
                  }
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      active
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  <span className="flex-1 font-medium">{item.label}</span>

                  <ChevronRight
                    className={`h-4 w-4 transition ${
                      active
                        ? "translate-x-0 text-white/80"
                        : "translate-x-0 text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-500"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          <button
            onClick={onLogout}
            className="mt-4 flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
}