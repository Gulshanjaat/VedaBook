const Conversation = require("../models/conversationModel");

// Create new conversation
const createConversation = async (userId) => {
  return await Conversation.create({
    userId,
    title: "New Chat",
    lastMessage: "",
  });
};

// Get conversation by id
const getConversation = async (conversationId) => {
  return await Conversation.findById(conversationId);
};

// Get existing conversation or create new
const getOrCreateConversation = async (
  userId,
  conversationId
) => {

  if (conversationId) {

    const conversation =
      await Conversation.findById(conversationId);

    if (conversation) {
      return conversation;
    }
  }

  return await createConversation(userId);
};

// Update title & last message
const updateConversation = async (
  conversationId,
  message
) => {

  const conversation =
    await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  conversation.lastMessage = message;

  if (
    conversation.title === "New Chat"
  ) {
    conversation.title =
      message.substring(0, 40);
  }

  await conversation.save();

  return conversation;
};

// History
const getUserConversations = async (
  userId
) => {

  return await Conversation.find({
    userId,
    isDeleted: false,
  }).sort({
    updatedAt: -1,
  });

};

// Soft delete
const deleteConversation = async (
  conversationId
) => {

  return await Conversation.findByIdAndUpdate(
    conversationId,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );

};

module.exports = {

  createConversation,

  getConversation,

  getOrCreateConversation,

  updateConversation,

  getUserConversations,

  deleteConversation,

};