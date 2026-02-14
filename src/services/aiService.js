import API from "../config/api";

export const askAI = async (question) => {
  const token = localStorage.getItem("token");

  const res = await API.post(
    "/api/ai/ask",
    { question },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
