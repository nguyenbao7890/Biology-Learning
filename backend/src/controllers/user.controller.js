const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { pool } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const getUsers = asyncHandler(async (req, res) => {
  const { role, keyword } = req.query;

  const conditions = [];
  const params = [];

  if (role) {
    conditions.push("role = ?");
    params.push(role);
  }

  if (keyword) {
    conditions.push("(name LIKE ? OR email LIKE ?)");
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [rows] = await pool.query(
    `
    SELECT id, name, email, role, avatar, phone, status, parent_id, created_at
    FROM users
    ${where}
    ORDER BY created_at DESC
    `,
    params
  );

  res.json(rows);
});

const getUserById = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT id, name, email, role, avatar, phone, status, parent_id, created_at
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [req.params.id]
  );

  if (rows.length === 0) {
    throw httpError(404, "User not found");
  }

  res.json(rows[0]);
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, status, parentId } = req.body;

  if (!name || !email || !password || !role) {
    throw httpError(400, "Name, email, password and role are required");
  }

  const [exists] = await pool.query(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (exists.length > 0) {
    throw httpError(409, "Email already exists");
  }

  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    `
    INSERT INTO users
    (id, name, email, password, role, avatar, phone, status, parent_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      name,
      email,
      hashedPassword,
      role,
      name.slice(0, 2).toUpperCase(),
      phone || null,
      status || "active",
      parentId || null
    ]
  );

  const [rows] = await pool.query(
    `
    SELECT id, name, email, role, avatar, phone, status, parent_id, created_at
    FROM users
    WHERE id = ?
    `,
    [id]
  );

  res.status(201).json(rows[0]);
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, phone, status, parentId } = req.body;

  const updateParent = Object.prototype.hasOwnProperty.call(req.body, "parentId");

  if (updateParent) {
    await pool.query(
      `
      UPDATE users
      SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        role = COALESCE(?, role),
        phone = COALESCE(?, phone),
        status = COALESCE(?, status),
        parent_id = ?
      WHERE id = ?
      `,
      [
        name || null,
        email || null,
        role || null,
        phone || null,
        status || null,
        parentId || null,
        req.params.id,
      ]
    );
  } else {
    await pool.query(
      `
      UPDATE users
      SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        role = COALESCE(?, role),
        phone = COALESCE(?, phone),
        status = COALESCE(?, status)
      WHERE id = ?
      `,
      [
        name || null,
        email || null,
        role || null,
        phone || null,
        status || null,
        req.params.id,
      ]
    );
  }

  const [rows] = await pool.query(
    `
    SELECT id, name, email, role, avatar, phone, status, parent_id, created_at
    FROM users
    WHERE id = ?
    `,
    [req.params.id]
  );

  if (rows.length === 0) {
    throw httpError(404, "User not found");
  }

  res.json(rows[0]);
});

const deleteUser = asyncHandler(async (req, res) => {
  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [
    req.params.id
  ]);

  if (result.affectedRows === 0) {
    throw httpError(404, "User not found");
  }

  res.json({
    message: "User deleted successfully"
  });
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};