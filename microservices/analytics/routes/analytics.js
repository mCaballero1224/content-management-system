const express = require("express");
const mongoose = require("mongoose");
const blogPosts = require("../models/BlogPost");
const router = express.Router();

/* POST /views/:postId
  * Increment views
  */
router.post("/views/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    // Increment the view count
    const updatedPost = await blogPosts.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true } // Return the updated document
    );
    console.log(updatedPost);
    // Check if the post was found
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating views:", error.message);
    res.status(500).json({ error: "Failed to update views." });
  }
});

/* POST /likes/:postId
  * Increment likes
  */
router.post("/likes/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    // Increment the view count
    const updatedPost = await blogPosts.findByIdAndUpdate(
      postId,
      { $inc: { likes: 1 } },
      { new: true } // Return the updated document
    );
    console.log(updatedPost);
    // Check if the post was found
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating likes:", error.message);
    res.status(500).json({ error: "Failed to update likes." });
  }
});

/* POST /dislikes/:postId
  * Increment dislikes
  */
router.post("/dislikes/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    // Increment the view count
    const updatedPost = await blogPosts.findByIdAndUpdate(
      postId,
      { $inc: { dislikes: 1 } },
      { new: true } // Return the updated document
    );
    console.log(updatedPost);
    // Check if the post was found
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating dislikes:", error.message);
    res.status(500).json({ error: "Failed to update dislikes." });
  }
});

/* POST /comments/:postId
  * Add a comment
  */
router.post("/comments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    console.log(`Adding comment to ${postId}`);
    const { author, comment } = req.body;
    if (!author || !comment) {
      return res.status(400).json({ error: "Author and comment are required." });
    }
    console.log(`Comment Data:\nAuthor:${author}\nComment:${comment}`);
    console.log(`Updating comment array.`);
    const updatedPost = await blogPosts.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { author, comment, createdAt: new Date() } },
      },
      { new: true }
    );
    console.log(updatedPost);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ error: "Failed to add comment." });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const analytics = await blogPosts.findById({ postId });
    if (!analytics) {
      return res.status(404).json({ message: "blogPosts not found for this post." });
    }
    res.status(200).json(analytics);
  } catch (error) {
    console.error("Error getting analytics:", error.message);
    res.status(500).json({ error: "Failed to fetch analytics." });
  }
});

module.exports = router;
