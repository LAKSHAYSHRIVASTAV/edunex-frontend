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
    <div className="min-h-screen flex text-gray-800 
    bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 p-4 bg-white/60 backdrop-blur-xl border-r border-gray-200 shadow-md rounded-r-3xl">

        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          📚 Rooms
        </h2>

        {rooms.map((room) => (
          <motion.div
            whileHover={{ scale: 1.05 }}
            key={room._id}
            onClick={() => setSelectedRoom(room)}
            className={`p-3 rounded-xl mb-3 cursor-pointer transition flex items-center gap-2
              ${
                selectedRoom?._id === room._id
                  ? "bg-gradient-to-r from-indigo-200 to-purple-200 text-indigo-700 shadow-md"
                  : "hover:bg-white/80"
              }`}
          >
            📘 {room.name}
          </motion.div>
        ))}
      </div>

      {/* ================= CHAT AREA ================= */}
      <div className="flex-1 flex flex-col">

        {/* EMPTY STATE */}
        {!selectedRoom && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg font-medium">
              Select a room to start discussion
            </p>
            <p className="text-sm">Collaborate and learn together 🚀</p>
          </div>
        )}

        {selectedRoom && (
          <>
            {/* HEADER */}
            <div className="p-4 border-b border-gray-200 bg-white/60 backdrop-blur-xl flex justify-between items-center shadow-sm">

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

              <span className="text-green-500 text-sm font-medium">
                ● Active
              </span>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <p className="text-lg">📚 Welcome to {selectedRoom.name}</p>
                  <p className="text-sm">Start discussion or share notes</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isUser = msg.user?.name === "Test User"; // replace later dynamically

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >

                      <div className="flex gap-2 max-w-md">

                        {!isUser && (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                            {msg.user?.name?.[0] || "U"}
                          </div>
                        )}

                        <div
                          className={`p-3 rounded-2xl shadow-md text-sm
                          ${
                            isUser
                              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                              : "bg-white border border-gray-200"
                          }`}
                        >
                          {!isUser && (
                            <p className="text-xs font-semibold text-indigo-600 mb-1">
                              {msg.user.name}
                            </p>
                          )}
                          {msg.content}
                        </div>

                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* INPUT */}
            <div className="p-4 border-t border-gray-200 bg-white/60 backdrop-blur-xl">

              <div className="flex items-center bg-white/70 backdrop-blur-md rounded-full px-4 py-2 shadow-md">

                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm px-2"
                  placeholder="Type a message..."
                />

                <button
                  onClick={sendMessage}
                  className="ml-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 text-white px-4 py-1 rounded-full text-sm transition"
                >
                  Send 🚀
                </button>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}