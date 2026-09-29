const express = require("express");
const { chatWithAI } = require("../../controllers/Users/chatController");
const { getHistory } = require("../../controllers/Users/conversationController");

const chatRouter = express.Router();



chatRouter.post("/message", chatWithAI);
chatRouter.get(
  "/history/:userId",
  getHistory
);
module.exports = chatRouter;