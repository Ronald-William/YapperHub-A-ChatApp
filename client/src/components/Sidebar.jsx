import { useEffect, useState } from "react";
import { getConversations } from "../services/chatApi";
import AddFriendModal from "./AddFriendModal";
import api from "../services/api";

export default function Sidebar({ activeId, setActiveId }) {
  const [convos, setConvos] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [activeTab, setActiveTab] = useState("conversations"); // "conversations" or "friends"

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await getConversations();
      
      console.log("API Response:", res);
      console.log("Conversations data:", res.data);
      console.log("Type of res.data:", typeof res.data);
      console.log("Is array?", Array.isArray(res.data));
      
      // Handle both {data: [...]} and direct array responses
      let conversationsData;
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        // Response is {data: {data: [...]}}
        conversationsData = res.data.data;
      } else if (res.data && Array.isArray(res.data)) {
        // Response is {data: [...]}
        conversationsData = res.data;
      } else if (Array.isArray(res.data)) {
        // Response is direct array
        conversationsData = res.data;
      } else {
        console.warn("Unexpected response format:", res);
        conversationsData = [];
      }
      
      console.log("Final conversations array:", conversationsData);
      
      // Debug: Log each conversation structure
      if (conversationsData.length > 0) {
        conversationsData.forEach((convo, index) => {
          console.log(`Conversation ${index}:`, convo);
          console.log(`  - ID: ${convo._id}`);
          console.log(`  - Friend:`, convo.friend);
          console.log(`  - Participants:`, convo.participants);
        });
      }
      
      setConvos(conversationsData);
    } catch (err) {
      console.error("Error loading conversations:", err);
      setError(err.message || "Failed to load conversations");
      setConvos([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  const loadFriends = async () => {
    try {
      const res = await api.get("/friends");
      console.log("Friends response:", res);
      console.log("Friends data:", res.data);
      console.log("Type:", typeof res.data);
      console.log("Is array?", Array.isArray(res.data));
      
      // Ensure we always set an array
      const friendsData = Array.isArray(res.data) ? res.data : [];
      setFriends(friendsData);
    } catch (err) {
      console.error("Error loading friends:", err);
      setFriends([]); // Ensure it's always an array on error
    }
  };

  useEffect(() => {
    loadConversations();
    loadFriends();
  }, []);

  const handleFriendAdded = (newConvo) => {
    console.log("Friend added:", newConvo);
    // Reload both conversations and friends
    loadConversations();
    loadFriends();
    // Optionally auto-select the new conversation
    if (newConvo?._id) {
      setActiveId(newConvo._id);
      setActiveTab("conversations");
    }
  };

  const handleFriendClick = async (friend) => {
    // Find or create conversation with this friend
    const existingConvo = convos.find(c => 
      c.participants?.some(p => p._id === friend._id)
    );

    if (existingConvo) {
      setActiveId(existingConvo._id);
      setActiveTab("conversations");
    } else {
      // Create conversation by adding friend
      try {
        const response = await api.post("/conversations", { 
          friendUsername: friend.username 
        });
        setActiveId(response.data._id);
        loadConversations();
        setActiveTab("conversations");
      } catch (err) {
        console.error("Error creating conversation:", err);
      }
    }
  };
  
  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 overflow-y-auto flex flex-col">
      <h2 className="p-4 font-semibold text-lg">Chats</h2>
      
      {/* Add Friend Button */}
      <button 
        className="mx-4 mb-4 p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        onClick={() => setShowAddFriend(true)}
      >
        + Add Friend
      </button>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 mx-4">
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === "conversations"
              ? "text-white border-b-2 border-blue-500"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
          onClick={() => setActiveTab("conversations")}
        >
          Conversations ({Array.isArray(convos) ? convos.length : 0})
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === "friends"
              ? "text-white border-b-2 border-blue-500"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
          onClick={() => setActiveTab("friends")}
        >
          Friends ({Array.isArray(friends) ? friends.length : 0})
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-4 text-center text-zinc-500">
          Loading...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 text-center text-red-500 text-sm">
          Error: {error}
          <button 
            onClick={() => {
              loadConversations();
              loadFriends();
            }}
            className="block mx-auto mt-2 text-blue-500 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Conversations Tab */}
      {!loading && !error && activeTab === "conversations" && (
        <>
          {!Array.isArray(convos) || convos.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 text-sm">
              No conversations yet.<br />
              Click on a friend to start chatting!
            </div>
          ) : (
            <div className="flex-1">
              {convos.map((c) => {
                // Find the friend (the other participant)
                const friend = c.friend || 
                              c.participants?.find(p => p._id !== c.participants[0]._id) ||
                              c.participants?.[0];
                
                const displayName = friend?.username || friend?.name || "Unknown User";
                
                return (
                  <div
                    key={c._id}
                    onClick={() => setActiveId(c._id)}
                    className={`p-3 cursor-pointer hover:bg-zinc-800 transition-colors ${
                      activeId === c._id ? "bg-zinc-800" : ""
                    }`}
                  >
                    {/* Display username */}
                    <div className="font-medium">
                      {displayName}
                    </div>
                    {c.lastMessage && (
                      <div className="text-sm text-zinc-500 truncate">
                        {c.lastMessage}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Friends Tab */}
      {!loading && !error && activeTab === "friends" && (
        <>
          {!Array.isArray(friends) || friends.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 text-sm">
              No friends yet.<br />
              Add some friends to start chatting!
            </div>
          ) : (
            <div className="flex-1">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  onClick={() => handleFriendClick(friend)}
                  className="p-3 cursor-pointer hover:bg-zinc-800 transition-colors"
                >
                  <div className="font-medium">
                    {friend.username}
                  </div>
                  {friend.name && (
                    <div className="text-sm text-zinc-500">
                      {friend.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Friend Modal */}
      {showAddFriend && (
        <AddFriendModal
          onClose={() => setShowAddFriend(false)}
          onFriendAdded={handleFriendAdded}
        />
      )}
    </div>
  );
}