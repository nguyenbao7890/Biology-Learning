import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import SectionTitle from "../../../components/common/SectionTitle";
import { courseApi, lessonApi, quizApi, uploadApi } from "../../../services/api";
import CourseStats from "./CourseStats";
import CourseInfoForm from "./CourseInfoForm";
import LessonBuilder from "./LessonBuilder";
import QuizBuilder from "./QuizBuilder";
import CourseList from "./CourseList";
import {
  emptyCourseForm,
  emptyLesson,
  emptyQuestion,
} from "./courseBuilderUtils";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyCourseForm());
  const [lessons, setLessons] = useState([emptyLesson()]);
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    timeLimitMinutes: 15,
    questions: [emptyQuestion()],
  });

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await courseApi.getAll();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      alert(error.message || "Không tải được khóa học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const stats = useMemo(() => {
    return {
      total: courses.length,
      published: courses.filter((c) => c.status === "published").length,
      draft: courses.filter((c) => c.status === "draft").length,
    };
  }, [courses]);

  const changeForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const changeLesson = (index, key, value) => {
    setLessons((prev) =>
      prev.map((lesson, i) =>
        i === index ? { ...lesson, [key]: value } : lesson
      )
    );
  };

  const changeQuiz = (key, value) => {
    setQuiz((prev) => ({ ...prev, [key]: value }));
  };

  const changeQuestion = (index, key, value) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((question, i) =>
        i === index ? { ...question, [key]: value } : question
      ),
    }));
  };

  const addLesson = () => {
    setLessons((prev) => [...prev, emptyLesson()]);
  };

  const removeLesson = (index) => {
    setLessons((prev) => prev.filter((_, i) => i !== index));
  };

  const addQuestion = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, emptyQuestion()],
    }));
  };

  const removeQuestion = (index) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const uploadCourseImage = async (file) => {
    if (!file) return;

    try {
      const data = await uploadApi.image("courses", file);
      changeForm("thumbnail", data.url);
    } catch (error) {
      alert(error.message || "Upload ảnh thất bại");
    }
  };

  const uploadLessonImage = async (index, file) => {
    if (!file) return;

    try {
      const data = await uploadApi.image("lessons", file);
      changeLesson(index, "imageUrl", data.url);
    } catch (error) {
      alert(error.message || "Upload ảnh thất bại");
    }
  };

  const uploadLessonFile = async (index, field, type, file) => {
    if (!file) return;

    try {
      const data = await uploadApi.file(type, file);
      changeLesson(index, field, data.url);
    } catch (error) {
      alert(error.message || "Upload tài liệu thất bại");
    }
  };

  const resetBuilder = () => {
    setForm(emptyCourseForm());
    setLessons([emptyLesson()]);
    setQuiz({
      title: "",
      description: "",
      timeLimitMinutes: 15,
      questions: [emptyQuestion()],
    });
  };

  const saveFullCourse = async () => {
    if (!form.title.trim()) {
      alert("Nhập tên khóa học");
      return;
    }

    const validLessons = lessons.filter((lesson) => lesson.title.trim());

    if (validLessons.length === 0) {
      alert("Cần ít nhất 1 bài học");
      return;
    }

    const validQuestions = quiz.questions.filter((q) => q.question.trim());

    try {
      setSaving(true);

      const createdCourse = await courseApi.create({
        title: form.title,
        description: form.description,
        level: form.level,
        price: Number(form.price || 0),
        status: form.status,
        thumbnail: form.thumbnail,
      });

      for (let i = 0; i < validLessons.length; i++) {
        const lesson = validLessons[i];

        await lessonApi.create({
          courseId: createdCourse.id,
          title: lesson.title,
          content: lesson.content,
          videoUrl: lesson.videoUrl,
          imageUrl: lesson.imageUrl,
          documentUrl: lesson.documentUrl,
          slideUrl: lesson.slideUrl,
          model3dUrl: lesson.model3dUrl,
          externalLink: lesson.externalLink,
          durationMinutes: Number(lesson.durationMinutes || 0),
          sortOrder: i + 1,
          isFree: Boolean(lesson.isFree),
        });
      }

      if (quiz.title.trim() && validQuestions.length > 0) {
        await quizApi.create({
          courseId: createdCourse.id,
          title: quiz.title,
          description: quiz.description,
          timeLimitMinutes: Number(quiz.timeLimitMinutes || 15),
          questions: validQuestions,
        });
      }

      alert("Đã tạo khóa học đầy đủ");
      resetBuilder();
      await loadCourses();
    } catch (error) {
      alert(error.message || "Không lưu được khóa học đầy đủ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Xóa khóa học này?");

    if (!ok) return;

    try {
      await courseApi.delete(id);
      await loadCourses();
    } catch (error) {
      alert(error.message || "Không xóa được khóa học");
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Course Builder"
        sub="Admin có thể tạo khóa học đầy đủ: ảnh, bài học, nội dung và quiz"
      />

      <CourseStats stats={stats} />

      <CourseInfoForm
        form={form}
        onChange={changeForm}
        onUploadCourseImage={uploadCourseImage}
      />

      <LessonBuilder
        lessons={lessons}
        onAddLesson={addLesson}
        onRemoveLesson={removeLesson}
        onChangeLesson={changeLesson}
        onUploadLessonImage={uploadLessonImage}
        onUploadLessonFile={uploadLessonFile}
      />

      <QuizBuilder
        quiz={quiz}
        onChangeQuiz={changeQuiz}
        onChangeQuestion={changeQuestion}
        onAddQuestion={addQuestion}
        onRemoveQuestion={removeQuestion}
      />

      <div className="sticky bottom-4 z-10 rounded-[28px] border border-emerald-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
        <button
          type="button"
          disabled={saving}
          onClick={saveFullCourse}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:scale-[1.01] disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Đang lưu khóa học..." : "Lưu khóa học đầy đủ"}
        </button>
      </div>

      <CourseList courses={courses} loading={loading} onDelete={handleDelete} />
    </div>
  );
}
