const express = require("express");
const {
  getItems,
  getItemById,
  createItem,
  buyItem,
  getMyPurchases,
  updateItem,
  deleteItem
} = require("../controllers/marketplace.controller");

const {
  authMiddleware,
  allowRoles
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getItems);
router.get("/purchases/my", authMiddleware, getMyPurchases);
router.get("/:id", getItemById);
router.post("/", authMiddleware, allowRoles("admin"), createItem);
router.post("/:id/buy", authMiddleware, allowRoles("student"), buyItem);
router.put("/:id", authMiddleware, allowRoles("admin"), updateItem);
router.delete("/:id", authMiddleware, allowRoles("admin"), deleteItem);

module.exports = router;