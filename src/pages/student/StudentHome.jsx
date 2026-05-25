import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BookOpenCheck,
  BrainCircuit,
  Flame,
  LineChart,
  Microscope,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import Card from "../../components/common/Card";
import StatCard from "../../components/common/StatCard";
import SectionTitle from "../../components/common/SectionTitle";
import ProgressBar from "../../components/common/ProgressBar";
import Badge from "../../components/common/Badge";
import { CHAPTERS } from "../../data/chapters";
import { getAssetUrl, studentApi } from "../../services/api";

const learningTrend = [
  { day: "T2", score: 58 },
  { day: "T3", score: 71 },
  { day: "T4", score: 69 },
  { day: "T5", score: 82 },
  { day: "T6", score: 88 },
  { day: "T7", score: 86 },
  { day: "CN", score: 91 },
];

const levelLabel = {
  basic: "Cơ bản",
  medium: "Trung bình",
  advanced: "Nâng cao",
};

export default function StudentHome({ onNav }) {
  const [overview, setOverview] = useState(null);
  const [continueCourses, setContinueCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudentHome = async () => {
    try {
      setLoading(true);
      setError("");

      const [overviewData, continueData] = await Promise.all([
        studentApi.overview(),
        studentApi.continueLearning(),
      ]);

      setOverview(overviewData || null);
      setContinueCourses(Array.isArray(continueData) ? continueData : []);
    } catch (err) {
      setError(err.message || "Không tải được dữ liệu học sinh");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentHome();
  }, []);

  const focusItems = useMemo(() => {
    if (continueCourses.length > 0) {
      return continueCourses.map((course) => ({
        id: course.id,
        title: course.title,
        subtitle:
          course.description ||
          `${course.lesson_count || 0} bài học · ${levelLabel[course.level] || course.level || "Cơ bản"
          }`,
        progress: Number(course.progress_percent || 0),
        thumbnail: course.thumbnail,
        isApi: true,
      }));
    }

    return CHAPTERS.slice(0, 4).map((chapter, index) => ({
      id: chapter.id,
      title: chapter.title,
      subtitle: chapter.topics.slice(0, 2).join(" · "),
      progress: [82, 67, 74, 58][index],
      thumbnail: chapter.image,
      isApi: false,
    }));
  }, [continueCourses]);

  const avgProgress = Number(overview?.avgProgress || 0);
  const avgScore = Number(overview?.avgScore || 0);
  const totalHours = Number(overview?.totalHours || 0);
  const streakText = overview?.completedLessons
    ? `${overview.completedLessons} bài`
    : "0 bài";

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Tiến độ tổng thể"
          value={loading ? "..." : `${avgProgress}%`}
          sub="Tính từ các khóa học đã đăng ký"
          icon={LineChart}
          tone="emerald"
        />
        <StatCard
          label="Điểm trung bình"
          value={loading ? "..." : avgScore ? avgScore : "0"}
          sub={`${overview?.quizCount || 0} lượt làm quiz`}
          icon={Sparkles}
          tone="violet"
        />
        <StatCard
          label="Giờ tự học"
          value={loading ? "..." : `${totalHours}h`}
          sub="Tổng thời lượng đã ghi nhận"
          icon={Activity}
          tone="teal"
        />
        <StatCard
          label="Bài đã hoàn thành"
          value={loading ? "..." : streakText}
          sub="Dựa trên tiến độ bài học"
          icon={Flame}
          tone="amber"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card glow className="p-6">
          <SectionTitle
            eyebrow="Student cockpit"
            title="Hiệu suất học tập 7 ngày"
            sub="Dashboard học sinh dùng dữ liệu API kết hợp biểu đồ trực quan."
          />

          <div className="h-72 min-h-[288px] min-w-0">
            <ResponsiveContainer width="100%" height={288}>
              <AreaChart data={learningTrend}>
                <defs>
                  <linearGradient
                    id="studentHomeArea"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  vertical={false}
                />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  fill="url(#studentHomeArea)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle
            eyebrow="Focus queue"
            title="Tiếp tục ngay"
            sub="Các khóa học được ưu tiên theo tiến độ gần đây."
          />

          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-3xl bg-slate-100"
                />
              ))
            ) : focusItems.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50 p-5 text-sm text-slate-600">
                Chưa có khóa học tiếp tục. Hãy đăng ký khóa học để bắt đầu.
              </div>
            ) : (
              focusItems.map((item, index) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50"
                >
                  {item.thumbnail && (
                    <img
                      src={
                        item.isApi ? getAssetUrl(item.thumbnail) : item.thumbnail
                      }
                      alt={item.title}
                      className="h-28 w-full object-cover"
                    />
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {item.subtitle}
                        </div>
                      </div>

                      <Badge
                        label={index < 2 ? "Ưu tiên cao" : "On track"}
                        tone={index < 2 ? "amber" : "emerald"}
                      />
                    </div>

                    <div className="mt-4">
                      <ProgressBar
                        value={item.progress}
                        tone={index % 2 === 0 ? "emerald" : "teal"}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{item.progress}% hoàn thành</span>
                      <button
                        onClick={() => onNav("lesson")}
                        className="inline-flex items-center gap-1 font-semibold text-emerald-700"
                      >
                        Tiếp tục <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <SectionTitle title="Hoạt động gần đây" sub="Lấy từ lịch sử học tập." />
          <div className="space-y-3">
            {(overview?.recentActivities || []).length > 0 ? (
              overview.recentActivities.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-2xl bg-emerald-50 p-4">
                  <div className="font-semibold text-slate-900">
                    {item.title}
                  </div>
                  <div className="mt-1 text-sm text-emerald-700">
                    {item.result_text || "Đã ghi nhận"}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    {item.duration_minutes || 0} phút
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-slate-600">
                Chưa có hoạt động gần đây.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle title="Insight nhanh" sub="Gợi ý học tập." />
          <div className="space-y-4 text-sm leading-6 text-slate-600">
            <div className="rounded-2xl border border-slate-100 p-4">
              <BrainCircuit className="mb-3 h-5 w-5 text-violet-600" />
              Bạn đã hoàn thành {overview?.completedLessons || 0} bài học. Hãy
              tiếp tục các khóa học còn dang dở để tăng tiến độ tổng thể.
            </div>
            <div className="rounded-2xl border border-slate-100 p-4">
              <Microscope className="mb-3 h-5 w-5 text-cyan-600" />
              Điểm quiz trung bình hiện tại là {avgScore || 0}. Nên làm lại quiz
              nếu điểm dưới 7.
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle title="Streak rewards" sub="Gamification nhẹ." />
          <div className="space-y-3">
            {[
              ["Gene Explorer", "Hoàn thành 4 bài về DNA"],
              ["Cell Detective", "Làm đúng 90% câu hỏi hình ảnh"],
              ["Focus Bloom", "Học liên tục nhiều ngày"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  {title}
                </div>
                <div className="mt-1 text-sm text-slate-500">{desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}