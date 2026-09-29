const PDF = require("../models/pdfModel");
const Text = require("../models/textModel");

// ========================================
// GET SELECTED SOURCES
// ========================================

const getSources = async (
  userId,
  selectedPDFs = [],
  selectedTexts = []
) => {
  let pdfs = [];
  let texts = [];

  console.log("SOURCE USER ID:", userId);
  console.log("SOURCE SELECTED PDFS:", selectedPDFs);
  console.log("SOURCE SELECTED TEXTS:", selectedTexts);

  // ========================================
  // SELECTED PDFs
  // ========================================

  if (selectedPDFs.length > 0) {
    pdfs = await PDF.find({
      _id: { $in: selectedPDFs },
      userId: userId,
      isDeleted: false,
    });

    console.log("FOUND PDFS:", pdfs.length);
  }

  // ========================================
  // SELECTED TEXTS
  // ========================================

  if (selectedTexts.length > 0) {
    texts = await Text.find({
      _id: { $in: selectedTexts },
      userId: userId,
      isDeleted: false,
    });

    console.log("FOUND TEXTS:", texts.length);
  }

  return {
    pdfs,
    texts,
  };
};


// ========================================
// BUILD AI CONTEXT
// ========================================

const buildContext = (pdfs, texts) => {
  let context = "";

  // PDFs
  pdfs.forEach((pdf) => {
    context += `

PDF:
File Name: ${pdf.fileName}

Content:
${pdf.extractedText}

------------------------------

`;
  });

  // Texts
  texts.forEach((text) => {
    context += `

TEXT:
Title: ${text.title}

Content:
${text.content}

------------------------------

`;
  });

  const MAX_CONTEXT_LENGTH = 50000;

  return context.substring(0, MAX_CONTEXT_LENGTH);
};


module.exports = {
  getSources,
  buildContext,
};