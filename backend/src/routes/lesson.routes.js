const express = require("express");
const {
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  updateLessonProgress
} = require("../controllers/lesson.controller");

const {
  authMiddleware,
  allowRoles
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/:id", authMiddleware, getLessonById);
router.post("/", authMiddleware, allowRoles("admin"), createLesson);
router.put("/:id", authMiddleware, allowRoles("admin"), updateLesson);
router.delete("/:id", authMiddleware, allowRoles("admin"), deleteLesson);
router.post(
  "/:id/progress",
  authMiddleware,
  allowRoles("student"),
  updateLessonProgress
);

module.exports = router;