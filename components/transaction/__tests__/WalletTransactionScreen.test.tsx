import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import WalletTransactionScreen from "../WalletTransactionScreen";
import {
  createOneTransaction,
  getAllTransactions,
} from "@/api/transaction/index";
import { offlineCreateOneTransaction } from "@/api/transaction/offline";
import { session } from "@/service/session";
import { Alert } from "react-native";

// Mock the API calls
jest.mock("@/api/transaction/index", () => ({
  createOneTransaction: jest.fn(),
  getAllTransactions: jest.fn(),
}));

jest.mock("@/api/transaction/offline", () => ({
  offlineCreateOneTransaction: jest.fn(),
  offlineGetAllTransactions: jest.fn(),
}));

// Mock the session
jest.mock("@/service/session", () => ({
  session: {
    getAccount: jest.fn(),
    getToken: jest.fn(),
  },
}));

const mockWallet = {
  id: "wallet-123",
  name: "Test Wallet",
  amount: 100,
  type: "CASH" as const,
};

const mockAccount = {
  id: "account-123",
  username: "testuser",
};

describe("WalletTransactionScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (session.getAccount as jest.Mock).mockReturnValue(mockAccount);
    (getAllTransactions as jest.Mock).mockResolvedValue([]);
  });

  it("calls createOneTransaction AND offlineCreateOneTransaction when adding a new transaction", async () => {
    const mockCreatedTransaction = {
      id: "trans-1",
      description: "Test Trans",
      amount: 50,
      type: "OUT",
      walletId: "wallet-123",
      accountId: "account-123",
      date: new Date().toISOString(),
    };
    (createOneTransaction as jest.Mock).mockResolvedValue(
      mockCreatedTransaction,
    );

    const { findByText, getByPlaceholderText, getAllByText } = render(
      <WalletTransactionScreen wallet={mockWallet} />,
    );

    // Wait for loading to finish and "Add Transaction" button to appear
    const openModalButton = await findByText("Add Transaction");

    // Click Add Transaction to open modal
    await act(async () => {
      fireEvent.press(openModalButton);
    });

    // Fill the form
    fireEvent.changeText(getByPlaceholderText("e.g. Groceries"), "Test Trans");
    fireEvent.changeText(getByPlaceholderText("0.00"), "50");

    // Submit the form in the modal
    const addButtons = getAllByText("Add Transaction");
    const modalAddButton =
      addButtons.find((b) => b.parent?.type === "Pressable") ||
      addButtons[addButtons.length - 1];

    await act(async () => {
      fireEvent.press(modalAddButton);
    });

    await waitFor(() => {
      expect(createOneTransaction).toHaveBeenCalledWith(
        "account-123",
        "wallet-123",
        expect.objectContaining({
          description: "Test Trans",
          amount: 50,
          type: "OUT",
        }),
      );

      // Verify that offline storage is also called for persistence
      expect(offlineCreateOneTransaction).toHaveBeenCalled();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Success",
      "Transaction added successfully",
    );
  }, 10000);
});
