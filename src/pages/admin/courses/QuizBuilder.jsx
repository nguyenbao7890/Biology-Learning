import { Plus, Trash2 } from "lucide-react";

export default function QuizBuilder({
  quiz,
  onChangeQuiz,
  onChangeQuestion,
  onAddQuestion,
  onRemoveQuestion,
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-950">3. Quiz</h3>
          <p className="mt-1 text-sm text-slate-500">
            Tạo bài kiểm tra cho khóa học
          </p>
        </div>

        <button
          type="button"
          onClick={onAddQuestion}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4" />
          Thêm câu hỏi
        </button>
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Tên quiz
          </label>
          <input
            value={quiz.title}
            onChange={(e) => onChangeQuiz("title", e.target.value)}
            placeholder="Ví dụ: Quiz Sinh học tế bào"
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Thời gian làm bài phút
          </label>
          <input
            value={quiz.timeLimitMinutes}
            onChange={(e) => onChangeQuiz("timeLimitMinutes", e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Mô tả quiz
          </label>
          <textarea
            rows={3}
            value={quiz.description}
            onChange={(e) => onChangeQuiz("description", e.target.value)}
            placeholder="Mô tả ngắn cho bài quiz..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
          />
        </div>
      </div>

      <div className="space-y-5">
        {quiz.questions.map((question, index) => (
          <div
            key={index}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="font-bold text-slate-900">
                Câu hỏi {index + 1}
              </div>

              {quiz.questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveQuestion(index)}
                  className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nội dung câu hỏi
                </label>
                <input
                  value={question.question}
                  onChange={(e) =>
                    onChangeQuestion(index, "question", e.target.value)
                  }
                  placeholder="Nhập câu hỏi..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-400"
                />
              </div>

              {["A", "B", "C", "D"].map((option) => {
                const key = `option${option}`;

                return (
                  <div key={option}>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Đáp án {option}
                    </label>
                    <input
                      value={question[key]}
                      onChange={(e) =>
                        onChangeQuestion(index, key, e.target.value)
                      }
                      placeholder={`Nhập đáp án ${option}`}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-400"
                    />
                  </div>
                );
              })}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Đáp án đúng
                </label>
                <select
                  value={question.correctOption}
                  onChange={(e) =>
                    onChangeQuestion(index, "correctOption", e.target.value)
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-400"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Giải thích
                </label>
                <input
                  value={question.explanation}
                  onChange={(e) =>
                    onChangeQuestion(index, "explanation", e.target.value)
                  }
                  placeholder="Giải thích đáp án..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
