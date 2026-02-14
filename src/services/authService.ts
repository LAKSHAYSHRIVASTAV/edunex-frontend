export type AuthResponse = {
  token: string;
  user: {
    _id: string;
    email: string;
    name?: string;
  };
  message?: string;
};

const BASE_URL = "https://edunex-backend-rj22.onrender.com";

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Login failed");
  }

  return data;
}

