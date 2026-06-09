const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
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
    isAdmin: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String
    },
    otpExpire: {
      type: Date,
      expires: 0,
    },
    profilePic: {
      type: String,
      default: "",
    },
    tokens: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

const usermodel = mongoose.model("User", userSchema);

module.exports = usermodel;