import { useAccountForm, useAccountMutation, useGetWalletById, useHandleCurrencyChange } from '../../hooks/walletHooks';
import './index.css';
import { Link } from 'react-router-dom';

const AccountMutation: React.FC<AccountMutationProps> = ({ walletId }) => {
  const { data: wallet, error, isLoading } = useGetWalletById(walletId);
  const mutation = useAccountMutation(walletId);
  const { selectedCurrency, selectedAccountId, handleCurrencyChange, missingCurrency } = useHandleCurrencyChange(wallet, mutation);

  const { amountRef, handleSubmit, message } = useAccountForm({ walletId, selectedAccountId: selectedAccountId });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred: {error.message}</div>;

  return (
    <div className="form-container">
      <div>Account: {wallet.holder.name}</div><br />
      <form onSubmit={handleSubmit}>
        
        <label htmlFor="currency-select">Currency:</label>
        <select id="currency-select" value={selectedCurrency} onChange={handleCurrencyChange}>
          <option value=''>Choose a currency:</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="BGN">BGN</option>
        </select>
        <div></div>
        <br />
        <label>Add Amount:</label>
        <input type="number" ref={amountRef} disabled={!selectedCurrency} />
        <br />
        <button type="submit">Send</button>&nbsp;&nbsp;
        <Link to={`/`}>Back</Link>
        {missingCurrency && <div className='msg'>{missingCurrency}</div>}
        {message && <div className='msg'>{message}</div>}
      </form>
    </div>
  )
}

export default AccountMutation