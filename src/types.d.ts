

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
  accountId?: string;
  amount?: number;
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

type Props = {
  children: ReactNode;
}

type State = {
  hasError: boolean;
  errorMessage: string;
}