import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db/connection.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// GET /api/comments/post/:postId — Get all comments for a post
router.get("/post/:postId", async (req, res) => {
  try {
    const db = getDB();
    const { postId } = req.params;

    // Validate postId format
    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID." });
    }

    // Find all comments for this post
    const comments = await db
      .collection("comments")
      .aggregate([
        { $match: { postId: new ObjectId(postId) } },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: "$author" },
        {
          $project: {
            _id: 1,
            postId: 1,
            userId: 1,
            content: 1,
            createdAt: 1,
            updatedAt: 1,
            "author.username": 1,
            "author.firstName": 1,
            "author.lastName": 1,
          },
        },
      ])
      .toArray();

    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

// POST /api/comments — Create a comment (requires login)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const { postId, content } = req.body;

    // Validate required fields
    if (!postId || !content) {
      return res
        .status(400)
        .json({ error: "postId and content are required." });
    }

    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID." });
    }

    // Check the post exists
    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Create the comment
    const newComment = {
      postId: new ObjectId(postId),
      userId: new ObjectId(req.user.userId),
      content: content.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("comments").insertOne(newComment);

    // Update commentCount on the post
    await db
      .collection("posts")
      .updateOne({ _id: new ObjectId(postId) }, { $inc: { commentCount: 1 } });

    res.status(201).json({
      message: "Comment created.",
      commentId: result.insertedId,
    });
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: "Failed to create comment." });
  }
});

// PUT /api/comments/:commentId — Edit a comment (only by author)
router.put("/:commentId", authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const { commentId } = req.params;
    const { content } = req.body;

    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID." });
    }

    if (!content) {
      return res.status(400).json({ error: "Content is required." });
    }

    // Find the comment
    const comment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    // Check ownership — only the author can edit
    if (comment.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You can only edit your own comments." });
    }

    // Update the comment
    await db.collection("comments").updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          content: content.trim(),
          updatedAt: new Date(),
        },
      },
    );

    res.json({ message: "Comment updated." });
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ error: "Failed to update comment." });
  }
});

// DELETE /api/comments/:commentId — Delete a comment (only by author)
router.delete("/:commentId", authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const { commentId } = req.params;

    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID." });
    }

    // Find the comment
    const comment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own comments." });
    }

    // Delete the comment
    await db.collection("comments").deleteOne({ _id: new ObjectId(commentId) });

    // Decrement commentCount on the post
    await db
      .collection("posts")
      .updateOne({ _id: comment.postId }, { $inc: { commentCount: -1 } });

    res.json({ message: "Comment deleted." });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Failed to delete comment." });
  }
});

export default router;
