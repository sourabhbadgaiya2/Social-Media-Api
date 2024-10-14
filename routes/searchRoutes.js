const router = require("express").Router();

const postSchema = require("../models/postSchema");
const userSchema = require("../models/userSchema");
const { isLoggedIn } = require("../middlewares/auth");

// Search users, posts, or hashtags
router.get("/", isLoggedIn, async (req, res) => {
  const query = req.query.q;

  try {
    const users = await userSchema
      .find({
        username: { $regex: query, $options: "i" }, // Case-insensitive search
      })
      .select("username");

    const posts = await postSchema.find({
      $or: [
        { content: { $regex: query, $options: "i" } }, // Search by content
        { hashtags: { $regex: query, $options: "i" } }, // Search by hashtags
      ],
    });

    // Debugging logs
    console.log("Query:", query);
    console.log("Users:", users);
    console.log("Posts:", posts);

    res.json({ users, posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
