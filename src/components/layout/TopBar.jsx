import Avatar from "../common/Avatar";
import { ROLE_COLORS, ROLE_LABELS, ROLE_THEMES } from "../../data/nav";
import { Bell, Search, Sparkles } from "lucide-react";

export default function TopBar({ role, user, onNotif }) {
  const color = ROLE_COLORS[role];
  const theme = ROLE_THEMES[role] || ROLE_THEMES.student;

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="flex h-[72px] items-center justify-between px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span>Chào mừng quay lại</span>
          </div>

          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              Chào buổi sáng, {user.name}
            </h1>

            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: theme.soft,
                color: theme.primary,
              }}
            >
              {ROLE_LABELS[role]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-700 lg:inline-flex">
            <Search className="h-4 w-4" />
            Tìm kiếm
          </button>

          <button
            onClick={onNotif}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
            <Avatar initials={user.initials} size={36} color={color} />
          </div>
        </div>
      </div>
    </header>
  );
}