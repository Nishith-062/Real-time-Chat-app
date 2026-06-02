import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const onlineUsers = new Map();

export function getSocketId(userId) {
    
  return onlineUsers.get(userId);
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("✅ User connected:", socket.id, "for user:", userId);

  onlineUsers.set(userId, socket.id);

  io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    for (const [id, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        onlineUsers.delete(id);
        break;
      }
    }

    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });
});

export { io, app, server };
