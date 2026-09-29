const express = require("express");
const multer = require("multer");

const pdfRouter = express.Router();

const upload = require("../../utils/multer");

const {
  uploadPDFs,
  getUserPDFs,
} = require("../../controllers/Users/pdfController");


// ===============================
// UPLOAD PDFs
// ===============================

pdfRouter.post(
  "/upload",

  (req, res, next) => {

    upload.array("pdfs", 10)(
      req,
      res,

      function (err) {

        if (
          err instanceof multer.MulterError
        ) {

          if (
            err.code === "LIMIT_FILE_SIZE"
          ) {

            return res.status(400).json({

              success: false,

              message:
                "Your file is too large. Max size is 25MB",

            });

          }

        }

        if (err) {

          return res.status(400).json({

            success: false,

            message: err.message,

          });

        }

        next();

      }
    );

  },

  uploadPDFs
);


// ===============================
// GET USER PDFs
// ===============================

pdfRouter.get(
  "/user/:userId",
  getUserPDFs
);


module.exports = pdfRouter;