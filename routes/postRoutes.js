const router = require("express").Router();
const {
  newpost,
  getAllPost,
  likeByPostId,
  commentByPostId,
  DeletePostByPostId,
  GetPostsbyUserID,
} = require("../controllers/postcontroller");
const { isLoggedIn } = require("../middlewares/auth");
const postSchema = require("../models/postSchema");

router.get("/", (req, res) => {
  res.json({ message: "post homepage" });
});

// Create a new post
router.post("/newpost", isLoggedIn, newpost);

// Get all posts
router.get("/get-all-post", isLoggedIn, getAllPost);

// Like a post
router.put("/like/:id", isLoggedIn, likeByPostId);

// Comment on a post
router.post("/comment/:id", isLoggedIn, commentByPostId);

// Delete a post
router.delete("/:id", isLoggedIn, DeletePostByPostId);

// Get posts by a specific user
router.get("/user/:userId", isLoggedIn, GetPostsbyUserID);

module.exports = router;
