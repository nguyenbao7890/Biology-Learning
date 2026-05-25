import { Trash2 } from "lucide-react";
import Badge from "../../../components/common/Badge";
import { levelLabel } from "./courseBuilderUtils";
import { getAssetUrl } from "../../../services/api";

export default function CourseList({ courses, loading, onDelete }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900">
        Danh sách khóa học đã tạo
      </h3>

      <div className="mt-5">
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
            Đang tải khóa học...
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
            Chưa có khóa học nào.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
              >
                {course.thumbnail ? (
                  <img
                    src={getAssetUrl(course.thumbnail)}
                    alt={course.title}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-emerald-100 to-cyan-100 text-4xl">
                    🧬
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          label={levelLabel[course.level] || course.level}
                          color="#8b5cf6"
                        />
                        <Badge
                          label={
                            course.status === "published"
                              ? "Xuất bản"
                              : "Bản nháp"
                          }
                          color={
                            course.status === "published"
                              ? "#059669"
                              : "#d97706"
                          }
                        />
                      </div>

                      <h4 className="mt-3 text-lg font-bold text-slate-900">
                        {course.title}
                      </h4>

                      <p className="mt-2 line-clamp-2 text-sm leading-7 text-slate-600">
                        {course.description || "Chưa có mô tả."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDelete(course.id)}
                      className="rounded-2xl border border-red-100 bg-red-50 p-3 text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500">
                        Số bài
                      </div>
                      <div className="mt-1 text-sm font-bold text-slate-900">
                        {course.lesson_count || 0}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500">
                        Học viên
                      </div>
                      <div className="mt-1 text-sm font-bold text-slate-900">
                        {course.student_count || 0}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500">
                        Giá bán
                      </div>
                      <div className="mt-1 text-sm font-bold text-slate-900">
                        {Number(course.price || 0).toLocaleString("vi-VN")}đ
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
