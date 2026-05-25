import { useState } from "react";
import {
  BookOpen,
  Clock3,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  X,
  Trophy,
} from "lucide-react";
import StudentHome from "./StudentHome";
import StudentCourses from "./StudentCourses";
import LessonViewer from "./LessonViewer";
import StudentQuiz from "./StudentQuiz";
import StudentHistory from "./StudentHistory";

const navItems = [
  {
    key: "home",
    label: "Tổng quan",
    icon: Home,
  },
  {
    key: "courses",
    label: "Khóa học",
    icon: BookOpen,
  },
  {
    key: "quiz",
    label: "Quiz",
    icon: Trophy,
  },
  {
    key: "history",
    label: "Lịch sử",
    icon: Clock3,
  },
];

export default function StudentDashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("home");
  const [pagePayload, setPagePayload] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (nextPage, payload = {}) => {
    setActivePage(nextPage);
    setPagePayload(payload);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <StudentHome onNav={handleNav} />;

      case "courses":
        return <StudentCourses onNav={handleNav} />;

      case "lesson":
        return (
          <LessonViewer
            onNav={handleNav}
            courseId={pagePayload.courseId}
            lessonId={pagePayload.lessonId}
          />
        );

      case "quiz":
        return (
          <StudentQuiz
            onNav={handleNav}
            courseId={pagePayload.courseId}
            quizId={pagePayload.quizId}
          />
        );

      case "history":
        return <StudentHistory />;

      default:
        return <StudentHome onNav={handleNav} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white transition lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
            <button
              type="button"
              onClick={() => handleNav("home")}
              className="flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20">
                <GraduationCap className="h-6 w-6" />
              </div>

              <div className="text-left">
                <div className="text-lg font-extrabold tracking-tight">
                  Student
                </div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                  Learning space
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-2xl border border-slate-200 p-2 text-slate-500 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="text-sm font-bold text-slate-900">
                {user?.name || "Học sinh"}
              </div>
              <div className="mt-1 text-xs font-semibold text-emerald-700">
                {user?.email || "student@example.com"}
              </div>
            </div>

            <nav className="mt-5 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activePage === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleNav(item.key)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                      active
                        ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 p-4">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
          />
        )}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-xl lg:px-8">
            <div>
              <div className="text-sm font-semibold text-slate-500">
                BioLearn 10
              </div>
              <div className="text-xl font-extrabold text-slate-950">
                Dashboard học sinh
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-2xl border border-slate-200 p-3 text-slate-600 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </header>

          <div className="px-4 py-6 lg:px-8">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}