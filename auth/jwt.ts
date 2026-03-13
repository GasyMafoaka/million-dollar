import { decode as atob } from "base-64";

export function decodeJWT(token: string): { accountId: string } {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
}
