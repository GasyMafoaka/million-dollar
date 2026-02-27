export type Wallet = {
  id: string;
  name: string;
};

let wallets: Wallet[] = [
  {
    id: "wallet-1",
    name: "Wallet Test",
  },
];

export const mockWalletDB = {
  getAll: () => wallets,
};
