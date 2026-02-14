import { useEffect, useState } from "react";

export default function Friends() {
  const [friends, setFriends] = useState<any[]>([]);
  const [email, setEmail] = useState("");

  const token = localStorage.getItem("token");

  const fetchFriends = async () => {
    const res = await fetch(
      "https://edunex-backend-rj22.onrender.com/api/friends",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    setFriends(data);
  };

  const addFriend = async () => {
    await fetch(
      "https://edunex-backend-rj22.onrender.com/api/friends/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      }
    );

    setEmail("");
    fetchFriends();
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        👥 Friends
      </h1>

      <div className="mb-6 flex gap-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Friend's Email"
          className="border px-4 py-2 rounded"
        />
        <button
          onClick={addFriend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Friend
        </button>
      </div>

      <ul>
        {friends.map((f, index) => (
          <li key={index} className="mb-2">
            {f.friend.name} ({f.friend.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
