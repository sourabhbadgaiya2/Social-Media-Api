// routes/notifications.js
const express = require("express");
const router = express.Router();

const redisClient = require("../config/redisclient"); // Update the path as needed
const { isLoggedIn } = require("../middlewares/auth");

// Get user notifications
router.get("/", isLoggedIn, async (req, res) => {
  try {
    redisClient.lrange(
      `notifications:${req.user.id}`,
      0,
      -1,
      (err, notifications) => {
        if (err) {
          return res.status(500).send("Server error");
        }

        res.json(notifications);
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
