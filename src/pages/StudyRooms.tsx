import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function StudyRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedRoom]);

  const fetchRooms = async () => {
    const res = await fetch(
      "https://edunex-backend-rj22.onrender.com/api/rooms",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    setRooms(data);
  };

  const fetchMessages = async () => {
    const res = await fetch(
      `https://edunex-backend-rj22.onrender.com/api/rooms/${selectedRoom._id}/messages`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    setMessages(data);
  };

  const sendMessage = async () => {
    if (!newMessage) return;

    await fetch(
      `https://edunex-backend-rj22.onrender.com/api/rooms/${selectedRoom._id}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      }
    );

    setNewMessage("");
    fetchMessages();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex text-gray-800">
      
      {/* Sidebar */}
      <div className="w-64 p-4 bg-white/70 backdrop-blur-md border-r border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">📚 Rooms</h2>

        {rooms.map((room) => (
          <div
            key={room._id}
            onClick={() => setSelectedRoom(room)}
            className={`p-3 rounded-xl mb-2 cursor-pointer transition flex items-center gap-2
              ${
                selectedRoom?._id === room._id
                  ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow"
                  : "hover:bg-gray-100"
              }`}
          >
            📘 {room.name}
          </div>
        ))}
      </div>

      {/* Chat Section */}
      {selectedRoom && (
        <div className="flex-1 flex flex-col">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white/70 backdrop-blur-md flex justify-between items-center">
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm transition"
              >
                ⬅ Back
              </button>

              <h2 className="font-semibold text-lg">
                {selectedRoom.name}
              </h2>
            </div>

            <span className="text-green-500 text-sm">
              ● Active
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p className="text-lg">📚 Welcome to {selectedRoom.name}</p>
                <p className="text-sm">Start discussion or share notes</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 items-start"
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {msg.user?.name?.[0] || "U"}
                  </div>

                  {/* Message */}
                  <div className="bg-white border border-gray-200 p-3 rounded-xl max-w-md shadow-sm hover:shadow-md transition">
                    <p className="text-sm font-semibold text-blue-600">
                      {msg.user.name}
                    </p>
                    <p className="text-gray-700 text-sm">
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white/70 backdrop-blur-md">
            <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 shadow-sm">
              
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm px-2"
                placeholder="Type message..."
              />

              <button
                onClick={sendMessage}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 text-white px-4 py-1 rounded-lg text-sm transition"
              >
                Send
              </button>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}