import { useEffect, useMemo, useState } from "react";
import { BookOpen, ImagePlus, Search, Sparkles } from "lucide-react";
import SectionTitle from "../../components/common/SectionTitle";
import { courseApi, getAssetUrl, studentApi } from "../../services/api";

const levelText = {
  basic: "Cơ bản",
  medium: "Trung bình",
  advanced: "Nâng cao",
};

const levelClasses = {
  basic: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cover: "from-emerald-100 to-emerald-50",
    progress: "bg-emerald-500",
  },
  medium: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    cover: "from-blue-100 to-blue-50",
    progress: "bg-blue-500",
  },
  advanced: {
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    cover: "from-violet-100 to-violet-50",
    progress: "bg-violet-500",
  },
};

export default function StudentCourses({ onNav }) {
  const [filter, setFilter] = useState("all");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      let data;

      try {
        data = await courseApi.getMy();
      } catch {
        data = await courseApi.getAll();
      }

      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Không tải được danh sách khóa học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return courses.filter((course) => {
      const progress = Number(course.progress_percent || course.progress || 0);

      const matchFilter =
        filter === "all" ||
        (filter === "inprogress" && progress < 100) ||
        (filter === "done" && progress >= 100);

      const matchKeyword =
        !keyword ||
        course.title?.toLowerCase().includes(keyword) ||
        course.description?.toLowerCase().includes(keyword);

      return matchFilter && matchKeyword;
    });
  }, [courses, filter, query]);

  const filters = [
    { key: "all", label: "Tất cả" },
    { key: "inprogress", label: "Đang học" },
    { key: "done", label: "Hoàn thành" },
  ];

  const handleOpenCourse = async (course) => {
    try {
      setEnrollingId(course.id);

      if (!course.progress_percent && courseApi.enroll) {
        try {
          await courseApi.enroll(course.id);
        } catch {
          // Nếu đã enroll rồi thì bỏ qua
        }
      }

      try {
        await studentApi.createActivity({
          activityType: "course",
          title: `Mở khóa học: ${course.title}`,
          courseId: course.id,
          durationMinutes: 0,
          resultText: "Đang học",
        });
      } catch {
        // Không chặn UI nếu ghi lịch sử lỗi
      }

      onNav("lesson", { courseId: course.id });
    } finally {
      setEnrollingId("");
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Khóa học của tôi"
        sub="Danh sách khóa học được lấy trực tiếp từ backend MySQL"
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                filter === item.key
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
            placeholder="Tìm khóa học..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
            >
              <div className="h-40 animate-pulse bg-slate-100" />
              <div className="space-y-4 p-5">
                <div className="h-4 w-24 animate-pulse rounded-full bg-slate-100" />
                <div className="h-5 w-4/5 animate-pulse rounded-full bg-slate-100" />
                <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
          Chưa có khóa học nào phù hợp.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => {
            const progress = Number(course.progress_percent || course.progress || 0);
            const style = levelClasses[course.level] || levelClasses.basic;

            return (
              <div
                key={course.id}
                className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
              >
                <div
                  className={`relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br ${style.cover}`}
                >
                  {course.thumbnail ? (
                    <img
                      src={getAssetUrl(course.thumbnail)}
                      alt={course.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <ImagePlus className="h-14 w-14 text-emerald-500" />
                  )}

                  <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
                    {Number(course.price || 0) > 0
                      ? `${Number(course.price || 0).toLocaleString("vi-VN")}đ`
                      : "Miễn phí"}
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${style.badge}`}
                    >
                      {levelText[course.level] || course.level || "Cơ bản"}
                    </span>

                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                      {course.lesson_count || 0} bài học
                    </span>
                  </div>

                  <h3 className="line-clamp-2 text-lg font-bold text-slate-950">
                    {course.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                    {course.description || "Chưa có mô tả cho khóa học này."}
                  </p>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">Tiến độ</span>
                      <span className="text-slate-900">{progress}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${style.progress}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenCourse(course)}
                    disabled={enrollingId === course.id}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                  >
                    {enrollingId === course.id ? "Đang mở..." : "Vào học"}
                    {enrollingId !== course.id && <BookOpen className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
          <Sparkles className="h-4 w-4" />
          Gợi ý học tập
        </div>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Khi bạn mở khóa học hoặc hoàn thành bài học, hệ thống sẽ tự ghi vào
          lịch sử hoạt động và cập nhật dashboard học sinh.
        </p>
      </div>
    </div>
  );
}