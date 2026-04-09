import { useEffect, useState } from "react";
import { useSocket } from "../../context/ContextProvider";
import { useGetProfileQuery } from "../redux/api/manageApi";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { socket, socketLoading, socketError } = useSocket();
  const [chats, setChats] = useState([]);
  const { data: profileData } = useGetProfileQuery();
  const authId = profileData?.data?.id;

  useEffect(() => {
    if (!socket || socketLoading || socketError) {
      return; // Wait until socket is ready and no errors
    }

    const requestMessageList = () => {
      socket.emit("messageList", {});
    };

    const handleMessageList = (data) => {
      //console.log("Socket sidebar data:", data);
      setChats(data);
    };

    // Request message list immediately if socket is connected
    if (socket.connected) {
      requestMessageList();
    }

    // Listen for connection and message list events
    socket.on("connect", requestMessageList);
    socket.on("messageList", handleMessageList);

    // Clean up event listeners
    return () => {
      socket.off("connect", requestMessageList);
      socket.off("messageList", handleMessageList);
    };
  }, [socket, socketLoading, socketError]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks}w`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}mo`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}y`;
  };

  if (socketLoading) {
    return <div>Loading chats...</div>;
  }

  if (socketError) {
    return <div>Error: {socketError}</div>;
  }

  return (
    <div>
      <div className="overflow-y-auto h-[calc(100vh-130px)]">
        {chats.map((chatt, index) => {
          const chat = chatt.chat;
          if (!chat) return null;

          let linkId = "";
          if (chat.receiverId === authId) {
            linkId = chat.senderId;
          } else if (chat.senderId === authId) {
            linkId = chat.receiverId;
          }

          const isUnread = !chat.isRead;

          return (
            <div
              key={chat.id || index}
              className="p-4 hover:bg-gray-50 border-b flex items-start gap-3 bg-white"
            >
              <div className="h-10 w-10 rounded-full overflow-hidden shrink-0">
                <img
                  src={
                    chatt.receiverImage ||
                    "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
                  }
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              </div>

              <Link to={`/dashboard/bookingHistory/chat/${linkId}`} className="flex-1 min-w-0">
                <div className="flex-1">
                  <div className="flex gap-2 justify-between items-center">
                    <h3 className="font-medium truncate">
                      {chatt.senderName === chatt.receiverName
                        ? chatt.senderName
                        : chatt.receiverName || "Unknown User"}
                    </h3>
                    <span className="text-xs text-gray-400 shrink-0">
                      {formatTime(chat.createdAt)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center gap-2">
                 <p
  className={`mt-1 text-sm ${
    isUnread && chat.senderId !== authId ? "font-bold text-black" : "text-gray-500"
  } truncate flex-1 min-w-0`}
>
  {chat.message || "No message"}
</p>


                    {isUnread && chatt.unReadMessagesCount > 0 && (
                      <span className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shrink-0">
                        {chatt.unReadMessagesCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;