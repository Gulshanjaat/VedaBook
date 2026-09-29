const express =
require("express");

const messageRouter=
express.Router();

const {

  createMessage,

  getMessages,

} = require(
 "../../controllers/Users/messageController"
);

messageRouter.post(
 "/create",
 createMessage
);

messageRouter.get(
 "/:conversationId",
 getMessages
);

module.exports =messageRouter;