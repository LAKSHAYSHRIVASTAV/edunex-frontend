import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

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
  const activeFriends = Math.floor(friends.length / 2);
  const avgStudy = "3.5h";

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
        <div className="text-center mt-12">
          <p className="text-lg font-semibold text-gray-700">
            😲 No study partners yet
          </p>

          <p className="text-gray-500 mt-1">
            Add your first friend to start learning together!
          </p>

          {/* 🔥 IMAGE */}
          <motion.img
            src="/images/no-friends.png"
            alt="No friends"
            className="w-72 mx-auto mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          />

          {/* 🚀 CTA */}
          <button
            onClick={() =>
              document.querySelector("input")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Friend 🚀
          </button>
        </div>
      )}

      {/* ================= FRIEND CARDS ================= */}
      {friends.length > 0 && (
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {friends.map((f, index) => {
            const friend = f.friend;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition duration-300"
              >
                <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>

                <div className="flex justify-center -mt-10">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${friend.name}`}
                    className="w-20 h-20 rounded-full border-4 border-white shadow"
                  />
                </div>

                <div className="text-center mt-2 px-4 pb-4">
                  <h3 className="text-lg font-semibold">{friend.name}</h3>
                  <p className="text-gray-500 text-sm">{friend.email}</p>

                  <div className="flex justify-around mt-4 text-sm">
                    <div>
                      <p className="font-bold text-indigo-600">
                        {f.studyHours || Math.floor(Math.random() * 10) + 1}h
                      </p>
                      <p className="text-gray-400 text-xs">Study</p>
                    </div>

                    <div>
                      <p className="font-bold text-orange-500">
                        🔥 {f.streak || Math.floor(Math.random() * 7) + 1}
                      </p>
                      <p className="text-gray-400 text-xs">Streak</p>
                    </div>

                    <div>
                      <p
                        className={`font-bold ${
                          f.status === "online"
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      >
                        ●
                      </p>
                      <p className="text-gray-400 text-xs">
                        {f.status || "offline"}
                      </p>
                    </div>
                  </div>

                  <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                    Connect
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= LEADERBOARD ================= */}
      {friends.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3">
            🏆 Top Study Partners
          </h2>

          <div className="bg-white shadow rounded-xl p-4">
            {[...friends]
              .sort(() => 0.5 - Math.random())
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
