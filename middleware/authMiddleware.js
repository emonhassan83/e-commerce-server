const User = require("../models/userModal");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(decoded);  => { id: '64db3c6a480a24316ff952a3', iat: 1692089617, exp: 1692348817 }
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not authorized token expired. Please Login again.");
    }
  } else {
    throw new Error("There is no token attached to headers");
  }
});

const isAdmin = asyncHandler(async(req, res, next)=> {
  const {email} = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("You are not admin!")
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
