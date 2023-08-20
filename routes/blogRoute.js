const express = require("express");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlog,
  deleteABlog,
  likeBlog,
} = require("../controller/blogCtrl");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteABlog);
router.put("/likes", authMiddleware, likeBlog);

module.exports = router;
