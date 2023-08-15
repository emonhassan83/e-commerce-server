const express = require("express");
const {
  createProduct,
  getAProduct,
  getAllProducts,
  updateAProduct,
  deleteAProduct,
} = require("../controller/productCtrl");
const router = express.Router();
const {isAdmin, authMiddleware} = require("../middleware/authMiddleware")

router.post("/", isAdmin, authMiddleware, createProduct);
router.get("/:id", getAProduct);
router.put("/:id", isAdmin, authMiddleware, updateAProduct);
router.delete("/:id", isAdmin, authMiddleware, deleteAProduct);
router.get("/", getAllProducts);

module.exports = router;

