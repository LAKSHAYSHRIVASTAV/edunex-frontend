import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StudyRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const token = localStorage.getItem("token");

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex">
      
      {/* Sidebar */}
      <div className="w-64 p-4 border-r border-white/10">
        <h2 className="text-lg font-semibold mb-4">📚 Rooms</h2>

        {rooms.map((room) => (
          <div
            key={room._id}
            onClick={() => setSelectedRoom(room)}
            className={`p-3 rounded-xl mb-2 cursor-pointer transition flex items-center gap-2
              ${
                selectedRoom?._id === room._id
                  ? "bg-blue-500/30 shadow-lg"
                  : "hover:bg-white/10"
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
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="font-semibold text-lg">
              {selectedRoom.name}
            </h2>
            <span className="text-green-400 text-sm">
              ● Active
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm">
                    {msg.user?.name?.[0] || "U"}
                  </div>

                  {/* Message bubble */}
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl max-w-md">
                    <p className="text-sm font-semibold text-blue-300">
                      {msg.user.name}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center bg-white/10 rounded-xl px-3 py-2">
              
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm px-2 text-white"
                placeholder="Type message..."
              />

              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-lg text-sm transition"
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