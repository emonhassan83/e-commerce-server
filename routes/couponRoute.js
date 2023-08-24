const express = require('express');
const { createCoupon } = require('../controller/couponCtrl');
const router = express.Router();

router.post("/", createCoupon);

module.exports = router;