import { useState } from "react";
import Sidebar from "../components/Sidebar";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

export default function Chat() {
  const [users] = useState([
    { _id: 1, name: "Alice" },
    { _id: 2, name: "Bob" }
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const currentUser = { _id: 0, name: "Me" };

  const handleSend = () => {
    if (!text.trim() || !selectedUser) return;

    const newMsg = {
      _id: Date.now(),
      sender: currentUser._id,
      text
    };

    setMessages(prev => [...prev, newMsg]);
    setText("");
  };

  return (
    <div className="h-screen flex bg-gray-100">

      <Sidebar
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <div className="flex flex-col flex-1">
        <MessageList
          messages={messages}
          currentUser={currentUser}
        />

        <MessageInput
          text={text}
          setText={setText}
          onSend={handleSend}
          disabled={!selectedUser}
        />
      </div>
    </div>
  );
}
