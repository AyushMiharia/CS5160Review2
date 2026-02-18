import express from "express";

const router = express.Router();
const posts = [
  {
    id: 1,
    user: "John Smith",
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
];

router.get("/posts", (req, res) => {
  res.json(posts);
});

export default router;
