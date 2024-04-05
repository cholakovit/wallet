/* eslint-disable react-hooks/exhaustive-deps */
import { UseMutationResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { store } from "../store/store";
import { ChangeEvent, useEffect, useState } from "react";

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


export const useGetAccountBalance = (accountId: string): number => {
  const queryClient = useQueryClient();
  const walletData: Wallet[] | undefined = queryClient.getQueryData<Wallet[]>(['wallet']);

  if (!walletData) {
    console.error('Wallet data not found in cache.');
    return 0;
  }

  const accountBalance: number = walletData
  .flatMap(wallet => wallet.accounts) // Flatten all accounts into a single array
  .find(account => account.id === accountId) // Find the account with the matching accountId
  ?.transactions.reduce((sum, transaction) => sum + transaction, 0) // Calculate the balance if the account is found
  ?? 0; // Default to 0 if the account is not found or has no transactions

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
  }, [])

  return mutation;
};

export const useHandleCurrencyChange = (wallet: Wallet, mutation: UseMutationResult<void, unknown, string, unknown>) => {
  const [selectedCurrency, setSelectedCurrency] = useState('');

  const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = event.target.value;
    setSelectedCurrency(newCurrency);

    const accountWithSelectedCurrency = wallet.accounts.find((account) => account.currencyType === newCurrency);

    if (accountWithSelectedCurrency) {
      mutation.mutate(accountWithSelectedCurrency.id);
    } else {
      console.log('No account found for selected currency:', newCurrency);
    }
  };

  return { selectedCurrency, handleCurrencyChange };
};