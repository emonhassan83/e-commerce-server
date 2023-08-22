const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getACategory,
  getAllCategory,
} = require("../controller/blogCategoryCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/:id", authMiddleware, getACategory);
router.get("", authMiddleware, getAllCategory);
router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;