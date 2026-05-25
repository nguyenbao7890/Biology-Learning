import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Mail,
  Medal,
  TrendingUp,
  UserRound,
} from "lucide-react";
import Avatar from "../../components/common/Avatar";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";
import SectionTitle from "../../components/common/SectionTitle";
import Badge from "../../components/common/Badge";
import { parentApi } from "../../services/api";

function toNumber(value) {
  return Number(value || 0);
}

function getInitials(user) {
  return (
    user?.avatar ||
    user?.name
      ?.split(" ")
      .slice(-2)
      .map((x) => x[0])
      .join("")
      .toUpperCase() ||
    "HS"
  );
}

function getScoreStatus(score) {
  if (score >= 8) {
    return {
      label: "Học lực tốt",
      color: "#059669",
      message: "Điểm trung bình đang ở mức tốt.",
    };
  }

  if (score >= 6.5) {
    return {
      label: "Cần duy trì",
      color: "#d97706",
      message: "Điểm trung bình khá, nên duy trì nhịp học đều.",
    };
  }

  if (score > 0) {
    return {
      label: "Cần cải thiện",
      color: "#dc2626",
      message: "Điểm trung bình còn thấp, phụ huynh nên theo dõi thêm.",
    };
  }

  return {
    label: "Chưa có điểm",
    color: "#64748b",
    message: "Học sinh chưa có dữ liệu điểm kiểm tra.",
  };
}

