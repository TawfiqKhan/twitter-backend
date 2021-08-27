const { check, validationResult } = require("express-validator");

exports.validateRegister = [
  check("username", "Please enter a valid username").notEmpty(),
  check("password", "Password is required").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

exports.validateLogin = [
  check("username", "Please enter a valid username").notEmpty(),
  check("password", "Password is required").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

exports.validateTweet = [
  check("text", "Please enter a valid tweet").notEmpty(),
  check("userId", "User id is required").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];
exports.validateChat = [
  check("userId", "User id is required").notEmpty(),
  check("otherUserId", "otherUser id is required").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];
