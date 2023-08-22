const express = require("express");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getABrand,
  getAllBrand,
} = require("../controller/brandCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/:id", authMiddleware, getABrand);
router.get("", authMiddleware, getAllBrand);
router.post("/", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);

module.exports = router;