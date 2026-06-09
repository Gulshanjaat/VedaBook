const OpenAI = require("openai");

const pdfModel = require("../../models/pdfModel");
const textModel = require("../../models/textModel");
const userModel = require("../../models/users");

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

    // get all pdfs
    const pdfs = await pdfModel.find();

    // get all texts
    const texts = await textModel.find();

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

module.exports = { chatWithAI };