const express = require("express");
const {
  getAnalytics,
  getTracking,
  createAttendance,
  createScore
} = require("../controllers/admin.controller");

const {
  authMiddleware,
  allowRoles
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);
router.use(allowRoles("admin"));

router.get("/analytics", getAnalytics);
router.get("/tracking", getTracking);
router.post("/attendance", createAttendance);
router.post("/scores", createScore);

module.exports = router;