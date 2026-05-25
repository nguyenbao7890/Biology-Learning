import { ImagePlus } from "lucide-react";
import { levelOptions } from "./courseBuilderUtils";
import { getAssetUrl } from "../../../services/api";

export default function CourseInfoForm({
  form,
  onChange,
  onUploadCourseImage,
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-950">
          1. Thông tin khóa học
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Nhập thông tin tổng quan và ảnh đại diện cho khóa học
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            {form.thumbnail ? (
              <img
                src={getAssetUrl(form.thumbnail)}
                alt={form.title}
                className="h-64 w-full object-cover"
              />
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-slate-400">
                <ImagePlus className="h-10 w-10" />
                <div className="mt-3 text-sm font-semibold">
                  Chưa có ảnh khóa học
                </div>
              </div>
            )}
          </div>

          <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100">
            <ImagePlus className="h-4 w-4" />
            Upload ảnh khóa học
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onUploadCourseImage(e.target.files?.[0])}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Tên khóa học
            </label>
            <input
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder="Ví dụ: Sinh học tế bào nâng cao"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Mức độ
            </label>
            <select
              value={form.level}
              onChange={(e) => onChange("level", e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-400"
            >
              {levelOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Giá bán
            </label>
            <input
              value={form.price}
              onChange={(e) => onChange("price", e.target.value)}
              placeholder="99000"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Trạng thái
            </label>
            <select
              value={form.status}
              onChange={(e) => onChange("status", e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-400"
            >
              <option value="published">Xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Mô tả khóa học
            </label>
            <textarea
              rows={6}
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Nhập mô tả chi tiết cho khóa học..."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
