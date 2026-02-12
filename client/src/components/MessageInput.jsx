import { useState } from "react";
import { sendMessage } from "../services/chatApi";

export default function MessageInput({ convoId, onNew }) {
  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim() || !convoId) return;

    const res = await sendMessage({
      conversationId: convoId,
      text
    });

    onNew(res.data);
    setText("");
  };

  return (
    <div className="flex gap-2 p-3 border-t border-zinc-800">
      <input
        className="flex-1 bg-zinc-800 p-2 rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
      />

      <button
        onClick={handleSend}
        className="px-4 bg-blue-600 rounded"
      >
        Send
      </button>
    </div>
  );
}
