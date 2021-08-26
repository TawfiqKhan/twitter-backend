var express = require("express");
var router = express.Router();
const {
  createTweet,
  loadTweet,
  updateTweet,
  deleteTweet,
} = require("../controllers/tweet");

router.route("/").post(createTweet);
router.route("/:id").get(loadTweet);
router.route("/:id").patch(updateTweet);
router.route("/:id").delete(deleteTweet);
module.exports = router;
