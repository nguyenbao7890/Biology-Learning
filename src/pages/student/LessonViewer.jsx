import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Box,
  CheckCircle2,
  Clock3,
  Download,
  ExternalLink,
  FileText,
  ImagePlus,
  Layers3,
  ListChecks,
  PlayCircle,
  Presentation,
  Sparkles,
} from "lucide-react";
import Badge from "../../components/common/Badge";
import SectionTitle from "../../components/common/SectionTitle";
import StudentQuiz from "./StudentQuiz";
import { courseApi, getAssetUrl, lessonApi, studentApi } from "../../services/api";

const tabs = [
  { key: "content", label: "Nội dung", icon: BookOpen },
  { key: "media", label: "Hình ảnh / Video", icon: PlayCircle },
  { key: "summary", label: "Tóm tắt", icon: ListChecks },
  { key: "quiz", label: "Quiz", icon: Sparkles },
];

const fallbackLesson = {
  id: "demo",
  title: "Cấu trúc và chức năng của DNA",
  course_title: "Sinh học 10",
  content:
    "DNA là phân tử mang thông tin di truyền của sinh vật. DNA có cấu trúc dạng chuỗi xoắn kép, được cấu tạo từ các nucleotide. Mỗi nucleotide gồm nhóm phosphate, đường deoxyribose và một base nitơ. Hai mạch DNA liên kết theo nguyên tắc bổ sung: A liên kết với T, G liên kết với C.",
  video_url: "",
  image_url: "",
  duration_minutes: 45,
  is_free: true,
};


function getYouTubeEmbedUrl(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return url;
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/").filter(Boolean)[1];
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }

      const id = parsed.searchParams.get("v");
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }

    return url;
  } catch {
    return url;
  }
}

