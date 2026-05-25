const { v4: uuidv4 } = require("uuid");
const { pool } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const getLessonById = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT l.*, c.title AS course_title
    FROM lessons l
    JOIN courses c ON c.id = l.course_id
    WHERE l.id = ?
    LIMIT 1
    `,
    [req.params.id]
  );

  if (rows.length === 0) {
    throw httpError(404, "Lesson not found");
  }

  let progress = null;

  if (req.user) {
    const [progressRows] = await pool.query(
      `
      SELECT is_completed, last_position_seconds, completed_at
      FROM lesson_progress
      WHERE user_id = ? AND lesson_id = ?
      LIMIT 1
      `,
      [req.user.id, req.params.id]
    );

    progress = progressRows[0] || null;
  }

  res.json({
    ...rows[0],
    progress,
  });
});

const createLesson = asyncHandler(async (req, res) => {
  const {
    courseId,
    title,
    content,
    videoUrl,
    imageUrl,
    documentUrl,
    slideUrl,
    model3dUrl,
    externalLink,
    durationMinutes,
    sortOrder,
    isFree,
  } = req.body;

  if (!courseId || !title) {
    throw httpError(400, "Course ID and title are required");
  }

  const id = uuidv4();

  await pool.query(
    `
    INSERT INTO lessons
    (
      id,
      course_id,
      title,
      content,
      video_url,
      image_url,
      document_url,
      slide_url,
      model3d_url,
      external_link,
      duration_minutes,
      sort_order,
      is_free
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      courseId,
      title,
      content || "",
      videoUrl || "",
      imageUrl || "",
      documentUrl || "",
      slideUrl || "",
      model3dUrl || "",
      externalLink || "",
      durationMinutes || 0,
      sortOrder || 0,
      Boolean(isFree),
    ]
  );

  const [rows] = await pool.query("SELECT * FROM lessons WHERE id = ?", [id]);

  res.status(201).json(rows[0]);
});

const updateLesson = asyncHandler(async (req, res) => {
  const {
    title,
    content,
    videoUrl,
    imageUrl,
    documentUrl,
    slideUrl,
    model3dUrl,
    externalLink,
    durationMinutes,
    sortOrder,
    isFree,
  } = req.body;

  const [result] = await pool.query(
    `
    UPDATE lessons
    SET
      title = COALESCE(?, title),
      content = COALESCE(?, content),
      video_url = COALESCE(?, video_url),
      image_url = COALESCE(?, image_url),
      document_url = COALESCE(?, document_url),
      slide_url = COALESCE(?, slide_url),
      model3d_url = COALESCE(?, model3d_url),
      external_link = COALESCE(?, external_link),
      duration_minutes = COALESCE(?, duration_minutes),
      sort_order = COALESCE(?, sort_order),
      is_free = COALESCE(?, is_free)
    WHERE id = ?
    `,
    [
      title || null,
      content || null,
      videoUrl || null,
      imageUrl || null,
      documentUrl || null,
      slideUrl || null,
      model3dUrl || null,
      externalLink || null,
      durationMinutes ?? null,
      sortOrder ?? null,
      isFree ?? null,
      req.params.id,
    ]
  );

  if (result.affectedRows === 0) {
    throw httpError(404, "Lesson not found");
  }

  const [rows] = await pool.query("SELECT * FROM lessons WHERE id = ?", [
    req.params.id,
  ]);

  res.json(rows[0]);
});

const deleteLesson = asyncHandler(async (req, res) => {
  const [result] = await pool.query("DELETE FROM lessons WHERE id = ?", [
    req.params.id,
  ]);

  if (result.affectedRows === 0) {
    throw httpError(404, "Lesson not found");
  }

  res.json({
    message: "Lesson deleted successfully",
  });
});

const updateLessonProgress = asyncHandler(async (req, res) => {
  const { isCompleted, lastPositionSeconds } = req.body;
  const id = uuidv4();

  await pool.query(
    `
    INSERT INTO lesson_progress
    (id, user_id, lesson_id, is_completed, last_position_seconds, completed_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT (user_id, lesson_id) DO UPDATE SET
      is_completed = EXCLUDED.is_completed,
      last_position_seconds = EXCLUDED.last_position_seconds,
      completed_at = EXCLUDED.completed_at,
      updated_at = CURRENT_TIMESTAMP
    `,
    [
      id,
      req.user.id,
      req.params.id,
      Boolean(isCompleted),
      lastPositionSeconds || 0,
      isCompleted ? new Date() : null,
    ]
  );

  await pool.query(
    `
    UPDATE course_enrollments e
    SET progress_percent = x.progress_percent
    FROM (
      SELECT
        l.course_id,
        ROUND(
          (SUM(CASE WHEN lp.is_completed = TRUE THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(l.id), 0)) * 100
        ) AS progress_percent
      FROM lessons l
      LEFT JOIN lesson_progress lp
        ON lp.lesson_id = l.id AND lp.user_id = ?
      WHERE l.course_id = (
        SELECT course_id FROM lessons WHERE id = ?
      )
      GROUP BY l.course_id
    ) x
    WHERE x.course_id = e.course_id AND e.user_id = ?
    `,
    [req.user.id, req.params.id, req.user.id]
  );

  res.json({
    message: "Lesson progress updated",
  });
});

module.exports = {
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  updateLessonProgress,
};