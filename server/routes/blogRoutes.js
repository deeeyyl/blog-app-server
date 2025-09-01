const express = require("express");
const { 
  createPost, 
  getPosts, 
  getPostById, 
  updatePost, 
  deletePost,
  getPostsByUser
} = require("../controllers/blogController");
const { verify } = require("../auth");
const router = express.Router();

// Public routes
router.get("/", getPosts);

// Protected routes
router.get("/my-posts", verify, getPostsByUser);
router.get("/:id", getPostById);
router.post("/", verify, createPost);
router.put("/:id", verify, updatePost);
router.delete("/:id", verify, deletePost);

module.exports = router;
