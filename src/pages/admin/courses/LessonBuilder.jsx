import { getAssetUrl } from "../../../services/api";
import {
  Box,
  FileText,
  ImagePlus,
  Layers3,
  Link as LinkIcon,
  Plus,
  Presentation,
  Trash2,
  UploadCloud,
} from "lucide-react";

function fileNameFromUrl(url) {
  if (!url) return "";

  const cleanUrl = url.split("?")[0];
  return decodeURIComponent(cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1));
}

function UploadedFileInfo({ icon: Icon, label, url }) {
  if (!url) return null;

  return (
    <div className="mt-2 flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
      <Icon className="h-4 w-4 shrink-0" />
      <span className="line-clamp-1">{label}: {fileNameFromUrl(url)}</span>
    </div>
  );
}

export default function LessonBuilder({
  lessons,
  onAddLesson,
  onRemoveLesson,
  onChangeLesson,
  onUploadLessonImage,
  onUploadLessonFile,
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-950">
            2. Nội dung bài học
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Thêm bài học, video, ảnh, tài liệu, slide, link 3D và tài nguyên ngoài
          </p>
        </div>

        <button
          type="button"
          onClick={onAddLesson}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4" />
          Thêm bài học
        </button>
      </div>

      <div className="space-y-5">
        {lessons.map((lesson, index) => (
          <div
            key={index}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Layers3 className="h-4 w-4 text-emerald-600" />
                Bài học {index + 1}
              </div>

              {lessons.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveLesson(index)}
                  className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.65fr_1.35fr]">
              <div>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {lesson.imageUrl ? (
                    <img
                      src={getAssetUrl(lesson.imageUrl)}
                      alt={lesson.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 flex-col items-center justify-center text-slate-400">
                      <ImagePlus className="h-8 w-8" />
                      <div className="mt-2 text-xs font-semibold">
                        Ảnh bài học
                      </div>
                    </div>
                  )}
                </div>

                <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
                  <ImagePlus className="h-4 w-4" />
                  Upload ảnh
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      onUploadLessonImage(index, e.target.files?.[0])
                    }
                  />
                </label>

                <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-3">
                  <div className="mb-3 text-sm font-bold text-slate-800">
                    Tài liệu bài học
                  </div>

                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
                    <FileText className="h-4 w-4" />
                    Upload PDF / Word / Excel / ZIP
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt,.csv"
                      className="hidden"
                      onChange={(e) =>
                        onUploadLessonFile(
                          index,
                          "documentUrl",
                          "lesson-documents",
                          e.target.files?.[0]
                        )
                      }
                    />
                  </label>
                  <UploadedFileInfo
                    icon={FileText}
                    label="File bài học"
                    url={lesson.documentUrl}
                  />

                  <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
                    <Presentation className="h-4 w-4" />
                    Upload slide bài giảng
                    <input
                      type="file"
                      accept=".ppt,.pptx,.pdf"
                      className="hidden"
                      onChange={(e) =>
                        onUploadLessonFile(
                          index,
                          "slideUrl",
                          "lesson-slides",
                          e.target.files?.[0]
                        )
                      }
                    />
                  </label>
                  <UploadedFileInfo
                    icon={Presentation}
                    label="Slide"
                    url={lesson.slideUrl}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Tiêu đề bài học
                  </label>
                  <input
                    value={lesson.title}
                    onChange={(e) =>
                      onChangeLesson(index, "title", e.target.value)
                    }
                    placeholder="Ví dụ: Cấu trúc tế bào"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Video URL
                  </label>
                  <input
                    value={lesson.videoUrl}
                    onChange={(e) =>
                      onChangeLesson(index, "videoUrl", e.target.value)
                    }
                    placeholder="https://youtube.com/..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Thời lượng phút
                  </label>
                  <input
                    value={lesson.durationMinutes}
                    onChange={(e) =>
                      onChangeLesson(index, "durationMinutes", e.target.value)
                    }
                    placeholder="20"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Box className="h-4 w-4 text-emerald-600" />
                    Link mô hình 3D / mô phỏng
                  </label>
                  <input
                    value={lesson.model3dUrl}
                    onChange={(e) =>
                      onChangeLesson(index, "model3dUrl", e.target.value)
                    }
                    placeholder="https://sketchfab.com/... hoặc link mô phỏng"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <LinkIcon className="h-4 w-4 text-emerald-600" />
                    Link tài nguyên ngoài
                  </label>
                  <input
                    value={lesson.externalLink}
                    onChange={(e) =>
                      onChangeLesson(index, "externalLink", e.target.value)
                    }
                    placeholder="Google Drive, PhET, Genially, website..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nội dung bài học
                  </label>
                  <textarea
                    rows={7}
                    value={lesson.content}
                    onChange={(e) =>
                      onChangeLesson(index, "content", e.target.value)
                    }
                    placeholder="Nhập nội dung bài học..."
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                  />
                </div>

                <div className="md:col-span-2 rounded-2xl bg-white p-4 text-sm text-slate-500">
                  <div className="mb-2 flex items-center gap-2 font-bold text-slate-700">
                    <UploadCloud className="h-4 w-4 text-emerald-600" />
                    Gợi ý
                  </div>
                  Có thể tải file PDF, Word, PowerPoint, Excel, ZIP; hoặc gắn link 3D, Google Drive, PhET, Sketchfab để học sinh mở/tải trong trang bài học.
                </div>

                <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={lesson.isFree}
                    onChange={(e) =>
                      onChangeLesson(index, "isFree", e.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  Cho học thử miễn phí
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
