const conversationService = require("../../services/conversationService");

// Create New Conversation
const createConversation = async (req, res) => {

  try {

    const { userId } = req.body;

    if (!userId) {

      return res.status(400).json({

        success: false,

        message: "User ID is required",

      });

    }

    const conversation =
      await conversationService.createConversation(userId);

    return res.status(201).json({

      success: true,

      conversation,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// Get Conversation History
const getHistory = async (req, res) => {

  try {

    const { userId } = req.params;

    const conversations =
      await conversationService.getUserConversations(userId);

    return res.json({

      success: true,

      conversations,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// Delete Conversation
const deleteConversation = async (req, res) => {

  try {

    const { conversationId } = req.params;

    await conversationService.deleteConversation(conversationId);

    return res.json({

      success: true,

      message: "Conversation deleted successfully",

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

  createConversation,

  getHistory,

  deleteConversation,

};