const pdfParse = require("pdf-parse");

const imagekit = require("../../config/imagekit");

const pdfModel = require("../../models/pdfModel");

const uploadPDFs = async (req, res) => {

  try {
    const { userId } = req.body;

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
      const pdfDoc = await pdfModel.create({

        userId,

        fileName: file.originalname,

        pdfUrl: uploadedFile.url,

        imagekitFileId: uploadedFile.fileId,

        fileSize: file.size,

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



const getUserPDFs = async (req, res) => {

  try {

    const { userId } = req.params;

    if (!userId) {

      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });

    }

    const pdfs = await pdfModel
      .find({
        userId,
        isDeleted: false,
      })
      .select(
        "_id fileName pdfUrl fileSize createdAt"
      )
      .sort({
        createdAt: -1,
      });

    res.json({

      success: true,

      pdfs,

    });

  } catch (error) {

    console.log("Get PDFs Error:", error);

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

module.exports = { uploadPDFs,getUserPDFs };