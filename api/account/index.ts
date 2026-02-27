import { API_BASE_URL } from "../../constants/api";
import { Credentials, SignUpResult, SignInResult } from "./model";

export const signUp = async (
  credentials: Credentials,
): Promise<SignUpResult> => {
  const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error("Failed to sign up");
  }
  return response.json();
};

export const signIn = async (
  credentials: Credentials,
): Promise<SignInResult> => {
  const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error("Failed to sign in");
  }
  return response.json();
};
