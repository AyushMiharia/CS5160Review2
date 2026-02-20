import { Router } from 'express';
import { getDB } from '../db/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Post a vote (upvote or downvote)
// voteTpe should be true or false for upvote/downvote
router.post('/', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const { postId, userId, voteType } = req.body;
    if (!postId || !userId || typeof voteType !== 'boolean') {
      return res.status(400).json({ error: 'postId, userId and voteType are required.' });
    }
    const existingVote = await db.collection('votes').findOne({ postId, userId });
    if (existingVote) {
      return res.status(400).json({ error: 'User has already voted on this post.' });
    }

    const newVote = {
      postId,
      userId,
      voteType,
      createdAt: new Date(),
    };
    await db.collection('votes').insertOne(newVote);
    // Update the post's vote count
    const voteIncrement = voteType ? 1 : -1;
    await db.collection('posts').updateOne({ _id: new ObjectId(postId) }, { $inc: { voteCount: voteIncrement } });
    res.json({ message: 'Vote recorded successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record vote.' });
  }
});

//DELETE a vote (remove upvote or downvote)
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const { postId, userId } = req.body;
    if (!postId || !userId) {
      return res.status(400).json({ error: 'postId and userId are required.' });
    }
    const existingVote = await db.collection('votes').findOne({ postId, userId });
    if (!existingVote) {
      return res.status(404).json({ error: 'Vote not found for this user and post.' });
    }
    await db.collection('votes').deleteOne({ postId, userId });
    // Update the post's vote count
    const voteIncrement = existingVote.voteType ? -1 : 1; // Reverse the previous vote
    await db.collection('posts').updateOne({ _id: new ObjectId(postId) }, { $inc: { voteCount: voteIncrement } });
    res.json({ message: 'Vote removed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove vote.' });
  }
});

// UPDATE a vote (change from upvote to downvote or vice versa)
router.put('/', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const { postId, userId, voteType } = req.body;
    if (!postId || !userId || typeof voteType !== 'boolean') {
      return res.status(400).json({ error: 'postId, userId and voteType are required.' });
    }
    const existingVote = await db.collection('votes').findOne({ postId, userId });
    if (!existingVote) {
      return res.status(404).json({ error: 'Vote not found for this user and post.' });
    }
    await db.collection('votes').updateOne({ postId, userId }, { $set: { voteType, createdAt: new Date() } });
    // Update the post's vote count
    const voteIncrement = voteType ? 2 : -2; // Changing from downvote to upvote adds 2, and vice versa
    await db.collection('posts').updateOne({ _id: new ObjectId(postId) }, { $inc: { voteCount: voteIncrement } });
    res.json({ message: 'Vote updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update vote.' });
  }
});


// GET /api/trending?period=today|week|month
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { period = 'today' } = req.query;

    // Calculate start date
    const now = new Date();
    let startDate;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return res.status(400).json({ error: 'Invalid period. Use today, week, or month.' });
    }

    // Get top 20 posts sorted by voteCount
    const posts = await db
      .collection('posts')
      .find({ createdAt: { $gte: startDate } })
      .sort({ voteCount: -1, createdAt: -1 })
      .limit(20)
      .toArray();

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending posts.' });
  }
});

export default router;
