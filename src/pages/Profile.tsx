import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  name: string;
  email: string;
  joinedAt: string;
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
  weeklyGoal: number;
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "https://edunex-backend-rj22.onrender.com/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold mb-6">👤 My Profile</h1>

        <div className="space-y-4">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Joined:</strong> {new Date(profile.joinedAt).toDateString()}</p>
          <p><strong>Total Quizzes:</strong> {profile.totalQuizzes}</p>
          <p><strong>Average Score:</strong> {profile.averageScore}%</p>
          <p><strong>Best Score:</strong> {profile.bestScore}%</p>
          <p><strong>Weekly Goal:</strong> {profile.weeklyGoal} quizzes</p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}
