const express = require("express");

const pdfRouter = express.Router();

const upload = require("../../utils/multer");
const { uploadPDFs } = require("../../controllers/Users/pdfController");

// const { uploadPDF } = require("../controllers/pdfController");

pdfRouter.post(
  "/upload",
   (req, res, next) => {

    upload.array("pdfs", 10)(
      req,
      res,
      function (err) {

        if (err instanceof multer.MulterError) {

          if (err.code === "LIMIT_FILE_SIZE") {

            return res.status(400).json({
              success: false,
              message:
                "Your file is too large. Max size is 25MB",
            });
          }
        }

        next();
      }
    );
  },
  uploadPDFs
);

module.exports = pdfRouter;