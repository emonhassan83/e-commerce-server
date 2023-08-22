const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getACategory,
  getAllCategory,
} = require("../controller/prodCategoryCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);
router.get("/:id", authMiddleware, getACategory);
router.get("", authMiddleware, getAllCategory);

module.exports = router;
