import { Router } from 'express';
import { getDB } from '../db/connection.js';

const router = Router();

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
