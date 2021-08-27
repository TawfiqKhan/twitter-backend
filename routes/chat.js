var express = require("express");
var router = express.Router();
const { sendMessage, loadChat } = require("../controllers/chat");
const { validateChat } = require("../middleware/validate");

router.route("/").post(validateChat, sendMessage);
router.route("/:id").get(loadChat);
module.exports = router;
