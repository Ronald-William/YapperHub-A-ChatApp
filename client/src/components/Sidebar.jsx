export default function Sidebar({ users, selectedUser, setSelectedUser }) {
  return (
    <div className="w-64 bg-white shadow-lg border-r p-4">

      <h2 className="text-lg font-semibold mb-4">Chats</h2>

      {users.map(user => (
        <div
          key={user._id}
          onClick={() => setSelectedUser(user)}
          className={`p-3 rounded-lg cursor-pointer mb-2 transition
            ${selectedUser?._id === user._id
              ? "bg-black text-white"
              : "hover:bg-gray-200"}`}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}
