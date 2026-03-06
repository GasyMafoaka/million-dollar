import { SignUpResult } from "@/api/account/model";
import { getData, removeData, storeData } from "./storage";

const SESSION_KEY = "accountSession";

interface SessionData {
  account: SignUpResult;
  token: string;
}

class SessionService {
  private account?: SignUpResult;
  private token?: string;
  private initialized = false;

  async init() {
    if (this.initialized) return;

    const sessionData = await getData<SessionData>(SESSION_KEY);

    if (sessionData) {
      this.account = sessionData.account;
      this.token = sessionData.token;
    }

    this.initialized = true;
  }

  getAccount(): SignUpResult | undefined {
    if (!this.initialized) {
      throw new Error("SessionService not initialized");
    }
    return this.account;
  }

  getToken(): string | undefined {
    if (!this.initialized) {
      throw new Error("SessionService not initialized");
    }
    return this.token;
  }

  async setSession(account: SignUpResult, token: string) {
    this.account = account;
    this.token = token;
    this.initialized = true;

    await storeData(SESSION_KEY, { account, token });
  }

  async logout() {
    this.account = undefined;
    this.token = undefined;

    await removeData(SESSION_KEY);
  }

  isInitialized() {
    return this.initialized;
  }
}

export const session = new SessionService();
