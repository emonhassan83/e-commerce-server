const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModal");
const asyncHandler = require("express-async-handler");

//register a user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    //create a new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    //user already exists
    throw new Error("User already exists");
  }
});

//Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user already exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//update a user
const updateAUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const updateAUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updateAUser);
  } catch (error) {
    throw new Error(error);
  }
});

//Get all user
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

//Get a single user
const getAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getUser = await User.findById(id);
    res.json({ getUser });
  } catch (error) {
    throw new Error(error);
  }
});

//Delete a single user
const deleteAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteAUser = await User.findByIdAndDelete(id);
    res.json({ deleteAUser });
  } catch (error) {
    throw new Error(error);
  }
});

//Block a user
const blockAUser = asyncHandler(async (req, res) =>{
  const { id } = req.params;
  try {
    const block = await User.findByIdAndUpdate(id, {
      isBlocked: true,
    },
    {
      new: true,
    });
    res.json({
      message: "User blocked successfully!"
    })
  } catch (error) {
    throw new Error(error);
  }
});

//Unblock a user
const unblockAUser = asyncHandler(async (req, res) =>{
  const { id } = req.params;
  try {
    const unblock = await User.findByIdAndUpdate(id, {
      isBlocked: false,
    },
    {
      new: true,
    });
    res.json({
      message: "User unblocked successfully!"
    })
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getAllUser,
  getAUser,
  deleteAUser,
  updateAUser,
  blockAUser,
  unblockAUser,
};