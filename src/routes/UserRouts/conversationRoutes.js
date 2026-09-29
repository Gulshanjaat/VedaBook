const express = require("express");

const conversationRouter = express.Router();

const {

  createConversation,

  getUserConversations,
  deleteConversation,
  getHistory,

} = require(
  "../../controllers/Users/conversationController"
);

conversationRouter.post(
    "/new",
    createConversation
);

conversationRouter.get(
    "/history/:userId",
    getHistory
);

conversationRouter.delete(
    "/:conversationId",
    deleteConversation
);

module.exports = conversationRouter;