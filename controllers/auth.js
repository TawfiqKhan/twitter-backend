const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");

// @route POST /auth/register
// @desc Register user
// @access Public
exports.registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
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
