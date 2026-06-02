import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { useRef } from "react";

const ChatContainer = () => {
  function formatMessage(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      // hour12:false,
    });
  }

  const lastMsgref = useRef(null);
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeMessages,
    unsubscribeMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);

    subscribeMessages();

    return () => unsubscribeMessages();
  }, [selectedUser._id, getMessages, subscribeMessages, unsubscribeMessages]);

  // scroll messages
  useEffect(() => {
    if (lastMsgref.current && messages) {
      lastMsgref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) return <div>Loading</div>;

  return (
    <div className="pt-16 h-screen flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            ref={lastMsgref}
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                />
              </div>
            </div>
            <div className="chat-header">
              <time className="text-xs opacity-50">
                {formatMessage(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
