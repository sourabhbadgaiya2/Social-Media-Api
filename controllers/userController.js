const { catchAsyncError } = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const userSchema = require("../models/userSchema");
const { sendtoken } = require("../utils/SendwebToken");
const sendNotification = require("../utils/sendNotification");

exports.homepage = catchAsyncError(async (req, res) => {
  res.json({ message: "user homepage" });
});

exports.currentuser = catchAsyncError(async (req, res) => {
  const user = await userSchema.findById(req.user.id).exec();
  res.json(user);
});

exports.signup = catchAsyncError(async (req, res, next) => {
  const user = await userSchema(req.body).save();
  //   res.json({ message: "User created", user });
  sendtoken(user, 201, res);
});

exports.signin = catchAsyncError(async (req, res, next) => {
  const user = await userSchema
    .findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!user) return next(new ErrorHandler("User does not exists"));

  const isMatch = user.comparepassword(req.body.password);
  if (!isMatch) return next(new ErrorHandler("wrong password"));

  //   res.json({ message: "User signin", user });
  sendtoken(user, 200, res);
});

exports.signout = catchAsyncError(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "user signout" });
});
// ----------------------------------------------------------

exports.getuserprofilebyId = catchAsyncError(async (req, res) => {
  const user = await userSchema.findById(req.params.id).select("-password"); // Exclude password from the response

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.json(user);
});

exports.followUnfollowUser = catchAsyncError(async (req, res) => {
  const userToFollow = await userSchema.findById(req.params.id);
  const currentUser = await userSchema.findById(req.user.id);

  if (!userToFollow) {
    return res.status(404).json({ msg: "User not found" });
  }

  if (
    userToFollow.followers.some(
      (follower) => follower.toString() === req.user.id
    )
  ) {
    // Unfollow the user
    userToFollow.followers = userToFollow.followers.filter(
      (follower) => follower.toString() !== req.user.id
    );
    currentUser.following = currentUser.following.filter(
      (following) => following.toString() !== req.params.id
    );
  } else {
    // Follow the user
    userToFollow.followers.unshift(req.user.id);
    currentUser.following.unshift(req.params.id);

    // Send follow notification
    sendNotification(
      userToFollow.id,
      `${currentUser.username} started following you`
    );
  }

  await userToFollow.save();
  await currentUser.save();

  res.json({
    followers: userToFollow.followers,
    following: currentUser.following,
  });
});

