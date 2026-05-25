import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  Medal,
  Trophy,
} from "lucide-react";
import SectionTitle from "../../components/common/SectionTitle";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { parentApi } from "../../services/api";

function toNumber(value) {
  return Number(value || 0);
}

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleDateString("vi-VN");
  } catch {
    return "-";
  }
}

function getEvaluation(score, maxScore = 10) {
  const normalizedScore = maxScore ? (score / maxScore) * 10 : score;

  if (normalizedScore >= 9) {
    return {
      label: "Xuất sắc",
      color: "#059669",
    };
  }

  if (normalizedScore >= 8) {
    return {
      label: "Giỏi",
      color: "#0d9488",
    };
  }

  if (normalizedScore >= 6.5) {
    return {
      label: "Khá",
      color: "#d97706",
    };
  }

  if (normalizedScore >= 5) {
    return {
      label: "Trung bình",
      color: "#f59e0b",
    };
  }

  return {
    label: "Cần cố gắng",
    color: "#dc2626",
  };
}

export default function ParentScores() {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadChildren() {
      try {
        setLoading(true);
        setError("");

        const data = await parentApi.children();
        const list = Array.isArray(data) ? data : [];

        if (!mounted) return;

        setChildren(list);

        if (list.length > 0) {
          setSelectedChildId(list[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Parent children error:", err);

        if (mounted) {
          setError(err.message || "Không thể tải danh sách học sinh");
          setLoading(false);
        }
      }
    }

    loadChildren();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;

    let mounted = true;

    async function loadScores() {
      try {
        setLoading(true);
        setError("");

        const data = await parentApi.scores(selectedChildId);

        if (mounted) {
          setScores(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Parent scores error:", err);

        if (mounted) {
          setError(err.message || "Không thể tải điểm kiểm tra");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadScores();

    return () => {
      mounted = false;
    };
  }, [selectedChildId]);

  const stats = useMemo(() => {
    if (!scores.length) {
      return {
        average: 0,
        highest: 0,
        count: 0,
      };
    }

    const values = scores.map((item) => toNumber(item.score));
    const total = values.reduce((sum, item) => sum + item, 0);

    return {
      average: total / values.length,
      highest: Math.max(...values),
      count: scores.length,
    };
  }, [scores]);

  if (loading && !scores.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Đang tải điểm kiểm tra...
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
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SectionTitle
          title="Điểm kiểm tra"
          sub="Kết quả toàn bộ bài kiểm tra của học sinh"
        />

        {children.length > 1 && (
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-violet-400"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {children.length === 0 ? (
        <Card className="border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-3 text-sm font-medium text-amber-700">
            <ClipboardCheck className="h-5 w-5" />
            Tài khoản phụ huynh này chưa được gán học sinh.
          </div>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Điểm trung bình"
              value={stats.average ? stats.average.toFixed(1) : "-"}
              color="#7c3aed"
              icon={BarChart3}
            />

            <StatCard
              label="Điểm cao nhất"
              value={stats.highest ? stats.highest.toLocaleString("vi-VN") : "-"}
              color="#059669"
              icon={Trophy}
            />

            <StatCard
              label="Số bài đã thi"
              value={stats.count.toLocaleString("vi-VN")}
              color="#0891b2"
              icon={ClipboardCheck}
            />
          </div>

          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    {[
                      "Ngày",
                      "Bài kiểm tra",
                      "Môn / Chương",
                      "Loại",
                      "Điểm",
                      "Đánh giá",
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
                  {scores.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-10 text-center text-sm text-slate-500"
                      >
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                          <Medal className="h-5 w-5" />
                        </div>
                        Chưa có điểm kiểm tra.
                      </td>
                    </tr>
                  ) : (
                    scores.map((item) => {
                      const score = toNumber(item.score);
                      const maxScore = toNumber(item.max_score) || 10;
                      const evaluation = getEvaluation(score, maxScore);

                      const typeLabel =
                        item.type === "quiz"
                          ? "Quiz"
                          : item.type === "assignment"
                          ? "Bài tập"
                          : item.type === "exam"
                          ? "Kiểm tra"
                          : item.type || "Điểm";

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                        >
                          <td className="px-5 py-4 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-slate-400" />
                              {formatDate(item.created_at)}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                                <Award className="h-4 w-4" />
                              </div>

                              <div>
                                <div className="text-sm font-semibold text-slate-900">
                                  {item.title || item.note || "Bài kiểm tra"}
                                </div>

                                <div className="mt-0.5 text-xs text-slate-400">
                                  ID #{item.id}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {item.subject || "-"}
                          </td>

                          <td className="px-5 py-4">
                            <Badge label={typeLabel} color="#7c3aed" />
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className="text-base font-extrabold"
                              style={{ color: evaluation.color }}
                            >
                              {score}/{maxScore}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <Badge
                              label={evaluation.label}
                              color={evaluation.color}
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
        </>
      )}
    </div>
  );
}