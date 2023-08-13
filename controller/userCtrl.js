const User = require("../models/userModal");
const asyncHandler = require("express-async-handler");

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      //create a new user
      const newUser = await User.create(req.body);
      res.json(
          newUser
          );
    } else {
      //user already exists
      throw new Error("User already exists")
    }
  });

module.exports = { createUser };
