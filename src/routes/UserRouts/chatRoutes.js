const express = require("express");
const { chatWithAI, getHistory } = require("../../controllers/Users/chatController");

const chatRouter = express.Router();



chatRouter.post("/message", chatWithAI);
chatRouter.get(
  "/history/:userId",
  getHistory
);
module.exports = chatRouter;