export default function MessageInput({
  text,
  setText,
  onSend,
  disabled
}) {
  return (
    <div className="p-4 border-t bg-white flex gap-3">

      <input
        value={text}
        disabled={disabled}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onSend()}
        placeholder="Type a message..."
        className="flex-1 border rounded-xl px-4 py-2 focus:outline-none"
      />

      <button
        onClick={onSend}
        disabled={disabled}
        className="bg-black text-white px-6 rounded-xl disabled:opacity-40"
      >
        Send
      </button>
    </div>
  );
}
