const Message = require("../../models/messageModel");

const createMessage =
async (req, res) => {

  try {

    const {

      conversationId,

      role,

      content,

      sourcePDFs = [],

      sourceTexts = [],

      tokensUsed = 0,

      model = "gpt-4.1-mini",

    } = req.body;

    if (
      !conversationId ||
      !role ||
      !content
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Missing required fields",

      });
    }

    const message =
      await Message.create({

        conversationId,

        role,

        content,

        sourcePDFs,

        sourceTexts,

        tokensUsed,

        model,

      });

    res.status(201).json({

      success: true,

      message,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }
};

const getMessages =
async (req, res) => {

  try {

    const {

      conversationId,

    } = req.params;

    const messages =
      await Message.find({

        conversationId,

        isDeleted: false,

      }).sort({

        createdAt: 1,

      });

    res.json({

      success: true,

      messages,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }
};


module.exports = {

  createMessage,

  getMessages,

};