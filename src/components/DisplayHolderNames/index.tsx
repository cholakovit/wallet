import { Link } from 'react-router-dom'
import { useGetWallet } from '../../hooks/walletHooks'
import './index.css';

const DisplayHolderNames = () => {

  const { wallet, error, isLoading } = useGetWallet()

  if(error) return <div>Error Occured!</div>
  
  if(isLoading) return <div>Loading Data...</div>  

  return (
    <div className='holderNames'>
      <h1>Display holder names:</h1>
      <ul>
        {wallet && wallet.map((account: Wallet, index: number) => 
          (<li key={index}><Link to={`/mutation/${account.id}`}>{account.holder.name}</Link></li>)
        )}
      </ul>
    </div>
  )
}
  
export default DisplayHolderNames