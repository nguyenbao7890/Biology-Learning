const express = require("express");
const {
  getStudentOverview,
  getStudentActivities,
  createStudentActivity,
  getContinueLearning,
} = require("../controllers/student.controller");
const { authMiddleware, allowRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

// Cho admin test được API học sinh, còn học sinh vẫn dùng bình thường
router.use(allowRoles("student", "admin"));

router.get("/overview", getStudentOverview);
router.get("/activities", getStudentActivities);
router.post("/activities", createStudentActivity);
router.get("/continue-learning", getContinueLearning);

module.exports = router;