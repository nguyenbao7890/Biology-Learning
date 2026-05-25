const { v4: uuidv4 } = require("uuid");
const { pool } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const getCourses = asyncHandler(async (req, res) => {
  const { level, status, keyword } = req.query;

  const conditions = [];
  const params = [];

  if (level) {
    conditions.push("c.level = ?");
    params.push(level);
  }

  if (status) {
    conditions.push("c.status = ?");
    params.push(status);
  } else {
    conditions.push("c.status = 'published'");
  }

  if (keyword) {
    conditions.push("(c.title LIKE ? OR c.description LIKE ?)");
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [rows] = await pool.query(
    `
    SELECT
      c.*,
      COUNT(DISTINCT l.id) AS lesson_count,
      COUNT(DISTINCT e.id) AS student_count
    FROM courses c
    LEFT JOIN lessons l ON l.course_id = c.id
    LEFT JOIN course_enrollments e ON e.course_id = c.id
    ${where}
    GROUP BY c.id
    ORDER BY c.created_at DESC
    `,
    params
  );

  res.json(rows);
});

const getMyCourses = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT
      c.*,
      e.progress_percent,
      e.enrolled_at,
      COUNT(l.id) AS lesson_count
    FROM course_enrollments e
    JOIN courses c ON c.id = e.course_id
    LEFT JOIN lessons l ON l.course_id = c.id
    WHERE e.user_id = ?
    GROUP BY c.id, e.id
    ORDER BY e.enrolled_at DESC
    `,
    [req.user.id]
  );

  res.json(rows);
});

const getCourseById = asyncHandler(async (req, res) => {
  const [courses] = await pool.query(
    `
    SELECT
      c.*,
      COUNT(DISTINCT l.id) AS lesson_count,
      COUNT(DISTINCT q.id) AS quiz_count
    FROM courses c
    LEFT JOIN lessons l ON l.course_id = c.id
    LEFT JOIN quizzes q ON q.course_id = c.id
    WHERE c.id = ?
    GROUP BY c.id
    LIMIT 1
    `,
    [req.params.id]
  );

  if (courses.length === 0) {
    throw httpError(404, "Course not found");
  }

  const [lessons] = await pool.query(
    `
    SELECT *
    FROM lessons
    WHERE course_id = ?
    ORDER BY sort_order ASC, created_at ASC
    `,
    [req.params.id]
  );

  const [quizzes] = await pool.query(
    `
    SELECT id, title, description, time_limit_minutes
    FROM quizzes
    WHERE course_id = ?
    ORDER BY created_at ASC
    `,
    [req.params.id]
  );

  res.json({
    ...courses[0],
    lessons,
    quizzes
  });
});

const createCourse = asyncHandler(async (req, res) => {
  const { title, description, thumbnail, level, price, status } = req.body;

  if (!title) {
    throw httpError(400, "Course title is required");
  }

  const id = uuidv4();

  await pool.query(
    `
    INSERT INTO courses
    (id, title, description, thumbnail, level, price, status, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      title,
      description || "",
      thumbnail || "",
      level || "basic",
      price || 0,
      status || "published",
      req.user.id
    ]
  );

  const [rows] = await pool.query("SELECT * FROM courses WHERE id = ?", [id]);

  res.status(201).json(rows[0]);
});

const updateCourse = asyncHandler(async (req, res) => {
  const { title, description, thumbnail, level, price, status } = req.body;

  const [result] = await pool.query(
    `
    UPDATE courses
    SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      thumbnail = COALESCE(?, thumbnail),
      level = COALESCE(?, level),
      price = COALESCE(?, price),
      status = COALESCE(?, status)
    WHERE id = ?
    `,
    [
      title || null,
      description || null,
      thumbnail || null,
      level || null,
      price ?? null,
      status || null,
      req.params.id
    ]
  );

  if (result.affectedRows === 0) {
    throw httpError(404, "Course not found");
  }

  const [rows] = await pool.query("SELECT * FROM courses WHERE id = ?", [
    req.params.id
  ]);

  res.json(rows[0]);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const [result] = await pool.query("DELETE FROM courses WHERE id = ?", [
    req.params.id
  ]);

  if (result.affectedRows === 0) {
    throw httpError(404, "Course not found");
  }

  res.json({
    message: "Course deleted successfully"
  });
});

const enrollCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const id = uuidv4();

  await pool.query(
    `
    INSERT INTO course_enrollments
    (id, user_id, course_id, progress_percent)
    VALUES (?, ?, ?, 0)
    ON CONFLICT (user_id, course_id) DO NOTHING
    `,
    [id, req.user.id, courseId]
  );

  res.status(201).json({
    message: "Enrolled successfully"
  });
});

module.exports = {
  getCourses,
  getMyCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse
};