import React, { useState, useEffect, useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import { Navigate } from "../../Navigate";
import { useParams } from "react-router-dom";
import { useSocket } from "../../context/ContextProvider";
import { useGetProfileQuery } from "../redux/api/manageApi";
import Sidbar from "./Sidbar";

const ChatBox = () => {
  const { id: receiverId } = useParams();
  const { socket } = useSocket();
  const { data: profileData } = useGetProfileQuery();
  const authId = profileData?.data?.id;

  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef();

  // ✅ Clear input when receiverId changes
  useEffect(() => {
    setInput("");
  }, [receiverId]);

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => console.log("Socket connected"));
    socket.on("disconnect", () => console.log("Socket disconnected"));
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  // Fetch chats on load
  useEffect(() => {
    if (!socket || !receiverId || !authId) return;

    const emitFetchChats = () => {
      socket.emit("fetchChats", { receiverId, authId });
    };

    if (socket.connected) {
      emitFetchChats();
    } else {
      socket.once("connect", emitFetchChats);
    }

    return () => {
      socket.off("connect", emitFetchChats);
    };
  }, [socket, receiverId, authId]);

  // Handle incoming chats
  useEffect(() => {
    if (!socket) return;

    const handleChats = (data) => {
      console.log("Chats response:", data);

      // ✅ Set messages
      setMessages(data.chats || []);

      // ✅ Save receiver info
      setReceiver(data.receiver || null);
    };

    socket.on("chats", handleChats);
    return () => socket.off("chats", handleChats);
  }, [socket]);

  useEffect(() => {
    if (!socket || !authId || !receiverId) return;

    const handleMessage = (msg) => {
      const isForCurrentChat =
        (msg.senderId === authId && msg.receiverId === receiverId) ||
        (msg.senderId === receiverId && msg.receiverId === authId);

      if (!isForCurrentChat) return;

      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.id);
        if (exists) return prev;
        return [...prev, { ...msg, fromSelf: msg.senderId === authId }];
      });
    };

    socket.on("message", handleMessage);
    return () => socket.off("message", handleMessage);
  }, [socket, authId, receiverId]);

  const sendMessage = () => {
    if (!input.trim() || !authId) return;

    const messageData = {
      senderId: authId,
      receiverId,
      message: input,
      id: Date.now(),
    };

    socket.emit("message", messageData);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container m-auto ">
      <Navigate title="Message" />
      <div className="flex h-[85vh] bg-white">
        {/* Sidebar */}
        <div className="w-full md:w-96 border-r bg-white">
          <Sidbar receiverId={receiverId} />
        </div>

        {/* Chat area */}
        <div className="hidden md:flex flex-col flex-1">
          {/* ✅ Chat header */}
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img
                  src={
                    receiver?.image ||
                    "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
                  }
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-semibold">{receiver?.name || "Chat"}</h2>
              </div>
            </div>
          </div>

          {/* ✅ Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col">
            {messages?.map((msg) => {
              const isSelf = msg.senderId === authId;
              return (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${
                    isSelf ? "justify-end" : "justify-start gap-3"
                  }`}
                >
                  {!isSelf && (
                    <div className="h-8 w-8 rounded-full overflow-hidden mt-1 flex-shrink-0">
                      <img
                        src={
                          receiver?.image ||
                          "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
                        }
                        alt="User avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-lg max-w-[600px] break-words ${
                      isSelf
                        ? "bg-[#AB684D] text-white rounded-br-none"
                        : "bg-gray-100 text-black rounded-bl-none"
                    }`}
                  >
                    <p className="break-words whitespace-pre-wrap overflow-wrap-anywhere">{msg.message}</p>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef}></div>
          </div>

          {/* Input */}
          <div className="p-4 border-t flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100"></button>
            <input
              className="bg-gray-100 border-0 flex-1 py-2 px-4 rounded-md"
              placeholder="Aa"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="p-2 rounded-full bg-[#AB684D] hover:bg-blue-600"
              onClick={sendMessage}
            >
              <Send className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;