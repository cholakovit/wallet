

type Wallet = {
  id: string;
  accounts: Account[];
  holder: {
    name: string;
  };
};

type Account = {
  id: string;
  currencyType: string;
  transactions: number[];
};

type AccountMutationProps = {
  walletId: string; // Assuming accountId is a string
}

type AddTransactionParams = {
  queryClient: QueryClient;
  walletId: string;
  selectedAccountId: string;
  newAmount: number;
}

type UpdateAccountParams = {
  accounts: Account[];
  accountId: string;
  newTransaction: number;
}

type UseAccountFormProps = {
  walletId: string;
  selectedAccountId: string | undefined;
}