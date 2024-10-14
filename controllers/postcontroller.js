const { catchAsyncError } = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const postSchema = require("../models/postSchema");
const userSchema = require("../models/userSchema");
const sendNotification = require("../utils/sendNotification");

exports.newpost = catchAsyncError(async (req, res) => {
  const user = req.user; // Logged-in user

  // Create a new post with user ID
  const newPost = new postSchema({
    user: user.id,
    text: req.body.text,
  });

  const post = await newPost.save();
  res.json({ message: "post created", post });
});

exports.getAllPost = catchAsyncError(async (req, res) => {
  const posts = await postSchema.find().sort({ date: -1 }); // Sort by latest
  res.json(posts);
});

exports.likeByPostId = catchAsyncError(async (req, res, next) => {
  const post = await postSchema.findById(req.params.id);
  const user = await userSchema.findById(req.user.id);

  if (!post) {
    return res.status(404).json({ msg: "Post not found" });
  }

  if (post.likes.some((like) => like.user.toString() === req.user.id)) {
    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );
  } else {
    post.likes.unshift({ user: req.user.id });

    // Send like notification
    sendNotification(post.user, `${user.username} liked your post`);
  }

  await post.save();
  res.json(post.likes);
});

// exports.commentByPostId = catchAsyncError(async (req, res) => {
//   const { text } = req.body;

//   const post = await postSchema.findById(req.params.id);

//   const newComment = {
//     user: req.user.id,
//     text: text,
//   };

//   // Add the comment to the post
//   post.comments.unshift(newComment);
//   await post.save();
//   res.json(post.comments);
// });
exports.commentByPostId = catchAsyncError(async (req, res) => {
  const { text } = req.body;

  const post = await postSchema.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ msg: "Post not found" });
  }

  const newComment = {
    user: req.user.id,
    text: text,
  };

  // Add the comment to the post
  post.comments.unshift(newComment);

  // Send comment notification (assuming you want to notify the post owner)
  const user = await userSchema.findById(req.user.id);
  sendNotification(
    post.user,
    `${user.username} commented on your post: ${text}`
  );

  await post.save();
  res.json(post.comments);
});

exports.DeletePostByPostId = catchAsyncError(async (req, res) => {
  const post = await postSchema.findById(req.params.id);

  // Check if post exists
  if (!post) {
    return res.status(404).json({ msg: "Post not found" });
  }

  // Check if user is the owner of the post
  if (post.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: "User not authorized" });
  }

  // Use deleteOne to remove the post
  await postSchema.deleteOne({ _id: req.params.id });

  res.json({ msg: "Post removed" });
});

exports.GetPostsbyUserID = catchAsyncError(async (req, res) => {
  const posts = await postSchema
    .find({ user: req.params.userId })
    .sort({ date: -1 });

  if (!posts) {
    return res.status(404).json({ msg: "No posts found" });
  }

  res.json(posts);
});
