const Comment = require("../models/commentModel");
const Post = require("../models/blogModel");

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const newComment = await Comment.create({
      content,
      author: req.user.id,
      post: postId
    });

    const populatedComment = await newComment.populate("author", "username email");
    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });
    res.status(201).json(populatedComment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });

    res.json({ message: "Comment removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};