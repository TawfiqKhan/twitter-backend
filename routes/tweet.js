var express = require("express");
var router = express.Router();
const {
  createTweet,
  loadTweet,
  updateTweet,
  deleteTweet,
} = require("../controllers/tweet");
const { validateTweet } = require("../middleware/validate");

router.route("/").post(validateTweet, createTweet);
router.route("/:id").get(loadTweet);
router.route("/:id").patch(validateTweet, updateTweet);
router.route("/:id").delete(deleteTweet);
module.exports = router;
