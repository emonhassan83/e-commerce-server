const Coupon = require("../models/couponModal");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

//create a new coupon
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

//Get all coupon
const getAllCoupon = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

//Update a coupon
const updateCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbId(id);

  try {
    const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {new: true});
    res.json(updateCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

//Delete a coupon
const deleteCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbId(id);

  try {
    const deleteCoupon = await Coupon.findByIdAndDelete(id);
    res.json(deleteCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createCoupon, getAllCoupon, updateCoupon, deleteCoupon };
