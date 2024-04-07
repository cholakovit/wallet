/* eslint-disable react-hooks/exhaustive-deps */
import { UseMutationResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { store } from "../store/store";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export const useGetWallet = () => {

  const { data: wallet, error, isLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => fetch(process.env.REACT_APP_WALLETS_URL!).then(res => res.json()),
    refetchOnWindowFocus: false,
    retry: 5
  })

  return { wallet, error, isLoading }
}

export const useGetWalletById = (walletId: string) => {
  return useQuery({
    queryKey: ['wallet', walletId],
    queryFn: () =>
      fetch(`${process.env.REACT_APP_WALLETS_URL}/${walletId}`).then((res) =>
        res.json()
      ),
    retry: 5,
  });
};


export const useGetAccountBalance = (accountId: string): number | null => {
  const { data: walletData } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => fetch(process.env.REACT_APP_WALLETS_URL!).then(res => res.json()),
    staleTime: Infinity,
  });

  if (!walletData) {
    console.error('Wallet data not found in cache.');
    return null;
  }

  const accountBalance: number = walletData
  .flatMap((wallet: Wallet) => wallet.accounts) // Flatten all accounts into a single array
  .find((account: Account) => account.id === accountId) // Find the account with the matching accountId
  ?.transactions.reduce((sum: number, transaction: number) => sum + transaction, 0) // Calculate the balance if the account is found
  ?? null; // Default to null if the account is not found or has no transactions

  return accountBalance
}

export const useAccountBalanceSpend = (accountId: string, amountSpent: number): number => {
  const queryClient = useQueryClient();

  const walletData: Wallet[] | undefined = queryClient.getQueryData<Wallet[]>(['wallet']);

  if (!walletData) {
    console.error('Wallet data not found in cache.');
    return 0;
  }

  const account = walletData
    .flatMap(wallet => wallet.accounts)
    .find(account => account.id === accountId);

  if (!account) {
    console.error("Account not found.");
    return 0;
  }

  // Calculate the current balance
  const currentBalance = account.transactions.reduce((sum, transaction) => sum + transaction, 0);

  // Update the transactions for the account
  const updatedTransactions = [...account.transactions, amountSpent];

  console.log('updatedTransactions: ', updatedTransactions)

  // Check if the amount to spend is greater than the current balance
  if (amountSpent > currentBalance) {
    console.error("The amount to spend exceeds the current balance. Transaction cannot be completed.");
    return 0;
  }

  // Calculate the new balance after spending
  const newBalance = currentBalance - amountSpent;

  return newBalance
}

export const useAccountMutation = (accountId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['accountId', accountId],
    mutationFn: (newAccountId: string) => store.setAccountId(newAccountId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['accountId'] });
    }
  });

  useEffect(() => {
    mutation.mutate('');
  }, [accountId])

  return mutation;
};

export const useHandleCurrencyChange = (wallet: Wallet, mutation: UseMutationResult<void, unknown, string, unknown>) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>();
  const [missingCurrency, setMissingCurrency] = useState<string>('')

  const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = event.target.value;
    setSelectedCurrency(newCurrency);

    const accountWithSelectedCurrency = wallet.accounts.find((account) => account.currencyType === newCurrency);

    setSelectedAccountId(accountWithSelectedCurrency?.id)

    if (accountWithSelectedCurrency) {
      mutation.mutate(accountWithSelectedCurrency.id);
      setMissingCurrency('')
    } else {
      console.log('No account found for selected currency:', newCurrency);
      setMissingCurrency(`No account found for selected currency ${newCurrency}`)
      mutation.mutate('');
      setSelectedAccountId('')
    }
  };

  return { selectedCurrency, selectedAccountId, handleCurrencyChange, missingCurrency };
};

/* useAddTransactionToAccount with OPTIMISTI UPDATE */

