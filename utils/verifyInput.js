const User = require("../models/User");

const verifyInput = async (body, res) => {
  const { username } = body;
  const usernameExists = await User.findOne({ username });

  if (usernameExists) {
    res.status(400);
    throw new Error("A user with that username already exists");
  }
};

module.exports = verifyInput;
