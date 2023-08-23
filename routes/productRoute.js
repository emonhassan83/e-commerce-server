const express = require("express");
const {
  createProduct,
  getAProduct,
  getAllProducts,
  updateAProduct,
  deleteAProduct,
  addToWishlist,
  addToRating,
} = require("../controller/productCtrl");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware,isAdmin, createProduct);
router.get("/:id", getAProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, addToRating);

router.put("/:id", authMiddleware,isAdmin, updateAProduct);
router.delete("/:id", authMiddleware,isAdmin, deleteAProduct);
router.get("/", getAllProducts);

module.exports = router;