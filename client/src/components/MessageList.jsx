import { useEffect, useRef } from "react";

export default function MessageList({ messages, user }) {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((m) => (
        <div
          key={m._id}
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
  );
}
