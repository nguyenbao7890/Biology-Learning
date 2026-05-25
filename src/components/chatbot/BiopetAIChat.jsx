import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { chatbotApi } from "../../services/api";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Xin chào! Mình là BiopetAI 🌱 Bạn có thể hỏi mình các câu hỏi về sinh học nhé, mình sẽgiúp bạn giải đáp.",
};

export default function BiopetAIChat({ user }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const sendMessage = async (event) => {
    event?.preventDefault();

    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const history = nextMessages
        .filter((message) => message !== WELCOME_MESSAGE)
        .slice(-10)
        .map((message) => ({
          role: message.role,
          content: message.content,
        }));

      const data = await chatbotApi.sendMessage({ message: text, history });

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply || "Mình chưa có câu trả lời phù hợp. Bạn thử hỏi lại rõ hơn nhé.",
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error.message ||
            "BiopetAI đang gặp lỗi kết nối. Bạn kiểm tra backend và GEMINI_API_KEY rồi thử lại nhé.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <section className="w-[calc(100vw-2.5rem)] overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl shadow-emerald-900/20 sm:w-[390px]">
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold leading-tight">BiopetAI</h2>
                <p className="text-xs text-emerald-50">
                  Trợ lý Sinh học cho {user?.name || "bạn"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-white/90 transition hover:bg-white/15 hover:text-white"
              aria-label="Đóng BiopetAI"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={listRef} className="h-[430px] space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div key={`${message.role}-${index}`} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? "rounded-br-md bg-emerald-500 text-white"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  BiopetAI đang suy nghĩ...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-100 bg-white p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Hỏi BiopetAI về Sinh học..."
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              maxLength={2000}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Gửi tin nhắn"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-4 font-semibold text-white shadow-2xl shadow-emerald-900/25 transition hover:-translate-y-0.5 hover:shadow-emerald-900/30"
        aria-label="Mở BiopetAI"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="hidden sm:inline">BiopetAI</span>
      </button>
    </div>
  );
}
