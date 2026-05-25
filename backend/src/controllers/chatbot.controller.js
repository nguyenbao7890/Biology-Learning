const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

function extractUserMessage(input) {
  if (typeof input === "string") {
    return input.trim();
  }

  if (input && typeof input === "object") {
    return String(
      input.message ||
        input.text ||
        input.content ||
        input.question ||
        input.prompt ||
        ""
    ).trim();
  }

  return "";
}

function buildPrompt(message) {
  return `
Bạn là BiopetAI, một chatbot AI thông minh trong website học tập BioSphere.

Bạn có khả năng trò chuyện tự nhiên giống một trợ lý AI bình thường.
Người dùng có thể hỏi bất cứ cách nào, không cần đúng định dạng.

PHONG CÁCH TRẢ LỜI:
- Luôn hiểu ý người dùng từ câu hỏi tự nhiên.
- Trả lời trực tiếp, rõ ràng, bằng tiếng Việt.
- Không được nói "câu hỏi chưa đầy đủ" nếu vẫn hiểu được ý chính.
- Không bắt người dùng hỏi lại nếu câu hỏi đã có nội dung.
- Nếu câu hỏi liên quan Sinh học, hãy giải thích kỹ, dễ hiểu cho học sinh.
- Nếu câu hỏi ngoài Sinh học, vẫn trả lời bình thường, nhưng ưu tiên ngắn gọn.
- Nếu người dùng hỏi sai kiến thức, hãy sửa lại nhẹ nhàng.
- Có thể dùng ví dụ, gạch đầu dòng, so sánh đơn giản.
- Không trả lời máy móc.

Câu hỏi của người dùng:
${message}

Hãy trả lời như một chatbot AI đang trò chuyện trực tiếp với người dùng.
`;
}

async function sendMessage(req, res, next) {
  try {
    const rawMessage = req.body?.message ?? req.body;
    const userMessage = extractUserMessage(rawMessage);

    console.log("BiopetAI raw body:", req.body);
    console.log("BiopetAI user message:", userMessage);

    if (!userMessage) {
      return res.status(400).json({
        message: "Vui lòng nhập nội dung câu hỏi.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (!apiKey) {
      return res.status(500).json({
        message: "Backend chưa cấu hình GEMINI_API_KEY trong file .env.",
      });
    }

    const response = await fetch(
      `${GEMINI_API_BASE_URL}/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: buildPrompt(userMessage),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
          },
        }),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.log("Gemini API error:", data);

      return res.status(response.status).json({
        message:
          data?.error?.message ||
          "Không gọi được Gemini API. Vui lòng kiểm tra API key hoặc model.",
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("\n")
        .trim() || "BiopetAI chưa tạo được câu trả lời.";

    console.log("BiopetAI reply:", reply);

    return res.json({ reply });
  } catch (error) {
    console.error("BiopetAI server error:", error);
    return next(error);
  }
}

module.exports = { sendMessage };