export default function ParentHome() {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changingChild, setChangingChild] = useState(false);
  const [error, setError] = useState("");

  async function fetchChildren() {
    const data = await parentApi.children();
    const list = Array.isArray(data) ? data : [];

    setChildren(list);

    if (list.length > 0) {
      setSelectedChildId((current) => current || String(list[0].id));
    }

    return list;
  }

  async function fetchOverview(childId) {
    const data = await parentApi.overview(childId);
    setOverview(data);
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const childList = await fetchChildren();

        if (mounted && childList.length > 0) {
          await fetchOverview(childList[0].id);
        }
      } catch (err) {
        console.error("Parent home error:", err);

        if (mounted) {
          setError(err.message || "Không thể tải dữ liệu phụ huynh");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;

    let mounted = true;

    async function loadOverview() {
      try {
        setChangingChild(true);
        setError("");

        const data = await parentApi.overview(selectedChildId);

        if (mounted) {
          setOverview(data);
        }
      } catch (err) {
        console.error("Parent overview error:", err);

        if (mounted) {
          setError(err.message || "Không thể tải dữ liệu học sinh");
        }
      } finally {
        if (mounted) {
          setChangingChild(false);
        }
      }
    }

    loadOverview();

    return () => {
      mounted = false;
    };
  }, [selectedChildId]);

  const child = overview?.student;
  const progress = overview?.progress || {};
  const score = overview?.score || {};
  const attendance = overview?.attendance || {};

  const averageProgress = toNumber(progress.average_progress);
  const averageScore = toNumber(score.average_score);
  const enrolledCourses = toNumber(progress.enrolled_courses);

  const totalDays = toNumber(attendance.total_days);
  const presentDays = toNumber(attendance.present_days);
  const absentDays = toNumber(attendance.absent_days);
  const lateDays = toNumber(attendance.late_days);

  const attendanceRate = totalDays
    ? Math.round((presentDays / totalDays) * 100)
    : 0;

  const scoreStatus = getScoreStatus(averageScore);

  const quickAlerts = useMemo(() => {
    const alerts = [];

    if (absentDays > 0) {
      alerts.push({
        type: "warning",
        title: "Có ngày vắng học",
        description: `Học sinh đã vắng ${absentDays} ngày trong dữ liệu điểm danh.`,
        icon: AlertTriangle,
        color: "amber",
      });
    }

    if (lateDays > 0) {
      alerts.push({
        type: "warning",
        title: "Có lượt đi muộn",
        description: `Ghi nhận ${lateDays} lượt đi muộn.`,
        icon: AlertTriangle,
        color: "amber",
      });
    }

    if (averageScore > 0 && averageScore < 6.5) {
      alerts.push({
        type: "danger",
        title: "Điểm cần cải thiện",
        description: `Điểm trung bình hiện tại là ${averageScore.toLocaleString(
          "vi-VN"
        )}.`,
        icon: AlertTriangle,
        color: "rose",
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        type: "success",
        title: "Tình hình ổn định",
        description: "Chưa có cảnh báo nổi bật về điểm số hoặc chuyên cần.",
        icon: CheckCircle2,
        color: "emerald",
      });
    }

    return alerts;
  }, [absentDays, lateDays, averageScore]);

  if (loading && !overview) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Đang tải dữ liệu học sinh...
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

  if (!child) {
    return (
      <Card className="border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-amber-800">
              Chưa gán học sinh
            </h3>

            <p className="mt-1 text-sm text-amber-700">
              Tài khoản phụ huynh này chưa được gán học sinh. Vào admin để gán
              phụ huynh cho học sinh.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SectionTitle
          title="Tổng quan phụ huynh"
          sub="Theo dõi nhanh tình hình học tập của học sinh"
        />

        {children.length > 1 && (
          <div className="relative">
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="h-11 appearance-none rounded-2xl border border-slate-200 bg-white pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-400"
            >
              {children.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        )}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="bg-gradient-to-br from-violet-50 via-white to-slate-50 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar initials={getInitials(child)} size={60} color="#7c3aed" />

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {child.name}
                  </h2>

                  <Badge label="Học sinh" color="#7c3aed" />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    {child.email || "Chưa có email"}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    {enrolledCourses.toLocaleString("vi-VN")} khóa học
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              <div className="rounded-2xl border border-violet-100 bg-white/80 p-4 text-center">
                <div className="text-2xl font-extrabold text-violet-600">
                  {averageProgress}%
                </div>
                <div className="mt-1 text-xs font-medium text-slate-500">
                  Tiến độ tổng
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 text-center">
                <div className="text-2xl font-extrabold text-emerald-600">
                  {averageScore ? averageScore.toLocaleString("vi-VN") : "-"}
                </div>
                <div className="mt-1 text-xs font-medium text-slate-500">
                  Điểm TB
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-100 bg-white/80 p-4 text-center">
                <div className="text-2xl font-extrabold text-cyan-600">
                  {attendanceRate}%
                </div>
                <div className="mt-1 text-xs font-medium text-slate-500">
                  Chuyên cần
                </div>
              </div>
            </div>
          </div>

          {changingChild && (
            <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-500">
              Đang cập nhật dữ liệu học sinh...
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Khóa đang học"
          value={enrolledCourses.toLocaleString("vi-VN")}
          color="#7c3aed"
          icon={BookOpen}
        />

        <StatCard
          label="Điểm trung bình"
          value={averageScore ? averageScore.toLocaleString("vi-VN") : "-"}
          color="#059669"
          icon={Medal}
        />

        <StatCard
          label="Ngày có mặt"
          value={`${presentDays}/${totalDays}`}
          color="#0891b2"
          icon={CalendarCheck}
        />

        <StatCard
          label="Vắng / Muộn"
          value={`${absentDays}/${lateDays}`}
          color="#d97706"
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <SectionTitle
              title="Tóm tắt kết quả"
              sub="Các chỉ số chính, không thay thế trang tiến độ chi tiết"
            />

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <GraduationCap className="h-4 w-4 text-violet-500" />
                Tiến độ
              </div>

              <div className="mt-3 text-2xl font-extrabold text-slate-900">
                {averageProgress}%
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Trung bình trên các khóa đã đăng ký.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Medal className="h-4 w-4 text-emerald-500" />
                Điểm số
              </div>

              <div className="mt-3 text-2xl font-extrabold text-slate-900">
                {averageScore ? averageScore.toLocaleString("vi-VN") : "-"}
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {scoreStatus.message}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CalendarCheck className="h-4 w-4 text-cyan-500" />
                Chuyên cần
              </div>

              <div className="mt-3 text-2xl font-extrabold text-slate-900">
                {attendanceRate}%
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Có mặt {presentDays}/{totalDays} ngày được ghi nhận.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Cảnh báo nhanh" sub="Những điểm phụ huynh cần chú ý" />

          <div className="mt-4 space-y-3">
            {quickAlerts.map((item) => {
              const Icon = item.icon;

              const colorClass =
                item.color === "rose"
                  ? "border-rose-100 bg-rose-50 text-rose-700"
                  : item.color === "amber"
                  ? "border-amber-100 bg-amber-50 text-amber-700"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700";

              return (
                <div
                  key={item.title}
                  className={`rounded-2xl border p-4 ${colorClass}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0" />

                    <div>
                      <div className="text-sm font-bold">{item.title}</div>

                      <p className="mt-1 text-xs opacity-90">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Gợi ý theo dõi
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Trang này chỉ hiển thị tổng quan. Xem chi tiết ở các mục điểm số,
              tiến độ học tập và hoạt động học tập.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge label={scoreStatus.label} color={scoreStatus.color} />
            <Badge
              label={absentDays > 0 ? "Có vắng học" : "Chuyên cần ổn"}
              color={absentDays > 0 ? "#d97706" : "#059669"}
            />
            <Badge
              label={`${enrolledCourses} khóa học`}
              color="#7c3aed"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}