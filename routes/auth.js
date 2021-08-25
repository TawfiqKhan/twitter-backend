var express = require("express");
var router = express.Router();
const { registerUser } = require("../controllers/auth");

router.route("/register").post(registerUser);
module.exports = router;
