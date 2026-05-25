import { BookOpen, FilePlus2, Sparkles } from "lucide-react";

export default function CourseStats({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <BookOpen className="h-4 w-4" />
          Tổng khóa học
        </div>
        <div className="mt-3 text-3xl font-extrabold text-slate-900">
          {stats.total}
        </div>
      </div>

      <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-700">
          <Sparkles className="h-4 w-4" />
          Đã xuất bản
        </div>
        <div className="mt-3 text-3xl font-extrabold text-slate-900">
          {stats.published}
        </div>
      </div>

      <div className="rounded-3xl border border-violet-200 bg-violet-50 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
          <FilePlus2 className="h-4 w-4" />
          Bản nháp
        </div>
        <div className="mt-3 text-3xl font-extrabold text-slate-900">
          {stats.draft}
        </div>
      </div>
    </div>
  );
}
