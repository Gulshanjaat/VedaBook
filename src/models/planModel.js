const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  durationDays: {
    type: Number,
    required: true,
  },

  tokens: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Plan", planSchema);