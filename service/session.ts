import { SignUpResult } from "@/api/account/model";
import { getData, storeData, removeData } from "./storage";

const SESSION_KEY = "user_session";

interface SessionData {
  account: SignUpResult;
  token: string;
}

class SessionService {
  private account?: SignUpResult;
  private token?: string;
  private initialized: boolean = false;

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
    return this.account;
  }

  getToken(): string | undefined {
    return this.token;
  }

  async setSession(account: SignUpResult, token: string) {
    this.account = account;
    this.token = token;
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
