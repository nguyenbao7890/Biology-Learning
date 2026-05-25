const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { pool } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET || "biology_learning_secret_key",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    }
  );
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, parentId } = req.body;

  if (!name || !email || !password) {
    throw httpError(400, "Name, email and password are required");
  }

  const selectedRole = role || "student";

  if (!["student", "parent", "admin"].includes(selectedRole)) {
    throw httpError(400, "Invalid role");
  }

  const [exists] = await pool.query(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (exists.length > 0) {
    throw httpError(409, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();

  await pool.query(
    `
    INSERT INTO users
    (id, name, email, password, role, avatar, phone, parent_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      name,
      email,
      hashedPassword,
      selectedRole,
      name.slice(0, 2).toUpperCase(),
      phone || null,
      parentId || null
    ]
  );

  const [rows] = await pool.query(
    `
    SELECT id, name, email, role, avatar, phone, status, parent_id
    FROM users
    WHERE id = ?
    `,
    [id]
  );

  const user = rows[0];
  const token = createToken(user);

  res.status(201).json({
    message: "Register success",
    token,
    user
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    throw httpError(400, "Email and password are required");
  }

  const params = role ? [email, role] : [email];

  const [rows] = await pool.query(
    `
    SELECT *
    FROM users
    WHERE email = ?
    ${role ? "AND role = ?" : ""}
    LIMIT 1
    `,
    params
  );

  if (rows.length === 0) {
    throw httpError(401, "Invalid email, password or role");
  }

  const user = rows[0];

  if (user.status !== "active") {
    throw httpError(403, "Account is not active");
  }

 let isMatch = false;

if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
  isMatch = await bcrypt.compare(password, user.password);
} else {
  isMatch = password === user.password;
}

if (!isMatch) {
  throw httpError(401, "Invalid email, password or role");
}

  const token = createToken(user);

  delete user.password;

  res.json({
    message: "Login success",
    token,
    user
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    user: req.user
  });
});

module.exports = {
  register,
  login,
  me
};