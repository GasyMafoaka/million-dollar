export function decodeJWT(token: string): { accountId: string } {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
}
