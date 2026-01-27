export default function MessageList({ messages, currentUser }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">

      {messages.map(msg => {
        const isMe = msg.sender === currentUser._id;

        return (
          <div
            key={msg._id}
            className={`max-w-xs px-4 py-2 rounded-2xl shadow
              ${isMe
                ? "ml-auto bg-black text-white"
                : "mr-auto bg-white"}`}
          >
            {msg.text}
          </div>
        );
      })}
    </div>
  );
}
