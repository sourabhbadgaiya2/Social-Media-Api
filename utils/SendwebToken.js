exports.sendtoken = (user, statuscode, res) => {
  const token = user.genwebtoken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_PARSER * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure: false
  };

  res.status(statuscode).cookie("token", token, options).json({
    success: true,
    id: user._id,
    token,
  });
};
