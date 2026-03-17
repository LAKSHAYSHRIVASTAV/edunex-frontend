import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function Friends() {
  const [friends, setFriends] = useState<any[]>([]);
  const [email, setEmail] = useState("");

  const token = localStorage.getItem("token");

  /* ================= FETCH FRIENDS ================= */
  const fetchFriends = async () => {
    try {
      const res = await fetch(
        "https://edunex-backend-rj22.onrender.com/api/friends",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setFriends(data);
    } catch (err) {
      console.error("Error fetching friends:", err);
    }
  };

  /* ================= ADD FRIEND ================= */
  const addFriend = async () => {
    if (!email) return;

    try {
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

      // 🎉 Confetti effect
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      setEmail("");
      fetchFriends();
    } catch (err) {
      console.error("Error adding friend:", err);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  /* ================= DERIVED STATS ================= */
  const totalFriends = friends.length;
  const activeFriends = Math.floor(friends.length / 2); // dummy logic
  const avgStudy = "3.5h"; // static for demo

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        👥 Study Circle
      </h1>
      <p className="text-gray-500">
        Learn together. Stay consistent. Grow faster 🚀
      </p>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white shadow rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">Total Friends</p>
          <h2 className="text-xl font-bold">{totalFriends}</h2>
        </div>

        <div className="bg-white shadow rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">Active Now</p>
          <h2 className="text-xl font-bold text-green-500">
            {activeFriends}
          </h2>
        </div>

        <div className="bg-white shadow rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">Avg Study</p>
          <h2 className="text-xl font-bold">{avgStudy}</h2>
        </div>
      </div>

      {/* ================= ADD FRIEND ================= */}
      <div className="flex gap-3 mt-6">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter friend's email..."
          className="border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={addFriend}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:scale-105 transition"
        >
          Add
        </button>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {friends.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          <p className="text-lg">😢 No study partners yet</p>
          <p>Add your first friend to start learning together!</p>
        </div>
      )}

      {/* ================= FRIEND CARDS ================= */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {friends.map((f, index) => {
          const friend = f.friend;

          return (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-4 hover:scale-105 transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${friend.name}`}
                  className="w-12 h-12 rounded-full"
                />

                <div>
                  <h3 className="font-semibold">{friend.name}</h3>
                  <p className="text-sm text-gray-500">
                    {friend.email}
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-4 text-sm">
                <span>🔥 {Math.floor(Math.random() * 10) + 1} days</span>

                <span
                  className={
                    index % 2 === 0
                      ? "text-green-500"
                      : "text-gray-400"
                  }
                >
                  ● {index % 2 === 0 ? "Studying" : "Offline"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= LEADERBOARD ================= */}
      {friends.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3">
            🏆 Top Study Partners
          </h2>

          <div className="bg-white shadow rounded-xl p-4">
            {[...friends]
              .sort(() => 0.5 - Math.random()) // random ranking for demo
              .slice(0, 3)
              .map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between py-2 border-b"
                >
                  <span>
                    {i + 1}. {f.friend.name}
                  </span>
                  <span>{Math.floor(Math.random() * 15) + 1}h</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
