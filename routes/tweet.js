var express = require("express");
var router = express.Router();
const { createTweet } = require("../controllers/tweet");
// const { validateRegister, validateLogin } = require("../middleware/validate");

router.route("/").post(createTweet);
module.exports = router;
