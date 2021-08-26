const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const verifyInput = require("../utils/verifyInput");

// @route POST /auth/register
// @desc Register user
// @access Public
exports.registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  await verifyInput(req.body, res);
  const user = await User.create({
    username,
    password,
  });

  if (user) {
    const token = generateToken(user._id);
    const secondsInWeek = 604800;
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: secondsInWeek * 1000,
    });

    res.status(201).json({
      success: {
        user: {
          id: user._id,
          username: user.username,
        },
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @route POST /auth/login
// @desc Login user
// @access Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    const secondsInWeek = 604800;
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: secondsInWeek * 1000,
    });

    res.status(200).json({
      success: {
        user: {
          id: user._id,
          username: user.username,
        },
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});
