const express = require("express");
const { addComment, getCommentsForPost, removeComment } = require("../controllers/commentController");
const { verify } = require("../auth");

const router = express.Router();

router.post("/:postId", verify, addComment);
router.get("/:postId", getCommentsForPost);
router.delete("/:commentId", verify, removeComment);

module.exports = router;