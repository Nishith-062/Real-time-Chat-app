import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      // console.log(res);
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get("/messages/" + userId);
      // console.log(res);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  subscribeMessages: () => {
    
    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    socket.on("sendMessage", (newMessage) => {
      // console.log(newMessage);
      
      const MessageInput=newMessage.senderId===get().selectedUser._id
      // console.log(MessageInput);
      if(!MessageInput) return
      set({ messages: [...get().messages, newMessage] });
    });
  },
  unsubscribeMessages: async () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("sendMessage");
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
