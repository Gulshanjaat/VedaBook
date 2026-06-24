const OpenAI = require("openai");

const pdfModel = require("../../models/pdfModel");
const textModel = require("../../models/textModel");
const userModel = require("../../models/users");
const chatModel = require("../../models/chatModel");

const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,

  baseURL:
    `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,

  defaultQuery: {
    "api-version":
      process.env.AZURE_OPENAI_API_VERSION,
  },

  defaultHeaders: {
    "api-key":
      process.env.AZURE_OPENAI_API_KEY,
  },
});

const chatWithAI = async (req, res) => {

  try {

    const { userId, message } = req.body;

    if (!userId) {

      return res.status(400).json({
        success: false,
        message: "User ID required",
      });
    }

    if (!message) {

      return res.status(400).json({
        success: false,
        message: "Message required",
      });
    }

    // user check
    const user = await userModel.findById(userId);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // token check
    if (user.tokens <= 0) {

      return res.status(403).json({
        success: false,
        message: "No tokens left. Please subscribe.",
      });
    }



    const pdfs =
      await pdfModel.find({
        userId,
      });

    const texts =
      await textModel.find({
        userId,
      });

    let allContent = "";

    // pdf content
    pdfs.forEach((pdf) => {

      allContent +=
        `\n\nPDF: ${pdf.fileName}\n`;

      allContent +=
        pdf.extractedText;
    });

    // text content
    texts.forEach((text) => {

      allContent +=
        `\n\nTEXT:\n`;

      allContent +=
        text.content;
    });

    // OpenAI
    const response =
      await client.chat.completions.create({

        model:
          process.env.AZURE_OPENAI_DEPLOYMENT,

        messages: [

          {
            role: "system",

            content: `
You are an AI assistant.

Answer ONLY from uploaded PDFs and texts.

If answer is not found then say:
"Answer not found"
`,
          },

          {
            role: "user",

            content: `
CONTENT:
${allContent}

QUESTION:
${message}
`,
          },
        ],

        max_completion_tokens: 500,
      });

    const aiMessage =
      response.choices[0].message.content;

    await chatModel.create({

      userId,

      question:
        message,

      answer:
        aiMessage,

    });

    // deduct 1 token
    user.tokens -= 1;

    await user.save();

    res.json({
      success: true,

      aiMessage,

      remainingTokens:
        user.tokens,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getHistory =
  async (req, res) => {

    try {

      const { userId } =
        req.params;

      const chats =
        await chatModel.find({

          userId,

        })

          .sort({
            createdAt: -1,
          });

      res.json({

        success: true,

        chats,

      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = { chatWithAI,getHistory };