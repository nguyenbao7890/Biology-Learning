const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const courseRoutes = require("./routes/course.routes");
const lessonRoutes = require("./routes/lesson.routes");
const quizRoutes = require("./routes/quiz.routes");
const marketplaceRoutes = require("./routes/marketplace.routes");
const parentRoutes = require("./routes/parent.routes");
const adminRoutes = require("./routes/admin.routes");
const uploadRoutes = require("./routes/upload.routes");
const studentRoutes = require("./routes/student.routes");
const chatbotRoutes = require("./routes/chatbot.routes");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Same-origin requests, curl/Postman, and Render's health checks do not send Origin.
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Local fallback for uploaded files. In production, upload.routes stores files in Supabase Storage.
app.use("/uploads", express.static(path.join(process.cwd(), "backend", "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ message: "Biology Learning API is running", version: "2.0.0-supabase" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Serve React build from the same Render Web Service.
const frontendBuildPath = path.join(process.cwd(), "build");
app.use(express.static(frontendBuildPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "API endpoint not found", path: req.originalUrl });
  }

  res.sendFile(path.join(frontendBuildPath, "index.html"), (err) => {
    if (err) next(err);
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File quá lớn. Vui lòng upload ảnh dưới 5MB." });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
