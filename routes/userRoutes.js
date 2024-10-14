const router = require("express").Router();
const {
  homepage,
  signup,
  signin,
  currentuser,
  signout,
  getuserprofilebyId,
  followUnfollowUser,
} = require("../controllers/userController");
const { isLoggedIn } = require("../middlewares/auth");
const userSchema = require("../models/userSchema");

router.get("/", homepage);

router.post("/signup", signup);

router.post("/signin", signin);

router.get("/signout", signout);

router.get("/currentuser", isLoggedIn, currentuser);

// ---------------Follow or Unfollow-------------------------------------------

// Get user profile by ID
router.get("/:id", isLoggedIn, getuserprofilebyId);

// Follow or unfollow a user
router.put("/follow/:id", isLoggedIn, followUnfollowUser);

module.exports = router;
