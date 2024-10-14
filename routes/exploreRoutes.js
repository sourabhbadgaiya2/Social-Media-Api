const router = require("express").Router();

const postSchema = require("../models/postSchema");
const { isLoggedIn } = require("../middlewares/auth");

// Explore - Get random posts

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const posts = await postSchema.aggregate([{ $sample: { size: 10 } }]); // Get random 10 posts
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error Soue");
  }
});

module.exports = router;
