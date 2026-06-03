const express = require("express");
const { chatWithAI } = require("../../controllers/Users/chatController");

const chatRouter = express.Router();



chatRouter.post("/message", chatWithAI);

module.exports = chatRouter;