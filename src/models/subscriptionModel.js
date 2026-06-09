const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
  },

  startDate: {
    type: Date,
    default: Date.now,
  },

  endDate: Date,

  status: {
    type: String,
    enum: ["active", "expired"],
    default: "active",
  },
});

module.exports = mongoose.model(
  "Subscription",
  subscriptionSchema
);