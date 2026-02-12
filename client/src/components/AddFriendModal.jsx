import { useState } from "react";
import { createConversation } from "../services/chatApi";

export default function AddFriendModal({ onClose, onFriendAdded }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call the API to create a conversation
      const response = await createConversation(username.trim());
      
      // Notify parent component
      onFriendAdded(response.data);
      onClose();
    } catch (err) {
      console.error("Error adding friend:", err);
      setError(err.response?.data?.message || err.message || "Failed to add friend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 w-96 border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Add Friend</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-2">
              Username
            </label>
            <input
              type="text"
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter friend's username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Friend"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}