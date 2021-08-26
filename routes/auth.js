var express = require("express");
var router = express.Router();
const { registerUser, loginUser } = require("../controllers/auth");
const { validateRegister, validateLogin } = require("../middleware/validate");

router.route("/register").post(validateRegister, registerUser);
router.route("/login").post(validateLogin, loginUser);
module.exports = router;
