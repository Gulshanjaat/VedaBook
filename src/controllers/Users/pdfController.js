const pdfParse = require("pdf-parse");

const imagekit = require("../../config/imagekit");

const pdfModel = require("../../models/pdfModel");

const uploadPDFs = async (req, res) => {

  try {

    if (!req.files || req.files.length === 0) {

      return res.json({
        success: false,
        message: "PDFs required",
      });
    }

    const savedPDFs = [];

    for (const file of req.files) {

      // extract text
      const pdfData = await pdfParse(
        file.buffer
      );

      const extractedText = pdfData.text;

      // upload imagekit
      const uploadedFile =
        await imagekit.upload({

          file: file.buffer,

          fileName:
            Date.now() +
            "-" +
            file.originalname,

          folder: "/pdfs",
        });

      // save database
      const pdfDoc =
        await pdfModel.create({

          fileName: file.originalname,

          pdfUrl: uploadedFile.url,

          extractedText,
        });

      savedPDFs.push(pdfDoc);
    }

    res.json({
      success: true,
      message: "PDFs uploaded successfully",

      totalPDFs: savedPDFs.length,

      pdfs: savedPDFs,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { uploadPDFs };