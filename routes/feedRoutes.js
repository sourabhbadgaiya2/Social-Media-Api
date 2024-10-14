const router = require("express").Router();

const postSchema = require("../models/postSchema");

const { isLoggedIn } = require("../middlewares/auth");
const userSchema = require("../models/userSchema");

// Get activity feed (posts from followed users)
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const user = await userSchema
      .findById(req.user.id)
      .populate("following", "id"); // Get user's following list

    const posts = await postSchema
      .find({
        user: { $in: user.following }, // Fetch posts by followed users
      })
      .sort({ date: -1 }) // Sort by latest posts
      .populate("user", "username"); // Populate post creator details

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get engagement metrics for a post
//// Is route se user kisi specific post ke likes count, comments count aur un logon ke
// usernames dekh paayega jo like ya comment kar chuke hain

router.get("/:id/engagement", isLoggedIn, async (req, res) => {
  try {
    const post = await postSchema
      .findById(req.params.id)
      .populate("likes.user", "username") // Populate usernames of people who liked the post
      .populate("comments.user", "username"); // Populate usernames of people who commented on the post

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const engagement = {
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      likes: post.likes,
      comments: post.comments,
    };

    res.json(engagement);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

