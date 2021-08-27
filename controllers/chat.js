const User = require("../models/User");
const Chat = require("../models/Chat");
const asyncHandler = require("express-async-handler");

// @route POST /tweet
// @desc Create new tweet
// @access Private
exports.sendMessage = asyncHandler(async (req, res) => {
  const { text, userId, otherUserId, chatId } = req.body;
  // if chatId present just add messages to the existing chat if it is valid
  if (chatId) {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404);
      throw new Error("No Chat found");
    }
    chat.messages.push({ text, sender: userId });
    await chat.save();
    res.status(201).json(chat);
  } else {
    // if we dont have id, first make sure it doesn't already exist
    const chat = await Chat.findOne({ user: userId, otherUser: otherUserId });
    if (chat) {
      chat.messages.push({ text, sender: userId });
      await chat.save();
      res.status(201).json(chat);
    }
    // if chat doesnt exist, create one and add the message
    else {
      const chat = await Chat.create({
        user: userId,
        otherUser: otherUserId,
      });
      chat.messages.push({ text, sender: userId });
      await chat.save();
      res.status(201).json(chat);
    }
  }
});

exports.loadChat = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) {
    res.status(404);
    throw new Error("No Chat found");
  }
  res.status(200).json(chat);
});
