const jwt = require("jsonwebtoken");
const httpError = require("../utils/httpError");
const { pool } = require("../config/db");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw httpError(401, "Missing authorization token");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "biology_learning_secret_key"
    );

    const [rows] = await pool.query(
      `
      SELECT id, name, email, role, avatar, phone, status, parent_id
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [decoded.id]
    );

    if (rows.length === 0) {
      throw httpError(401, "User no longer exists");
    }

    req.user = rows[0];
    next();
  } catch (error) {
    next(httpError(401, "Invalid or expired token"));
  }
}

function allowRoles(...roles) {
  return function (req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(httpError(403, "You do not have permission"));
    }

    next();
  };
}

module.exports = {
  authMiddleware,
  allowRoles
};