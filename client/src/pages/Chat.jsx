import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const socket = io("http://localhost:5000", {
  withCredentials: true
});

export default function Chat() {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [inputUsername, setInputUsername] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");

  const bottomRef = useRef();

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ----------------------------
     Fetch ONLY after connect
  -----------------------------*/
  const connectUser = async () => {
    if (!inputUsername.trim()) return;

    try {
      const res = await api.get(`/messages/${inputUsername}`);
      setMessages(res.data);
      setReceiverUsername(inputUsername);
    } catch {
      setMessages([]);
    }
  };

  /* ----------------------------
     Socket listener
  -----------------------------*/
  useEffect(() => {
    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("newMessage");
  }, []);

  /* ----------------------------
     Join socket
  -----------------------------*/
  useEffect(() => {
    if (!user) return;
    socket.emit("join", user._id);
  }, [user]);

  useEffect(scrollToBottom, [messages]);

  /* ----------------------------
     Send message
  -----------------------------*/
  const sendMessage = async () => {
    if (!text.trim() || !receiverUsername) return;

    const res = await api.post("/messages", {
      receiverUsername,
      text
    });

    setMessages((prev) => [...prev, res.data]);
    setText("");
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col p-4">

      {/* username input */}
      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 p-2 rounded bg-zinc-800"
          placeholder="Receiver username"
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
        />

        <button
          onClick={connectUser}
          className="px-4 bg-green-600 rounded hover:bg-green-700"
        >
          Connect
        </button>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto mb-3 flex flex-col gap-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-xs p-2 rounded-lg ${
              String(m.sender) === String(user._id)
                ? "bg-blue-600 ml-auto"
                : "bg-zinc-700"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* send */}
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-zinc-800"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />

        <button
          onClick={sendMessage}
          className="px-4 bg-blue-600 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}