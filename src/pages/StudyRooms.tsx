import { useEffect, useState } from "react";

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
    <div className="p-10 flex gap-10">
      {/* Room List */}
      <div className="w-1/4">
        <h2 className="text-xl font-bold mb-4">📚 Rooms</h2>
        {rooms.map((room) => (
          <div
            key={room._id}
            onClick={() => setSelectedRoom(room)}
            className="p-3 border rounded mb-2 cursor-pointer hover:bg-gray-100"
          >
            {room.name}
          </div>
        ))}
      </div>

      {/* Chat Section */}
      {selectedRoom && (
        <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col">
          <h2 className="font-bold mb-4">
            {selectedRoom.name}
          </h2>

          <div className="flex-1 overflow-y-auto space-y-2 mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className="p-2 bg-gray-100 rounded"
              >
                <span className="font-semibold">
                  {msg.user.name}:{" "}
                </span>
                {msg.content}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={newMessage}
              onChange={(e) =>
                setNewMessage(e.target.value)
              }
              className="border flex-1 px-3 py-2 rounded"
              placeholder="Type message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

