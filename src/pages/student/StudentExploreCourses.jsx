import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Plus,
  Search,
} from "lucide-react";
import SectionTitle from "../../components/common/SectionTitle";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { courseApi } from "../../services/api";

function formatPrice(price) {
  const value = Number(price || 0);

  if (!value) return "Miễn phí";

  return value.toLocaleString("vi-VN") + "đ";
}

export default function StudentExploreCourses() {
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [error, setError] = useState("");

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [allCoursesData, myCoursesData] = await Promise.all([
        courseApi.getAll(),
        courseApi.getMy(),
      ]);

      setCourses(Array.isArray(allCoursesData) ? allCoursesData : []);
      setMyCourses(Array.isArray(myCoursesData) ? myCoursesData : []);
    } catch (err) {
      console.error("Student explore courses error:", err);
      setError(err.message || "Không thể tải danh sách khóa học");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleEnroll(course) {
    try {
      setEnrollingId(course.id);

      await courseApi.enroll(course.id);

      await fetchData();
    } catch (err) {
      console.error("Enroll course error:", err);
      alert(err.message || "Không thể đăng ký khóa học");
    } finally {
      setEnrollingId(null);
    }
  }

  const myCourseIds = new Set(myCourses.map((course) => String(course.id)));

  const filteredCourses = courses.filter((course) => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return true;

    return (
      course.title?.toLowerCase().includes(keyword) ||
      course.description?.toLowerCase().includes(keyword)
    );
  });

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Đang tải danh sách khóa học...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm font-medium text-rose-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SectionTitle
          title="Khám phá khóa học"
          sub="Chọn và đăng ký khóa học từ hệ thống"
        />

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm khóa học..."
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-emerald-400 sm:w-72"
          />
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <BookOpen className="h-6 w-6" />
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            Chưa có khóa học phù hợp
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Thử tìm kiếm bằng từ khóa khác hoặc chờ giáo viên/admin thêm khóa học.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => {
            const enrolled = myCourseIds.has(String(course.id));

            return (
              <Card key={course.id} className="overflow-hidden p-0">
                <div className="h-32 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500" />

                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <GraduationCap className="h-5 w-5" />
                    </div>

                    <Badge
                      label={course.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                      color={course.status === "published" ? "#059669" : "#64748b"}
                    />
                  </div>

                  <h3 className="line-clamp-2 text-base font-bold text-slate-900">
                    {course.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm text-slate-500">
                    {course.description || "Chưa có mô tả khóa học."}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <div className="text-xs text-slate-400">Học phí</div>
                      <div className="text-sm font-bold text-slate-900">
                        {formatPrice(course.price)}
                      </div>
                    </div>

                    {enrolled ? (
                      <button
                        type="button"
                        disabled
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 text-sm font-semibold text-emerald-700"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Đã đăng ký
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={enrollingId === course.id}
                        onClick={() => handleEnroll(course)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-4 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Plus className="h-4 w-4" />
                        {enrollingId === course.id ? "Đang đăng ký..." : "Đăng ký"}
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}