import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BookOpen,
  Gauge,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";
import SectionTitle from "../../components/common/SectionTitle";
import { adminApi } from "../../services/api";

const roleColors = {
  student: "#10b981",
  parent: "#8b5cf6",
  teacher: "#059669",
  admin: "#dc2626",
};

export default function AdminHome() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchAnalytics() {
      try {
        setLoading(true);
        setError("");

        const data = await adminApi.analytics();

        if (mounted) {
          setAnalytics(data);
        }
      } catch (err) {
        console.error("Admin analytics error:", err);
        if (mounted) {
          setError(err.message || "Không thể tải dữ liệu tổng quan");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  const users = analytics?.users || {};
  const courses = analytics?.courses || {};
  const lessons = analytics?.lessons || {};
  const quizzes = analytics?.quizzes || {};
  const scores = analytics?.scores || {};
  const progress = analytics?.progress || {};
  const topCourses = analytics?.topCourses || [];

  const totalUsers = Number(users.total_users || 0);
  const totalStudents = Number(users.total_students || 0);
  const totalParents = Number(users.total_parents || 0);
  const totalTeachers = Number(users.total_teachers || 0);
  const totalAdmins = Number(users.total_admins || 0);

  const roleDistribution = useMemo(
    () => [
      {
        role: "student",
        label: "Học sinh",
        count: totalStudents,
        color: roleColors.student,
      },
      {
        role: "parent",
        label: "Phụ huynh",
        count: totalParents,
        color: roleColors.parent,
      },
      {
        role: "teacher",
        label: "Giáo viên",
        count: totalTeachers,
        color: roleColors.teacher,
      },
      {
        role: "admin",
        label: "Admin",
        count: totalAdmins,
        color: roleColors.admin,
      },
    ],
    [totalStudents, totalParents, totalTeachers, totalAdmins]
  );

  const systemStats = [
    {
      label: "Tổng khóa học",
      value: Number(courses.total_courses || 0).toLocaleString("vi-VN"),
      color: "#059669",
    },
    {
      label: "Đã xuất bản",
      value: Number(courses.published_courses || 0).toLocaleString("vi-VN"),
      color: "#0d9488",
    },
    {
      label: "Tổng bài học",
      value: Number(lessons.total_lessons || 0).toLocaleString("vi-VN"),
      color: "#8b5cf6",
    },
    {
      label: "Tổng quiz",
      value: Number(quizzes.total_quizzes || 0).toLocaleString("vi-VN"),
      color: "#f59e0b",
    },
  ];

  const maxEnrollment = Math.max(
    ...topCourses.map((item) => Number(item.enrollments || 0)),
    1
  );

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Đang tải dữ liệu tổng quan...
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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Tổng người dùng"
          value={totalUsers.toLocaleString("vi-VN")}
          color="#dc2626"
          icon={Users}
        />

        <StatCard
          label="Học sinh"
          value={totalStudents.toLocaleString("vi-VN")}
          color="#10b981"
          icon={GraduationCap}
        />

        <StatCard
          label="Giáo viên"
          value={totalTeachers.toLocaleString("vi-VN")}
          color="#8b5cf6"
          icon={ShieldCheck}
        />

        <StatCard
          label="Khóa học"
          value={Number(courses.total_courses || 0).toLocaleString("vi-VN")}
          color="#f59e0b"
          icon={Activity}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="p-5">
          <SectionTitle title="Khóa học nổi bật" sub="Theo số lượt đăng ký" />

          {topCourses.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              Chưa có dữ liệu khóa học.
            </div>
          ) : (
            <>
              <div className="mt-4 flex h-28 items-end gap-2">
                {topCourses.map((course) => (
                  <div key={course.id} className="flex-1">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-rose-600 to-rose-400"
                      style={{
                        height: `${
                          (Number(course.enrollments || 0) / maxEnrollment) *
                          110
                        }px`,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                {topCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="line-clamp-1 text-slate-500">
                      {course.title}
                    </span>
                    <span className="font-bold text-slate-700">
                      {Number(course.enrollments || 0).toLocaleString("vi-VN")}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card className="p-5">
          <SectionTitle title="Phân phối vai trò" />

          <div className="mt-3 space-y-3">
            {roleDistribution.map((item) => (
              <div
                key={item.role}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <span className="text-sm text-slate-600">{item.label}</span>

                <span
                  className="text-sm font-bold"
                  style={{ color: item.color }}
                >
                  {Number(item.count || 0).toLocaleString("vi-VN")}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Hệ thống" />

          <div className="mt-3 space-y-3">
            {systemStats.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{item.label}</span>
                </div>

                <span
                  className="text-sm font-bold"
                  style={{ color: item.color }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="p-5">
          <SectionTitle title="Điểm trung bình" sub="Toàn hệ thống" />

          <div className="mt-4 flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Gauge className="h-5 w-5" />
            </div>

            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                {Number(scores.average_score || 0).toLocaleString("vi-VN")}
              </div>
              <p className="text-sm text-slate-500">Điểm quiz / bài kiểm tra</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Tiến độ trung bình" sub="Theo khóa học đã đăng ký" />

          <div className="mt-4 flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <Activity className="h-5 w-5" />
            </div>

            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                {Number(progress.average_progress || 0).toLocaleString("vi-VN")}%
              </div>
              <p className="text-sm text-slate-500">Mức hoàn thành khóa học</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Nội dung học tập" sub="Bài học và quiz" />

          <div className="mt-4 flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                {Number(lessons.total_lessons || 0) +
                  Number(quizzes.total_quizzes || 0)}
              </div>
              <p className="text-sm text-slate-500">Tổng bài học + quiz</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}