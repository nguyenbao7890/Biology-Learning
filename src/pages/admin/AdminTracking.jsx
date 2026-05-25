import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BookOpen,
  Clock3,
  GraduationCap,
  UserRound,
} from "lucide-react";
import SectionTitle from "../../components/common/SectionTitle";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { adminApi } from "../../services/api";

export default function AdminTracking() {
  const [trackingRows, setTrackingRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchTracking() {
      try {
        setLoading(true);
        setError("");

        const data = await adminApi.tracking();

        if (mounted) {
          setTrackingRows(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Admin tracking error:", err);

        if (mounted) {
          setError(err.message || "Không thể tải dữ liệu theo dõi học sinh");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchTracking();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalStudents = trackingRows.length;

    const studyingStudents = trackingRows.filter(
      (row) => Number(row.enrolled_courses || 0) > 0
    ).length;

    const completedProgress = trackingRows.filter(
      (row) => Number(row.average_progress || 0) >= 80
    ).length;

    const noProgress = trackingRows.filter(
      (row) => Number(row.average_progress || 0) === 0
    ).length;

    return {
      totalStudents,
      studyingStudents,
      completedProgress,
      noProgress,
    };
  }, [trackingRows]);

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Theo dõi hoạt động học sinh"
        sub="Tổng hợp tiến độ học tập, điểm số và điểm danh"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Tổng học sinh"
          value={stats.totalStudents.toLocaleString("vi-VN")}
          color="#059669"
          icon={GraduationCap}
        />

        <StatCard
          label="Đang học khóa"
          value={stats.studyingStudents.toLocaleString("vi-VN")}
          color="#0d9488"
          icon={BookOpen}
        />

        <StatCard
          label="Tiến độ tốt"
          value={stats.completedProgress.toLocaleString("vi-VN")}
          color="#8b5cf6"
          icon={Activity}
        />

        <StatCard
          label="Chưa có tiến độ"
          value={stats.noProgress.toLocaleString("vi-VN")}
          color="#dc2626"
          icon={Clock3}
        />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <span className="text-sm font-semibold text-slate-900">
            Theo dõi học sinh
          </span>

          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {stats.studyingStudents.toLocaleString("vi-VN")} đang học
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white">
                {[
                  "Học sinh",
                  "Email",
                  "Khóa đã đăng ký",
                  "Tiến độ TB",
                  "Điểm TB",
                  "Điểm danh",
                  "Trạng thái",
                ].map((h) => (
                  <th
                    key={h}
                    className="border-b border-slate-200 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm font-medium text-rose-600"
                  >
                    {error}
                  </td>
                </tr>
              ) : trackingRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    Chưa có dữ liệu học sinh.
                  </td>
                </tr>
              ) : (
                trackingRows.map((row) => {
                  const progress = Number(row.average_progress || 0);
                  const averageScore = Number(row.average_score || 0);
                  const enrolledCourses = Number(row.enrolled_courses || 0);
                  const attendanceDays = Number(row.attendance_days || 0);

                  const status =
                    progress >= 80
                      ? "good"
                      : enrolledCourses > 0
                      ? "learning"
                      : "inactive";

                  return (
                    <tr
                      key={row.student_id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                            <UserRound className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-900">
                              {row.student_name}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-400">
                              ID #{row.student_id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {row.email}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {enrolledCourses.toLocaleString("vi-VN")}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex min-w-32 items-center gap-3">
                          <div className="h-2 flex-1 rounded-full bg-slate-100">
                            <div
                              className="h-2 rounded-full bg-emerald-500"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>

                          <span className="w-10 text-right text-sm font-semibold text-slate-700">
                            {progress}%
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {averageScore > 0
                          ? averageScore.toLocaleString("vi-VN")
                          : "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {attendanceDays.toLocaleString("vi-VN")} ngày
                      </td>

                      <td className="px-5 py-4">
                        <Badge
                          label={
                            status === "good"
                              ? "Tiến độ tốt"
                              : status === "learning"
                              ? "Đang học"
                              : "Chưa học"
                          }
                          color={
                            status === "good"
                              ? "#059669"
                              : status === "learning"
                              ? "#0d9488"
                              : "#d97706"
                          }
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}