const textModel = require("../../models/textModel");

const uploadText = async (req, res) => {

  try {

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Text required",
      });
    }

    // word count
    const words =
      content.trim().split(/\s+/);

    // max 450 words
    if (words.length > 450) {

      return res.status(400).json({
        success: false,

        message:
          "Text limit exceeded. Max 450 words allowed",
      });
    }

    // save db
    const textDoc =
      await textModel.create({

        content,
      });

    res.json({
      success: true,

      message:
        "Text uploaded successfully",

      text: textDoc,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { uploadText };