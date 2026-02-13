import { useState } from "react";
import api from "../services/api";

export default function AddFriendModal({ onClose, onRequestSent }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Send friend request
      const response = await api.post("/friends/request", { 
        username: username.trim() 
      });
      
      setSuccess(true);
      
      // Notify parent component
      if (onRequestSent) {
        onRequestSent(response.data);
      }

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error("Error sending friend request:", err);
      setError(err.response?.data?.message || err.message || "Failed to send request");
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
              disabled={loading || success}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-900 bg-opacity-30 border border-green-700 rounded text-green-400 text-sm">
              Friend request sent successfully! ✓
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
              disabled={loading}
            >
              {success ? 'Close' : 'Cancel'}
            </button>
            {!success && (
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Request"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}