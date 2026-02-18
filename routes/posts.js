import express from "express";

const router = express.Router();
const posts = [
  {
    id: 1,
    author: "John Smith",
    timestamp: "2024-06-01T12:00:00Z",
    username: "johnsmith",
    content: "This is the first post.",
    likes: 10,
    comments: [
      {
        id: 1,
        user: "Jane Doe",
        content: "Great post!",
        likes: 5,
      },
      {
        id: 2,
        user: "Bob Johnson",
        content: "I agree with Jane!",
        likes: 1,
      },
    ],
  },
    {
    id: 2,
    author: "Alice Johnson",
    timestamp: "2024-06-02T15:30:00Z",
    username: "alicejohnson",
    content: "Hello, this is another post.",
    likes: 20,
    comments: [
      {
        id: 1,
        user: "Charlie Brown",
        content: "Nice to see you here, Alice!",
        likes: 3,
      },
    ],
  },
];

router.get("/posts", (req, res) => {
  res.json(posts);
});

export default router;
