const jwt = require("jsonwebtoken");
const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModal");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");

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
    //apply cookies
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser?.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
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

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error("There is no Refresh token in Cookies!");
  const refreshToken = cookie.refreshToken;
  //console.log(refreshToken);
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("There is no Refresh token in db or not matched!");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decode) => {
    if (err || user.id !== decode.id) {
      throw new Error("There is something wrong with the refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

//Logout functionality
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error("There is no Refresh token in Cookies!");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbidden
  }
  const filter = { refreshToken: refreshToken };
  await User.findOneAndUpdate(filter, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); //forbidden
});

//update a user
const updateAUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  //validate id
  validateMongodbId(_id);
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
  //validate id
  validateMongodbId(_id);
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
const blockAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //validate id
  validateMongodbId(_id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User blocked successfully!",
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Unblock a user
const unblockAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //validate id
  validateMongodbId(_id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User unblocked successfully!",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const password = req.body;
  const newPassword = req.body.password;
  //validate id
  validateMongodbId(_id);
  const user = await User.findById(_id);

  if (password) {
    user.password = newPassword;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.json(user);
  }
});

//TODO: its not working my code 
const forgetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}' >Click Here</a>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forget Password Link",
      htm: resetURL,
    }
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const {password} = req.body;
  const {token} = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, Please try again later.");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  res.json(user);
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
  handleRefreshToken,
  logout,
  updatePassword,
  forgetPasswordToken,
  resetPassword,
};
