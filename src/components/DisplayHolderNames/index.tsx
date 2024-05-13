import { useGetWallet } from '../../hooks/walletHooks'
import ErrorBoundary from '../../helper/ErrorBoundary';
import Skeleton from '../Skeleton';
import { AccountLink } from '../AccountLink';

import './index.css';

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
            <li><AccountLink account={account} /></li>
          </ErrorBoundary>
        )
      )}
      </ul>
      
    </div>
  )
}
  
export default DisplayHolderNames