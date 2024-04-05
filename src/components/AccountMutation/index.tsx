import { useAccountMutation, useGetWalletById, useHandleCurrencyChange } from '../../hooks/walletHooks';
import './index.css';
import { Link } from 'react-router-dom';

const AccountMutation: React.FC<AccountMutationProps> = ({ accountId }) => {
  const { data: wallet, error, isLoading } = useGetWalletById(accountId);
  const mutation = useAccountMutation(accountId);
  const { selectedCurrency, handleCurrencyChange } = useHandleCurrencyChange(wallet, mutation);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred: {error.message}</div>;

  return (
    <div className="form-container">
      <div>Account: {wallet.holder.name}</div><br />
      <form>
        <label htmlFor="currency-select">Currency:</label>
        <select id="currency-select" value={selectedCurrency} onChange={handleCurrencyChange}>
          <option value=''>Choose a currency:</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="BGN">BGN</option>
        </select>
        <div></div>
        <br />
        {/* <label>Amount:</label>
        <input type="text" /> */}
        <br />
        <button type="submit">Send</button>&nbsp;&nbsp;
        <Link to={`/`}>Back</Link>
      </form>
    </div>

  )
}

export default AccountMutation