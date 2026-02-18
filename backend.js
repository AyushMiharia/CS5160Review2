import express from "express";
import postsRouter from "./routes/posts.js";

const PORT = process.env.PORT || 3000;

console.log(`Initializing backend server...`);
const app = express();

app.use(express.static("frontend"));

app.use("/api", postsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
