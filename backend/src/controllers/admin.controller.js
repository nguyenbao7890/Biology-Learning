const { v4: uuidv4 } = require("uuid");
const { pool } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const getAnalytics = asyncHandler(async (req, res) => {
  const [[users]] = await pool.query(
    `
    SELECT
  COUNT(*) AS total_users,
  SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) AS total_students,
  SUM(CASE WHEN role = 'parent' THEN 1 ELSE 0 END) AS total_parents,
  SUM(CASE WHEN role = 'teacher' THEN 1 ELSE 0 END) AS total_teachers,
  SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS total_admins
FROM users
    `,
  );

  const [[courses]] = await pool.query(
    `
    SELECT
      COUNT(*) AS total_courses,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published_courses
    FROM courses
    `,
  );

  const [[lessons]] = await pool.query(
    `
    SELECT COUNT(*) AS total_lessons
    FROM lessons
    `,
  );

  const [[quizzes]] = await pool.query(
    `
    SELECT COUNT(*) AS total_quizzes
    FROM quizzes
    `,
  );

  const [[scores]] = await pool.query(
    `
    SELECT ROUND(AVG(score), 2) AS average_score
    FROM scores
    `,
  );

  const [[progress]] = await pool.query(
    `
    SELECT ROUND(AVG(progress_percent), 0) AS average_progress
    FROM course_enrollments
    `,
  );

  const [topCourses] = await pool.query(
    `
    SELECT
      c.id,
      c.title,
      COUNT(e.id) AS enrollments
    FROM courses c
    LEFT JOIN course_enrollments e ON e.course_id = c.id
    GROUP BY c.id
    ORDER BY enrollments DESC
    LIMIT 5
    `,
  );

  res.json({
    users,
    courses,
    lessons,
    quizzes,
    scores,
    progress,
    topCourses,
  });
});

const getTracking = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT
      u.id AS student_id,
      u.name AS student_name,
      u.email,
      ROUND(AVG(s.score), 2) AS average_score,
      COUNT(DISTINCT ce.id) AS enrolled_courses,
      ROUND(AVG(ce.progress_percent), 0) AS average_progress,
      COUNT(DISTINCT a.id) AS attendance_days
    FROM users u
    LEFT JOIN scores s ON s.student_id = u.id
    LEFT JOIN course_enrollments ce ON ce.user_id = u.id
    LEFT JOIN attendance a ON a.student_id = u.id
    WHERE u.role = 'student'
    GROUP BY u.id
    ORDER BY u.name ASC
    `,
  );

  res.json(rows);
});

const createAttendance = asyncHandler(async (req, res) => {
  const { studentId, date, status, note } = req.body;

  await pool.query(
    `
    INSERT INTO attendance
    (id, student_id, date, status, note)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT (student_id, date) DO UPDATE SET
      status = EXCLUDED.status,
      note = EXCLUDED.note,
      updated_at = CURRENT_TIMESTAMP
    `,
    [uuidv4(), studentId, date, status || "present", note || ""],
  );

  res.status(201).json({
    message: "Attendance saved",
  });
});

const createScore = asyncHandler(async (req, res) => {
  const { studentId, subject, score, maxScore, type, note } = req.body;

  await pool.query(
    `
    INSERT INTO scores
    (id, student_id, subject, score, max_score, type, note)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      uuidv4(),
      studentId,
      subject,
      score,
      maxScore || 10,
      type || "quiz",
      note || "",
    ],
  );

  res.status(201).json({
    message: "Score created",
  });
});

module.exports = {
  getAnalytics,
  getTracking,
  createAttendance,
  createScore,
};
