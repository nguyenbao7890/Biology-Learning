const express = require("express");
const {
  getQuizzes,
  getQuizById,
  createQuiz,
  submitQuiz,
  getMyQuizHistory,
  deleteQuiz
} = require("../controllers/quiz.controller");

const {
  authMiddleware,
  allowRoles
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getQuizzes);
router.get("/history/my", authMiddleware, allowRoles("student"), getMyQuizHistory);
router.get("/:id", authMiddleware, getQuizById);
router.post("/", authMiddleware, allowRoles("admin"), createQuiz);
router.post("/:id/submit", authMiddleware, allowRoles("student"), submitQuiz);
router.delete("/:id", authMiddleware, allowRoles("admin"), deleteQuiz);

module.exports = router;