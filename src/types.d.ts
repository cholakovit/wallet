

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
  accountId: string; // Assuming accountId is a string
}