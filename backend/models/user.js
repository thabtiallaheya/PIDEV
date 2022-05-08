const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const User = new Schema({
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  authStrategy: {
    type: String,
    default: "local",
  },
  status: { type: Boolean, default: true },
  photo: String,
  verified: {
    type: Boolean,
    default: false,
  },
  password: String,
  email: {
    type: "string",
    trim: true,
    unique: true,
  },
  followers: [String],
  following: [String],
  phone: String,
  bio: String,
  role: String,
  restpassword: String,
  trainings: [
    {
      type: Schema.Types.ObjectId,
      ref: "training",
    },
  ],
});

User.methods.generateVerificationToken = function () {
  const user = this;
  const verificationToken = jwt.sign(
    { ID: user._id },
    process.env.USER_VERIFICATION_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return verificationToken;
};

module.exports = mongoose.model("User", User);
