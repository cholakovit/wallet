export const store = {
  accountId: '',

  setAccountId: async (accountId: string) => {
    store.accountId = accountId
  },

  getAccountId: async () => {
    console.log('getAccountId: ', store.accountId)
    return store.accountId
  }
}