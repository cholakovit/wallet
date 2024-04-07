import { Link } from 'react-router-dom'
import { useGetWallet } from '../../hooks/walletHooks'
import './index.css';
import ErrorBoundary from '../../helper/ErrorBoundary';
import Skeleton from '../Skeleton';

const DisplayHolderNames = () => {
  const { wallet, error, isLoading } = useGetWallet();

  return (
    <div className='holderNames'>
      <h1>Display holder names:</h1>
      {isLoading && <Skeleton count={10} />}
      {error && <div>Error Occurred: {error.message}</div>}
      <ul>
        {wallet && wallet.map((account: Wallet, index: number) => (
          <ErrorBoundary key={index}>
            <li key={index}><Link to={`/mutation/${account.id}`}>{account.holder.name}</Link></li>
          </ErrorBoundary>
        ))}
      </ul>
      
    </div>
  )
}
  
export default DisplayHolderNames