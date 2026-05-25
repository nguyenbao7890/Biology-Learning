import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  HelpCircle,
  RefreshCcw,
  Send,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import SectionTitle from "../../components/common/SectionTitle";
import { quizApi, studentApi } from "../../services/api";
import { QUIZ_QUESTIONS } from "../../data/quiz";

const optionLetters = ["A", "B", "C", "D"];

function normalizeQuestion(question) {
  if (question.q && Array.isArray(question.opts)) {
    return {
      id: question.id || question.q,
      question: question.q,
      options: question.opts,
      correctIndex: question.ans,
      explanation: question.explanation || "",
    };
  }

  return {
    id: question.id,
    question: question.question,
    options: [
      question.option_a || question.optionA,
      question.option_b || question.optionB,
      question.option_c || question.optionC,
      question.option_d || question.optionD,
    ].filter(Boolean),
    correctIndex: optionLetters.indexOf(
      question.correct_option || question.correctOption || "A"
    ),
    explanation: question.explanation || "",
  };
}

function normalizeQuiz(quiz) {
  const rawQuestions = quiz.questions || quiz.quiz_questions || [];

  return {
    id: quiz.id || "local",
    title: quiz.title || "Kiểm tra kiến thức",
    description: quiz.description || "Làm bài quiz để kiểm tra mức độ hiểu bài.",
    timeLimitMinutes: quiz.time_limit_minutes || quiz.timeLimitMinutes || 15,
    questions: rawQuestions.map(normalizeQuestion),
  };
}

