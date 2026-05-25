import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function DashLayout({
  role,
  page,
  onNav,
  onLogout,
  children,
  user,
}) {
  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_20%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.08),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] font-sans text-slate-900">
      <Sidebar role={role} activePage={page} onNav={onNav} onLogout={onLogout} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar role={role} user={user} onNotif={() => {}} />

        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}