const { v4: uuidv4 } = require("uuid");
const { pool } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const getStudentOverview = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [[courseStats]] = await pool.query(
    `
    SELECT
      COUNT(*) AS enrolled_courses,
      ROUND(AVG(progress_percent), 0) AS avg_progress,
      SUM(CASE WHEN progress_percent >= 100 THEN 1 ELSE 0 END) AS completed_courses
    FROM course_enrollments
    WHERE user_id = ?
    `,
    [userId]
  );

  const [[quizStats]] = await pool.query(
    `
    SELECT
      COUNT(*) AS quiz_count,
      ROUND(AVG(score), 1) AS avg_score
    FROM quiz_attempts
    WHERE user_id = ?
    `,
    [userId]
  );

  const [[lessonStats]] = await pool.query(
    `
    SELECT
      COUNT(*) AS completed_lessons,
      COALESCE(SUM(last_position_seconds), 0) AS total_seconds
    FROM lesson_progress
    WHERE user_id = ? AND is_completed = TRUE
    `,
    [userId]
  );

  const [recentActivities] = await pool.query(
    `
    SELECT *
    FROM student_activities
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 8
    `,
    [userId]
  );

  res.json({
    enrolledCourses: Number(courseStats.enrolled_courses || 0),
    avgProgress: Number(courseStats.avg_progress || 0),
    completedCourses: Number(courseStats.completed_courses || 0),
    quizCount: Number(quizStats.quiz_count || 0),
    avgScore: Number(quizStats.avg_score || 0),
    completedLessons: Number(lessonStats.completed_lessons || 0),
    totalHours: Number((Number(lessonStats.total_seconds || 0) / 3600).toFixed(1)),
    recentActivities,
  });
});

const getStudentActivities = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { range = "all" } = req.query;

  let dateCondition = "";

  if (range === "today") {
    dateCondition = "AND created_at::date = CURRENT_DATE";
  }

  if (range === "week") {
    dateCondition = "AND created_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'";
  }

  if (range === "month") {
    dateCondition = "AND created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'";
  }

  const [rows] = await pool.query(
    `
    SELECT *
    FROM student_activities
    WHERE user_id = ?
    ${dateCondition}
    ORDER BY created_at DESC
    LIMIT 100
    `,
    [userId]
  );

  res.json(rows);
});

const createStudentActivity = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const {
    activityType,
    title,
    lessonId,
    courseId,
    durationMinutes,
    resultText,
  } = req.body;

  const id = uuidv4();

  await pool.query(
    `
    INSERT INTO student_activities
    (
      id,
      user_id,
      activity_type,
      title,
      lesson_id,
      course_id,
      duration_minutes,
      result_text
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      userId,
      activityType || "lesson",
      title || "Hoạt động học tập",
      lessonId || null,
      courseId || null,
      Number(durationMinutes || 0),
      resultText || null,
    ]
  );

  const [rows] = await pool.query(
    "SELECT * FROM student_activities WHERE id = ?",
    [id]
  );

  res.status(201).json(rows[0]);
});

const getContinueLearning = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [rows] = await pool.query(
    `
    SELECT
      c.id,
      c.title,
      c.description,
      c.thumbnail,
      c.level,
      c.price,
      e.progress_percent,
      COUNT(l.id) AS lesson_count
    FROM course_enrollments e
    JOIN courses c ON c.id = e.course_id
    LEFT JOIN lessons l ON l.course_id = c.id
    WHERE e.user_id = ?
    GROUP BY c.id, e.progress_percent, e.updated_at
    ORDER BY e.updated_at DESC
    LIMIT 6
    `,
    [userId]
  );

  res.json(rows);
});

module.exports = {
  getStudentOverview,
  getStudentActivities,
  createStudentActivity,
  getContinueLearning,
};