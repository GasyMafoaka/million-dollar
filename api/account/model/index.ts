export interface Credentials {
  username?: string;
  password?: string;
}

export interface SignUpResult {
  id?: string;
  username?: string;
}

export interface SignInResult {
  account?: SignUpResult;
  token?: string;
}
