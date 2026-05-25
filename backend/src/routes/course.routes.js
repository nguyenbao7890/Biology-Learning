const express = require("express");
const {
  getCourses,
  getMyCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse
} = require("../controllers/course.controller");

const {
  authMiddleware,
  allowRoles
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getCourses);
router.get("/my", authMiddleware, allowRoles("student"), getMyCourses);
router.get("/:id", getCourseById);
router.post("/", authMiddleware, allowRoles("admin"), createCourse);
router.put("/:id", authMiddleware, allowRoles("admin"), updateCourse);
router.delete("/:id", authMiddleware, allowRoles("admin"), deleteCourse);
router.post("/:id/enroll", authMiddleware, allowRoles("student"), enrollCourse);

module.exports = router;