export default function StudentQuiz({ onNav, mini = false, courseId, quizId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [curr, setCurr] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(!mini);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuizzes() {
      try {
        setLoading(true);
        setError("");

        let data;

        if (quizId) {
          const quiz = await quizApi.getById(quizId);
          data = [quiz];
        } else if (courseId && quizApi.getByCourse) {
          data = await quizApi.getByCourse(courseId);
        } else {
          data = await quizApi.getAll();
        }

        const list = Array.isArray(data) ? data : [data];
        const normalized = list
          .filter(Boolean)
          .map(normalizeQuiz)
          .filter((quiz) => quiz.questions.length > 0);

        setQuizzes(normalized);
      } catch (err) {
        setError(err.message || "Không tải được quiz");
        setQuizzes([
          normalizeQuiz({
            id: "local",
            title: "Quiz demo",
            description: "Dữ liệu dự phòng khi API chưa có quiz.",
            questions: QUIZ_QUESTIONS,
          }),
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadQuizzes();
  }, [courseId, quizId]);

  const activeQuiz = useMemo(() => {
    return (
      quizzes[activeQuizIndex] ||
      normalizeQuiz({
        id: "local",
        title: "Quiz demo",
        description: "Dữ liệu dự phòng.",
        questions: QUIZ_QUESTIONS,
      })
    );
  }, [quizzes, activeQuizIndex]);

  const q = activeQuiz.questions[curr];
  const total = activeQuiz.questions.length;

  const resetQuiz = () => {
    setCurr(0);
    setSelected(null);
    setAnswers([]);
    setDone(false);
  };

  const changeQuiz = (index) => {
    setActiveQuizIndex(index);
    setCurr(0);
    setSelected(null);
    setAnswers([]);
    setDone(false);
  };

  const handleNext = async () => {
    if (selected === null) return;

    const newAnswers = [...answers, selected];

    if (curr < total - 1) {
      setAnswers(newAnswers);
      setCurr(curr + 1);
      setSelected(null);
      return;
    }

    setAnswers(newAnswers);
    setDone(true);

    const score = newAnswers.filter(
      (answer, index) => answer === activeQuiz.questions[index].correctIndex
    ).length;

    try {
      if (activeQuiz.id && activeQuiz.id !== "local" && quizApi.submit) {
        await quizApi.submit(activeQuiz.id, {
          answers: newAnswers.map((answer, index) => ({
            questionId: activeQuiz.questions[index].id,
            selectedOption: optionLetters[answer],
          })),
        });
      }

      await studentApi.createActivity({
        activityType: "quiz",
        title: `Làm quiz: ${activeQuiz.title}`,
        durationMinutes: activeQuiz.timeLimitMinutes,
        resultText: `${Math.round((score / total) * 10)}/10`,
      });
    } catch {
      // Không chặn UI nếu ghi lịch sử/submit lỗi
    }
  };

  const finalAnswers = done ? answers : answers;
  const score = finalAnswers.filter(
    (answer, index) => answer === activeQuiz.questions[index]?.correctIndex
  ).length;
  const score10 = total ? Math.round((score / total) * 10) : 0;

  if (loading) {
    return (
      <div className={mini ? "" : "space-y-6"}>
        {!mini && (
          <SectionTitle
            title="Kiểm tra kiến thức"
            sub="Đang tải quiz từ backend..."
          />
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 h-5 w-40 animate-pulse rounded-full bg-slate-100" />
          <div className="h-24 animate-pulse rounded-3xl bg-slate-100" />
          <div className="mt-5 grid gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className={mini ? "" : "space-y-6"}>
        {!mini && (
          <SectionTitle
            title="Kiểm tra kiến thức"
            sub="Không có câu hỏi để hiển thị"
          />
        )}

        <div className="rounded-3xl border border-dashed border-emerald-200 bg-white p-10 text-center shadow-sm">
          <HelpCircle className="mx-auto h-10 w-10 text-emerald-600" />
          <h3 className="mt-4 text-lg font-bold text-slate-900">
            Chưa có quiz
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Admin cần tạo quiz cho khóa học trước.
          </p>
        </div>
      </div>
    );
  }

  if (done) {
    const passed = score10 >= 7;

    return (
      <div className={mini ? "" : "space-y-6"}>
        {!mini && (
          <SectionTitle
            title="Kết quả kiểm tra"
            sub={`Quiz: ${activeQuiz.title}`}
          />
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="rounded-[30px] border border-emerald-200 bg-white p-8 text-center shadow-sm"
        >
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl ${
              passed ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
            }`}
          >
            {passed ? <Trophy className="h-10 w-10" /> : <Sparkles className="h-10 w-10" />}
          </div>

          <div className="mt-5 text-3xl font-extrabold text-slate-900">
            {score}/{total} câu đúng
          </div>

          <div className="mt-2 text-lg font-bold text-emerald-700">
            Điểm: {score10}/10
          </div>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
            {passed
              ? "Làm tốt lắm. Bạn đã nắm khá chắc nội dung bài học."
              : "Bạn nên xem lại phần lý thuyết và làm lại quiz một lần nữa."}
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={resetQuiz}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Làm lại
            </button>

            {!mini && (
              <button
                onClick={() => onNav?.("courses")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                Về khóa học
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={mini ? "" : "space-y-6"}>
      {!mini && (
        <SectionTitle
          title="Kiểm tra kiến thức"
          sub={`Câu ${curr + 1}/${total}`}
        />
      )}

      {error && !mini && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-700">
          {error}
        </div>
      )}

      {!mini && quizzes.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {quizzes.map((quiz, index) => (
            <button
              key={quiz.id || index}
              onClick={() => changeQuiz(index)}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                activeQuizIndex === index
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {quiz.title}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <HelpCircle className="h-3.5 w-3.5" />
              Câu {curr + 1}/{total}
            </div>

            <h3 className="mt-3 text-xl font-extrabold text-slate-900">
              {activeQuiz.title}
            </h3>

            {!mini && (
              <p className="mt-1 text-sm text-slate-500">
                {activeQuiz.description}
              </p>
            )}
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
            <Clock3 className="h-4 w-4" />
            {activeQuiz.timeLimitMinutes} phút
          </div>
        </div>

        <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${((curr + 1) / total) * 100}%` }}
          />
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <div className="text-lg font-bold leading-8 text-slate-900">
            {q.question}
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {q.options.map((opt, index) => {
            const active = selected === index;

            return (
              <button
                key={`${q.id}-${index}`}
                onClick={() => setSelected(index)}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/40"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                    active
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {optionLetters[index]}
                </span>

                <span className="pt-1 text-sm font-semibold leading-6">
                  {opt}
                </span>

                {active && <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={selected === null}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          {curr < total - 1 ? "Câu tiếp theo" : "Nộp bài"}
          {curr < total - 1 ? (
            <ArrowRight className="h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}