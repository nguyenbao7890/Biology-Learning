import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  CalendarDays,
  Clock3,
  Download,
  FileText,
  Filter,
  PlayCircle,
  Search,
  Trophy,
} from "lucide-react";
import SectionTitle from "../../components/common/SectionTitle";
import Badge from "../../components/common/Badge";
import { studentApi } from "../../services/api";

const ranges = [
  { key: "today", label: "Hôm nay" },
  { key: "week", label: "Tuần này" },
  { key: "month", label: "Tháng này" },
  { key: "all", label: "Tất cả" },
];

const activityLabel = {
  lesson: "Học bài",
  quiz: "Làm quiz",
  video: "Xem video",
  download: "Tải tài liệu",
  course: "Khóa học",
};

const activityIcon = {
  lesson: BookOpen,
  quiz: Trophy,
  video: PlayCircle,
  download: Download,
  course: FileText,
};

const activityTone = {
  lesson: "#0d9488",
  quiz: "#8b5cf6",
  video: "#0891b2",
  download: "#f59e0b",
  course: "#10b981",
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StudentHistory() {
  const [range, setRange] = useState("week");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const loadActivities = async (nextRange = range) => {
    try {
      setLoading(true);
      setError("");

      const data = await studentApi.activities(nextRange);
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Không tải được lịch sử hoạt động");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities(range);
  }, [range]);

  const filteredActivities = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) return activities;

    return activities.filter((item) => {
      return (
        item.title?.toLowerCase().includes(keyword) ||
        item.activity_type?.toLowerCase().includes(keyword) ||
        item.result_text?.toLowerCase().includes(keyword)
      );
    });
  }, [activities, query]);

  const stats = useMemo(() => {
    const totalMinutes = activities.reduce((sum, item) => {
      return sum + Number(item.duration_minutes || 0);
    }, 0);

    const quizCount = activities.filter((item) => item.activity_type === "quiz")
      .length;

    const lessonCount = activities.filter(
      (item) => item.activity_type === "lesson"
    ).length;

    return {
      total: activities.length,
      minutes: totalMinutes,
      quiz: quizCount,
      lesson: lessonCount,
    };
  }, [activities]);

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Lịch sử hoạt động"
        sub="Toàn bộ lịch sử học tập được lấy trực tiếp từ backend"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Activity className="h-4 w-4" />
            Tổng hoạt động
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {loading ? "..." : stats.total}
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-cyan-700">
            <Clock3 className="h-4 w-4" />
            Thời lượng
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {loading ? "..." : `${stats.minutes}p`}
          </div>
        </div>

        <div className="rounded-3xl border border-violet-200 bg-violet-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
            <Trophy className="h-4 w-4" />
            Quiz
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {loading ? "..." : stats.quiz}
          </div>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
            <BookOpen className="h-4 w-4" />
            Bài học
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {loading ? "..." : stats.lesson}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {ranges.map((item) => (
              <button
                key={item.key}
                onClick={() => setRange(item.key)}
                className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                  range === item.key
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "bg-white text-slate-500 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm hoạt động..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-emerald-300"
            />
          </div>
        </div>

        {error && (
          <div className="m-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="mb-3 h-16 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Filter className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Chưa có hoạt động
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Hãy học bài, làm quiz hoặc tải tài liệu để tạo lịch sử.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    {[
                      "Thời gian",
                      "Hoạt động",
                      "Nội dung",
                      "Thời lượng",
                      "Kết quả",
                    ].map((h) => (
                      <th
                        key={h}
                        className="border-b border-slate-100 px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredActivities.map((item) => {
                    const Icon = activityIcon[item.activity_type] || Activity;
                    const color =
                      activityTone[item.activity_type] || "#0d9488";

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            {formatDate(item.created_at)}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-2xl text-white"
                              style={{ background: color }}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="text-sm font-semibold text-slate-900">
                              {activityLabel[item.activity_type] ||
                                item.activity_type}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                          {item.title}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {Number(item.duration_minutes || 0) > 0
                            ? `${item.duration_minutes} phút`
                            : "—"}
                        </td>

                        <td className="px-5 py-4">
                          <Badge
                            label={item.result_text || "Đã ghi nhận"}
                            color={color}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-4 lg:hidden">
              {filteredActivities.map((item) => {
                const Icon = activityIcon[item.activity_type] || Activity;
                const color = activityTone[item.activity_type] || "#0d9488";

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white"
                        style={{ background: color }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-bold text-slate-900">
                            {activityLabel[item.activity_type] ||
                              item.activity_type}
                          </div>
                          <Badge
                            label={item.result_text || "Đã ghi nhận"}
                            color={color}
                          />
                        </div>

                        <div className="mt-1 text-sm font-semibold text-slate-700">
                          {item.title}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                          <span>{formatDate(item.created_at)}</span>
                          <span>
                            {Number(item.duration_minutes || 0) > 0
                              ? `${item.duration_minutes} phút`
                              : "Không có thời lượng"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}