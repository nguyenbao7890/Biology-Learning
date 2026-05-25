const { v4: uuidv4 } = require("uuid");
const { pool } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const getQuizzes = asyncHandler(async (req, res) => {
  const { courseId } = req.query;

  const params = [];
  let where = "";

  if (courseId) {
    where = "WHERE q.course_id = ?";
    params.push(courseId);
  }

  const [rows] = await pool.query(
    `
    SELECT
      q.*,
      c.title AS course_title,
      COUNT(qq.id) AS question_count
    FROM quizzes q
    JOIN courses c ON c.id = q.course_id
    LEFT JOIN quiz_questions qq ON qq.quiz_id = q.id
    ${where}
    GROUP BY q.id
    ORDER BY q.created_at DESC
    `,
    params
  );

  res.json(rows);
});

const getQuizById = asyncHandler(async (req, res) => {
  const [quizRows] = await pool.query(
    `
    SELECT q.*, c.title AS course_title
    FROM quizzes q
    JOIN courses c ON c.id = q.course_id
    WHERE q.id = ?
    LIMIT 1
    `,
    [req.params.id]
  );

  if (quizRows.length === 0) {
    throw httpError(404, "Quiz not found");
  }

  const [questions] = await pool.query(
    `
    SELECT
      id,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      explanation,
      sort_order
    FROM quiz_questions
    WHERE quiz_id = ?
    ORDER BY sort_order ASC
    `,
    [req.params.id]
  );

  res.json({
    ...quizRows[0],
    questions
  });
});

const createQuiz = asyncHandler(async (req, res) => {
  const { courseId, title, description, timeLimitMinutes, questions } = req.body;

  if (!courseId || !title) {
    throw httpError(400, "Course ID and title are required");
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const quizId = uuidv4();

    await connection.query(
      `
      INSERT INTO quizzes
      (id, course_id, title, description, time_limit_minutes)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        quizId,
        courseId,
        title,
        description || "",
        timeLimitMinutes || 15
      ]
    );

    if (Array.isArray(questions)) {
      for (let index = 0; index < questions.length; index++) {
        const q = questions[index];

        await connection.query(
          `
          INSERT INTO quiz_questions
          (
            id, quiz_id, question,
            option_a, option_b, option_c, option_d,
            correct_option, explanation, sort_order
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            uuidv4(),
            quizId,
            q.question,
            q.optionA,
            q.optionB,
            q.optionC,
            q.optionD,
            q.correctOption,
            q.explanation || "",
            index + 1
          ]
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      id: quizId,
      message: "Quiz created successfully"
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

const submitQuiz = asyncHandler(async (req, res) => {
  const { answers } = req.body;

  if (!answers || typeof answers !== "object") {
    throw httpError(400, "Answers are required");
  }

  const [questions] = await pool.query(
    `
    SELECT *
    FROM quiz_questions
    WHERE quiz_id = ?
    ORDER BY sort_order ASC
    `,
    [req.params.id]
  );

  if (questions.length === 0) {
    throw httpError(404, "Quiz not found or has no questions");
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const attemptId = uuidv4();
    let correctCount = 0;

    const answerResults = [];

    for (const question of questions) {
      const selectedOption = answers[question.id];
      const isCorrect = selectedOption === question.correct_option;

      if (isCorrect) {
        correctCount += 1;
      }

      answerResults.push({
        questionId: question.id,
        selectedOption,
        correctOption: question.correct_option,
        isCorrect,
        explanation: question.explanation
      });
    }

    const totalQuestions = questions.length;
    const score = Number(((correctCount / totalQuestions) * 10).toFixed(2));

    await connection.query(
      `
      INSERT INTO quiz_attempts
      (id, user_id, quiz_id, score, correct_count, total_questions, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        attemptId,
        req.user.id,
        req.params.id,
        score,
        correctCount,
        totalQuestions
      ]
    );

    for (const answer of answerResults) {
      if (!answer.selectedOption) continue;

      await connection.query(
        `
        INSERT INTO quiz_attempt_answers
        (id, attempt_id, question_id, selected_option, is_correct)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          uuidv4(),
          attemptId,
          answer.questionId,
          answer.selectedOption,
          answer.isCorrect
        ]
      );
    }

    const [quizRows] = await connection.query(
      `
      SELECT q.title, c.title AS course_title
      FROM quizzes q
      JOIN courses c ON c.id = q.course_id
      WHERE q.id = ?
      LIMIT 1
      `,
      [req.params.id]
    );

    await connection.query(
      `
      INSERT INTO scores
      (id, student_id, subject, score, max_score, type, note)
      VALUES (?, ?, ?, ?, 10, 'quiz', ?)
      `,
      [
        uuidv4(),
        req.user.id,
        quizRows[0].course_title,
        score,
        quizRows[0].title
      ]
    );

    await connection.commit();

    res.json({
      attemptId,
      score,
      correctCount,
      totalQuestions,
      answers: answerResults
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

const getMyQuizHistory = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT
      a.*,
      q.title AS quiz_title,
      c.title AS course_title
    FROM quiz_attempts a
    JOIN quizzes q ON q.id = a.quiz_id
    JOIN courses c ON c.id = q.course_id
    WHERE a.user_id = ?
    ORDER BY a.submitted_at DESC
    `,
    [req.user.id]
  );

  res.json(rows);
});

const deleteQuiz = asyncHandler(async (req, res) => {
  const [result] = await pool.query("DELETE FROM quizzes WHERE id = ?", [
    req.params.id
  ]);

  if (result.affectedRows === 0) {
    throw httpError(404, "Quiz not found");
  }

  res.json({
    message: "Quiz deleted successfully"
  });
});

module.exports = {
  getQuizzes,
  getQuizById,
  createQuiz,
  submitQuiz,
  getMyQuizHistory,
  deleteQuiz
};