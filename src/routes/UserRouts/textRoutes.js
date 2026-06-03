const express = require("express");

const textrouter = express.Router();

const {  uploadText} = require("../../controllers/Users/textController");

textrouter.post(
  "/upload",
  uploadText
);

module.exports = textrouter;