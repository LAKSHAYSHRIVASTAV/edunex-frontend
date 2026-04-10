import API from "../config/api";

export type AuthResponse = {
  token: string;
  user: {
    _id: string;
    email: string;
    name?: string;
  };
  message?: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

const getErrorMessage = (error: any, fallback: string) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return fallback;
};

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await API.post("/auth/login", { email, password });
    return res.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, "Unable to sign in right now."));
  }
}

export async function registerUser(payload: RegisterPayload) {
  try {
    const res = await API.post("/auth/register", payload);
    return res.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, "Unable to create your account right now."));
  }
}

export async function forgotPassword(email: string) {
  try {
    const res = await API.post("/auth/forgot-password", { email });
    return res.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, "Failed to send reset link. Please try again."));
  }
}