function splitContent(content) {
  if (!content) return [];

  return content
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function LessonViewer({ onNav, lessonId, courseId }) {
  const [tab, setTab] = useState("content");
  const [lesson, setLesson] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressSaving, setProgressSaving] = useState(false);
  const [error, setError] = useState("");

  const loadLesson = async () => {
    try {
      setLoading(true);
      setError("");

      let lessonData = null;

      if (lessonId && lessonApi.getById) {
        lessonData = await lessonApi.getById(lessonId);
      } else if (courseId && courseApi.getById) {
        const course = await courseApi.getById(courseId);
        const lessons = course.lessons || course.lesson_list || [];

        setCourseLessons(Array.isArray(lessons) ? lessons : []);

        lessonData = Array.isArray(lessons) && lessons.length > 0 ? lessons[0] : null;
      }

      setLesson(lessonData || fallbackLesson);

      const activeCourseId =
        lessonData?.course_id || lessonData?.courseId || courseId || null;

      if (activeCourseId && courseApi.getById) {
        try {
          const course = await courseApi.getById(activeCourseId);
          const lessons = course.lessons || course.lesson_list || [];

          if (Array.isArray(lessons)) {
            setCourseLessons(lessons);
          }
        } catch {
          // Không chặn UI nếu không lấy được danh sách bài học
        }
      }

      if (lessonData?.id) {
        try {
          await studentApi.createActivity({
            activityType: "lesson",
            title: `Mở bài học: ${lessonData.title}`,
            lessonId: lessonData.id,
            courseId: lessonData.course_id || lessonData.courseId || null,
            durationMinutes: 0,
            resultText: "Đang học",
          });
        } catch {
          // Không chặn UI nếu ghi lịch sử lỗi
        }
      }
    } catch (err) {
      setError(err.message || "Không tải được bài học");
      setLesson(fallbackLesson);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLesson();
  }, [lessonId, courseId]);

  const activeLesson = lesson || fallbackLesson;

  const lessonResources = useMemo(() => {
    const resources = [];

    const documentUrl = activeLesson.document_url || activeLesson.documentUrl;
    const slideUrl = activeLesson.slide_url || activeLesson.slideUrl;
    const model3dUrl = activeLesson.model3d_url || activeLesson.model3dUrl;
    const externalLink = activeLesson.external_link || activeLesson.externalLink;

    if (documentUrl) {
      resources.push({
        label: "File bài học",
        url: getAssetUrl(documentUrl),
        icon: FileText,
        download: true,
      });
    }

    if (slideUrl) {
      resources.push({
        label: "Slide bài giảng",
        url: getAssetUrl(slideUrl),
        icon: Presentation,
        download: true,
      });
    }

    if (model3dUrl) {
      resources.push({
        label: "Mô hình 3D / mô phỏng",
        url: model3dUrl,
        icon: Box,
      });
    }

    if (externalLink) {
      resources.push({
        label: "Tài nguyên ngoài",
        url: externalLink,
        icon: ExternalLink,
      });
    }

    return resources;
  }, [activeLesson]);

  const paragraphs = useMemo(() => {
    return splitContent(activeLesson.content);
  }, [activeLesson.content]);

  const summaryItems = useMemo(() => {
    if (paragraphs.length > 0) {
      return paragraphs.slice(0, 5);
    }

    return [
      "Bài học cung cấp kiến thức trọng tâm.",
      "Nội dung được chia thành các phần ngắn, dễ theo dõi.",
      "Học sinh nên xem lại phần tóm tắt trước khi làm quiz.",
    ];
  }, [paragraphs]);

  const markCompleted = async () => {
    if (!activeLesson.id || activeLesson.id === "demo") return;

    try {
      setProgressSaving(true);

      await lessonApi.updateProgress(activeLesson.id, {
        isCompleted: true,
        lastPositionSeconds: Number(activeLesson.duration_minutes || 0) * 60,
      });

      await studentApi.createActivity({
        activityType: "lesson",
        title: `Hoàn thành bài học: ${activeLesson.title}`,
        lessonId: activeLesson.id,
        courseId: activeLesson.course_id || activeLesson.courseId || null,
        durationMinutes: Number(activeLesson.duration_minutes || 0),
        resultText: "Hoàn thành",
      });

      alert("Đã đánh dấu hoàn thành bài học");
    } catch (err) {
      alert(err.message || "Không thể cập nhật tiến độ");
    } finally {
      setProgressSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => onNav("courses")}
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </button>

        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
            <div className="h-72 animate-pulse bg-slate-100" />
            <div className="space-y-4 p-6">
              <div className="h-5 w-1/2 animate-pulse rounded-full bg-slate-100" />
              <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
              <div className="h-4 w-4/5 animate-pulse rounded-full bg-slate-100" />
            </div>
          </div>

          <div className="h-80 animate-pulse rounded-[30px] bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => onNav("courses")}
        className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách
      </button>

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
          <div className="relative h-72 overflow-hidden bg-gradient-to-br from-emerald-100 to-cyan-100">
            {activeLesson.image_url || activeLesson.imageUrl ? (
              <img
                src={getAssetUrl(activeLesson.image_url || activeLesson.imageUrl)}
                alt={activeLesson.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImagePlus className="h-16 w-16 text-emerald-500" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/10 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge label={activeLesson.course_title || "Sinh học 10"} color="#0891b2" />
                <Badge
                  label={`${activeLesson.duration_minutes || 0} phút`}
                  color="#0d9488"
                />
                {activeLesson.is_free ? (
                  <Badge label="Học thử" color="#f59e0b" />
                ) : (
                  <Badge label="Khóa học" color="#8b5cf6" />
                )}
              </div>

              <h1 className="max-w-3xl text-3xl font-extrabold text-white">
                {activeLesson.title}
              </h1>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-100 pb-4">
              {tabs.map((item) => {
                const Icon = item.icon;
                const active = tab === item.key;

                return (
                  <button
                    key={item.key}
                    onClick={() => setTab(item.key)}
                    className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {tab === "content" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-slate max-w-none"
              >
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-base leading-8 text-slate-700">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-base leading-8 text-slate-700">
                    Chưa có nội dung cho bài học này.
                  </p>
                )}
              </motion.div>
            )}

            {tab === "media" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {activeLesson.video_url || activeLesson.videoUrl ? (
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950">
                    <iframe
                      title={activeLesson.title}
                      src={getYouTubeEmbedUrl(activeLesson.video_url || activeLesson.videoUrl)}
                      className="h-80 w-full"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                    <PlayCircle className="mx-auto h-10 w-10 text-emerald-600" />
                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      Chưa có video
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Admin có thể thêm video URL trong Course Builder.
                    </p>
                  </div>
                )}

                {activeLesson.image_url || activeLesson.imageUrl ? (
                  <img
                    src={getAssetUrl(activeLesson.image_url || activeLesson.imageUrl)}
                    alt={activeLesson.title}
                    className="max-h-[420px] w-full rounded-3xl object-cover"
                  />
                ) : null}

                {activeLesson.model3d_url || activeLesson.model3dUrl ? (
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <Box className="h-4 w-4 text-emerald-600" />
                        Mô hình 3D / mô phỏng
                      </div>
                      <a
                        href={activeLesson.model3d_url || activeLesson.model3dUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-600"
                      >
                        Mở link
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                    <iframe
                      title={`${activeLesson.title} - 3D`}
                      src={activeLesson.model3d_url || activeLesson.model3dUrl}
                      className="h-96 w-full"
                      allowFullScreen
                    />
                  </div>
                ) : null}
              </motion.div>
            )}

            {tab === "summary" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {summaryItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-extrabold text-emerald-700">
                      {index + 1}
                    </div>
                    <div className="text-sm leading-7 text-slate-700">{item}</div>
                  </div>
                ))}
              </motion.div>
            )}

            {tab === "quiz" && (
              <StudentQuiz
                onNav={onNav}
                mini
                courseId={activeLesson.course_id || activeLesson.courseId}
              />
            )}

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500">
                Hoàn thành bài học để cập nhật tiến độ và lịch sử.
              </div>

              <button
                onClick={markCompleted}
                disabled={progressSaving || activeLesson.id === "demo"}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                <CheckCircle2 className="h-4 w-4" />
                {progressSaving ? "Đang lưu..." : "Đánh dấu hoàn thành"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
            <SectionTitle title="Bài học trong khóa" />

            <div className="mt-4 space-y-3">
              {courseLessons.length > 0 ? (
                courseLessons.map((item, index) => {
                  const active = item.id === activeLesson.id;

                  return (
                    <button
                      key={item.id || index}
                      type="button"
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                        active
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                          active
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-slate-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="line-clamp-1 text-sm font-bold text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {item.duration_minutes || 0} phút
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  Chưa có danh sách bài học.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
            <SectionTitle title="Tài liệu đính kèm" />

            <div className="mt-4 space-y-3">
              {lessonResources.length > 0 ? (
                lessonResources.map((resource) => {
                  const Icon = resource.icon;

                  return (
                    <a
                      key={`${resource.label}-${resource.url}`}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      download={resource.download}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span className="line-clamp-1">{resource.label}</span>
                      </span>
                      {resource.download ? (
                        <Download className="h-4 w-4 shrink-0" />
                      ) : (
                        <ExternalLink className="h-4 w-4 shrink-0" />
                      )}
                    </a>
                  );
                })
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  Bài học này chưa có tài liệu, slide hoặc link tài nguyên.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[30px] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
              <Clock3 className="h-4 w-4" />
              Thời lượng gợi ý
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">
              {activeLesson.duration_minutes || 0} phút
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Học kỹ nội dung, xem media nếu có, sau đó làm quiz để kiểm tra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}