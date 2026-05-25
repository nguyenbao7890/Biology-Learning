const express = require("express");
const {
  getChildren,
  getChildOverview,
  getChildScores,
  getChildAttendance
} = require("../controllers/parent.controller");

const {
  authMiddleware,
  allowRoles
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);
router.use(allowRoles("parent"));

router.get("/children", getChildren);
router.get("/overview", getChildOverview);
router.get("/scores", getChildScores);
router.get("/attendance", getChildAttendance);

module.exports = router;