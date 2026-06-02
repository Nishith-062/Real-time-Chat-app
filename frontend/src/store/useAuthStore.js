import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const { connectSocket } = get();
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      connectSocket();
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  SignInAuth: async (data) => {
    set({ isSigningUp: true });
    try {
      const { connectSocket } = get();
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      const { disconnectSocket } = get();
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successfully");
      disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const { connectSocket } = get();
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success(res.data.message);
      connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile changes successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: async () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    socket.connect();

    set({ socket });

    // socket.on("connect", () => {
    //   console.log("connected to the server", socket.id);

    //   // ✅ ADD THIS LINE HERE
    //   import("./useChatStore").then(({ useChatStore }) => {
    //     useChatStore.getState().subscribeMessages();
    //   });
    // });

    socket.on("getOnlineUsers", (onlineUsers) => {
      set({ onlineUsers });
    });
  },

  disconnectSocket: async () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
