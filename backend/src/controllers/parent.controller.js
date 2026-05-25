const { pool } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

async function getChildId(parentId, requestedChildId) {
  if (requestedChildId) {
    const [rows] = await pool.query(
      `
      SELECT id
      FROM users
      WHERE id = ? AND parent_id = ? AND role = 'student'
      LIMIT 1
      `,
      [requestedChildId, parentId]
    );

    if (rows.length === 0) {
      throw httpError(404, "Child not found");
    }

    return requestedChildId;
  }

  const [children] = await pool.query(
    `
    SELECT id
    FROM users
    WHERE parent_id = ? AND role = 'student'
    LIMIT 1
    `,
    [parentId]
  );

  if (children.length === 0) {
    throw httpError(404, "No child linked to this parent");
  }

  return children[0].id;
}

const getChildren = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT id, name, email, avatar, phone, status
    FROM users
    WHERE parent_id = ? AND role = 'student'
    ORDER BY name ASC
    `,
    [req.user.id]
  );

  res.json(rows);
});

const getChildOverview = asyncHandler(async (req, res) => {
  const childId = await getChildId(req.user.id, req.query.childId);

  const [[student]] = await pool.query(
    `
    SELECT id, name, email, avatar, phone
    FROM users
    WHERE id = ?
    `,
    [childId]
  );

  const [[progress]] = await pool.query(
    `
    SELECT
      COUNT(*) AS enrolled_courses,
      ROUND(AVG(progress_percent), 0) AS average_progress
    FROM course_enrollments
    WHERE user_id = ?
    `,
    [childId]
  );

  const [[score]] = await pool.query(
    `
    SELECT ROUND(AVG(score), 2) AS average_score
    FROM scores
    WHERE student_id = ?
    `,
    [childId]
  );

  const [[attendance]] = await pool.query(
    `
    SELECT
      COUNT(*) AS total_days,
      SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) AS present_days,
      SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) AS absent_days,
      SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) AS late_days
    FROM attendance
    WHERE student_id = ?
    `,
    [childId]
  );

  res.json({
    student,
    progress,
    score,
    attendance
  });
});

const getChildScores = asyncHandler(async (req, res) => {
  const childId = await getChildId(req.user.id, req.query.childId);

  const [rows] = await pool.query(
    `
    SELECT
      id,
      student_id,
      subject,
      score,
      max_score,
      type,
      note,
      CASE
        WHEN note IS NOT NULL AND note != '' THEN note
        WHEN type = 'quiz' THEN 'Bài quiz'
        WHEN type = 'assignment' THEN 'Bài tập'
        ELSE 'Kiểm tra'
      END AS title,
      created_at
    FROM scores
    WHERE student_id = ?
    ORDER BY created_at DESC
    `,
    [childId]
  );

  res.json(rows);
});

const getChildAttendance = asyncHandler(async (req, res) => {
  const childId = await getChildId(req.user.id, req.query.childId);

  const [rows] = await pool.query(
    `
    SELECT *
    FROM attendance
    WHERE student_id = ?
    ORDER BY date DESC
    `,
    [childId]
  );

  res.json(rows);
});

module.exports = {
  getChildren,
  getChildOverview,
  getChildScores,
  getChildAttendance
};