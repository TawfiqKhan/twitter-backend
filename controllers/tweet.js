const User = require("../models/User");
const Tweet = require("../models/Tweet");
const asyncHandler = require("express-async-handler");

// @route POST /tweet
// @desc Create new tweet
// @access Private
exports.createTweet = asyncHandler(async (req, res) => {
  const { text, userId } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    res.status(401);
    throw new Error("Not authorized");
  }
  const tweet = await Tweet.create({
    text,
    ownerId: user._id,
  });

  res.status(201).json(tweet);
});

// @route POST /tweet/:id
// @desc Update existing tweet
// @access Private
exports.updateTweet = asyncHandler(async (req, res) => {
  const { text, userId } = req.body;
  const tweet = await Tweet.findById(req.params.id);
  if (!tweet) {
    res.status(404);
    throw new Error("No Tweet found");
  }

  if (tweet.ownerId !== userId) {
    res.status(401);
    throw new Error("Not authorized");
  }
  tweet.text = text;
  tweet.save();
  res.status(201).json(tweet);
});
