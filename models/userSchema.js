const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: { type: String },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

UserSchema.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.genwebtoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SEC, {
    expiresIn: "1d",
  });
};

module.exports = mongoose.model("user", UserSchema);
