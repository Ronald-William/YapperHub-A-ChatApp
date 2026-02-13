import { useEffect, useState } from "react";
import api from "../services/api";

export default function FriendRequests({ onRequestHandled }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/friends/requests");
      console.log("Friend requests:", res.data);
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading friend requests:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (requesterId) => {
    try {
      setProcessingId(requesterId);
      const res = await api.post(`/friends/accept/${requesterId}`);
      
      console.log("Request accepted:", res.data);
      
      // Remove from requests list
      setRequests(prev => prev.filter(r => r._id !== requesterId));
      
      // Notify parent to reload friends/conversations and pass the new conversation
      if (onRequestHandled) {
        onRequestHandled(res.data.conversation);
      }
    } catch (err) {
      console.error("Error accepting request:", err);
      alert(err.response?.data?.message || "Failed to accept request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requesterId) => {
    try {
      setProcessingId(requesterId);
      await api.post(`/friends/reject/${requesterId}`);
      
      // Remove from requests list
      setRequests(prev => prev.filter(r => r._id !== requesterId));
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert(err.response?.data?.message || "Failed to reject request");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-zinc-500">
        Loading requests...
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="p-4 text-center text-zinc-500 text-sm">
        No pending friend requests
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {requests.map((request) => (
        <div
          key={request._id}
          className="p-3 border-b border-zinc-800 hover:bg-zinc-800 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">
                {request.username}
              </div>
              {request.name && (
                <div className="text-sm text-zinc-500">
                  {request.name}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(request._id)}
                disabled={processingId === request._id}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors disabled:opacity-50"
              >
                {processingId === request._id ? "..." : "Accept"}
              </button>
              <button
                onClick={() => handleReject(request._id)}
                disabled={processingId === request._id}
                className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-sm transition-colors disabled:opacity-50"
              >
                {processingId === request._id ? "..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}