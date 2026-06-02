import cloudinary from "../lib/cloudinary.js";
import Message from "../models/messages.models.js";
import User from "../models/user.models.js";
import { io, getSocketId } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: userToChatId, recieverId: myId },
        { senderId: myId, recieverId: userToChatId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const updateResponse = await cloudinary.uploader.upload(image);
      imageUrl = updateResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const recieverSocketId = getSocketId(recieverId);

    if (recieverSocketId) {
      io.to(recieverSocketId).emit("sendMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
