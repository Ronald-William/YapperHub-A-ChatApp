import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { getMessages } from "../services/chatApi";

import Sidebar from "../components/Sidebar";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

const socket = io("http://localhost:5000", {
  withCredentials: true
});

export default function Chat() {
  const { user } = useAuth();

  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Socket connection status
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  // Join user's room
  useEffect(() => {
    if (!user) {
      console.warn("No user found, cannot join socket room");
      return;
    }
    
    console.log("Joining room for user:", user._id);
    socket.emit("joinUser", user._id);
  }, [user]);

  // Load messages and join conversation room when conversation changes
  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }

    // Join the conversation room for real-time updates
    console.log("Joining conversation room:", activeId);
    socket.emit("joinConversation", activeId);

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Loading messages for conversation:", activeId);
        const res = await getMessages(activeId);
        
        console.log("Messages loaded:", res.data);
        setMessages(res.data || []);
      } catch (err) {
        console.error("Error loading messages:", err);
        setError(err.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    load();

    // Cleanup: leave the conversation room when switching
    return () => {
      console.log("Leaving conversation room:", activeId);
      socket.emit("leaveConversation", activeId);
    };
  }, [activeId]);

  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (msg) => {
      console.log("New message received via socket:", msg);
      
      if (msg.conversation === activeId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [activeId]);

  return (
    <div className="h-screen bg-black text-white flex">
      <Sidebar activeId={activeId} setActiveId={setActiveId} />

      <div className="flex-1 flex flex-col">
        {activeId ? (
          <>
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-zinc-500">
                Loading messages...
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center text-red-500">
                Error: {error}
              </div>
            ) : (
              <>
                <MessageList messages={messages} user={user} />
                <MessageInput
                  convoId={activeId}
                  onNew={(msg) => {
                    console.log("Message sent:", msg);
                    // Don't add here - let the socket event handle it
                    // This prevents duplicate messages on sender side
                  }}
                />
              </>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}