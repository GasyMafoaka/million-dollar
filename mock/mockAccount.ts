export type Account = {
  id: string;
  email: string;
};

let accounts: Account[] = [
  {
    id: "account-1",
    email: "test@mail.com",
  },
];

export const mockAccountDB = {
  getAll: () => accounts,
};
