/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socketLoading, setSocketLoading] = useState(false);
  const token = useSelector((s) => s.logInUser?.token);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    setSocketLoading(true);

    const socket = io(`https://backend.barberstime.com/messages`, {
      auth: { token },
      autoConnect: true,
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      setSocketLoading(false);
     // console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      //console.log("Socket disconnected");
    });

    socketRef.current = socket;

    // Clean up on unmount or token change
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, socketLoading }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);








// import {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { useSelector } from "react-redux";
// import { io } from "socket.io-client";

// const SocketContext = createContext(null);

// // Use a configurable base URL for flexibility (replace with your actual base URL)
// const SOCKET_BASE = "http://10.10.20.26:8080"; // Adjust for your environment

// export const SocketProvider = ({ children }) => {
//   const [socketLoading, setSocketLoading] = useState(true);
//   const [socketError, setSocketError] = useState(null);
//   const token = useSelector((s) => s.logInUser?.token);
//   const socketRef = useRef(null);

//   useEffect(() => {
//     if (!token) {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }
//       setSocketLoading(false);
//       setSocketError(null);
//       return;
//     }

//     setSocketLoading(true);
//     setSocketError(null);

//     // Initialize socket with consistent configuration
//     const socket = io(SOCKET_BASE, {
//       path: "/messages", // Adjust if your server expects a specific path
//       auth: { token },
//       transports: ["websocket", "polling"], // Fallback to polling if WebSocket fails
//       autoConnect: true,
//       withCredentials: true,
//     });

//     socketRef.current = socket;

//     // Handle connection success
//     socket.on("connect", () => {
//       console.log("Socket connected:", socket.id);
//       setSocketLoading(false);
//       setSocketError(null);
//     });

//     // Handle connection errors
//     socket.on("connect_error", (error) => {
//       console.error("Socket connection error:", error.message);
//       setSocketLoading(false);
//       setSocketError("Failed to connect to server. Please try again later.");
//     });

//     // Handle disconnection
//     socket.on("disconnect", (reason) => {
//       console.log("Socket disconnected:", reason);
//       setSocketLoading(false);
//       setSocketError("Disconnected from server.");
//     });

//     // Clean up on unmount or token change
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }
//       setSocketLoading(false);
//       setSocketError(null);
//     };
//   }, [token]);

//   // Memoize the context value to prevent unnecessary re-renders
//   const value = useMemo(
//     () => ({
//       socket: socketRef.current,
//       socketLoading,
//       socketError,
//     }),
//     [socketLoading, socketError]
//   );

//   return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
// };

// export const useSocket = () => useContext(SocketContext);