const conversationService = require("../../services/conversationService");
const messageService = require("../../services/messageService");
const sourceService = require("../../services/sourceService");
const aiService = require("../../services/aiService");
const tokenService = require("../../services/tokenService");

const chatWithAI = async (req, res) => {
  try {

    const {
      userId,
      conversationId,
      message,
      selectedPDFs = [],
      selectedTexts = [],
    } = req.body;
    console.log("========== CHAT ==========");
console.log("BODY:", req.body);
console.log("USER ID:", userId);
console.log("MESSAGE:", message);
console.log("SELECTED PDFS:", selectedPDFs);
console.log("SELECTED TEXTS:", selectedTexts);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Check Tokens
    await tokenService.checkTokens(userId);

    // Get Existing Conversation OR Create New
    const conversation =
      await conversationService.getOrCreateConversation(
        userId,
        conversationId
      );

    // Save User Message
    await messageService.saveUserMessage(
      conversation._id,
      message
    );

    // Get PDFs & Texts
    const { pdfs, texts } =
      await sourceService.getSources(
        userId,
        selectedPDFs,
        selectedTexts
      );

    if (pdfs.length === 0 && texts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one PDF or Text.",
      });
    }

    // Build Context
    const context =
      sourceService.buildContext(
        pdfs,
        texts
      );

    // Generate AI Answer
    const ai =
      await aiService.generateAnswer(
        context,
        message
      );

    // Save AI Message
    await messageService.saveAIMessage(
      conversation._id,
      ai.answer,
      pdfs.map(pdf => pdf._id),
      texts.map(text => text._id),
      ai.tokens
    );

    // Update Conversation
    await conversationService.updateConversation(
      conversation._id,
      message
    );

    // Deduct Token
    const remainingTokens =
      await tokenService.deductToken(
        userId
      );

    return res.json({
      success: true,
      conversationId: conversation._id,
      aiMessage: ai.answer,
      remainingTokens,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  chatWithAI,
};