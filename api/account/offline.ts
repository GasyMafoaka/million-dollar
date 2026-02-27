import { Credentials, SignUpResult, SignInResult } from "./model";

export const offlineSignUp = async (
  credentials: Credentials,
): Promise<SignUpResult> => {
  return {
    id: "offline-id",
    username: credentials.username || "offline-user",
  };
};

export const offlineSignIn = async (
  _credentials: Credentials,
): Promise<SignInResult> => {
  return {
    account: {
      id: "offline-id",
      username: _credentials.username || "offline-user",
    },
    token: "offline-token",
  };
};
