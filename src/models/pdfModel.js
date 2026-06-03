const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    fileName: String,

    pdfUrl: String,

    extractedText: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PDF", pdfSchema);