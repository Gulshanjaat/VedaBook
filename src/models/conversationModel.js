const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "New Chat",
    },

    lastMessage: {
      type: String,
      default: "",
    },

    sourceType: {
      type: String,
      enum: ["all", "selected"],
      default: "all",
    },

    selectedPDFs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PDF",
      },
    ],

    selectedTexts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Text",
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Conversation",
  conversationSchema
);