const { v4: uuidv4 } = require("uuid");
const { pool } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const getItems = asyncHandler(async (req, res) => {
  const { type, keyword } = req.query;

  const conditions = ["status = 'active'"];
  const params = [];

  if (type) {
    conditions.push("type = ?");
    params.push(type);
  }

  if (keyword) {
    conditions.push("(title LIKE ? OR description LIKE ?)");
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  const [rows] = await pool.query(
    `
    SELECT *
    FROM marketplace_items
    WHERE ${conditions.join(" AND ")}
    ORDER BY created_at DESC
    `,
    params
  );

  res.json(rows);
});

const getItemById = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM marketplace_items
    WHERE id = ?
    LIMIT 1
    `,
    [req.params.id]
  );

  if (rows.length === 0) {
    throw httpError(404, "Marketplace item not found");
  }

  res.json(rows[0]);
});

const createItem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    type,
    price,
    imageUrl,
    fileUrl,
    rating,
    status
  } = req.body;

  if (!title) {
    throw httpError(400, "Title is required");
  }

  const id = uuidv4();

  await pool.query(
    `
    INSERT INTO marketplace_items
    (id, title, description, type, price, image_url, file_url, rating, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      title,
      description || "",
      type || "document",
      price || 0,
      imageUrl || "",
      fileUrl || "",
      rating || 0,
      status || "active"
    ]
  );

  const [rows] = await pool.query(
    "SELECT * FROM marketplace_items WHERE id = ?",
    [id]
  );

  res.status(201).json(rows[0]);
});

const buyItem = asyncHandler(async (req, res) => {
  const [items] = await pool.query(
    `
    SELECT *
    FROM marketplace_items
    WHERE id = ? AND status = 'active'
    LIMIT 1
    `,
    [req.params.id]
  );

  if (items.length === 0) {
    throw httpError(404, "Marketplace item not found");
  }

  const item = items[0];

  await pool.query(
    `
    INSERT INTO purchases
    (id, user_id, item_id, amount, status)
    VALUES (?, ?, ?, ?, 'paid')
    ON CONFLICT (user_id, item_id) DO UPDATE SET
      amount = EXCLUDED.amount,
      status = 'paid',
      purchased_at = CURRENT_TIMESTAMP
    `,
    [uuidv4(), req.user.id, item.id, item.price]
  );

  res.status(201).json({
    message: "Purchase success",
    item
  });
});

const getMyPurchases = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT
      p.id AS purchase_id,
      p.amount,
      p.status AS purchase_status,
      p.purchased_at,
      m.*
    FROM purchases p
    JOIN marketplace_items m ON m.id = p.item_id
    WHERE p.user_id = ?
    ORDER BY p.purchased_at DESC
    `,
    [req.user.id]
  );

  res.json(rows);
});

const updateItem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    type,
    price,
    imageUrl,
    fileUrl,
    rating,
    status
  } = req.body;

  const [result] = await pool.query(
    `
    UPDATE marketplace_items
    SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      type = COALESCE(?, type),
      price = COALESCE(?, price),
      image_url = COALESCE(?, image_url),
      file_url = COALESCE(?, file_url),
      rating = COALESCE(?, rating),
      status = COALESCE(?, status)
    WHERE id = ?
    `,
    [
      title || null,
      description || null,
      type || null,
      price ?? null,
      imageUrl || null,
      fileUrl || null,
      rating ?? null,
      status || null,
      req.params.id
    ]
  );

  if (result.affectedRows === 0) {
    throw httpError(404, "Marketplace item not found");
  }

  const [rows] = await pool.query(
    "SELECT * FROM marketplace_items WHERE id = ?",
    [req.params.id]
  );

  res.json(rows[0]);
});

const deleteItem = asyncHandler(async (req, res) => {
  const [result] = await pool.query(
    "DELETE FROM marketplace_items WHERE id = ?",
    [req.params.id]
  );

  if (result.affectedRows === 0) {
    throw httpError(404, "Marketplace item not found");
  }

  res.json({
    message: "Marketplace item deleted successfully"
  });
});

module.exports = {
  getItems,
  getItemById,
  createItem,
  buyItem,
  getMyPurchases,
  updateItem,
  deleteItem
};