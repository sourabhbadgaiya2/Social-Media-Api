const { catchAsyncError } = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema"); // Assuming you have a user model

exports.isLoggedIn = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login in to access the resource"));
  }

  const { id } = jwt.verify(token, process.env.JWT_SEC);

  // Fetch the user from the database using the id
  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  req.user = user; // Assign the user object to req.user
  next();
});