export const useAddTransactionToAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['wallet'],
    mutationFn: addTransactionToAccount,
    onMutate: async ({ walletId, selectedAccountId, newAmount }) => {
      // Cancel any outgoing refetches to avoid overwriting the optimistic update
      await queryClient.cancelQueries({ queryKey: ['wallet'] });

      // Snapshot the previous value
      const previousWallet = queryClient.getQueryData<Wallet[]>(['wallet']);

      // Optimistically update to the new value
      if (previousWallet) {
        const updatedWallets = previousWallet.map(wallet => {
          if (wallet.id === walletId) {
            // Find the account and update its transactions
            const updatedAccounts = wallet.accounts.map(account => {
              if (account.id === selectedAccountId) {
                return { ...account, transactions: [...account.transactions, newAmount] };
              }
              return account;
            });

            return { ...wallet, accounts: updatedAccounts };
          }
          return wallet;
        });
        queryClient.setQueryData(['wallet'], updatedWallets);
      }
      return { previousWallet };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousWallet) {
        queryClient.setQueryData(['wallet'], context.previousWallet);
      }
    },
    onSettled: () => {
      // Invalidate and refetch wallets data to ensure the UI is up-to-date
      //queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
};

/* useAddTransactionToAccount with no  OPTIMISTI UPDATE */

// export const useAddTransactionToAccount = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationKey: ['wallet'],
//     mutationFn: addTransactionToAccount,
//     onSettled: () => {
//       // Invalidate and refetch wallets data to ensure the UI is up-to-date
//       queryClient.invalidateQueries({ queryKey: ['wallet'] });
//     },
//   });
// };


// Function to update a specific account's transactions within a list of accounts
function updateAccountTransactions({ accounts, accountId, newTransaction }: UpdateAccountParams): Account[] {
  const accountIndex = accounts.findIndex(account => account.id === accountId);
  if (accountIndex === -1) throw new Error('Account not found');

  // Create the updated account with the new transaction added
  const updatedAccount: Account = {
    ...accounts[accountIndex],
    transactions: [...accounts[accountIndex].transactions, newTransaction],
  };

  // Replace the old account with the updated one in the accounts array
  return [
    ...accounts.slice(0, accountIndex),
    updatedAccount,
    ...accounts.slice(accountIndex + 1),
  ];
}

// Example usage within the addTransactionToAccount function
const addTransactionToAccount = async ({ queryClient, walletId, selectedAccountId, newAmount }: AddTransactionParams) => {
  const wallet: Wallet | undefined = queryClient.getQueryData<Wallet>(['wallet', walletId]);
  if (!wallet) throw new Error('Wallet not found');
  
  try {
    const updatedAccounts = updateAccountTransactions({ accounts: wallet.accounts, accountId: selectedAccountId, newTransaction: newAmount });

    // Proceed with updating the wallet in the database/API
    const response = await fetch(`${process.env.REACT_APP_WALLETS_URL}/${walletId}`, {
      method: 'PATCH',
      body: JSON.stringify({ accounts: updatedAccounts }),
    });

    if (!response.ok) throw new Error('Failed to update the wallet');

    return response.json();
  } catch (error) {
    console.error('Error updating account transactions:', error);
    throw error;
  }
};

export const useAccountForm = ({ walletId, selectedAccountId }: UseAccountFormProps) => {
  const amountRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const addTransactionMutation = useAddTransactionToAccount();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    if (!selectedAccountId) {
      setMessage("Please select currency.");
      return;
    } else { setMessage(''); }

    const amount = amountRef.current?.value;
    if (!amount) {
      setMessage("Amount is missing! Please enter amount.");
      return;
    } else { setMessage(''); }

    addTransactionMutation.mutate({
      queryClient,
      walletId,
      selectedAccountId,
      newAmount: parseFloat(amount),
    }, {
      onSuccess: () => {
        if (amountRef.current) {
          amountRef.current.value = '';
        }
        setMessage("Transaction successfully added.");
      },
      onError: (error: any) => {
        setMessage(`Transaction failed: ${error.message || 'Unknown error'}`);
      }
    });
  };

  return { amountRef, handleSubmit, message };
};