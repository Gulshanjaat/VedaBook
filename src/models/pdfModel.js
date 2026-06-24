const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    fileName: String,

    pdfUrl: String,

    extractedText: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PDF", pdfSchema);