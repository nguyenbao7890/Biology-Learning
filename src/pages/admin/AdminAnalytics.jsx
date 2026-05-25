import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  BookOpen,
  Clock3,
  TrendingUp,
  Users,
} from "lucide-react";
import SectionTitle from "../../components/common/SectionTitle";
import { adminApi } from "../../services/api";

const roleColors = {
  student: "#10b981",
  parent: "#8b5cf6",
  teacher: "#06b6d4",
  admin: "#ef4444",
};

function toNumber(value) {
  return Number(value || 0);
}

function buildLinePoints(data, width = 520, height = 220, padding = 28) {
  if (!data.length) return "";

  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  return data
    .map((d, i) => {
      const x =
        data.length === 1
          ? width / 2
          : padding + (i * usableWidth) / (data.length - 1);

      const y =
        padding +
        usableHeight -
        ((d.value - min) / Math.max(max - min, 1)) * usableHeight;

      return `${x},${y}`;
    })
    .join(" ");
}

export default function AdminAnalytics() {
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
          setError(err.message || "Không thể tải dữ liệu thống kê");
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

  const totalUsers = toNumber(users.total_users);
  const totalStudents = toNumber(users.total_students);
  const totalParents = toNumber(users.total_parents);
  const totalTeachers = toNumber(users.total_teachers);
  const totalAdmins = toNumber(users.total_admins);

  const roleData = useMemo(
    () => [
      {
        key: "student",
        label: "Học sinh",
        value: totalStudents,
        color: roleColors.student,
      },
      {
        key: "parent",
        label: "Phụ huynh",
        value: totalParents,
        color: roleColors.parent,
      },
      {
        key: "teacher",
        label: "Giáo viên",
        value: totalTeachers,
        color: roleColors.teacher,
      },
      {
        key: "admin",
        label: "Admin",
        value: totalAdmins,
        color: roleColors.admin,
      },
    ],
    [totalStudents, totalParents, totalTeachers, totalAdmins]
  );

  const donutStyle = useMemo(() => {
    if (!totalUsers) {
      return { background: "#e2e8f0" };
    }

    let current = 0;

    const parts = roleData.map((item) => {
      const percent = (item.value / totalUsers) * 100;
      const start = current;
      const end = current + percent;

      current = end;

      return `${item.color} ${start}% ${end}%`;
    });

    return {
      background: `conic-gradient(${parts.join(", ")})`,
    };
  }, [roleData, totalUsers]);

  const courseChartData = topCourses.map((course) => ({
    id: course.id,
    label: course.title,
    value: toNumber(course.enrollments),
  }));

  const maxCourseEnrollment = Math.max(
    ...courseChartData.map((item) => item.value),
    1
  );

  const linePoints = buildLinePoints(courseChartData);

  const summaryData = [
    {
      label: "Khóa đã xuất bản",
      value: toNumber(courses.published_courses).toLocaleString("vi-VN"),
      color: "#10b981",
    },
    {
      label: "Tổng bài học",
      value: toNumber(lessons.total_lessons).toLocaleString("vi-VN"),
      color: "#06b6d4",
    },
    {
      label: "Tổng quiz",
      value: toNumber(quizzes.total_quizzes).toLocaleString("vi-VN"),
      color: "#8b5cf6",
    },
    {
      label: "Tiến độ trung bình",
      value: `${toNumber(progress.average_progress).toLocaleString("vi-VN")}%`,
      color: "#ef4444",
    },
  ];

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Đang tải dữ liệu thống kê...
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
      <SectionTitle
        title="Thống kê & Báo cáo"
        sub="Theo dõi người dùng, khóa học, bài học và kết quả học tập"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Users className="h-4 w-4" />
            Tổng người dùng
          </div>

          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {totalUsers.toLocaleString("vi-VN")}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Tất cả tài khoản trên hệ thống
          </p>
        </div>

        <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-cyan-700">
            <BookOpen className="h-4 w-4" />
            Tổng khóa học
          </div>

          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {toNumber(courses.total_courses).toLocaleString("vi-VN")}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {toNumber(courses.published_courses).toLocaleString("vi-VN")} khóa
            đã xuất bản
          </p>
        </div>

        <div className="rounded-3xl border border-violet-200 bg-violet-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
            <Activity className="h-4 w-4" />
            Tiến độ trung bình
          </div>

          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {toNumber(progress.average_progress).toLocaleString("vi-VN")}%
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Trung bình theo khóa đã đăng ký
          </p>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
            <Clock3 className="h-4 w-4" />
            Điểm trung bình
          </div>

          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {toNumber(scores.average_score).toLocaleString("vi-VN")}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Trung bình điểm quiz/bài kiểm tra
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Khóa học nhiều đăng ký
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Top khóa học theo số lượt ghi danh
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>

          {courseChartData.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
              Chưa có dữ liệu khóa học.
            </div>
          ) : (
            <div className="flex h-72 items-end gap-3">
              {courseChartData.map((item, index) => (
                <div
                  key={item.id || `${item.label}-${index}`}
                  className="flex flex-1 flex-col items-center gap-3"
                >
                  <div className="text-xs font-semibold text-slate-500">
                    {item.value}
                  </div>

                  <div className="flex h-56 w-full items-end rounded-2xl bg-slate-100 p-1">
                    <div
                      className="w-full rounded-xl bg-gradient-to-t from-emerald-600 to-emerald-400"
                      style={{
                        height: `${(item.value / maxCourseEnrollment) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="line-clamp-2 min-h-8 text-center text-xs font-medium text-slate-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Xu hướng ghi danh
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Biểu đồ theo top khóa học
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            {courseChartData.length === 0 ? (
              <div className="flex h-56 items-center justify-center text-sm text-slate-500">
                Chưa có dữ liệu để vẽ biểu đồ.
              </div>
            ) : (
              <svg viewBox="0 0 520 220" className="h-56 w-full">
                <polyline
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={linePoints}
                />

                {courseChartData.map((item, i) => {
                  const width = 520;
                  const height = 220;
                  const padding = 28;
                  const max = Math.max(...courseChartData.map((d) => d.value));
                  const min = Math.min(...courseChartData.map((d) => d.value));

                  const x =
                    courseChartData.length === 1
                      ? width / 2
                      : padding +
                        (i * (width - padding * 2)) /
                          (courseChartData.length - 1);

                  const y =
                    padding +
                    (height - padding * 2) -
                    ((item.value - min) / Math.max(max - min, 1)) *
                      (height - padding * 2);

                  return (
                    <g key={item.id || `${item.label}-${i}`}>
                      <circle cx={x} cy={y} r="5" fill="#06b6d4" />
                      <text
                        x={x}
                        y="210"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#94a3b8"
                      >
                        {i + 1}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr_1fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">
              Phân bố vai trò
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Tỷ trọng người dùng hiện tại
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative h-44 w-44 rounded-full" style={donutStyle}>
              <div className="absolute inset-5 flex items-center justify-center rounded-full bg-white text-center">
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">
                    {totalUsers.toLocaleString("vi-VN")}
                  </div>
                  <div className="text-xs font-medium text-slate-400">
                    Tổng user
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 w-full space-y-3">
              {roleData.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-600">{item.label}</span>
                  </div>

                  <span className="text-sm font-bold text-slate-900">
                    {item.value.toLocaleString("vi-VN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">
              Nội dung hệ thống
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Khóa học, bài học và bài kiểm tra
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Khóa học",
                value: toNumber(courses.total_courses),
                max: Math.max(toNumber(courses.total_courses), 1),
                color: "bg-emerald-500",
              },
              {
                label: "Bài học",
                value: toNumber(lessons.total_lessons),
                max: Math.max(toNumber(lessons.total_lessons), 1),
                color: "bg-cyan-500",
              },
              {
                label: "Quiz",
                value: toNumber(quizzes.total_quizzes),
                max: Math.max(toNumber(quizzes.total_quizzes), 1),
                color: "bg-violet-500",
              },
              {
                label: "Khóa đã xuất bản",
                value: toNumber(courses.published_courses),
                max: Math.max(toNumber(courses.total_courses), 1),
                color: "bg-amber-500",
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-semibold text-slate-900">
                    {item.value.toLocaleString("vi-VN")}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className={`h-3 rounded-full ${item.color}`}
                    style={{
                      width: `${Math.min((item.value / item.max) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">Tóm tắt nhanh</h3>
            <p className="mt-1 text-sm text-slate-500">
              Một vài chỉ số nổi bật hiện tại
            </p>
          </div>

          <div className="space-y-3">
            {summaryData.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
              >
                <span className="text-sm text-slate-600">{item.label}</span>
                <span className="text-sm font-bold" style={{ color: item.color }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}